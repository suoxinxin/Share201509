(function () {
  function getCss(curEle, attr) {
    var val = null, reg = null;
    if ("getComputedStyle" in window) {
      val = window.getComputedStyle(curEle, null)[attr];
    } else {
      if (attr === "opacity") {
        val = curEle.currentStyle["filter"];
        reg = /^alpha\(opacity=(\d+(\.\d+)?)\)$/;
        val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
      } else {
        val = curEle.currentStyle[attr];
      }
    }
    reg = /^-?\d+(\.\d+)?(pt|px|em|rem)?$/;
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
    var reg = /(width|height|left|top|right|bottom|(margin|padding(Left|Top|Right|Bottom)))/;
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
    Linear: function (t, c, b, d) {
      return c * t / d + b;
    }
  };

  function animate(curEle, tarObj, duration, effect, callBack) {
    effect = zhufengEffect.Linear;
    var times = 0, beginObj = {}, changeObj = {};
    for (var key in tarObj) {
      if (tarObj.hasOwnProperty(key)) {
        beginObj[key] = getCss(curEle, key);
        changeObj[key] = tarObj[key] - beginObj[key];
      }
    }
    window.clearInterval(curEle.timer);
    curEle.timer = window.setInterval(function () {
      times += 10;
      if (times >= duration) {
        for (key in tarObj) {
          if (tarObj.hasOwnProperty(key)) {
            setCss(curEle, key, tarObj[key]);
          }
        }
        typeof callBack === "function" ? callBack.call(curEle) : null;
        window.clearInterval(curEle.timer);
        return;
      }
      for (key in changeObj) {
        if (changeObj.hasOwnProperty(key)) {
          var cur = effect(times, changeObj[key], beginObj[key], duration);
          setCss(curEle, key, cur);
        }
      }
    }, 10);
  }

  window.animate = animate;
})();