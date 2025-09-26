$(function () {
  const gameData = getGameData();
  updateStatsDisplayLast(gameData);
  updateWorkDisplayLast(gameData);

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
});
