function play(){
  let board = [1,0,2,0,1,0,0,2,1];
  console.log(judgeWin(board));
}

function judgeWin(board) {
  const LINE_LIST = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const line of LINE_LIST){
    if(board[line[0]] === board[line[1]] && board[line[1]] === board[line[2]]){
      return board[line[0]]  // winner
    }
  }
  return 0;
}