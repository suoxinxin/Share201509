(function () {
    function getCss(curEle, attr) {
        var val = reg = null;
        if ("getComputedStyle"in window) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {
            if (attr === "opacity") {
                val = curEle.currentStyle["filter"];
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        reg = /^-?\d+(\.\d+)?(px|pt|em|rem)?$/;
        return reg.test(val) ? parseFloat(val) : val;
    }

    function setCss(curEle, attr, value) {
        if (attr === "float") {
            curEle["style"]["cssFloat"] = value;
            curEle["style"]["styleFloat"] = value;
            return;
        }
        if (attr === "opacity") {
            value > 1 ? value = 1 : null;
            value < 0 ? value = 0 : null;
            curEle["style"]["opacity"] = value;
            curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            return;
        }
        var reg = /^(width|height|(padding|margin(Top|Left|Right|Bottom))|top|left|right|bottom)$/;
        if (reg.test(attr)) {
            reg = /^-?\d+(\.\d+)?$/;
            if (reg.test(value)) {
                curEle["style"][attr] = value + "px";
                return;
            }
        }
        curEle["style"][attr] = value;
    }

    var zhufengEffect = {
        Linear: function (t, b, c, d) {
            return c * t / d + b;
        }
    };
    //->实现我们的运动动画
    function animate(curEle, tarObj, duration, effect, callBack) {
        var fnEffect = zhufengEffect.Linear;
        if (typeof effect === "number") {
            var ary = ["Linear", "Elastic-easeOut", "Back-easeOut", "Bounce-easeOut", "Expo-easeIn"];
            for (var i = 0; i < ary.length; i++) {
                if (effect === (i + 1)) {
                    var curItem = ary[i].split("-");
                    var curItemFir = curItem[0];
                    var curItemTwo = curItem[1];
                    fnEffect = curItem.length === 1 ? zhufengEffect[curItemFir] : zhufengEffect[curItemFir][curItemTwo];
                    break;
                }
            }
        } else if (effect instanceof Array) {
            var effectFir = effect[0];
            var effectTwo = effect[1];
            fnEffect = effect.length === 1 ? zhufengEffect[effectFir] : zhufengEffect[effectFir][effectTwo];
        } else if (typeof effect === "function") {
            callBack = effect;
        }
        var times = 0, beginObj = {}, changeObj = {};
        for (var key in tarObj) {
            if (tarObj.hasOwnProperty(key)) {
                beginObj[key] = getCss(curEle, key);
                changeObj[key] = tarObj[key] - beginObj[key];
            }
        }

        //->实现动画操作
        window.clearInterval(curEle.timer);
        curEle.timer = window.setInterval(function () {
            times += 10;
            if (times >= duration) {
                window.clearInterval(curEle.timer);
                for (var key in tarObj) {
                    if (tarObj.hasOwnProperty(key)) {
                        setCss(curEle, key, tarObj[key]);
                    }
                }
                typeof callBack === "function" ? callBack.call(curEle) : null;
                return;
            }
            for (key in changeObj) {
                if (changeObj.hasOwnProperty(key)) {
                    var cur = fnEffect(times, beginObj[key], changeObj[key], duration);
                    setCss(curEle, key, cur);
                }
            }
        }, 10);
    }

    window.animate = animate;
})();
(function () {
    var ary = ["img/T1fUJ_BgWv1RXrhCrK.jpg", "img/T1bYAvBjJv1RXrhCrK.jpg", "img/T1Ngx_B7xv1RXrhCrK.jpg", "img/T1lVh_ByJv1RXrhCrK.jpg", "img/T1UbZ_B5Vv1RXrhCrK.jpg"];
    var autoTimer = null, step = 0, count = ary.length;
    var inner = document.getElementById("inner"), imgList = inner.getElementsByTagName("img");
    var tip = document.getElementById("tip"), tipList = tip.getElementsByTagName("li");
    var btnLeft = document.getElementById("btnLeft"), btnRight = document.getElementById("btnRight");
    bindData();
    function bindData() {
        var str = "";
        for (var i = 0; i < ary.length; i++) {
            str += "<div><img src='' trueImg='" + ary[i] + "'/></div>";
        }
        str += "<div><img src='' trueImg='" + ary[0] + "'/></div>";
        inner.innerHTML = str;
        inner.style.width = (count + 1) * 1226 + "px";
        str = "";
        for (i = 0; i < ary.length; i++) {
            str += "<li></li>";
        }
        tip.innerHTML = str;
        selectTip();
    }
    window.setTimeout(lazyImg, 100);
    function lazyImg() {
        for (var i = 0; i < imgList.length; i++) {
            ~function (i) {
                var curImg = imgList[i];
                var oImg = new Image;
                oImg.src = curImg.getAttribute("trueImg");
                oImg.onload = function () {
                    curImg.src = this.src;
                    curImg.style.display = "block";
                    animate(curImg, {opacity: 1}, 100);
                }
            }(i);
        }
    }
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
(function () {
    var ulNav = document.getElementById("ulNav"), liList = ulNav.getElementsByTagName("li"),aList=ulNav.getElementsByTagName("a"), divList =ulNav.getElementsByTagName("div");
    for (var i = 0; i <liList.length; i++) {
        var cur = liList[i];
        cur.index = i;
        cur.onmouseover = function () {
            this.className = "bg";
            divList[this.index].className = "show";
            for (var k = 0; k < liList.length; k++) {
                if (k !== this.index) {
                    liList[k].className = null;
                    divList[k].className = null;
                }
            }
        }
    }
    //var ulNav = document.getElementById("ulNav"), liList = ulNav.getElementsByTagName("li"), aList = ulNav.getElementsByTagName("a"), divList = ulNav.getElementsByClassName("play");
    //document.body.onmouseover = function (e) {
    //    e = e || window.event;
    //    e.target = e.target || e.srcElement;
    //    var parent = null, curCon = null, curDiv = null;
    //    if ((e.target.tagName.toLowerCase() === "li" && e.target.parentNode.id === "ulNav") || e.target.parentNode.parentNode.id === "ulNav" || e.target.className === "show") {
    //        if (e.target.tagName.toLowerCase() === "li" && e.target.parentNode.id === "ulNav") {
    //            parent = e.target;
    //            curCon = utils.children(parent, "a")[0];
    //            curDiv = utils.children(parent, "div")[1];
    //            parent.className = "bg";
    //            utils.addClass(curDiv, "show");
    //
    //        } else if (e.target.parentNode.parentNode.id === "ulNav") {
    //            parent = utils.children(parent);
    //            curCon = utils.children(parent, "a")[0];
    //            curDiv = utils.children(parent, "div")[1];
    //            parent.className = "bg";
    //            utils.addClass(curDiv, "show");
    //        } else {
    //            utils.addClass(e.target, "show");
    //        }
    //    }
    //    liList.className = null;
    //    utils.removeClass(divList, "show");
    //};
})();
