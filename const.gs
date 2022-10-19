const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
const ACCESS_TOKEN = SCRIPT_PROPERTIES.getProperty('ACCESS_TOKEN');

// ユーザ情報を書きこむシート
const SHEET_ID = "1IMu0jFkGIxofVEWgy71pNf1iR6RaAJwDB_tgjZ-GGKY";
const SHEET = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

const ANS_LIST = ["くし","いくさ","くるま","ゆみ","とほ","みぎ","めん","くつした","くち","ふくし","ふいくさ","ふくるま","ふゆみ","ふとほ","ふみぎ","ふめん","ふくつした","ふくち"];
const HINT_1_3 = "騎士=■ | □□→🦌 | 👁️";
const HINT_4_9 = "50 | ↓↑ | ←→ | □ん | ろ | 📺";
const HINT_GAME = "■: 置く場所";
const CLEAR_ORDER = [4,11,8,9,1,16,3,14,6];
const ENDED_LIST = ["GAME OVER", "WINNER: ○", "WINNER: ✕"];

const CAROUSEL =()=> {
  let content = [];
  for(const N of [1,2,3,7,6,8,9,4,5]) {
    const N_STR = (N <= 3 || N == 7) ? String(N) : "?"; 
    content.push(
      {
        "type": "bubble",
        "size": "micro",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Q"+N_STR,
              "color": "#ffffff",
              "size": "sm",
              "align": "center"
            }
          ],
          "backgroundColor": "#666666",
          "paddingAll": "sm"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "image",
              "url": getImgUrl("q"+N),
              "size": "full",
              "aspectMode": "cover",
              "gravity": "top"
            }
          ],
          "paddingAll": "none"
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "HINT",
                  "color": "#cccccc",
                  "action": {
                    "type": "postback",
                    "data": "hint"+N
                  },
                  "size": "sm"
                }
              ],
              "cornerRadius": "sm",
              "borderColor": "#cccccc",
              "borderWidth": "normal",
              "justifyContent": "center",
              "alignItems": "center",
              "paddingAll": "sm",
              "flex": 3
            }
          ],
          "backgroundColor": "#666666"
        }
      }
    );
  };
  return getFlexMsg("Q1~Q9", 
    {
      "type": "carousel",
      "contents": content
    }
  );
};

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
