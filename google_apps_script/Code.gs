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
      valueOrBlank_(payload.analytics_or_business_intelligence_importance),
      listAsText_(payload.analytics_or_business_intelligence_focus),
      valueOrBlank_(payload.analytics_or_business_intelligence_level),
      valueOrBlank_(payload.use_of_ai_importance),
      listAsText_(payload.use_of_ai_focus),
      valueOrBlank_(payload.use_of_ai_level),
      valueOrBlank_(payload.proficiency_in_tools_importance),
      listAsText_(payload.proficiency_in_tools_focus),
      valueOrBlank_(payload.proficiency_in_tools_level),
      valueOrBlank_(payload.soft_skills_and_communication_importance),
      listAsText_(payload.soft_skills_and_communication_focus),
      valueOrBlank_(payload.soft_skills_and_communication_level),
      valueOrBlank_(payload.governance_importance),
      listAsText_(payload.governance_focus),
      valueOrBlank_(payload.governance_level),
      valueOrBlank_(payload.additionalComments),
      valueOrBlank_(payload.submittedAtClient)
    ];

    validatePayload_(payload, row);
    sheet.appendRow(row);

    return jsonResponse_({ status: 'success', message: 'Response saved successfully.' });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: err.message });
  }
}

function validatePayload_(payload, row) {
  if (!row[2]) throw new Error('Industry is required.');
  if (!row[3]) throw new Error('Company size is required.');
  if (!row[4]) throw new Error('At least one tool must be selected.');
  if (row[4].indexOf('Others') !== -1 && !row[5]) throw new Error('Please specify the other tool.');
  if (!row[6]) throw new Error('Top priority is required.');

  var areas = [
    'analytics_or_business_intelligence',
    'use_of_ai',
    'proficiency_in_tools',
    'soft_skills_and_communication',
    'governance'
  ];

  areas.forEach(function(area) {
    if (!valueOrBlank_(payload[area + '_importance'])) throw new Error(area + ' importance is required.');
    var focus = payload[area + '_focus'];
    if (!Array.isArray(focus) || !focus.length) throw new Error(area + ' focus selection is required.');
    if (focus.length > 3) throw new Error(area + ' allows up to 3 focus selections.');
    if (!valueOrBlank_(payload[area + '_level'])) throw new Error(area + ' expected level is required.');
  });
}

function getOrCreateResponsesSheet_() {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID script property is missing.');
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName('SurveyResponses');
  if (!sheet) sheet = ss.insertSheet('SurveyResponses');
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;
  var header = [
    'response_id','submitted_at','industry','company_size','tools_selected','other_tool','first_priority',
    'analytics_or_business_intelligence_importance','analytics_or_business_intelligence_focus','analytics_or_business_intelligence_level',
    'use_of_ai_importance','use_of_ai_focus','use_of_ai_level',
    'proficiency_in_tools_importance','proficiency_in_tools_focus','proficiency_in_tools_level',
    'soft_skills_and_communication_importance','soft_skills_and_communication_focus','soft_skills_and_communication_level',
    'governance_importance','governance_focus','governance_level',
    'additional_comments','submitted_at_client'
  ];
  sheet.appendRow(header);
  sheet.getRange(1, 1, 1, header.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, header.length);
}

function valueOrBlank_(value) {
  return value == null ? '' : String(value).trim();
}

function toolsAsText_(value) {
  return Array.isArray(value) ? value.map(valueOrBlank_).filter(String).join(' | ') : valueOrBlank_(value);
}

function listAsText_(value) {
  return Array.isArray(value) ? value.map(valueOrBlank_).filter(String).join(' | ') : valueOrBlank_(value);
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
