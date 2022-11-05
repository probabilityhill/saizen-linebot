// 画像URLを取得
function getImgUrl(filename) {
  return "https://github.com/probabilityhill/saizen-linebot/blob/main/img/" + filename + ".png?raw=true?20221023";
}

// ステータスを設定
function setStatus(userId, status, col=6, numRows=null, numCols=null){
  const ROW = SHEET.createTextFinder(userId).findNext().getRow();  // ユーザIDが存在する行
  if(numRows){
    SHEET.getRange(ROW,col,numRows,numCols).setValues(status);
  }
  else{
    SHEET.getRange(ROW,col).setValue(status);  // col列目にstatusを記入
  }
}

// ステータスを取得
function getStatus(userId, col=6, numRows=null, numCols=null){
  const ROW = SHEET.createTextFinder(userId).findNext().getRow();  // ユーザIDが存在する行
  if(numRows){
    return SHEET.getRange(ROW,col,numRows,numCols).getValues();  // 二次元配列
  }
  return SHEET.getRange(ROW,col).getValue();  // col列目のstatusを取得  
}

// ユーザ情報取得
function getUserProfile(){
  const LAST_ROW = SHEET.getLastRow();                            // 最終行取得
  const USER_LIST = SHEET.getRange(1,1,LAST_ROW,2).getValues();   // 記入されたデータを取得
  let userInfoList = [];                                          // 取得した情報を格納する配列
  for(const USER of USER_LIST){
    // 情報を取得済みの場合は飛ばす
    if(USER[1]){
      continue;
    }
    const URL = "https://api.line.me/v2/bot/profile/" + USER[0];  // 末尾にユーザーIDを追加
    try {
      const USER_PROFILE = JSON.parse(UrlFetchApp.fetch(URL,{
        "headers": {
          "Authorization":  "Bearer " + ACCESS_TOKEN
        }
      }));
      // 取得した情報（表示名、ステータスメッセージ、プロフィール画像のURL）を配列に追加
      userInfoList.push([
        USER_PROFILE.displayName,
        USER_PROFILE.statusMessage, 
        USER_PROFILE.pictureUrl
      ]);      
    }    
    catch {
      // 取得できなかった場合は"Not found."と記入
      userInfoList.push([
        "Not found.",
        "Not found.", 
        "Not found."
      ]);      
    }
  }
  const NUM_ROWS = userInfoList.length;  // 書き込む行数
  // 取得した情報を書き込む
  SHEET.getRange(LAST_ROW-NUM_ROWS+1,2,NUM_ROWS,3).setValues(userInfoList);
}