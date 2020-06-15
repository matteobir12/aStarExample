var startnum = 100;
var endnum = 758;
var wallboxes = [];
var base = 50;
var height = 25;
var displaynumbs = false;
var locked = false;
var allowdrag = false;
var lastedit = 0;
var interval;
var hehe = false;
var hehe2 = false;

class Box {
    constructor(pos, g, h, f, cond, discby, id) {
        this.pos = pos;//tuple
        this.f = f;
        this.g = g;
        this.h = h;
        this.cond = cond;
        this.discby = discby;
        this.id = id;
    }
}


function boxesNear(box, board) {
    var x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, x7, y7, x8, y8;
    y1 = y2 = y3 = box.pos[1] - 1;
    x1 = x4 = x6 = box.pos[0] - 1;
    y4 = y5 = box.pos[1];
    x2 = x7 = box.pos[0];
    y6 = y7 = y8 = box.pos[1] + 1;
    x3 = x5 = x8 = box.pos[0] + 1;

    if (box.pos[1] == 1) {
        x1 = y1 = x2 = y2 = x3 = y3 = 0;
    }
    if (box.pos[0] == 1) {
        x1 = y1 = x4 = y4 = x6 = y6 = 0;
    }
    if (box.pos[1] == height) {
        x6 = y6 = x7 = y7 = x8 = y8 = 0;
    }
    if (box.pos[0] == base) {
        x3 = y3 = x5 = y5 = x8 = y8 = 0;
    }
    var positions = [[x1, y1], [x2, y2], [x3, y3], [x4, y4], [x5, y5], [x6, y6], [x7, y7], [x8, y8]];//returns [0,0] if there is no box there

    var boxes = [];
    var box;
    for (var i = 0; i < 8; i++) {
        if (positions[i][0] != 0) {
            box = board[(base * (positions[i][1] - 1)) + positions[i][0] - 1];
            if (box.cond != "wall" && box.cond != "start") {
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


function calcPos(i) {
    var x = i % base;
    if (x == 0) {
        x = base;
    }
    var y = Math.trunc((i / (Number(base) + .000001))) + 1;
    return [Number(x), y];
}


function distance(pos1, pos2) {
    var x = Math.abs(pos1[0] - pos2[0])
    var y = Math.abs(pos1[1] - pos2[1])
    if (x > y) {
        return (y * 1.41) + x - y;
    } else {
        return (x * 1.41) + y - x;
    }
    // return Math.sqrt(Math.pow(pos1[0] - pos2[0],2) + Math.pow(pos1[1] - pos2[1], 2));
}


function getBoard() {
    locked = false;
    var board = [];
    var b;
    for (var i = 1; i <= (base * height); i++) {
        b = new Box(calcPos(i), 0, 10000, 10000, 'box', 10000, i);
        document.getElementById(String(i)).className = 'box';

        if (i == startnum) {
            b = new Box(calcPos(i), 0, 10000, 10000, 'start', 10000, i);
            document.getElementById(String(i)).className = 'start';
        }
        else if (i == endnum) {
            b = new Box(calcPos(i), 0, 10000, 10000, 'end', 10000, i);
            document.getElementById(String(i)).className = 'end';
        }
        else {
            for (var j = 0; j < wallboxes.length; j++) {
                if (i == wallboxes[j]) {
                    b = new Box(calcPos(i), 0, 10000, 10000, 'wall', 10000, i);
                    document.getElementById(String(i)).className = 'wall';
                }

            }
        }

        board.push(b);
        // console.log(b.pos)
    }
    return board;
}


function aStar(board) {
    t0 = performance.now()
    locked = true;
    path = [];
    loop = true;
    startbox = board[startnum - 1];
    endbox = board[endnum - 1];
    var lowestF = 100000, next, lowestHi = 100000, flag = 0;
    currentnum = startnum - 1;
    var idd = 0;
    while (loop) {
        // setTimeout(function(){

        near = boxesNear(board[currentnum], board);
        for (var i = 0; i < near.length; i++) {

            if (idd == 0 || distance(board[currentnum].pos, near[i].pos) + board[currentnum].g <= near[i].g || near[i].discby == 10000) {
                board[near[i].id - 1].g = distance(board[currentnum].pos, near[i].pos) + board[currentnum].g;
                board[near[i].id - 1].discby = currentnum + 1;
            }
            // else{
            //     board[near[i]].g = distance(board[currentnum].pos, board[near[i]].pos) + board[currentnum].g;
            //     board[near[i]].discby = currentnum + 1;
            // }
            //////// document.writeln(near[i]);
            //////// document.writeln(board[near[i]].g);
            board[near[i].id - 1].h = distance(near[i].pos, endbox.pos);
            board[near[i].id - 1].f = near[i].g + near[i].h;
            if (displaynumbs) {
                document.getElementById(near[i].id).innerHTML = String(near[i].f.toFixed(2)) + " " + near[i].g.toFixed(2) + " " + near[i].h.toFixed(2) + " " + near[i].discby;
            }
            if (JSON.stringify(near[i].pos) == JSON.stringify(endbox.pos)) {
                t1 = performance.now();
                console.log((t1 - t0) + " ms");
                selectpath(path, board, idd);
                return path, board;
            }
        }

        lowestF = 100000;
        lowestHi;
        lowestfarr = [];
        for (var i = 0; i < board.length; i++) {
            if (board[i].discby == 10000) {
                // console.log("hit");
                continue;
            }
            flag = 0;
            if (path.length > 0) {
                for (var j = 0; j < path.length; j++) {

                    if (path[j] == i) {
                        flag = 1;
                    }
                }
            }
            if (flag == 1) {
                // document.writeln("flagged:" +i);
                continue;

            }
            if (board[i].f < lowestF) {
                lowestF = board[i].f;
                lowestfarr.push(board[i]);
                next = i;

            }

            // else if (board[i].f == lowestF) {
            // if (idd == 0) {
            //     lowestHi = i;
            // }

            // if (board[i].h < board[lowestHi].h) {

            //     lowestHi = i;

            // }
            // else if (lowestH == board[i].h) {
            //     next = i;
            // }

        }
        var a = [];
        for (var i = 0; i < board.length; i++) {
            if (i == 197) {
                console.log("198h " + board[i].h);
                console.log("198f " + board[i].f);
            }
            if (Math.trunc(board[i].f, 2) == Math.trunc(lowestF, 2)) {
                a.push(board[i]);
                console.log(board[i]);
            }

        }
        lowestHi = a[0].id - 1;


        if (a[1]) {
            for (var i = 0; i < a.length; i++) {
                console.log(a[i].h)
                if (board[lowestHi].h > a[i].h) {
                    lowestHi = a[i].id - 1;
                    //console.log(board[lowestHi].h);
                    //console.log("changed h");
                }
            }
            next = lowestHi;
            console.log("using lowest h");
        }

        idd++;
        currentnum = next;
        path.push(next);
        //document.writeln(next);
        if (next + 1 == endnum) {
            // selectpath(path,board);
            // return path, board;
        }
        else {
            // document.getElementById(String(next+1)).className = 'path';
            bum(next, idd);
        }

        if (idd == 100000) {
            // selectpath(path,board);
            return path, board;
        }

        // }, 50);

    }

}


function bum(n, i) {
    interval = setTimeout(function () {
        document.getElementById(String(n + 1)).className = 'pulse path';
    }, 20 * i);
}


function selectpath(path, board, t) {
    setTimeout(function () {
        var boxpath = [];
        var nextpath = board[endnum - 1].discby;
        for (var i = 0; i < path.length; i++) {
            document.getElementById(String(nextpath)).className = 'fpulse fpath';
            nextpath = board[nextpath - 1].discby;
            if (nextpath == startnum) {
                break;
            }
        }
    }, (20 * t) + 1000)

}

function main() {
    createBoard()
    getBoard()
    // aStar(getBoard());


}


function createBoard() {
    for (var i = 0; i < height; i++) {
        var div = document.createElement("div");
        div.id = "row " + (i + 1);
        div.className = "row";
        if (base >= 50) {

            div.style.height = ((80 / base) + .1) + "vw";
        } else {
            div.style.height = ((80 / base) + .3) + "vw";
        }
        document.getElementById("cont").appendChild(div);
    }


    var row = 1;

    for (var i = 0; i < (base * height); i++) {
        var div = document.createElement("div");
        div.id = String(i + 1);

        div.style.height = (80 / base) + "vw";
        div.style.width = (80 / base) + "vw";
        div.className = "box";
        div.setAttribute("onclick", "toggle(" + (i + 1) + ");");

        div.setAttribute("onmousemove", "dragg(" + (i + 1) + ");");
        div.setAttribute("onmousedown", "dragg(0);");
        div.setAttribute("onmouseup", "dragg(-1);");
        if (i % base == 0 && i != 0) {
            row++;
        }
        if (base >= 50) {

            div.style.border = ".05vw solid gray";
        }
        document.getElementById("row " + row).appendChild(div);
    }
    if (hehe) {
        wallboxes = [1, 4, 5, 6, 8, 70, 73, 75, 77, 139, 140, 142, 143, 144, 146, 147];
    }
    if (hehe2) {
        wallboxes = [4245, 4665, 5084, 5504, 5924, 6344, 6764, 7184, 8024, 8444, 9284, 9704, 10544, 11384, 11804, 12224, 13064, 13903, 14323, 14743, 15583, 16423, 16843, 17683, 18523, 18943, 19363, 19783, 20203, 20623, 21463, 21883, 22303, 22723, 23143, 23563, 23983, 24403, 24823, 7605, 7185, 5514, 5933, 5932, 6351, 6350, 6349, 6348, 6767, 5515, 5516, 5517, 5518, 5519, 5520, 5521, 5522, 5942, 5943, 5944, 5945, 6366, 6367, 6787, 6788, 6789, 6790, 7210, 7211, 7212, 7632, 7633, 8053, 8054, 8474, 8475, 8896, 9316, 9737, 10157, 10578, 11418, 11838, 12258, 12678, 13099, 13519, 13939, 14359, 14779, 15199, 15619, 16039, 16459, 16879, 17299, 17719, 18139, 18559, 18979, 19399, 19819, 20239, 20659, 21079, 21499, 21919, 22339, 22759, 23179, 23178, 23598, 24018, 24438, 24858, 6819, 7239, 7659, 8079, 8499, 8919, 9339, 9759, 10179, 10599, 11019, 11439, 11859, 12279, 12699, 13118, 13538, 13958, 14378, 14798, 15218, 15638, 16058, 16478, 16898, 17318, 17738, 18158, 18578, 19418, 19838, 20259, 20679, 21099, 21519, 21939, 22359, 22779, 23199, 23619, 24039, 24459, 24879, 25299, 3879, 7281, 7280, 6860, 6859, 6858, 6857, 6437, 6436, 6435, 6434, 6433, 6432, 6431, 6430, 6429, 6428, 6427, 6007, 6006, 6005, 6424, 6423, 6422, 6841, 7260, 7679, 8099, 8098, 8518, 8938, 8937, 9777, 10197, 10616, 11036, 11456, 11876, 12296, 12716, 12715, 13135, 13555, 13975, 14395, 15235, 16074, 16914, 17334, 17754, 18594, 19435, 20275, 21115, 21116, 21536, 21957, 22377, 22378, 22798, 22799, 23219, 23220, 23221, 23642, 24063, 24064, 24485, 24486, 24487, 24908, 24909, 24910, 24911, 24912, 24494, 24495, 24496, 24076, 24077, 24078, 24079, 23659, 23660, 23661, 23241, 23242, 22822, 22402, 15695, 15276, 15696, 15697, 15277, 15278, 15279, 15280, 15281, 15282, 15283, 15284, 15285, 15286, 15287, 15288, 15289, 15290, 15710, 15711, 15712, 15713, 15714, 15715, 15716, 15717, 15718, 15719, 15720, 15721, 15301, 15302, 15303, 15304, 15305, 15306, 15307, 15308, 14888, 14889, 14469, 14049, 13629, 13628, 13208, 12788, 12367, 11947, 11526, 11105, 10264, 10263, 9843, 9423, 9002, 9001, 8580, 8159, 7738, 7317, 6896, 6895, 6473, 6472, 6050, 6048, 6046, 6044, 6043, 6461, 6460, 7299, 7718, 8138, 8557, 8977, 9396, 9816, 10235, 10655, 11913, 12753, 13172, 13592, 14012, 14432, 15272, 15692, 16113, 16533, 17374, 17794, 18214, 18635, 19055, 19896, 20317, 20737, 21578, 21999, 22420, 22841, 23262, 23263, 23684, 23685, 24107, 24109, 24111, 24112, 24113, 24114, 24115, 24116, 24117, 24118, 24119, 24120, 24121, 24122, 23703, 23284, 23285, 22865, 22866, 22447, 22027, 22028, 22029];
    }
}


function toggle(id) {
    if (!(locked)) {

        if (document.getElementById(id).className == "box") {
            document.getElementById(id).className = "wall";
            wallboxes.push(id)

        }
        else if (document.getElementById(id).className == "wall") {
            document.getElementById(id).className = "box"
            for (var i = 0; i < wallboxes.length; i++) {
                if (wallboxes[i] == id) {

                    wallboxes.splice(i, 1);
                }
            }
        }
        else if (document.getElementById(id).className == "start") {
            console.log("clicked start");
            for (var i = 0; i < (base * height); i++) {
                if (document.getElementById(i + 1).className == "box") {
                    document.getElementById(i + 1).className = "box Sbox";
                }
            }
            locked = true;
            startnum = 0;
        }
        else if (document.getElementById(id).className == "end") {

            console.log("clicked end");
            for (var i = 0; i < (base * height); i++) {
                if (document.getElementById(i + 1).className == "box") {
                    document.getElementById(i + 1).className = "box Ebox";
                }
            }
            locked = true;
            endnum = 0;
        }
    }
    else if (document.getElementById(id).className == "box Sbox") {
        startnum = id;
        document.getElementById(id).className = "start";

        getBoard();
    }
    else if (document.getElementById(id).className == "box Ebox") {
        endnum = id;
        document.getElementById(id).className = "end";

        getBoard();

    }
}


function submitXY() {
    removeBoard(base, height);
    if (document.getElementById("base").value) { base = document.getElementById("base").value; }
    if (document.getElementById("height").value) { height = document.getElementById("height").value; }
    if (base == 69 && height > 2) {
        hehe = true;
    }
    if (base == 420 && height == 69) {
        hehe2 = true;
    }
    // wallboxes = [];
    main()

}


function removeBoard(b, h) {
    for (var i = 0; i < (h); i++) {
        var e = document.getElementById("row " + (i + 1));
        e.parentNode.removeChild(e);
    };

}


function numbTog() {
    if (displaynumbs) { displaynumbs = false; }
    else {
        displaynumbs = true;
    }
}


function clearWalls() {
    wallboxes = [];
}


function dragg(id) {
    if (!(locked)) {

        if (id == 0) {
            allowdrag = true;
        }
        else if (id == -1) {
            allowdrag = false;
            getBoard();

        }
        else if (allowdrag) {
            if (!(document.getElementById(id).className == 'start') && !(document.getElementById(id).className == 'end')) {
                if (document.getElementById(id).className == 'wall' && lastedit !== id) {
                    document.getElementById(id).className = 'box'
                    lastedit = id;
                    for (var i = 0; i < wallboxes.length; i++) {
                        if (wallboxes[i] == id) {

                            wallboxes.splice(i, 1);
                        }
                    }
                }
                else if (document.getElementById(id).className == 'box' && lastedit !== id) {
                    document.getElementById(id).className = 'wall';
                    lastedit = id;
                    wallboxes.push(id);
                }
            }
        }
    }
}


main();