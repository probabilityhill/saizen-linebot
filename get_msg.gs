// 応答メッセージを取得
function getReplyMsg(userId, text){
  let status = getStatus(userId);  // ステータスを取得

  if(text == "start"){
    setStatus(userId, [[1,0,0,0,0,0,0,0,0,0,0,1]], col=6, numRows=1, numCols=12);  // データを初期化
    // 画像カルーセル1~3 + 「きし」ボタン 送信
    const ANS = ANS_LIST[CLEAR_ORDER[0]];
    return[CAROUSEL(), getTextMsg(" TUTORIAL(Q1～Q3)"),getFlexMsg("CLICK", getAnsBtn(ANS))];
  }
  else if(text == "HINT"){
    return [getTextMsg(HINT_GAME)];
  }
  else if(text == "Q"){
    return [CAROUSEL()];
  }  
  else outer: if(status >= 1 && status <= 9){  // status1~9の場合
    const ANS_IDX = ANS_LIST.indexOf(text);
    const Q_IDX = ANS_IDX % 9;
    if(getStatus(userId, col=7+Q_IDX)) break outer;  // 解答済みの場合は抜ける

    if(ANS_IDX > -1){  // ○or✕
      const JUDGE = ANS_IDX < 9 ? 1 : 2;
      const JUDGE_MARK = JUDGE === 1 ? "○" : "✕";
      const JUDGE_MSG = getJudgeMsg(status, JUDGE_MARK);
      const IS_OVER = status % 2 + 1 === JUDGE;  // ゲームオーバーになったかどうか
      let msg;

      setStatus(userId, JUDGE, col=7+Q_IDX);  // マスを埋める
      setStatus(userId, status+1);  // ステータスを更新

      const BOARD = getStatus(userId, col=7, numRows=1, numCols=9)[0];
      
      if(status === 1 || status === 2){  // Q1,2に正解した場合
        const NEXT_ANS = ANS_LIST[CLEAR_ORDER[status]];
        return [JUDGE_MSG, getFlexMsg("CLICK", getAnsBtn(NEXT_ANS))];
      }
      else if(status === 3){
        return [JUDGE_MSG, getTextMsg("TUTORIAL COMPLETED")];
      }

      let result = getStatus(userId, col=16);

      // ゲームが終了していない場合
      if(!ENDED_LIST.includes(result)){
        if(IS_OVER){  // ゲームオーバーになった場合
          result = "GAME OVER"
          msg = result;
          setStatus(userId,[[result,0]],col=16,numRows=1,numCols=2);  // result="GAME OVER"を設定          
        }        
        else if(judgeWin(BOARD)){  // 勝敗がついた場合
          msg = "WIN: " + JUDGE_MARK;
          setStatus(userId,[[msg,0]],col=16,numRows=1,numCols=2);  // result="WIN: "を設定
        }
        else if(ANS_IDX != CLEAR_ORDER[status-1]){  // クリア不可能になった場合
          setStatus(userId,0,col=17);  // clear:0を設定
        }
      }

      if(status === 9){
        const JUDGE_RESULT = getStatus(userId, col=16,numRows=1,numCols=2)[0];
        result = JUDGE_RESULT[0];
        msg = "【RESULT】";
        if(result){  // ゲームが終了している場合
          msg += result;
        }
        else{
          if(JUDGE_RESULT[1]){  // クリア可能な場合
            msg += "DRAW（最善を尽くした）";
          }
          else{
            msg += "DRAW（最善を尽くさなかった）";
          }          
        }
      }

      if(msg){
        return [JUDGE_MSG, getTextMsg(msg)];
      }

      return [JUDGE_MSG];
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

function getAnsBtn(text){
  return {
    "type": "bubble",
    "size": "nano",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "contents": [],
          "weight": "bold",
          "color": "#666666",
          "text": "CLICK",
          "align": "center",
          "size": "sm"
        }
      ],
      "action": {
        "type": "message",
        "text": text
      },
      "paddingStart": "none",
      "paddingEnd": "none"
    }
  };
}

// テキストメッセージを取得
function getTextMsg(text){
  return {
    "type":"text",
    "text":text,
    "quickReply": QUICK_REPLY
  };
}

// ○✕を返す
function getJudgeMsg(n, text){
  return {
    "type":"text",
    "text":text,
    "sender": {
      "name": n+"手目"
    },
    "quickReply": QUICK_REPLY
  };
}

// Flex Messageを取得
function getFlexMsg(label, content){
  return {
    'type':'flex',
    'altText':label,
    'contents':content,
    "quickReply": QUICK_REPLY
  };
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