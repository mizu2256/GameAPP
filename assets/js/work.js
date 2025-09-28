$(document).on("contextmenu", function (e) {
  e.preventDefault();
});

$(function () {
  let nextGameData;

  $(".player-choose .choose").on("click", function () {
    // ボタンのデータ属性からタイプと変動値を取得
    const gameData = getGameData();
    nowPower = gameData.power;
    nowStudy = gameData.study;

    let checkValueWork;

    checkValueWork = parseInt($(this).data("work"));
    const checkValuePower = parseInt($(this).data("power"));
    const checkValueStudy = parseInt($(this).data("study"));

    let alertMessage, resultText;

    // 知力増加値が一定値を超えていない場合、エラーとしてアラートを表示し、処理を中断
    if (nowStudy < checkValueStudy || nowPower < checkValuePower) {
      alertMessage =
        "知力・体力の増加値が規定値（知力：" +
        checkValueStudy +
        "・体力：" +
        checkValuePower +
        "）未満です。この職業には就職できません...";
      alert(`${alertMessage}`);
      return; // ここで処理を中断
    }

    // nextGameDataに現在のデータを保持
    nextGameData = gameData;
    nextGameData.skip = false;

    if (checkValueWork != 5 && checkValueWork != 9) {
      resultText = `あなたの知力・体力（${nowStudy}・${nowPower}） は規定値（${checkValueStudy}・${checkValuePower}）を超えています。<br>就職しますか？<br>（現在のステータスは変動していません）`;
    } else if (checkValueWork != 9) {
      resultText = `就職しますか？<br>（現在のステータスは変動していません）`;
    } else {
      resultText = `変更しませんか？<br>（現在のステータスは変動していません）<br>`;
    }

    $("#result-text").html(resultText);

    if (checkValueWork != 9) {
      nextGameData.work = checkValueWork;
    }

    updateStatsDisplay(nextGameData);

    $(".player-con").hide();
    $(".result-con").show(); // 確認画面に遷移
  });

    $(".player-choose-2 .choose").on("click", function () {
    // ボタンのデータ属性からタイプと変動値を取得
    const gameData = getGameDataFromData();
    nowPower = gameData.power;
    nowStudy = gameData.study;

    let checkValueWork;

    checkValueWork = parseInt($(this).data("work"));
    const checkValuePower = parseInt($(this).data("power"));
    const checkValueStudy = parseInt($(this).data("study"));

    let alertMessage, resultText;

    // 知力増加値が一定値を超えていない場合、エラーとしてアラートを表示し、処理を中断
    if (nowStudy < checkValueStudy || nowPower < checkValuePower) {
      alertMessage =
        "知力・体力の増加値が規定値（知力：" +
        checkValueStudy +
        "・体力：" +
        checkValuePower +
        "）未満です。この職業には就職できません...";
      alert(`${alertMessage}`);
      return; // ここで処理を中断
    }

    // nextGameDataに現在のデータを保持
    nextGameData = gameData;
    nextGameData.skip = false;

    if (checkValueWork != 5 && checkValueWork != 9) {
      resultText = `あなたの知力・体力（${nowStudy}・${nowPower}） は規定値（${checkValueStudy}・${checkValuePower}）を超えています。<br>就職しますか？<br>（現在のステータスは変動していません）`;
    } else if (checkValueWork != 9) {
      resultText = `就職しますか？<br>（現在のステータスは変動していません）`;
    } else {
      resultText = `変更しませんか？<br>（現在のステータスは変動していません）<br>`;
    }

    $("#result-text").html(resultText);

    if (checkValueWork != 9) {
      nextGameData.work = checkValueWork;
    }

    updateStatsDisplay(nextGameData);

    $(".player-con").hide();
    $(".result-con").show(); // 確認画面に遷移
  });

  $("#finish-video").on("click", function () {
    $(document).off("contextmenu");
    // nextGameDataは数値増減前の値が格納されているが、check.htmlへ遷移
    $(window).off("beforeunload");
    navigateTo("../../check.html", nextGameData);
  });

  $("#recheck").on("click", function () {
    $(".result-con").hide();
    $(".player-con").show();
  });
});
