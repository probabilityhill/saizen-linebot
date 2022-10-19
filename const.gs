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
const CLEAR_URL = "https://twitter.com/intent/tweet?text=LINE%E8%AC%8E%E3%80%8E%E6%9C%80%E5%96%84%E6%89%8B%E3%80%8FCLEAR%0A%E6%9C%80%E5%96%84%E6%89%8B%E3%82%92%E6%89%93%E3%81%A1%E7%B6%9A%E3%81%91%E3%81%9F%EF%BC%81%0A%0APLAY%EF%BC%88%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%B3%E7%89%88%E3%81%AE%E3%81%BF%EF%BC%89%20%E2%86%92%20https%3A%2F%2Flin.ee%2FzzNhJsv%0A%0A%23%E6%9C%80%E5%96%84%E6%89%8B%E8%AC%8E%20%23LINE%E8%AC%8E%20%40TM_TryAngle";
const CLEAR_URL_GREAT = "https://twitter.com/intent/tweet?text=LINE%E8%AC%8E%E3%80%8E%E6%9C%80%E5%96%84%E6%89%8B%E3%80%8F%E3%81%A7%E9%9A%A0%E3%81%97%E8%A6%81%E7%B4%A0%E3%82%92%E8%A6%8B%E3%81%A4%E3%81%91%E3%81%9F%EF%BC%81%0A%0APLAY%EF%BC%88%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%B3%E7%89%88%E3%81%AE%E3%81%BF%EF%BC%89%20%E2%86%92%20https%3A%2F%2Flin.ee%2FzzNhJsv%0A%0A%23%E6%9C%80%E5%96%84%E6%89%8B%E8%AC%8E%20%23LINE%E8%AC%8E%20%40TM_TryAngle";
const CLEAR_URL_NULL = "https://twitter.com/intent/tweet?text=LINE%E8%AC%8E%E3%80%8E%E6%9C%80%E5%96%84%E6%89%8B%E3%80%8F%E3%81%A7%E3%81%AA%E3%81%84%E3%82%82%E3%81%AE%E3%82%92%E8%A6%8B%E3%81%A4%E3%81%91%E3%81%9F%EF%BC%81%0A%0APLAY%EF%BC%88%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%B3%E7%89%88%E3%81%AE%E3%81%BF%EF%BC%89%20%E2%86%92%20https%3A%2F%2Flin.ee%2FzzNhJsv%0A%0A%23%E6%9C%80%E5%96%84%E6%89%8B%E8%AC%8E%20%23LINE%E8%AC%8E%20%40TM_TryAngle";

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

const CLEAR_MSG =(url, text)=> {
  return {
    "type": "bubble",
    "size": "kilo",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "Congratulations!",
          "weight": "bold",
          "size": "lg",
          "color": "#404040"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "lg",
          "contents": [
            {
              "type": "text",
              "text": text+"\nクリアツイートは以下のボタンからお願いいたします。",
              "color": "#404040",
              "wrap": true,
              "size": "sm"
            }
          ]
        }
      ],
      "paddingBottom": "none"
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "button",
          "action": {
            "type": "uri",
            "label": "TWEET",
            "uri": url
          },
          "height": "sm",
          "color": "#00acee",
          "style": "primary"
        },
        {
          "type": "box",
          "layout": "vertical",
          "contents": [],
          "margin": "sm"
        }
      ]
    }
  };
}

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