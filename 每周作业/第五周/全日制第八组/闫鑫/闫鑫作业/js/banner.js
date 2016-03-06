/**
 * Created by Logan on 2016/2/22.
 */
(function () {
  var outer = document.getElementById("outer");
  var inner = document.getElementById("inner");
  var imgList = inner.getElementsByTagName("img");
  var tip = outer.getElementsByTagName("ul")[0];
  var tipList = tip.getElementsByTagName("li");
  var autoTimer = null, step = 0, count = tipList.length;
  var btnLeft = document.getElementById("btnLeft");
  var btnRight = document.getElementById("btnRight");

  outer.onmouseover = function () {
    window.clearInterval(autoTimer);
    btnLeft.style.display = "block";
    btnRight.style.display = "block";
  };
  outer.onmouseout = function () {
    btnLeft.style.display = "none";
    btnRight.style.display = "none";
    autoTimer = window.setInterval(autoMove, 2000);
  };
  function lazyLoad() {
    for (var i = 0; i < imgList.length; i++) {
      (function (i) {
        var cur = imgList[i];
        var oImg = new Image;
        oImg.src = cur.getAttribute("trueImg");
        oImg.onload = function () {
          cur.src = this.src;
          animate(cur, {opacity: 1}, 500);
          selectTip();
        };
      })(i);
    }
  }

  window.setTimeout(lazyLoad, 500);
  function selectTip() {
    var tempStep = step;
    tempStep >= tipList.length ? tempStep = 0 : null;
    for (var i = 0; i < tipList.length; i++) {
      tipList[i].className = i === tempStep ? "tip" : null;
    }
  }

  btnLeft.onclick = function () {
    step--;
    if (step < 0) {
      inner.style.left = -count * 730 + "px";
      step = count - 1;
    }
    animate(inner, {left: -step * 730}, 500);
    selectTip();
  };
  btnRight.onclick = function () {
    autoMove();
  };
  tipMove();
  function tipMove() {
    for (var i = 0; i < tipList.length; i++) {
      tipList[i].index = i;
      tipList[i].onmouseover = function () {
        window.clearInterval(autoTimer);
        step = this.index;
        animate(inner, {left: -step * 730}, 500);
        selectTip();
        autoTimer = window.setInterval(autoMove, 2000);
      };
    }
  }

  function autoMove() {
    step++;
    if (step > count) {
      inner.style.left = 0;
      step = 1;
    }
    animate(inner, {left: -step * 730}, 500);
    selectTip();
  }

  autoTimer = window.setInterval(autoMove, 2000);
})();