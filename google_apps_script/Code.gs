function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Survey endpoint is running.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!sheetId) {
      throw new Error('Missing SPREADSHEET_ID in Script Properties.');
    }

    var payloadString = extractPayload_(e);
    if (!payloadString) {
      throw new Error('No payload received.');
    }

    var payload = JSON.parse(payloadString);
    validatePayload_(payload);

    var ss = SpreadsheetApp.openById(sheetId);
    var responsesSheet = getOrCreateResponsesSheet_(ss);
    var rankingsSheet = getOrCreateRankingsSheet_(ss);

    var responseId = Utilities.getUuid();
    var submittedAt = payload.submitted_at || new Date().toISOString();
    var respondent = payload.respondent || {};

    responsesSheet.appendRow([
      responseId,
      submittedAt,
      payload.survey_name || '',
      payload.target_profile || '',
      payload.total_points || 0,
      respondent.name || '',
      respondent.email || '',
      respondent.company || '',
      respondent.role || '',
      respondent.industry || '',
      respondent.country || '',
      JSON.stringify(payload.allocations || []),
      JSON.stringify(payload.ranked || [])
    ]);

    var ranked = payload.ranked || [];
    ranked.forEach(function(item, index) {
      rankingsSheet.appendRow([
        responseId,
        submittedAt,
        index + 1,
        item.id || '',
        item.domain || '',
        item.competency || '',
        item.short_label || '',
        item.points || 0,
        respondent.company || '',
        respondent.role || '',
        respondent.country || ''
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Survey saved to Google Sheets.',
        response_id: responseId
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function extractPayload_(e) {
  if (!e) return null;
  if (e.postData && e.postData.contents && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
    return e.postData.contents;
  }
  if (e.parameter && e.parameter.payload) {
    return e.parameter.payload;
  }
  return null;
}

function validatePayload_(payload) {
  if (!payload || !payload.allocations || !payload.ranked) {
    throw new Error('Payload is incomplete.');
  }
  if (payload.total_points !== 100) {
    throw new Error('Total points must equal 100.');
  }
  if (!Array.isArray(payload.allocations) || payload.allocations.length !== 18) {
    throw new Error('Expected 18 competency allocations.');
  }
}

function getOrCreateResponsesSheet_(ss) {
  var name = 'SurveyResponses';
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow([
      'response_id', 'submitted_at', 'survey_name', 'target_profile', 'total_points',
      'name', 'email', 'company', 'role', 'industry', 'country',
      'allocations_json', 'ranked_json'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getOrCreateRankingsSheet_(ss) {
  var name = 'Rankings';
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow([
      'response_id', 'submitted_at', 'rank', 'competency_id', 'domain',
      'competency', 'short_label', 'points', 'company', 'role', 'country'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
