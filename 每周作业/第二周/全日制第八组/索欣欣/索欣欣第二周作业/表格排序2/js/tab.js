var tab=document.getElementById("tab");
var tHead=tab.tHead;
var tBody=tab.tBodies[0];
var rows=tBody.rows;
var oThs=tHead.rows[0].cells;

function bindData(){
    var frg=document.createDocumentFragment();
    for(var i=0;i<jsonAry.length;i++){
        var cur=jsonAry[i];
        cur.sex=(cur.sex===0?"男":"女");
        var oTr=document.createElement("tr");
        for(var key in cur){
            var oTd=document.createElement("td");
            oTd.innerHTML=cur[key];
            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
    frg=null;
}
bindData();

function changeBg(){
    for(var i=0;i<rows.length;i++){
        rows[i].className=(i%2===1?"bg":null);
    }
}
changeBg();

function sortList(n) {
    var zhufeng = this;
    zhufeng.flag *= -1;
    for (var k = 0; k < oThs.length; k++) {
        if (k !== n) {
            oThs[k].flag = -1;
        }
    }

    var ary = utils.listToArray(rows);
    ary.sort(function (a, b) {
        var cur = a.cells[n].innerHTML;
        var next = b.cells[n].innerHTML;
        var curNum = parseFloat(cur);
        var nextNum = parseFloat(next);
        if (isNaN(curNum) || isNaN(nextNum)) {
            return cur.localeCompare(next) * zhufeng.flag;
        }
        return (curNum - nextNum) * zhufeng.flag;
    });
    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg = null;
    changeBg();
}

for(var i=0;i<oThs.length;i++){
    var curTh=oThs[i];
    if(curTh.className==="cursor"){
        curTh.flag=-1;
        curTh.index=i;
        curTh.onclick=function(){
            sortList.call(this,this.index)
        }
    }
}

























