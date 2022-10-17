const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
const ACCESS_TOKEN = SCRIPT_PROPERTIES.getProperty('ACCESS_TOKEN');

// ユーザ情報を書きこむシート
const SHEET_ID = "1IMu0jFkGIxofVEWgy71pNf1iR6RaAJwDB_tgjZ-GGKY";
const SHEET = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

const ANS_LIST = ["とほ","くるま","くち","くし","いくさ","くつした","ゆみ","みぎ","めん","ふきし","ふくるま","ふくち","ふくし","ふいくさ","ふくつした","ふゆみ","ふみぎ","ふめん"];

const QUICK_REPLY = {
  "items": [
    {
      "type": "action",
      "action": {
        "type": "message",
        "label": "start",
        "text": "start"
      }
    },
    {
      "type": "action",
      "action": {
        "type": "message",
        "label": "hint",
        "text": "hint"
      }
    },
    {
      "type": "action",
      "action": {
        "type": "message",
        "label": "rule",
        "text": "rule"
      }
    },    
    {
      "type": "action",
      "action": {
        "type": "uri",
        "label": "contact",
        "uri": "https://twitter.com/TM_TryAngle"
      }
    }
  ]
};
