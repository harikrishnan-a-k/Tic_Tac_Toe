// script to maintain height same as width for each td
document.querySelectorAll('td').forEach(function(td){
    const width=getComputedStyle(td).width;
   
    td.style.height=`${width}`;
})
// var cw = $('.child').width();
// $('.child').css({'height':cw+'px'});

//document.querySelectorAll('td button.cell')[4].style.color='#0000ff'

// adding rotate effect for buttons on click
document.querySelectorAll('button.cell').forEach(function(btn){
    btn.addEventListener('click',function(e){
        this.classList.toggle('rotate');
    })
})

// class for tic Tac Toe
class TicTacToe{
    constructor(aiPlayer,humanPlayer){
        
        this.aiPlayer=aiPlayer;
        this.humanPlayer=humanPlayer;
        this.winCombos=[
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        this.originalBoard=Array.from(Array(9).keys());
        this.gameWon=null;
        this.cells=document.querySelectorAll('.cell');


    }
    startGame(){
        //const cells=document.querySelectorAll('.cell');
        this.cells.forEach(function(cell){
            cell.innerHTML="";
            cell.addEventListener('click',game.turnClick);
        })
    }
    turnClick(e){
        game.turn(e.target.id,game.humanPlayer);
        if(!game.isTie()&&!game.gameWon){
            window.setTimeout(function(){
                game.turn(game.bestSquare(),game.aiPlayer);
                game.isTie();
            },1500);
           
        }
    }
    turn(squareId,player){
        this.originalBoard[squareId]=player;
        const square=document.getElementById(squareId);
        square.innerHTML=player;
        document.querySelector('#click').play();
        square.removeEventListener('click',game.turnClick);
        this.gameWon=this.checkWin(this.originalBoard,player);
        if(this.gameWon){
            this.gameOver();
        }
        


    }
    checkWin(board,player){
        let playedSquares=[];
        board.forEach(function(el,i){
            if(el===player){
                playedSquares.push(i);
            }
        })
        console.log(playedSquares);
        for(let [index,win] of this.winCombos.entries()){
            if(win.every((el)=>{return playedSquares.includes(el)})){
            return {index,player};
            break;
            }
        }
        return null;
    }
    gameOver(){
        for(let index of this.winCombos[this.gameWon.index] ){
            const square=document.getElementById(index);
            square.style.backgroundColor= this.gameWon.player===this.humanPlayer?"blue":"red";
        }
        //const cells=document.querySelectorAll('button.cell');
        this.cells.forEach(function(cell){
            cell.removeEventListener('click',game.turnClick);
        });
        this.declareWin(this.gameWon.player===this.humanPlayer?'You Won !!! Hurray...':'You loose,AI beat you...');
    }
    emptySquares(){
        return this.originalBoard.filter((el)=>typeof el==='number');
    }
    bestSquare(){
        //return this.emptySquares()[0];
        return this.minimax(this.originalBoard, this.aiPlayer).index;
    }
    isTie(){
        if(this.emptySquares().length===0&& !this.gameWon){
            this.cells.forEach(function(cell){
                cell.style.backgroundColor='green';
                cell.removeEventListener('click',game.turnClick);
            });
            this.declareWin(' You managed tie the game. congrats !!!');
            return true;
        }
        else{
            return false;
        }
    }
    declareWin(msg){
        if(msg.includes('won')||msg.includes('tie')){
            document.querySelector('#winOrTie').play();
        }
        else{
            document.querySelector('#lost').play();
        }
        document.querySelector('.endgame .message').innerText=msg;
        document.querySelector('.endgame').classList.add('show');
    }
    minimax(newBoard,player){
        let availSpots = this.emptySquares();

        if (this.checkWin(newBoard, this.humanPlayer)) {
            return {score: -10};
        } else if (this.checkWin(newBoard, this.aiPlayer)) {
            return {score: 10};
        } else if (availSpots.length === 0) {
            return {score: 0};
        }
        let moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            let move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;

            if (player === this.aiPlayer) {
                let result = this.minimax(newBoard, this.humanPlayer);
                move.score = result.score;
            } else {
                let result = this.minimax(newBoard, this.aiPlayer);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;

            moves.push(move);
        }

        let bestMove;
        if(player === this.aiPlayer) {
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];

    }
}

let hplayer,aiplayer;
let marker=confirm('WE have 2 Markers. X & O. you want X?')
if(marker===true){
    hplayer="X";
    aiplayer="O";
}
else{
    hplayer="O";
    aiplayer="X";
}
let startFirst=confirm(' Do you want to make First Move?')

const game=new TicTacToe(aiplayer,hplayer);
if(startFirst){
    game.startGame();
}
else{
    game.startGame();
    alert(' OK. wait unitil AI make the first move');
    game.turn(4,game.aiPlayer);
}


const reset=document.querySelector('#reset');
reset.addEventListener('click',()=>{
    window.location.reload();
});