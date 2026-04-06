# High-Value Individual Priority Survey (Google Sheets + Matrix Layout)

This package contains:

- `frontend/` — static site for GitHub Pages
- `google_apps_script/` — Apps Script endpoint that stores responses in Google Sheets

## What changed
- No respondent profile section
- Questions are embedded directly in `app.js`
- Survey is displayed as a matrix table for faster answering
- Respondents allocate exactly 300 points across 18 capability areas

## Deploy the frontend
1. Upload the files in `frontend/` to a GitHub repository.
2. Enable GitHub Pages for that repository.
3. Open `frontend/index.html` and replace the placeholder Apps Script URL with your deployed web app URL.

## Deploy the Google Apps Script endpoint
1. Create a new Google Apps Script project.
2. Paste in `google_apps_script/Code.gs`.
3. Add the `appsscript.json` manifest.
4. In Script Properties, add `SPREADSHEET_ID` with the Google Sheet ID.
5. Deploy as a web app with access allowed to anyone with the link.

## Google Sheets tabs created automatically
- `SurveyResponses`
- `Rankings`


## Google Sheets output layout
This version saves **one submission per row** in the `SurveyResponses` sheet.
Each survey question becomes its **own column header**, and the respondent's allocated score is written directly into that cell.

Important: if your spreadsheet already has an older `SurveyResponses` sheet from a previous version, rename or delete that sheet before testing this version. The new layout will then be created automatically on the first successful submission.
