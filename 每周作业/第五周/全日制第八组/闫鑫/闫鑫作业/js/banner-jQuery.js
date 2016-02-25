$(function () {
  var $inner = $("#inner"), autoTimer = null, step = 0;
  var $tip = $("#tip"), $tipList = $tip.find("li"), count = 6;
  window.setTimeout(lazyLoad, 500);
  function lazyLoad() {
    $inner.find("img").each(function (index, item) {
      var oImg = new Image;
      oImg.src = $(item).attr("trueImg");
      oImg.onload = function () {
        selectTip();
        $(item).prop("src", this.src).stop().animate({opacity: 1}, 500);
      }
    });
  }

  $("#outer").bind("mouseover", function () {
    window.clearInterval(autoTimer);
    $("#btnLeft").css("display", "block");
    $("#btnRight").css("display", "block");
  }).bind("mouseout", function () {
    autoTimer = window.setInterval(autoMove, 2000);
    $("#btnLeft").css("display", "none");
    $("#btnRight").css("display", "none");
  });
  $("#btnLeft").bind("click", function () {
    step--;
    if (step < 0) {
      $inner.css("left", "-count * 730");
      step = count - 1;
    }
    $inner.stop().animate({left: -step * 730}, 500);
    selectTip();
  });
  $("#btnRight").bind("click", function () {
    autoMove();
  });
  function selectTip() {
    var tempStep = step;
    tempStep >= count ? tempStep = 0 : null;
    $tipList.each(function (index, item) {
      tempStep === index ? $(this).addClass("tip") : $(this).removeClass("tip");
    });
  }

  $tipList.bind("mouseover", function (e) {
    window.clearInterval(autoTimer);
    step = $(this).index();
    $inner.stop().animate({left: -step * 730}, 500);
    selectTip();
    autoTimer = window.setInterval(autoMove, 2000);
  });
  autoTimer = window.setInterval(autoMove, 2000);
  function autoMove() {
    step++;
    if (step > count) {
      $inner.css("left", "0");
      step = 1;
    }
    $inner.stop().animate({left: -step * 730}, 500);
    selectTip();
  }
});