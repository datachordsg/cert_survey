# High-Value Individual Survey with Google Sheets

This package gives you a simpler deployment pattern:

- **Frontend**: GitHub Pages static site
- **Storage**: Google Sheet
- **API layer**: Google Apps Script web app

The survey asks managers and business leaders to allocate **100 points** across **18 competency questions** to show what they want most from the ideal **high-value individual in digital transformation and corporate enablement**.

## Folder structure

- `frontend/index.html` - survey page for GitHub Pages
- `frontend/app.js` - scoring, submission, and result logic
- `frontend/styles.css` - styling
- `frontend/competency_questions.json` - the 18 questions
- `google_apps_script/Code.gs` - Apps Script backend
- `google_apps_script/appsscript.json` - Apps Script project settings

## How the data is stored

The Apps Script writes to two sheets in your Google Sheet:

1. **SurveyResponses**
   - one row per respondent
   - stores respondent details plus full JSON payload

2. **Rankings**
   - one row per ranked competency per response
   - easier for analysis, pivot tables, and dashboards

## Setup steps

### 1. Create a Google Sheet

Create a blank Google Sheet and copy its ID from the URL.

Example URL:

`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### 2. Create a Google Apps Script project

Open the Google Sheet, then go to:

**Extensions → Apps Script**

Replace the default code with the contents of `google_apps_script/Code.gs`.

Also replace the contents of `appsscript.json` with the provided file.

### 3. Add your spreadsheet ID

In Apps Script:

- Go to **Project Settings**
- Under **Script Properties**, add:
  - Key: `SPREADSHEET_ID`
  - Value: your Google Sheet ID

### 4. Deploy the script as a web app

In Apps Script:

- Click **Deploy → New deployment**
- Choose **Web app**
- Execute as: **Me**
- Who has access: **Anyone** or **Anyone with the link**

Copy the deployed **Web app URL**.

### 5. Update the frontend URL

In `frontend/index.html`, replace:

`PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`

with your real Apps Script web app URL.

### 6. Publish the frontend on GitHub Pages

Upload the contents of `frontend/` to your GitHub repository and enable GitHub Pages.

## Notes on browser submission

This package uses a simple `FormData` POST request to Google Apps Script so you do not need a traditional backend server.

## Suggested analysis workflow

Once survey responses are collected, you can compare:

- employer priority by competency
- curriculum/module coverage by competency
- student performance by competency

That lets you validate this chain:

**What employers want → competencies prioritised → modules taught → competencies demonstrated**

## Competency areas included

- Structured data readiness
- Data quality and integration
- Data and knowledge strategy
- Analysis and dashboards
- KPI analysis and modelling
- Predictive and decision strategy
- AI productivity use
- AI workflow integration
- AI governance and decision design
- Workflow execution
- Process optimization and automation
- Enterprise transformation
- Professional reporting
- Stakeholder influence
- Executive communication and negotiation
- Ethics and evidence basics
- Risk and compliance evaluation
- Responsible AI systems


Updated version: respondent profile fields removed; questions are embedded directly in app.js so they appear even when opening index.html locally.
