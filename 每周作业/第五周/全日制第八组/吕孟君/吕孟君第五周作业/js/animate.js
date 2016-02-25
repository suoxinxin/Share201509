(function () {
    function getCss(curEle, attr) {
        var val = reg = null;
        if ("getComputedStyle"in window) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {
            if (attr === "opacity") {
                val = curEle.currentStyle["filter"]
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
    //->ʵ�����ǵ��˶�����
    function animate(curEle, tarObj, duration, effect, callBack) {
        //->Ĭ���������õĶ��������ٵ�
        var fnEffect = zhufengEffect.Linear;

        //->ͨ������effect�����Ͳ�һ��,��������Ĭ�ϵ��˶�Ч��
        if (typeof effect === "number") {
            //->������ݽ�������һ������
            //1->Linear 2->Elastic-easeOut 3->Back-easeOut 4->Bounce-easeOut 5->Expo-easeIn
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
            //->������ݽ�������һ������
            var effectFir = effect[0];
            var effectTwo = effect[1];
            fnEffect = effect.length === 1 ? zhufengEffect[effectFir] : zhufengEffect[effectFir][effectTwo];
        } else if (typeof effect === "function") {
            //->������ݽ�������һ������,����Ĭ����Ϊ�������˶�Ч�����ǻص�����
            callBack = effect;
        }

        //->����෽�����ʼλ��ֵ��ÿһ��������ܾ���
        var times = 0, beginObj = {}, changeObj = {};
        for (var key in tarObj) {
            if (tarObj.hasOwnProperty(key)) {
                beginObj[key] = getCss(curEle, key);
                changeObj[key] = tarObj[key] - beginObj[key];
            }
        }

        //->ʵ�ֶ�������
        window.clearInterval(curEle.timer);
        curEle.timer = window.setInterval(function () {
            times += 10;
            //->����Ŀ��λ����,���ǽ�����ʱ��,�������õ�ǰԪ�ص�λ����Ŀ��ֵ,����ִ�����ǵĻص�����
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

            //->û�е���ָ����λ��,����ѭ�����еķ���,Ȼ��ͨ����ʽ��ȡÿһ������ĵ�ǰλ�õ�ֵ,Ȼ���Ԫ��������ʽ
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