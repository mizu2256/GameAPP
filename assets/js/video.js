$(document).on("contextmenu", function (e) {
  e.preventDefault();
});

$(function () {
  let nextGameData;

  // 動画のサムネイルを設定
  const data = getGameData();
  const picturePath = `../assets/pictures/map/map_${data.map}_picture.webp`;
  console.log(picturePath);
  const videoPicture = $("#picture img");
  videoPicture.attr("src", picturePath);

  $(".pre-start").on("click", function () {
    const preVideoPlayer = $("#pre-video-player");

    $(".dev-con").hide();
    $(".pre-video-con").show();

    preVideoPlayer
      .get(0)
      .play()
      .catch((e) => console.error("動画の再生に失敗しました", e));

    preVideoPlayer.one("ended", function () {
      $(".pre-video-con").hide();
      $(".player-con").show();
    });
  });

  // 動画再生ボタンのクリックイベント
  $(".video-start").on("click", function () {
    // ボタンのデータ属性からタイプと変動値を取得
    const changeType = $(this).data("type");
    const changeValue = $(this).data("value");
    const changeValue2 = $(this).data("value2");
    const changeValue3 = $(this).data("value3");
    const buttonId = $(this).attr("id");

    if (buttonId == "skip") {
      $(".video-player-con").css("background-color", "#fff")
    }

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

      // 変更対象のステータスと対応するchangeValueのマップを作成
      const updates = [];

      // changeValue, changeValue2, changeValue3の初期化と取得
      // changeValue2, changeValue3 は undefined の可能性があるため、存在しない場合は0として扱う
      const val1 = parseInt(changeValue) || 0;
      const val2 = parseInt(changeValue2) || 0; // changeValue2 がない場合は 0
      const val3 = parseInt(changeValue3) || 0; // changeValue3 がない場合は 0

      // 変更内容の決定: changeType に応じてどのステータスがどの値で更新されるかを定義
      switch (changeType) {
        case 1: // money
          updates.push({ key: "money", text: "お金", value: val1 });
          break;
        case 2: // power
          updates.push({ key: "power", text: "体力", value: val1 });
          break;
        case 3: // study
          updates.push({ key: "study", text: "知力", value: val1 });
          break;
        case 4: // money, study
          updates.push({ key: "money", text: "お金", value: val1 });
          updates.push({ key: "study", text: "知力", value: val2 });
          break;
        case 5: // power, study
          updates.push({ key: "power", text: "体力", value: val1 });
          updates.push({ key: "study", text: "知力", value: val2 });
          break;
        case 6: // money, power
          updates.push({ key: "money", text: "お金", value: val1 });
          updates.push({ key: "power", text: "体力", value: val2 });
          break;
        case 7: // money, power, study
          updates.push({ key: "money", text: "お金", value: val1 });
          updates.push({ key: "power", text: "体力", value: val2 });
          updates.push({ key: "study", text: "知力", value: val3 });
          break;
        default:
          console.warn("未定義のchangeTypeです:", changeType);
          return; // 未定義の場合は処理を終了
      }

      // データを更新し、結果メッセージの部品を生成
      const resultMessages = [];
      updates.forEach((update) => {
        // 元の値を整数に変換して加算
        const initialValue = parseInt(gameData[update.key]) || 0;
        const newValue = initialValue + update.value;

        // gameDataを更新
        gameData[update.key] = newValue;

        // メッセージ生成
        let messagePart;
        if (update.value >= 0) {
          // 増加
          messagePart = `${update.text}が${update.value}増加し、${newValue}になり`;
        } else {
          // 減少
          messagePart = `${
            update.text
          }が${-update.value}減少し、${newValue}になり`;
        }
        resultMessages.push(messagePart);
      });

      // 結果メッセージ全体を組み立てる
      let finalMessage = "";
      if (resultMessages.length > 0) {
        // 末尾の "になり" を "になりました！" または "になりました..." に置き換える
        const lastIndex = resultMessages.length - 1;
        let lastMessage = resultMessages[lastIndex];

        // 複数の変更がある場合は、句読点を調整
        if (resultMessages.length > 1) {
          // 最後の要素以外は "<br>" で繋ぐ
          for (let i = 0; i < lastIndex; i++) {
            finalMessage += resultMessages[i] + "<br>";
          }
        }

        // 最後のメッセージの末尾を調整
        // 増加/減少の判定は、変更された値の合計ではなく、個々の値に基づいてメッセージが作られているため、
        // 最終的なメッセージの末尾は、全ての変更の合計がプラスかマイナスかで決めるのが一般的ですが、
        // 元のコードは2つの変更までしか考慮しておらず、かつ複雑な判定をしていないため、
        // ここでは単純に「なりました！」で統一するか、最後に「！」または「...」を付けます。

        // 元のコードの複雑な if/else を避けるため、ここではシンプルに「になりました！」で統一します。
        // 例: お金が+10, 知力が-5 の場合でも「になりました！」とします。
        lastMessage = lastMessage.replace("になり", "になりました。");
        finalMessage += lastMessage;

        $("#result-text").html(finalMessage);
      } else {
        // 変更がなかった場合のフォールバック（通常は発生しない）
        $("#result-text").html("ステータスの変更はありませんでした。");
      }

      // check.htmlに戻る
      gameData.skip = false;
      console.log(gameData);
      nextGameData = gameData; // gameDataの参照を nextGameData に代入
      console.log(gameData);

      updateStatsDisplay(nextGameData);

      $(".video-player-con").hide();
      $(".result-con").show();
    });
  });

  $("#finish-video").on("click", function () {
    $(document).off("contextmenu");
    $(window).off("beforeunload");
    navigateTo("../../check.html", nextGameData);
  });
});
