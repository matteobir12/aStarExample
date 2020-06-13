var startnum = 23;
var endnum = 14;
var wallboxes = [];
var base = 7;
var height = 4;
var displaynumbs = false;
var locked = false;
var allowdrag = false;
var lastedit=0;
var interval;
var hehe = false;

class Box {
    constructor(pos,g,h,f,cond,discby,id){
        this.pos = pos;//tuple
        this.f = f;
        this.g = g;
        this.h = h;
        this.cond = cond;
        this.discby = discby;
        this.id = id;
    }
}


function boxesNear(box ,board){
    var x1,y1,x2,y2,x3,y3,x4,y4,x5,y5,x6,y6,x7,y7,x8,y8;
    y1 = y2 = y3 = box.pos[1]-1;
    x1 = x4 = x6 = box.pos[0]-1;
    y4 = y5 = box.pos[1];
    x2 = x7 = box.pos[0];
    y6 = y7 = y8 = box.pos[1]+1;
    x3 = x5 = x8 = box.pos[0]+1;

    if (box.pos[1] == 1){
        x1 = y1 = x2 = y2 = x3 = y3 = 0;
    }
    if (box.pos[0] == 1){
        x1 = y1 = x4 = y4 = x6 = y6 = 0;
    }
    if (box.pos[1] == height){
        x6 = y6 = x7 = y7 = x8 = y8 = 0;
    }
    if (box.pos[0] == base){
        x3 = y3 = x5 = y5 = x8 = y8 = 0;
    }
    var positions = [[x1,y1],[x2,y2],[x3,y3],[x4,y4],[x5,y5],[x6,y6],[x7,y7],[x8,y8]];//returns [0,0] if there is no box there

    var boxes = [];
    var box;
    for(var i = 0; i < 8; i++){
        if(positions[i][0] != 0){
            box = board[(base * (positions[i][1] - 1)) + positions[i][0]-1];
            if(box.cond != "wall" && box.cond != "start"){
                boxes.push(box);
            }
        }
    }
    
    // for(var i = 0; i<8;i++){
    //     for (var j = 0; j < (base*height); j++){
    //         if (JSON.stringify(board[j].pos) == JSON.stringify(positions[i]) && board[j].cond != "wall" && board[j].cond != "start"){// && board[j].discby != 100){
    //             boxes.push(j);
    //         }
    //     }
    // }
    return boxes;
}


function calcPos(i){
    var x = i%base;
    if (x == 0){
        x = base;
    }
    var y = Math.trunc((i/(Number(base) + .000001))) + 1;
    return [Number(x), y];
}


function distance(pos1,pos2){
    return Math.sqrt(Math.pow(pos1[0] - pos2[0],2) + Math.pow(pos1[1] - pos2[1], 2));
}


function getBoard(){
    locked = false;
    var board = [];
    var b;
    for (var i = 1; i <= (base*height); i++){
        b = new Box(calcPos(i),0,10000,10000,'box', 10000,i);
        document.getElementById(String(i)).className = 'box';
        
        if (i == startnum){
            b = new Box(calcPos(i),0,10000,10000,'start', 10000,i);
            document.getElementById(String(i)).className = 'start';
        }
        else if(i == endnum){
            b = new Box(calcPos(i),0,10000,10000,'end', 10000,i);
            document.getElementById(String(i)).className = 'end';
        }
        else{
            for (var j = 0; j < wallboxes.length; j++){
                if ( i == wallboxes[j]){
                    b = new Box(calcPos(i),0,10000,10000,'wall', 10000,i);
                    document.getElementById(String(i)).className = 'wall';
                }
            
            }
        }

        board.push(b);
        // console.log(b.pos)
    }
    return board;
}


function aStar(board)
{
    var t0 = performance.now()
    locked = true;
    path = [];
    loop = true;
    startbox = board[startnum-1];
    endbox = board[endnum-1];
    var lowestF = 100000,next,lowestH = 100000,flag=0;
    currentnum = startnum -1;
    var idd = 0;
    while (loop)
    {
        // setTimeout(function(){
            near = boxesNear(board[currentnum], board);
            for (var i = 0; i<near.length;i++) 
            {   
                
                if(idd == 0 || distance(board[currentnum].pos, near[i].pos) + board[currentnum].g <= near[i].g || near[i].discby == 10000){
                    board[near[i].id-1].g = distance(board[currentnum].pos, near[i].pos) + board[currentnum].g;
                    board[near[i].id-1].discby = currentnum + 1;
                }
                // else{
                //     board[near[i]].g = distance(board[currentnum].pos, board[near[i]].pos) + board[currentnum].g;
                //     board[near[i]].discby = currentnum + 1;
                // }
                //////// document.writeln(near[i]);
                //////// document.writeln(board[near[i]].g);
                board[near[i].id-1].h = distance(near[i].pos, endbox.pos);
                board[near[i].id-1].f = near[i].g + near[i].h;
                if (displaynumbs){
                    document.getElementById(near[i].id).innerHTML = String(near[i].f.toFixed(2)) + " " + near[i].g.toFixed(2) +" "+ near[i].h.toFixed(2) + " " + near[i].discby; 
                }
                if(JSON.stringify(near[i].pos) == JSON.stringify(endbox.pos)){
                    selectpath(path,board);
                    return path, board;
                }
            }

            lowestF=100000;
            lowestH=100000;
            for (var i = 0; i < board.length; i++)
            {   
                if(board[i].discby == 10000){
                    // console.log("hit");
                    continue;
                }
                flag=0;
                if (path.length > 0){
                    for(var j=0; j<path.length;j++){
                        
                        if (path[j] == i){
                            flag = 1;
                        }
                    }
                }
                if(flag == 1){
                    // document.writeln("flagged:" +i);
                    continue;
                    
                }
                if (board[i].f < lowestF){
                    lowestF = board[i].f;
                    next = i;
                }
                else if(board[i].f == lowestF)
                {
                    if(board[i].h < lowestH)
                    {
                        lowestH = board[i].h;
                        next = i;
                    }
                    else if(lowestH == board[i].h) 
                    {
                        next = i;
                    }
                }
            }

            idd++;
            currentnum = next;
            path.push(next);
            //document.writeln(next);
            if (next+1 == endnum)
            {
                t1 = performance.now()
                selectpath(path,board);
                return path, board, t1 - t0;
            }
            else{
                // document.getElementById(String(next+1)).className = 'path';
                bum(next, idd);
            }
            
            if (idd == 10000)
            {   
                // selectpath(path,board);
                return path, board;
            }
        
        // }, 50);
    
    }   
    
}


function bum(n, i){
    interval = setTimeout(function(){
        document.getElementById(String(n+1)).className = 'pulse path';
    }, 100* i);
}


function selectpath(path, board){
    var boxpath = [];
    var nextpath = board[endnum-1].discby;
    for(var i =0;i<path.length; i++){
        document.getElementById(String(nextpath)).className = 'fpath';
        nextpath = board[nextpath-1].discby;
        if(nextpath == startnum){
            break;
        }
    }
}

function main(){
    createBoard()
    getBoard()
    // aStar(getBoard());
    

}


function createBoard() {
    for(var i=0;i <height;i++){
        var div = document.createElement("div");
        div.id = "row "+(i+1);
        div.className = "row";
        if (base >= 50) {

            div.style.height = ((80 / base) + .1) + "vw";
        } else {
            div.style.height = ((80 / base) + .3) + "vw";
        }
        document.getElementById("cont").appendChild(div);
    }

    
    var row = 1;

    for(var i=0;i <(base*height);i++){
        var div = document.createElement("div");
        div.id = String(i+1);
        
        div.style.height = (80/base)+"vw";
        div.style.width = (80/base)+"vw";
        div.className = "box";
        div.setAttribute("onclick","toggle("+(i+1)+");");
        
        div.setAttribute("onmousemove","dragg("+(i+1)+");");
        div.setAttribute("onmousedown","dragg(0);");
        div.setAttribute("onmouseup","dragg(-1);");
        if (i%base == 0 && i !=0){
            row++;
        }
        if (base >= 50) {

            div.style.border = ".05vw solid gray";
        }
        document.getElementById("row "+row).appendChild(div);
    }
    if(hehe){
    wallboxes = [1,4,5,6,8,70,73,75,77,139,140,142,143,144,146,147];}
}


function toggle(id) {
    if(!(locked)){

        if (document.getElementById(id).className == "box")
        {
            document.getElementById(id).className = "wall";
            wallboxes.push(id)
            
        } 
        else if(document.getElementById(id).className == "wall"){
            document.getElementById(id).className = "box"
            for (var i =0;i<wallboxes.length;i++){
                if (wallboxes[i]==id){
                    
                    wallboxes.splice(i,1);
                }
            }
        }
        else if(document.getElementById(id).className == "start"){
            console.log("clicked start");
            for (var i=0;i<(base*height);i++){
                if(document.getElementById(i+1).className=="box"){
                    document.getElementById(i+1).className= "box Sbox";
                }
            }
            locked = true;
            startnum = 0;
        }
        else if(document.getElementById(id).className == "end"){
            
            console.log("clicked end");
            for (var i=0;i<(base*height);i++){
                if(document.getElementById(i+1).className=="box"){
                    document.getElementById(i+1).className= "box Ebox";
                }
            }
            locked = true;
            endnum = 0;
        }  
    }
    else if(document.getElementById(id).className == "box Sbox"){
        startnum = id;
        document.getElementById(id).className = "start";
        
        getBoard();
    }
    else if(document.getElementById(id).className == "box Ebox"){
        endnum = id;
        document.getElementById(id).className = "end";
        
        getBoard();

    }
}


function submitXY() {
    removeBoard(base,height);
    if(document.getElementById("base").value){base = document.getElementById("base").value;}
    if(document.getElementById("height").value){ height = document.getElementById("height").value;}
    if(base==69&&height>2){
        hehe=true;
    }
    // wallboxes = [];
    main()
    
}


function removeBoard(b,h) {
    for(var i = 0;i<(h);i++){
        var e = document.getElementById("row "+(i+1));
        e.parentNode.removeChild(e);
    };
    
}


function numbTog() {
    if (displaynumbs)
    {displaynumbs =false;}
    else{
        displaynumbs = true;
    }
}


function clearWalls(){
    wallboxes = []
}


function dragg(id){
    if (!(locked))  {
        
            if(id==0){
                allowdrag = true;
            }
            else if (id == -1){
                allowdrag = false;
                getBoard();
                
            }
            else if (allowdrag){
                if (!(document.getElementById(id).className == 'start') && !(document.getElementById(id).className == 'end')){
                if (document.getElementById(id).className == 'wall'&&lastedit!==id)
                {document.getElementById(id).className = 'box'
                lastedit = id;
                for (var i =0;i<wallboxes.length;i++){
                    if (wallboxes[i]==id){
                        
                        wallboxes.splice(i,1);
                    }
                }
            }
                else if (document.getElementById(id).className == 'box'&&lastedit!==id)
                {
                    document.getElementById(id).className = 'wall';
                    lastedit = id;
                    wallboxes.push(id);
                }
            }
        }
    }
}


main();