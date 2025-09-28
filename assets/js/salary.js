$(function () {
  let nextGameData;

  $(".dev-result-salary .choose").on("click", function () {
    // ボタンのデータ属性からタイプと変動値を取得
    const gameData = getGameData();
    nowMoney = parseInt(gameData.money);

    let checkValue, baseSalary, nextGameMoney;

    checkValue = parseFloat($(this).data("value"));

    // 1. data.work のIDに一致するオブジェクトを workName 配列から検索
    const salaryWork = workName.find((work) => work.id === gameData.work);

    if (salaryWork) {
      baseSalary = parseInt(salaryWork.money);
    } else {
      console.error(
        `職業ID ${gameData.work} に一致するデータが見つかりません。`
      );
    }

    changeValue = checkValue * baseSalary;
    nextGameMoney = nowMoney + changeValue;

    let resultText;
    console.log(nextGameMoney);

    // nextGameDataに現在のデータを保持
    nextGameData = gameData;
    nextGameData.money = nextGameMoney;
    nextGameData.skip = true;

    resultText = `結果、資金が${changeValue}増加し、${nextGameMoney}になります。よろしいですか？`;

    $("#check-text").html(resultText);

    updateStatsDisplay(nextGameData);

    $(".dev-con").hide();
    $(".check-con").show(); // 確認画面に遷移
  });

  // はいボタンの処理
  $("#map-OK")
    .off("click")
    .on("click", function () {
      $(window).off("beforeunload");
      navigateTo("../../check.html", nextGameData);
    });

  $("#map-OK-a")
    .off("click")
    .on("click", function () {
      // 💡 追加: ページ遷移はしないが、最新のデータをローカルストレージに保存する
      localStorage.setItem("gameData", JSON.stringify(nextGameData));

      // 💡 追加: 転職画面に表示されるステータスを最新にする
      updateStatsDisplay(nextGameData);
      $(".check-con").hide();
      $(".player-con").show();
    });
});
