/**
 * Created by Administrator on 2016/2/24.
 */
(function () {
    function bind(curEle, evenType, evenFn) {
        if (" addEventListener" in document) {
            curEle.addEventListener(evenType, evenFn, false);

            return;
        }
        var tempFn = function () {
            evenFn.call(curEle);
        };
        tempFn.photo = evenFn;
        tempFn.type = evenType;
        /*curEle["myBind"]=tempFn;*/
        /*第一次给自定义属性存储的是Fn1包装后的结果，第二次给自定义属性存储的是Fn2包装后的结果，把Fn2覆盖掉了*/
        if (!curEle["myBind" + evenType]) {/*加个+evenType找到不同的类型*/
            curEle["myBind" + evenType] = [];
        }
        var ary = curEle["myBind" + evenType];
        //->解决重复问题：每一次自己在往自定义属性对应的容器中添加前，看一下之前是否已经有了，有的话就不用在重新的添加了，同理也不需要往事件池中存储了

        for (var i = 0; i < ary.length; i++) {
            var cur = ary[i];
            if (cur.photo === evenFn) {
                return;
            }
        }

        ary.push(tempFn);
        curEle.attachEvent("on" + evenType, tempFn);
        //curEle.attachEvent("on"+evenType,function(){
        ////    this是window
        //    evenFn.call(curEle);
        //});
    }

    //unbind():移除当前元素的某一个行为绑定的方法
    function unbind(curEle, evenType, evenFn) {
        if ("removeEventListener" in document) {
            curEle.removeEventListener(evenType, evenFn, false);
            return;
        }
        var ary = curEle["myBind" + evenType];
        if (ary && ary instanceof Array) {/*解决没绑定直接删除的情况*/
            for (var i = 0; i < ary.length; i++) {
                var cur = ary[i];
                if (cur.photo === evenFn && cur.type === evenType) {
                    /*ary.splice(i, 1);*///->找到后,把自己存储的容器中对应的移除掉(移除自定属性存储的)为了防止塌陷问题，我们在移除时不要把原有数组中每一个方法对应的
                    curEle.detachEvent("on" + evenType, cur);//->在把事件池中对应的也移除掉
                    break;
                }
            }
        }
        //curEle.detachEvent("on"+evenType,curEle["myBind"]);
    }

    //on给当前元素的某一个行为类型绑定的所有方法都存放到自己定义的容器中
    function on(curEle, evenType, evenFn) {
        if (!curEle["myEvebt" + evenType]) {
            curEle["myEvebt" + evenType] = [];
        }
        var ary = curEle["myEvebt" + evenType];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] = evenFn) {
                return;
            }
        }
        ary.push(evenFn);
        //curEle.addEventListener(evenType, run, false);
        //curEle.attachEvent("on"+evenType,run);
        // ->执行on的时候,我们给当前元素绑定了一个点击的行为,当点击的时候执行run方法:run方法中的this是当前元素curEle,并且浏览器给run传递了一个MouseEvent事件对象
        bind(curEle, evenType, run);
    }

    //->off:在自己的事件池中把某一个方法移除
    function off(curEle, evenType, evenFn) {
        var ary = curEle["myEvent" + evenType];
        for (var i = 0; i < ary.length; i++) {
            var cur = ary[i];
            if (cur === evenFn) {
                ary.splice(i, 1);
                break;
            }
        }
    }

//->run:我们只给当前元素的点击行为绑定一个方法run,当触发点击的时候执行的是run方法,我在run方法中根据自己存储的方法顺序分别的在把这些方法执行
    function run(e) {
        e = e || window.event;
        var flag = e.target ? true : false;//->IE6~8下不兼容e.target,得到的flag为false
        if (!flag) {
            e.target = e.srcElement;
            e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            e.preventDefault = function () {
                e.returnValue = false;
            };
            e.stopPropagation = function () {
                e.cancelBubble = true;
            };
        }
        //为了后期每个绑定方法中使用事件对象方便，统一把事件对象兼容处理掉
        var ary = this["myEvent" + e.type];
        for (var i = 0; i < ary.length; i++) {
            var tempFn = ary[i];
            tempFn(this);
            /*因为在内置的事件池中绑定的方法执行时，this都是当前要操作的元素，并且浏览器还会给其传递一个事件对象，而我们创建的容器中*/
        }
    }
});


