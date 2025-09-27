$(function () {
  let nextGameData;

  $(".choose").on("click", function () {
    // ボタンのデータ属性からタイプと変動値を取得
    const changeValueMoney = parseInt($(this).data("money"));
    const changeValuePower = parseInt($(this).data("power"));
    const changeValueStudy = parseInt($(this).data("study"));

    // 現在のゲームデータを取得
    const gameData = getGameData();

    // データを更新
    gameData.money += changeValueMoney;
    gameData.power += changeValuePower;
    gameData.study += changeValueStudy;

    let resultText;
    
    // 全ての値が0の場合の分岐を追加
    if (changeValueMoney === 0 && changeValuePower === 0 && changeValueStudy === 0) {
      resultText = "値は変動しませんでした。";
    } else {
      const updatedText = `お金が、${
        changeValueMoney >= 0 ? `${changeValueMoney}増加` : `${-changeValueMoney}減少`
      }し、${gameData.money}になり、`;
      const updatedText2 = `体力が、${
        changeValuePower >= 0 ? `${changeValuePower}増加` : `${-changeValuePower}減少`
      }し、${gameData.power}になり、`;
      const updatedText3 = `知力が、${
        changeValueStudy >= 0 ? `${changeValueStudy}増加` : `${-changeValueStudy}減少`
      }し、${gameData.study}になりました。`;
      
      resultText = `${updatedText}<br>${updatedText2}<br>${updatedText3}`;
    }

    // check.htmlに戻る
    gameData.skip = false;
    console.log(gameData);
    nextGameData = gameData;
    $("#result-text").html(resultText);

    updateStatsDisplay(nextGameData);

    $(".player-con").hide();
    $(".result-con").show();
  });

  $("#finish-video").on("click", function () {
    navigateTo("../../check.html", nextGameData);
  });
});