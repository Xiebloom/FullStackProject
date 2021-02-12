const e = require("express");

var starttime = new Array();
var finishtime = new Array();

starttime[0] = 0;
finishtime[0] = 0;
//generatedata(starttime,finishtime);

//console.log(starttime.length);

var id = 'M101';
var idnumber = 0;


idnumber = setnewID(id);

console.log(idnumber);
console.log(typeof idnumber);




function generatedata(starttime, finishtime) {

    var k = 0;
    var r = 0;
    for (var i = 0; i < 20; i++) {
        //保存该回生成的随机数
        r = randomnunber(i, i + 1);
        //    console.log(r);
        //    console.log(randomnunber(0,1));

        //若新的开始时间小于之前的结束时间，即为该段连续
        if (i == 0) {
            starttime[i] = randomnunber(i, i + 1);
            finishtime[i] = starttime[i] + randomnunber(0, 1);
        }
        else {
            if (r <= finishtime[k]) {
                finishtime[k] = finishtime[k] + randomnunber(0, 1);
                console.log('Finishtime伸びる！' + ' to ' + finishtime[k]);
            }
            //否则就是新的一段时间 
            else {
                starttime[k + 1] = r;
                finishtime[k + 1] = r + randomnunber(0, 1);
                k++;
            }
        }

        console.log('starttime' + k + ' = ' + starttime[k]);
        console.log('finishtime' + k + ' = ' + finishtime[k]);
    }
}

function randomnunber(down, up) {
    return Math.random() * (up - down) + down;
}

function setnewID(lastid){
    var newid;
    newid = Number(lastid[1]*100) + Number(lastid[2]*10) + Number(lastid[3])+1;
    return 'M' + String(newid); 
}

//module.export = generatedata();