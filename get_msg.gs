// 応答メッセージを取得
function getReplyMsg(userId, text){
  let status = getStatus(userId);  // ステータスを取得
  if(text == "start"){
    
  }
  else if(status >= 1 && status <= 9){  // status1~9の場合
    const ANS_IDX = ANS_LIST.indexOf(text);
    if(ANS_IDX > -1){  // o or x
      const JUDGE = ANS_IDX < 9 ? 1 : 2;
      const JUDGE_MARK = JUDGE === 1 ? "○" : "✕";
      return getJudgeMsg(status, JUDGE_MARK);
    }
  }
  /*
  let status = getStatus(userId);  // ステータスを取得

  if(text == "start"){
    setStatus(userId, 1);  // F列目にステータス1を設定
    return getImgMsg(getImgUrl("q1"));
  }
  else if(text == "water"){
    return getImgMsg(getImgUrl(getFilename(userId, Math.min(status, 4))));
  }
  else if(text == "hint"){
    return [{
      "type":"text",
      "text":HINT_LIST[status],
      "quickReply": QUICK_REPLY
    }];
  }
  else if(text == "rule"){
    return getFlexMsg("rule", RULE);
  }
  else if(status >= 1 && status <= 3){  // status1~3の場合
    const isHira = (HIRA_LIST[status-1] == text);
    const isKan = (KAN_LIST[status-1] == text);

    if(isHira || isKan){
      if(isHira){  // ひらがなの場合
        setLetterType(userId, status, 0);
      }
      else {  // 漢字の場合
        setLetterType(userId, status, 1);
      }      
      status += 1
      setStatus(userId, status);  // ステータスを更新
      if(status === 4){
        // waterと最終問題の画像を返す
        return getImgMsg(getImgUrl(getFilename(userId, 4)),getImgUrl("q4"));
      }
      return getImgMsg(getImgUrl("q"+status));      
    }
  }
  else if(status === 4 && text == "melted"){  // 最終問題正解の場合
    setLetterType(userId, 4, "#");  // 到達を記録
    status += 1
    setStatus(userId, status);  // ステータスを更新
    return getFlexMsg("Congratulations!", CLEAR_MSG, getImgUrl("clear"), hasText=true);
  }
  */

  return [{
    "type":"text",
    "text":"...",
    "quickReply": QUICK_REPLY
  }];
}

function getJudgeMsg(n, text){
  return [{
    "type":"text",
    "text":text,
    "sender": {
      "name": n+"手目"
    },
    "quickReply": QUICK_REPLY
  }];
}

// Flex Messageを取得
function getFlexMsg(label, content, url="", hasImg=false){
  if(hasImg){
    return [{
      "type": "image",
      "originalContentUrl": url,
      "previewImageUrl": url
    },
    {
      'type':'flex',
      'altText':label,
      'contents':content,
      "quickReply": QUICK_REPLY
    }];
  }
  return [{
    'type':'flex',
    'altText':label,
    'contents':content,
    "quickReply": QUICK_REPLY
  }];
}

// 画像メッセージを取得
function getImgMsg(url, second=null, hasText=false){
  if(hasText){  // テキストがある場合
    return [{
      "type": "image",
      "originalContentUrl": url,
      "previewImageUrl": url
    },
    {
      "type":"text",
      "text":second,
      "quickReply": QUICK_REPLY
    }];
  }
  if(second){  // 2つ目の画像がある場合
    return [{
      "type": "image",
      "originalContentUrl": url,
      "previewImageUrl": url
    },
    {
      "type": "image",
      "originalContentUrl": second,
      "previewImageUrl": second,
      "quickReply": QUICK_REPLY
    }];
  }

  return [{
    "type": "image",
    "originalContentUrl": url,
    "previewImageUrl": url,
    "quickReply": QUICK_REPLY
  }];
}