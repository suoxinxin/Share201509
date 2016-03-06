(function () {
  var autoTimer = null, step = 0, count = 5;
  var inner = document.getElementById("inner"), imgList = inner.getElementsByTagName("img");
  var tip = document.getElementById("tip"), tipList = tip.getElementsByTagName("li");
  var btnLeft = document.getElementById("btnLeft"), btnRight = document.getElementById("btnRight");

  function selectTip() {
    var tempStep = step;
    tempStep >= tipList.length ? tempStep = 0 : null;
    for (var i = 0; i < tipList.length; i++) {
      tipList[i].className = i === tempStep ? "bg" : null;
    }
  }

  tipMove();
  function tipMove() {
    for (var i = 0; i < tipList.length; i++) {
      var curTip = tipList[i];
      curTip.index = i;
      curTip.onclick = function () {
        window.clearInterval(autoTimer);
        step = this.index;
        animate(inner, {left: -step * 1226}, 500);
        selectTip();
        autoTimer = window.setInterval(autoMove, 2000);
      }
    }
  }

  btnRight.onclick = function () {
    window.clearInterval(autoTimer);
    autoMove();
    autoTimer = window.setInterval(autoMove, 2000);
  };

  btnLeft.onclick = function () {
    window.clearInterval(autoTimer);
    step--;
    if (step < 0) {
      step = count - 1;
      inner.style.left = -count * 1226 + "px";
    }
    animate(inner, {left: -step * 1226}, 500);
    selectTip();
    autoTimer = window.setInterval(autoMove, 2000);
  };
  function autoMove() {
    step++;
    if (step > count) {
      step = 1;
      inner.style.left = 0;
    }
    animate(inner, {left: -step * 1226}, 500);
    selectTip();
  }

  autoTimer = window.setInterval(autoMove, 2000);
})();


//轮播图左侧列表


(function(){
  var outerLeft = document.getElementById("outerLeft"),oLis=outerLeft.getElementsByTagName("li");
  var oDiv = document.getElementsByTagName("div"),phone=document.getElementsByClassName("phone");


  document.body.onmouseover = function (e) {
    e = e || window.event;
    e.target = e.target || e.srcElement;
    if (e.target.id === "li1"||(e.target.tagName.toLowerCase() === "a" && e.target.parentNode.id === "li1")) {
      phone.style.display = "block";
      phone.style.width = "794px";
    }
    else if (e.target.id === "li2"||(e.target.tagName.toLowerCase() === "a" && e.target.parentNode.id === "li2")) {
      phone.style.display = "block";
      phone.style.width="300px";
    }
    else {
      phone.style.display = "none";
    }
  };
})();


