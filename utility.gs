// 画像URLを取得
function getImgUrl(filename) {
  return [
    "https://github.com/probabilityhill/saizen-linebot/blob/main/img/" + filename + ".png?raw=true",
    "https://github.com/probabilityhill/saizen-linebot/blob/main/img/" + filename + "_pre.png?raw=true"
  ];
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
function getUserName(){
  const LAST_ROW = SHEET.getLastRow();  // 最終行取得
  for(let i = 2; i <= LAST_ROW; i++){
    if(SHEET.getRange(i,2).isBlank()){
      const USER_ID = SHEET.getRange(i,1).getValue();
      const URL = "https://api.line.me/v2/bot/profile/" + USER_ID;
      const USER_PROFILE = UrlFetchApp.fetch(URL,{
        "headers": {
          "Authorization" :  "Bearer " + ACCESS_TOKEN,
        }
      });      
      SHEET.getRange(i,2).setValue(JSON.parse(USER_PROFILE).displayName);
      SHEET.getRange(i,3).setValue(JSON.parse(USER_PROFILE).statusMessage);
      SHEET.getRange(i,4).setValue(JSON.parse(USER_PROFILE).pictureUrl);
    }
  }
}