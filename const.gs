const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
const ACCESS_TOKEN = SCRIPT_PROPERTIES.getProperty('ACCESS_TOKEN');

// ユーザ情報を書きこむシート
const SHEET_ID = "1IMu0jFkGIxofVEWgy71pNf1iR6RaAJwDB_tgjZ-GGKY";
const SHEET = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

const ANS_LIST = ["くし","いくさ","くるま","ゆみ","とほ","みぎ","めん","くつした","くち","ふくし","ふいくさ","ふくるま","ふゆみ","ふとほ","ふみぎ","ふめん","ふくつした","ふくち"];
const HINT_LIST = ["🕒","□□→🦌","👁️","ろ","📺","☀️","50","H＜=推測","□=□=□=ん"];
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
                    "data": String(N)
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

/*
{
  "type": "bubble",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "RULE",
            "weight": "bold",
            "color": "#404040",
            "size": "lg"
          }
        ]
      },
      {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "最善手を打ち続ける（＝Q1~9を正しい順に解き進める）ことでクリアとなる。ただし、Q1, 2 ,3, 7以外の問題番号は不明。",
                "size": "sm",
                "color": "#404040",
                "wrap": true
              }
            ],
            "margin": "sm"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "ゲーム終了後も解答可能である。また、STARTボタンからいつでもやり直すことができる。",
                "size": "sm",
                "color": "#404040",
                "wrap": true
              }
            ],
            "margin": "sm"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "Q1~3はチュートリアルとなっているため、ボタンを押すだけでOK。（チュートリアル中のテキストの送信は禁止）",
                "size": "sm",
                "color": "#404040",
                "wrap": true
              }
            ],
            "margin": "sm"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "・ 答えはひらがなで送信",
                "size": "sm",
                "color": "#404040"
              },
              {
                "type": "text",
                "text": "・ 正解 → ◯　ふ正解 → ✕",
                "size": "sm",
                "color": "#404040"
              }
            ],
            "margin": "sm"
          }
        ]
      },
      {
        "type": "separator",
        "margin": "lg"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "ボタンの機能",
            "weight": "bold",
            "color": "#666666",
            "size": "sm"
          }
        ],
        "paddingTop": "md",
        "paddingBottom": "sm",
        "paddingStart": "sm"
      },
      {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "START",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "スタート / やり直し",
                "wrap": true,
                "color": "#404040",
                "size": "sm",
                "flex": 2
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "RULE",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "ルールを確認する",
                "wrap": true,
                "color": "#404040",
                "size": "sm",
                "flex": 2
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Q",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "問題画像を見る",
                "wrap": true,
                "color": "#404040",
                "size": "sm",
                "flex": 2
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "HINT",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "ゲームのヒントを見る",
                "wrap": true,
                "color": "#404040",
                "size": "sm",
                "flex": 2
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "CONTACT",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "不具合等を報告する",
                "wrap": true,
                "color": "#404040",
                "size": "sm",
                "flex": 2
              }
            ]
          }
        ],
        "paddingStart": "md"
      }
    ],
    "paddingAll": "lg"
  }
}
*/

const RULE = {
  "type": "bubble",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "RULE",
            "weight": "bold",
            "color": "#404040",
            "size": "lg"
          }
        ]
      },
      {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "最善手を打ち続ける（＝Q1~9を正しい順に解き進める）ことでクリアとなる。ただし、Q1, 2 ,3, 7以外の問題番号は不明。",
                "size": "sm",
                "color": "#404040",
                "wrap": true
              }
            ],
            "margin": "sm"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "ゲーム終了後も解答可能である。また、STARTボタンからいつでもやり直すことができる。",
                "size": "sm",
                "color": "#404040",
                "wrap": true
              }
            ],
            "margin": "sm"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "Q1~3はチュートリアルとなっているため、ボタンを押すだけでOK。（チュートリアル中のテキストの送信は禁止）",
                "size": "sm",
                "color": "#404040",
                "wrap": true
              }
            ],
            "margin": "sm"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "・ 答えはひらがなで送信",
                "size": "sm",
                "color": "#404040"
              },
              {
                "type": "text",
                "text": "・ 正解 → ◯　ふ正解 → ✕",
                "size": "sm",
                "color": "#404040"
              }
            ],
            "margin": "sm"
          }
        ]
      },
      {
        "type": "separator",
        "margin": "lg"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "ボタンの機能",
            "weight": "bold",
            "color": "#666666",
            "size": "sm"
          }
        ],
        "paddingTop": "md",
        "paddingBottom": "sm",
        "paddingStart": "sm"
      },
      {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "START",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "スタート / やり直し",
                "wrap": true,
                "color": "#404040",
                "size": "sm",
                "flex": 2
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "RULE",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "ルールを確認する",
                "wrap": true,
                "color": "#404040",
                "size": "sm",
                "flex": 2
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Q",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "問題画像を見る",
                "wrap": true,
                "color": "#404040",
                "size": "sm",
                "flex": 2
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "HINT",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "ゲームのヒントを見る",
                "wrap": true,
                "color": "#404040",
                "size": "sm",
                "flex": 2
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "CONTACT",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
                "weight": "bold"
              },
              {
                "type": "text",
                "text": "不具合等を報告する",
                "wrap": true,
                "color": "#404040",
                "size": "sm",
                "flex": 2
              }
            ]
          }
        ],
        "paddingStart": "md"
      }
    ],
    "paddingAll": "lg"
  }
};

const QUICK_REPLY = {
  "items": [
    {
      "type": "action",
      "action": {
        "type": "message",
        "label": "START",
        "text": "START"
      }
    },
    {
      "type": "action",
      "action": {
        "type": "message",
        "label": "RULE",
        "text": "RULE"
      }
    },
    {
      "type": "action",
      "action": {
        "type": "message",
        "label": "Q",
        "text": "Q"
      }
    },
    {
      "type": "action",
      "action": {
        "type": "message",
        "label": "HINT",
        "text": "HINT"
      }
    },    
    {
      "type": "action",
      "action": {
        "type": "uri",
        "label": "CONTACT",
        "uri": "https://twitter.com/TM_TryAngle"
      }
    }
  ]
};
