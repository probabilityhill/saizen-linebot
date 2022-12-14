// 応答メッセージを取得
function getReplyMsg(userId, text){
  // ステータスを取得
  let [status,e1,e2,e3,e4,e5,e6,e7,e8,e9,result,canClear,isSaizen,isGreat,isNull,isOmake] = getStatus(userId, col=6, numRows=1, numCols=16)[0];

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
  else outer: if(status >= 1 && status <= 9){  // status1~9の場合
    const ANS_IDX = ANS_LIST.indexOf(text);
    const Q_IDX = ANS_IDX % 9;
    if(eval("e"+(Q_IDX+1))) break outer;  // 解答済みの場合は抜ける

    if(ANS_IDX > -1){  // ○or✕
      const JUDGE = ANS_IDX < 9 ? 1 : 2;
      const JUDGE_MARK = JUDGE === 1 ? "○" : "✕";
      const JUDGE_MSG = getJudgeMsg(status, JUDGE_MARK);
      const IS_OVER = status % 2 + 1 === JUDGE;  // ゲームオーバーになったかどうか
      let msg;

      eval("e"+(Q_IDX+1)+" = "+JUDGE+";");  // マスを埋める
      
      if(status === 1 || status === 2){  // Q1,2に正解した場合
        const NEXT_ANS = ANS_LIST[CLEAR_ORDER[status]];
        setStatus(userId, [[status+1,e1,e2,e3,e4,e5,e6,e7,e8,e9]], col=6, numRows=1, numCols=10);  // ステータスを更新
        return [JUDGE_MSG, getFlexMsg("CLICK", getAnsBtn(NEXT_ANS))];
      }
      else if(status === 3){
        setStatus(userId, [[status+1,e1,e2,e3,e4,e5,e6,e7,e8,e9]], col=6, numRows=1, numCols=10);  // ステータスを更新
        return [JUDGE_MSG, getTextMsg("TUTORIAL COMPLETED")];
      }

      // ゲームが終了していない場合
      if(!ENDED_LIST.includes(result)){
        if(IS_OVER){  // ゲームオーバーになった場合
          result = "GAME OVER"
          msg = result;
          canClear = 0;         
        }        
        else if(judgeWin([e1,e2,e3,e4,e5,e6,e7,e8,e9])){  // 勝敗がついた場合
          result = "WINNER: " + JUDGE_MARK;
          msg = result;
          canClear = 0;
        }
        else if(ANS_IDX != CLEAR_ORDER[status-1]){  // クリア不可能になった場合
          canClear = 0;
        }
      }

      if(status === 9){
        msg = "【RESULT】";
        if(result){  // ゲームが終了している場合
          msg += result;
          return [JUDGE_MSG, getTextMsg(msg), getImgMsg(getImgUrl("draw"))];
        }
        else{
          if(canClear){  // クリア可能な場合
            isSaizen = 1
            msg += "DRAW";
            // ステータスを更新
            setStatus(userId, [[status+1,e1,e2,e3,e4,e5,e6,e7,e8,e9,result,canClear,isSaizen]], col=6, numRows=1, numCols=13);
            return [JUDGE_MSG, getTextMsg(msg), getImgMsg(getImgUrl("clear")), getFlexMsg("Congratulations!", CLEAR_MSG(CLEAR_URL, "最善手を打ち続けた！"))];
          }
          else{
            msg += "DRAW";
            // ステータスを更新
            setStatus(userId, [[status+1,e1,e2,e3,e4,e5,e6,e7,e8,e9,result,canClear]], col=6, numRows=1, numCols=12);
            return [JUDGE_MSG, getTextMsg(msg), getImgMsg(getImgUrl("draw"))];
          }          
        }
      }

      // ステータスを更新
      setStatus(userId, [[status+1,e1,e2,e3,e4,e5,e6,e7,e8,e9,result,canClear]], col=6, numRows=1, numCols=12);
      
      if(msg){
        return [JUDGE_MSG, getTextMsg(msg)];
      }
      return [JUDGE_MSG];
    }
  }
  else if((text == "great" || text == "GREAT") && isSaizen){
    if(isNull){
      setStatus(userId, [[1,1,1]], col=19, numRows=1, numCols=3);  // 到達を記録
      return [getImgMsg(getImgUrl("great")), getFlexMsg("Congratulations!", CLEAR_MSG(CLEAR_URL_GREAT, "隠し要素を見つけた！")),getImgMsg(getImgUrl("last"))];
    }
    setStatus(userId, 1, col=19);  // 到達を記録
    return [getImgMsg(getImgUrl("great")), getFlexMsg("Congratulations!", CLEAR_MSG(CLEAR_URL_GREAT, "隠し要素を見つけた！"))];
  }  
  else if((text == "null" || text == "NULL") && isSaizen){
    if(isGreat){
      setStatus(userId, [[1,1]], col=20, numRows=1, numCols=2);  // 到達を記録
      return [getImgMsg(getImgUrl("null")), getFlexMsg("Congratulations!", CLEAR_MSG(CLEAR_URL_NULL, "ないものを見つけた！")),getImgMsg(getImgUrl("last"))];
    }    
    setStatus(userId, 1, col=20);  // 到達を記録
    return [getImgMsg(getImgUrl("null")), getFlexMsg("Congratulations!", CLEAR_MSG(CLEAR_URL_NULL, "ないものを見つけた！"))];
  }
  else if((text == "かいけつ" || text == "解決") && isOmake){
    setStatus(userId, 1, col=22);  // 到達を記録
    return [getImgMsg(getImgUrl("allclear")), getFlexMsg("Congratulations!", CLEAR_MSG(CLEAR_URL_ALLCLEAR, "最善手を解き尽くした！"))];
  }

  // 応答キーワードでない場合
  return [{
    "type": "text",
    "text": "...",
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
    "type": "text",
    "text": text,
    "quickReply": QUICK_REPLY
  };
}

// ○✕を返す
function getJudgeMsg(n, text){
  return {
    "type": "text",
    "text": text,
    "sender": {
      "name": n+"手目"
    },
    "quickReply": QUICK_REPLY
  };
}

// Flex Messageを取得
function getFlexMsg(label, content){
  return {
    "type": "flex",
    "altText": label,
    "contents": content,
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