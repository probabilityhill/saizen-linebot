// 応答メッセージを取得
function getReplyMsg(userId, text){
  let status = getStatus(userId);  // ステータスを取得

  if(text == "START"){
    setStatus(userId, [[1,0,0,0,0,0,0,0,0,0,0,1]], col=6, numRows=1, numCols=12);   // データを初期化
    const ANS = ANS_LIST[CLEAR_ORDER[0]];
    return[CAROUSEL(), getTextMsg(" TUTORIAL(Q1～Q3)"),getFlexMsg("CLICK", getAnsBtn(ANS))];
  }
  else if(text == "HINT"){
    return [getFlexMsg("HINT", HINT_GAME)];
  }
  else if(text == "RULE"){
    return [getFlexMsg("RULE", RULE)];
  }
  else if(text == "Q"){
    return [CAROUSEL()];
  }
  else if((text == "great" || text == "GREAT") && getStatus(userId,col=18)){
    setStatus(userId, 1, col=19);  // 到達を記録
    return [getFlexMsg("Congratulations!", CLEAR_MSG(CLEAR_URL_GREAT, "隠し要素を見つけた！")), getImgMsg(getImgUrl("great"))];
  }  
  else if((text == "null" || text == "NULL") && getStatus(userId,col=18)){
    setStatus(userId, 1, col=20);  // 到達を記録
    return [getFlexMsg("Congratulations!", CLEAR_MSG(CLEAR_URL_NULL, "ないものを見つけた！")), getImgMsg(getImgUrl("null"))];
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
          msg = "WINNER: " + JUDGE_MARK;
          setStatus(userId,[[msg,0]],col=16,numRows=1,numCols=2);  // result="WINNER: "を設定
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
            setStatus(userId, 1, col=18);  // 到達を記録
            msg += "DRAW（最善を尽くした）";
            return [getFlexMsg("Congratulations!", CLEAR_MSG(CLEAR_URL, "最善を尽くした！")), getImgMsg(getImgUrl("clear"))];
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

  // 応答キーワードでない場合
  return [{
    "type":"text",
    "text":"...",
    "quickReply": QUICK_REPLY
  }];
}

// 解答ボタンを取得
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
function getImgMsg(url){
  return {
    "type": "image",
    "originalContentUrl": url,
    "previewImageUrl": url,
    "quickReply": QUICK_REPLY
  };
}