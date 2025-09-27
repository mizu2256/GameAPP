$(function () {
  const gameData = getGameData();
  updateStatsDisplayLast(gameData);
  updateWorkDisplayLast(gameData);

  const valueInsideSqrt =
    (gameData.money + (gameData.power + gameData.study) * 10) * 100;
  let totalResult;

  if (valueInsideSqrt < 0) {
    // ルート内の値が負の場合
    // Math.sqrtの引数に絶対値を与えてルート計算を行い、結果を負の数にします。
    // Math.sqrt(0)は0なので、valueInsideSqrt = 0 の場合は else ブロックで処理されます。
    totalResult = -parseInt(Math.sqrt(Math.abs(valueInsideSqrt)));
  } else {
    // ルート内の値が0以上の場合
    totalResult = parseInt(Math.sqrt(valueInsideSqrt));
  }

  $(".total-result").text(`最終リザルト：${totalResult}点`);

  $(".next-1")
    .off("click")
    .on("click", function () {
      $(".dev-con").hide();
      $(".player-con").show();
    });

  $(".next-2")
    .off("click")
    .on("click", function () {
      $(".player-con").hide();
      $(".player-result-con").show();
    });

  $(".next-3")
    .off("click")
    .on("click", function () {
      $(".player-result-con").hide();
      $(".finish-con").show();
    });

  $(".reset")
    .off("click")
    .on("click", function () {
      $(window).off("beforeunload");
      navigateTo("../../index.html", gameData);
    });
});
