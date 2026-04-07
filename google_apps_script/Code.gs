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

    validatePayload_(payload);

    var row = [
      Utilities.getUuid(),
      new Date(),
      valueOrBlank_(payload.industry),
      valueOrBlank_(payload.companySize),
      toolsAsText_(payload.toolsSelected),
      valueOrBlank_(payload.otherTool),
      valueOrBlank_(payload.firstPriority)
    ];

    var areas = [
      'analytics_or_business_intelligence',
      'use_of_ai',
      'proficiency_in_tools',
      'soft_skills_and_communication',
      'governance'
    ];

    areas.forEach(function(area) {
      row.push(valueOrBlank_(payload[area + '_importance']));
      var selections = normalizeSelections_(payload[area + '_focus']);
      for (var i = 0; i < 3; i++) {
        row.push(valueOrBlank_(selections[i] && selections[i].item));
        row.push(valueOrBlank_(selections[i] && selections[i].level));
      }
    });

    row.push(valueOrBlank_(payload.additionalComments));
    row.push(valueOrBlank_(payload.submittedAtClient));

    sheet.appendRow(row);
    return jsonResponse_({ status: 'success', message: 'Response saved successfully.' });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: err.message });
  }
}

function validatePayload_(payload) {
  if (!valueOrBlank_(payload.industry)) throw new Error('Industry is required.');
  if (!valueOrBlank_(payload.companySize)) throw new Error('Company size is required.');
  if (!Array.isArray(payload.toolsSelected) || !payload.toolsSelected.length) throw new Error('At least one tool must be selected.');
  if (payload.toolsSelected.indexOf('Others') !== -1 && !valueOrBlank_(payload.otherTool)) throw new Error('Please specify the other tool.');
  if (!valueOrBlank_(payload.firstPriority)) throw new Error('Top priority is required.');

  var areas = [
    'analytics_or_business_intelligence',
    'use_of_ai',
    'proficiency_in_tools',
    'soft_skills_and_communication',
    'governance'
  ];

  areas.forEach(function(area) {
    if (!valueOrBlank_(payload[area + '_importance'])) throw new Error(area + ' importance is required.');
    var selections = normalizeSelections_(payload[area + '_focus']);
    if (!selections.length) throw new Error(area + ' focus selection is required.');
    if (selections.length > 3) throw new Error(area + ' allows up to 3 focus selections.');
    selections.forEach(function(selection) {
      if (!valueOrBlank_(selection.item)) throw new Error(area + ' selected item is missing.');
      if (!valueOrBlank_(selection.level)) throw new Error(area + ' expected level is required for each selected item.');
    });
  });
}

function normalizeSelections_(value) {
  if (!Array.isArray(value)) return [];
  return value.map(function(entry) {
    if (typeof entry === 'string') {
      return { item: valueOrBlank_(entry), level: '' };
    }
    return {
      item: valueOrBlank_(entry && entry.item),
      level: valueOrBlank_(entry && entry.level)
    };
  }).filter(function(entry) {
    return entry.item;
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
    'analytics_or_business_intelligence_importance','analytics_or_business_intelligence_focus_1','analytics_or_business_intelligence_focus_1_level','analytics_or_business_intelligence_focus_2','analytics_or_business_intelligence_focus_2_level','analytics_or_business_intelligence_focus_3','analytics_or_business_intelligence_focus_3_level',
    'use_of_ai_importance','use_of_ai_focus_1','use_of_ai_focus_1_level','use_of_ai_focus_2','use_of_ai_focus_2_level','use_of_ai_focus_3','use_of_ai_focus_3_level',
    'proficiency_in_tools_importance','proficiency_in_tools_focus_1','proficiency_in_tools_focus_1_level','proficiency_in_tools_focus_2','proficiency_in_tools_focus_2_level','proficiency_in_tools_focus_3','proficiency_in_tools_focus_3_level',
    'soft_skills_and_communication_importance','soft_skills_and_communication_focus_1','soft_skills_and_communication_focus_1_level','soft_skills_and_communication_focus_2','soft_skills_and_communication_focus_2_level','soft_skills_and_communication_focus_3','soft_skills_and_communication_focus_3_level',
    'governance_importance','governance_focus_1','governance_focus_1_level','governance_focus_2','governance_focus_2_level','governance_focus_3','governance_focus_3_level',
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

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
