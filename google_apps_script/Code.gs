function doGet() {
  return jsonResponse_({
    status: 'success',
    message: 'Survey endpoint is running.'
  });
}

function doPost(e) {
  try {
    const payloadText = e && e.parameter && e.parameter.payload
      ? e.parameter.payload
      : (e && e.postData && e.postData.contents ? e.postData.contents : '{}');

    const data = JSON.parse(payloadText);
    const ss = SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')
    );

    const sheet = getOrCreateSheet_(ss, 'SurveyResponses');
    const answers = Array.isArray(data.answers) ? data.answers : [];
    const competencyNames = answers.map(a => a.competency);

    ensureHeader_(sheet, competencyNames);

    const responseMap = {};
    answers.forEach(a => {
      responseMap[a.competency] = a.response || '';
    });

    const row = [
      Utilities.getUuid(),
      new Date(),
      data.industry || '',
      data.company_size || '',
      ...competencyNames.map(name => responseMap[name] || '')
    ];

    sheet.appendRow(row);

    return jsonResponse_({
      status: 'success',
      message: 'Response saved successfully.'
    });
  } catch (err) {
    return jsonResponse_({
      status: 'error',
      message: err && err.message ? err.message : String(err)
    });
  }
}

function getOrCreateSheet_(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function ensureHeader_(sheet, competencyNames) {
  const expected = [
    'response_id',
    'submitted_at',
    'industry',
    'company_size',
    ...competencyNames
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(expected);
    sheet.getRange(1, 1, 1, expected.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, expected.length);
    return;
  }

  const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const same = existing.length === expected.length && existing.every((v, i) => String(v) === String(expected[i]));
  if (!same) {
    throw new Error('The SurveyResponses header does not match the current competency structure. Rename or delete the old SurveyResponses sheet, then submit again.');
  }
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
