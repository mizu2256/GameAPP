$(document).on("contextmenu", function (e) {
  e.preventDefault();
});

$(function () {
  let nextGameData;

  // 動画のサムネイルを設定
  const data = getGameData();
  const picturePath = `../assets/pictures/map/map_${data.map}_picture.png`;
  console.log(picturePath);
  const videoPicture = $("#picture img");
  videoPicture.attr("src", picturePath);

  // 動画再生ボタンのクリックイベント
  $(".video-start").on("click", function () {
    // ボタンのデータ属性からタイプと変動値を取得
    const changeType = $(this).data("type");
    const changeValue = $(this).data("value");
    const changeValue2 = $(this).data("value2");
    const buttonId = $(this).attr("id");

    // 動画のパスを設定
    const videoPath = `../assets/video/${buttonId}.mp4`;
    const videoPlayer = $("#video-player");

    // ソースを更新し、プレイヤーを表示
    videoPlayer.attr("src", videoPath);
    $("#video-con").hide();
    $(".video-player-con").show();

    // 動画の再生
    videoPlayer
      .get(0)
      .play()
      .catch((e) => console.error("動画の再生に失敗しました", e));

    // 動画再生終了時のイベント (一度だけ実行)
    videoPlayer.one("ended", function () {
      // 現在のゲームデータを取得
      const gameData = getGameData();
      console.log(gameData, changeType, changeValue);

      // データを更新
      let updatedValue, updatedText, newUpdatedValue;
      let updatedValue2, updatedText2, newUpdatedValue2;
      if (changeType === 1) {
        // money
        updatedValue = parseInt(gameData.money) + parseInt(changeValue);
        gameData.money = updatedValue;
        updatedText = "お金";
        newUpdatedValue = gameData.money;
      } else if (changeType === 2) {
        // power
        updatedValue = parseInt(gameData.power) + parseInt(changeValue);
        gameData.power = updatedValue;
        updatedText = "体力";
        newUpdatedValue = gameData.power;
      } else if (changeType === 3) {
        // study
        updatedValue = parseInt(gameData.study) + parseInt(changeValue);
        gameData.study = updatedValue;
        updatedText = "知力";
        newUpdatedValue = gameData.study;
      } else if (changeType === 4) {
        updatedValue = parseInt(gameData.money) + parseInt(changeValue);
        updatedValue2 = parseInt(gameData.study) + parseInt(changeValue2);
        gameData.money = updatedValue;
        gameData.study = updatedValue2;
        updatedText = "お金";
        updatedText2 = "知力";
        newUpdatedValue = gameData.money;
        newUpdatedValue2 = gameData.study;
      } else if (changeType === 5) {
        updatedValue = parseInt(gameData.power) + parseInt(changeValue);
        updatedValue2 = parseInt(gameData.study) + parseInt(changeValue2);
        gameData.power = updatedValue;
        gameData.study = updatedValue2;
        updatedText = "体力";
        updatedText2 = "知力";
        newUpdatedValue = gameData.power;
        newUpdatedValue2 = gameData.study;
      }

      // check.htmlに戻る
      gameData.skip = false;
      console.log(gameData);
      nextGameData = gameData;
      if (changeType < 4) {
        if (changeValue >= 0) {
          $("#result-text").html(
            `${updatedText}が${changeValue}増加し、${newUpdatedValue}になりました！`
          );
        } else {
          $("#result-text").html(
            `${updatedText}が${-changeValue}減少し、${newUpdatedValue}になりました...`
          );
        }
      } else {
        if (changeValue >= 0) {
          if (changeValue2 >= 0) {
            $("#result-text").html(
              `${updatedText}が${changeValue}増加し、${newUpdatedValue}になり、<br>${updatedText2}が${changeValue2}増加し、${newUpdatedValue2}になりました！`
            );
          } else {
            $("#result-text").html(
              `${updatedText}が${changeValue}増加し、${newUpdatedValue}になり、<br>${updatedText2}が${-changeValue2}減少し、${newUpdatedValue2}になりました...`
            );
          }
        } else {
          if (changeValue2 >= 0) {
            $("#result-text").html(
              `${updatedText}が${-changeValue}減少し、${newUpdatedValue}になり、<br>${updatedText2}が${changeValue2}増加し、${newUpdatedValue2}になりました！`
            );
          } else {
            $("#result-text").html(
              `${updatedText}が${-changeValue}減少し、${newUpdatedValue}になり、<br>${updatedText2}が${-changeValue2}減少し、${newUpdatedValue2}になりました...`
            );
          }
        }
      }

      updateStatsDisplay(nextGameData);

      $(".video-player-con").hide();
      $(".result-con").show();
    });
  });

  $("#finish-video").on("click", function () {
    $(document).off("contextmenu");
    navigateTo("../../check.html", nextGameData);
  });
});
