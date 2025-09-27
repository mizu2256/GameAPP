$(function () {
  const gameData = getGameData();
  updateStatsDisplayLast(gameData);
  updateWorkDisplayLast(gameData);

  let totalResult;

  totalResult = parseInt(
    Math.sqrt(Math.abs(gameData.money + (gameData.power + gameData.study) * 10))
  );
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
      navigateTo("../../index.html", gameData);
    });
});
