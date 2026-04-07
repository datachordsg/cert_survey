# Hiring Manager Competency Survey (MCQ Version)

This package contains a premium single-page survey frontend for GitHub Pages and a Google Apps Script backend that writes responses to Google Sheets.

## What changed in this version
- Replaces open-ended interview-question boxes with structured selections
- Respondents answer **all 5 competency areas**
- For each area, respondents provide:
  - importance rating
  - up to 3 focus items they would most want to assess
  - expected level rating
- Keeps:
  - organisation profile
  - tools selection
  - top priority selection
  - premium microsite styling
  - submission overlay and thank-you message

## Setup
1. Create or choose a Google Sheet.
2. Open **Extensions → Apps Script** from that sheet.
3. Replace the code in `Code.gs` with the contents of `google_apps_script/Code.gs`.
4. Make sure the manifest matches `google_apps_script/appsscript.json`.
5. In Apps Script **Project Settings**, add a script property:
   - Key: `SPREADSHEET_ID`
   - Value: your Google Sheet ID
6. Deploy the Apps Script as a **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy the `/exec` URL and place it in `frontend/index.html` if needed.
8. Upload the contents of the `frontend/` folder to GitHub and enable GitHub Pages.

## Important
If your current sheet already has a `SurveyResponses` tab from an older version, rename or delete it before testing this version so the new header can be created.
