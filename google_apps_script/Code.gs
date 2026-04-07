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
      toolsAsText_(payload.toolsSelected),
      valueOrBlank_(payload.otherTool),
      valueOrBlank_(payload.firstPriority),
      valueOrBlank_(payload.analyticsQuestions),
      valueOrBlank_(payload.aiQuestions),
      valueOrBlank_(payload.toolsQuestions),
      valueOrBlank_(payload.softSkillsQuestions),
      valueOrBlank_(payload.governanceQuestions),
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
  if (!row[4]) throw new Error('At least one tool must be selected.');
  if (row[4].indexOf('Others') !== -1 && !row[5]) throw new Error('Please specify the other tool.');
  if (!row[6]) throw new Error('First priority is required.');
  if (!row[7]) throw new Error('Analytics or Business Intelligence questions are required.');
  if (!row[8]) throw new Error('Use of AI questions are required.');
  if (!row[9]) throw new Error('Proficiency in Tools questions are required.');
  if (!row[10]) throw new Error('Soft Skills and Communication questions are required.');
  if (!row[11]) throw new Error('Governance questions are required.');
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
    'tools_selected',
    'other_tool',
    'first_priority',
    'analytics_or_business_intelligence_questions',
    'use_of_ai_questions',
    'proficiency_in_tools_questions',
    'soft_skills_and_communication_questions',
    'governance_questions',
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

function toolsAsText_(value) {
  if (Array.isArray(value)) return value.map(valueOrBlank_).filter(String).join(' | ');
  return valueOrBlank_(value);
}
