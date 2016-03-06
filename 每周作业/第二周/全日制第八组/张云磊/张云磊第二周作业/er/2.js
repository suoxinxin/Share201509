var oTab = document.getElementById("tab");
var tHead = oTab.tHead;
var tBody = oTab.tBodies[0];
var oThs = tHead.rows[0].cells;
var oTrs = tBody.rows;
function bindData() {
    frg = document.createDocumentFragment();
    for (var i = 0; i < jsonAry.length; i++) {
        var cur = jsonAry[i];
        cur.sex = cur.sex === 0 ? "男" : "女";
        var oTr = document.createElement("tr");
        for (var key in cur) {
            var oTd = document.createElement("td");
            oTd.innerHTML = cur[key];
            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
    frg = null;
}
bindData();

function changeBg() {
    for (var i = 0; i < oTrs.length; i++) {
        oTrs[i].className = (i % 2) == 1 ? "bg" : null;
    }
}
changeBg();

function sortList(n) {
    var zhufeng = this;
    zhufeng.flag *= -1;

    for(var k=0;k<oThs.length;k++){
        if(k!==n){
            oThs[k].flag=-1;
        }
    }
    var ary = utils.listToArray(oTrs);
    ary.sort(function (a, b) {
        var curIn = a.cells[n].innerHTML;
        var nextIn = b.cells[n].innerHTML;
        var curInNum = parseFloat(curIn);
        var nextInNum = parseFloat(nextIn);
        if (isNaN(curIn) || isNaN(nextIn)) {
            return (curIn.localeCompare(nextIn)) * zhufeng.flag;
        }
        return (curInNum - nextInNum)*zhufeng.flag;
    });
    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg = null;
    changeBg();
}
for (var i = 0; i < oThs.length; i++) {
    if (oThs[i].className === "cursor") {
        oThs[i].flag = -1;
        oThs[i].index = i;
        oThs[i].onclick = function () {
            sortList.call(this, this.index)
        };
    }
}
