# Hiring Manager Competency Survey — Premium Microsite Version

This package keeps the same Google Sheets backend structure, but upgrades the frontend into a more premium, polished microsite-style survey.

## What this version includes
- a more refined visual design
- one first-and-foremost priority selection across the 5 areas
- responses for all 5 capability areas
- multi-select tools field including `Others`
- one Google Sheets row per submission

## Frontend setup
Upload the contents of the `frontend` folder to GitHub Pages.

## Google Apps Script setup
1. Open your Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Paste `google_apps_script/Code.gs` into Apps Script.
4. Use `google_apps_script/appsscript.json` if you need the manifest.
5. Add a Script Property named `SPREADSHEET_ID` with your Google Sheet ID.
6. Deploy as a **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy the `/exec` URL.
8. Update `window.APP_CONFIG.appsScriptUrl` in `frontend/index.html` if needed.

## Google Sheet output columns
- response_id
- submitted_at
- industry
- company_size
- tools_selected
- other_tool
- first_priority
- analytics_or_business_intelligence_questions
- use_of_ai_questions
- proficiency_in_tools_questions
- soft_skills_and_communication_questions
- governance_questions
- submitted_at_client

## Important
If your current `SurveyResponses` tab was created from an older format, rename or delete it before testing this version.
