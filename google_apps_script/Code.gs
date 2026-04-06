
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
    var responsesSheet = getOrCreateResponsesSheet_(ss, payload.allocations);

    var responseId = Utilities.getUuid();
    var submittedAt = payload.submitted_at || new Date().toISOString();
    var totalPoints = Number(payload.total_points || 0);

    var row = [responseId, submittedAt];
    payload.allocations.forEach(function(item) {
      row.push(Number(item.points || 0));
    });
    row.push(totalPoints);

    responsesSheet.appendRow(row);

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
  if (!payload || !payload.allocations || !Array.isArray(payload.allocations)) {
    throw new Error('Payload is incomplete.');
  }
  if (Number(payload.total_points) !== 300) {
    throw new Error('Total points must equal 300.');
  }
  if (payload.allocations.length !== 18) {
    throw new Error('Expected 18 competency allocations.');
  }

  var computedTotal = payload.allocations.reduce(function(sum, item) {
    return sum + Number(item.points || 0);
  }, 0);

  if (computedTotal !== 300) {
    throw new Error('The submitted scores do not add up to 300.');
  }
}

function getOrCreateResponsesSheet_(ss, allocations) {
  var name = 'SurveyResponses';
  var sheet = ss.getSheetByName(name);
  var expectedHeader = buildHeader_(allocations);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(expectedHeader);
    styleHeader_(sheet, expectedHeader.length);
    return sheet;
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(expectedHeader);
    styleHeader_(sheet, expectedHeader.length);
    return sheet;
  }

  var actualHeader = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (!headersMatch_(actualHeader, expectedHeader)) {
    throw new Error('The SurveyResponses sheet still uses the old layout. Rename or delete that sheet, then submit again so the new question-column layout can be created.');
  }

  return sheet;
}

function buildHeader_(allocations) {
  var headers = ['response_id', 'submitted_at'];
  allocations.forEach(function(item, index) {
    var label = item.question || item.competency || item.short_label || ('Question ' + (index + 1));
    headers.push(label);
  });
  headers.push('total_points');
  return headers;
}

function headersMatch_(actualHeader, expectedHeader) {
  if (actualHeader.length !== expectedHeader.length) {
    return false;
  }
  for (var i = 0; i < expectedHeader.length; i++) {
    if (String(actualHeader[i]) !== String(expectedHeader[i])) {
      return false;
    }
  }
  return true;
}

function styleHeader_(sheet, columnCount) {
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, columnCount).setFontWeight('bold').setWrap(true);
  sheet.autoResizeColumns(1, Math.min(columnCount, 5));
}
