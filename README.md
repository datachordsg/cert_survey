# High-Value Individual Competency Needs Survey

This package contains:
- `frontend/` – static HTML survey for GitHub Pages
- `google_apps_script/` – Google Apps Script endpoint that writes responses to Google Sheets

## What changed
- Questions are now **open-ended** instead of point allocation
- Added **company industry** and **company size** fields
- Google Sheet output is **one response per row**
- Each competency is saved as its **own column** in `SurveyResponses`

## Google Sheet output format
The `SurveyResponses` tab will contain:
- `response_id`
- `submitted_at`
- `industry`
- `company_size`
- 18 competency columns

## Setup
1. Create a Google Sheet.
2. Open **Extensions > Apps Script**.
3. Paste `google_apps_script/Code.gs` into the project.
4. Add a Script Property named `SPREADSHEET_ID` with your Google Sheet ID.
5. Deploy the script as a **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the deployed `/exec` URL.
7. Open `frontend/index.html` and replace:
   - `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`
   with your Apps Script URL.
8. Upload the `frontend/` files to GitHub and enable GitHub Pages.

## Important
If you already have an older `SurveyResponses` tab from a previous version, rename or delete it before first submission.
