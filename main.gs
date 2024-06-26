function tmp() {
  const USER_ID = "test";
  let text = "かいけつ";
  console.log(getReplyMsg(USER_ID, text));
  //console.log(getStatus(USER_ID, col=16));
  
}

function testGetUserInfo() {
    const URL = "https://api.line.me/v2/bot/profile/" + "Uab5d60c7a728c9116595ee282e027bf3";  // 末尾にユーザーIDを追加
    const USER_PROFILE = JSON.parse(UrlFetchApp.fetch(URL,{
      "headers": {
        "Authorization":  "Bearer " + ACCESS_TOKEN
      }
    }));
    console.log(USER_PROFILE);
}

// イベントを受け取る
function doPost(e){
  const EVENTS = JSON.parse(e.postData.contents).events;
  for (const event of EVENTS){
    execute(event);
  }
}

// イベントを受け取ったら実行する
function execute(event){
  const EVENT_TYPE = event.type;
  const USER_ID = event.source.userId;
  const REPLY_TOKEN = event.replyToken;

  if(EVENT_TYPE === "follow"){
    const ROW = SHEET.getLastRow()+1;  // 書く行取得
    SHEET.getRange(ROW,1).setValue(USER_ID);  // A列目にユーザID記入
    setStatus(USER_ID, 0);  // ステータス0を設定
    SHEET.getDataRange().removeDuplicates([1]);  // ユーザIDの重複を削除
    sendReplyMessage(REPLY_TOKEN,  [getFlexMsg("RULE", RULE)]);  // ルールを送信
  }
  else if(EVENT_TYPE === "message"){
    if(event.message.type === "text"){
      let text = event.message.text.trim();  // 先頭・末尾の空白削除
      sendReplyMessage(REPLY_TOKEN, getReplyMsg(USER_ID, text));
    }
  }
  else if(EVENT_TYPE === "postback"){   
    const N = parseInt(event.postback.data);  // ヒントの番号
    sendReplyMessage(REPLY_TOKEN, [getTextMsg(HINT_LIST[N-1])]);
  }
}

// メッセージを送信
function sendReplyMessage(replyToken, messages){
  const URL = "https://api.line.me/v2/bot/message/reply";
  const RES = UrlFetchApp.fetch(URL, {
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + ACCESS_TOKEN,
    },
    "method": "post",
    "payload": JSON.stringify({
      "replyToken": replyToken,
      "messages": messages 
    }),
  });
  return RES;
}
