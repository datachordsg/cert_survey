function doGet() {
  return jsonResponse_({
    status: 'success',
    message: 'Survey endpoint is running.'
  });
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents || '{}');
    var sheet = getOrCreateResponsesSheet_();
    ensureHeader_(sheet);

    var row = [
      Utilities.getUuid(),
      new Date(),
      valueOrBlank_(payload.industry),
      valueOrBlank_(payload.companySize),
      valueOrBlank_(payload.top1Competency),
      valueOrBlank_(payload.top1Questions),
      valueOrBlank_(payload.top2Competency),
      valueOrBlank_(payload.top2Questions),
      valueOrBlank_(payload.top3Competency),
      valueOrBlank_(payload.top3Questions),
      valueOrBlank_(payload.submittedAtClient)
    ];

    validatePayload_(row);
    sheet.appendRow(row);

    return jsonResponse_({
      status: 'success',
      message: 'Response saved successfully.'
    });
  } catch (err) {
    return jsonResponse_({
      status: 'error',
      message: err.message
    });
  }
}

function validatePayload_(row) {
  if (!row[2]) throw new Error('Industry is required.');
  if (!row[3]) throw new Error('Company size is required.');
  if (!row[4] || !row[5]) throw new Error('Top 1 competency and questions are required.');
  if (!row[6] || !row[7]) throw new Error('Top 2 competency and questions are required.');
  if (!row[8] || !row[9]) throw new Error('Top 3 competency and questions are required.');

  var unique = {};
  [row[4], row[6], row[8]].forEach(function(item) {
    if (unique[item]) throw new Error('Each selected competency must be different.');
    unique[item] = true;
  });
}

function getOrCreateResponsesSheet_() {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID script property is missing.');
  }

  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName('SurveyResponses');
  if (!sheet) {
    sheet = ss.insertSheet('SurveyResponses');
  }
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;

  var header = [
    'response_id',
    'submitted_at',
    'industry',
    'company_size',
    'top1_competency',
    'top1_questions',
    'top2_competency',
    'top2_questions',
    'top3_competency',
    'top3_questions',
    'submitted_at_client'
  ];

  sheet.appendRow(header);
  sheet.getRange(1, 1, 1, header.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, header.length);
}

function valueOrBlank_(value) {
  return value == null ? '' : String(value).trim();
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
