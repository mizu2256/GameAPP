// URLパラメータまたはローカルストレージからゲームデータを取得する共通関数
function getGameData() {
  const urlParams = new URLSearchParams(window.location.search);
  const data = {
    money: parseInt(urlParams.get("money")) || 0,
    power: parseInt(urlParams.get("power")) || 0,
    study: parseInt(urlParams.get("study")) || 0,
    map: parseInt(urlParams.get("map")) || 0,
    skip: urlParams.get("skip"),
  };
  // URLパラメータにデータがない場合、ローカルストレージから取得
  if (Object.values(data).every((val) => !val)) {
    const savedData = localStorage.getItem("gameData");
    return savedData
      ? JSON.parse(savedData)
      : {
          money: 10000,
          power: 40,
          study: 40,
          map: 0,
          skip: true,
        };
  }
  return data;
}

// データをURLに追加し、ローカルストレージに保存してページ遷移する共通関数
function navigateTo(page, data) {
  // ローカルストレージにデータを保存
  localStorage.setItem("gameData", JSON.stringify(data));
  const params = new URLSearchParams({
    money: data.money,
    power: data.power,
    study: data.study,
    map: data.map,
    skip: data.skip,
  }).toString();
  window.location.href = `${page}?${params}`;
}

// 画面のステータス表示を更新
function updateStatsDisplay(data) {
  $("#now-money").text(`現在の所持金: ${data.money}`);
  $("#now-power").text(`現在の体力: ${data.power}`);
  $("#now-study").text(`現在の知力: ${data.study}`);
  $("#now-map").text(`現在のマス: ${data.map}`);
}

// -------------------- index.html用 --------------------

function startGame() {
  const audio = $("#click-sound")[0];
  audio.play();

  const button = $(".title-con button");
  button.css({
    transition: "transform 0.2s ease-out",
    transform: "scale(1.2)",
  });

  setTimeout(() => {
    button.css({
      transition: "transform 0.5s ease-out",
      transform: "scale(0)",
    });
    setTimeout(() => {
      // 初期値でcheck.htmlにスキップ遷移
      const initialData = {
        money: 10000,
        power: 40,
        study: 40,
        map: 0,
        skip: true,
      };
      navigateTo("check.html", initialData);
    }, 500);
  }, 200);
}

// -------------------- check.html用 --------------------

function setupCheckPage() {
  const data = getGameData(); // データの取得元をローカルストレージに対応
  updateStatsDisplay(data);

  if (data.skip === "true" || data.skip === true) {
    $(".player-con").hide();
    $(".dev-con").show();
  }

  // OKボタンの処理
  $("#ok-btn").on("click", function () {
    $(".player-con").hide();
    $(".dev-con").show();
  });

  // サイコロボタンの処理
  $(".dice-result .row button").on("click", function () {
    let diceRoll = parseInt($(this).text());
    const nextMap = data.map + diceRoll;
    let newMap = nextMap;
    let information = "";

    // ストップマスを配列で管理
    const stopPoints = [10, 19];

    // ストップマスを通過または停止する場合の処理
    for (const stopPoint of stopPoints) {
      if (data.map < stopPoint && nextMap >= stopPoint) {
        newMap = stopPoint;
        diceRoll = stopPoint - data.map;
        information = "STOPマスです！";
        break; // 複数のストップマスを通過する場合、最初のストップマスで止まる
      }
    }

    $(".dev-con").hide();
    $(".check-con").show();

    $("#check-map").html(
      `${diceRoll}マス進み、今回止まるマスは、「${newMap}」です。${information}よろしいですか？`
    );

    // はいボタンの処理
    $("#check-OK")
      .off("click")
      .on("click", function () {
        const nextData = { ...data, map: newMap };

        // 止まったマスがストップマスだった場合の処理（必要に応じて追加）
        if (stopPoints.includes(nextData.map)) {
          // 例: 止まったストップマスのフラグを立てる
          // nextData[`stop${nextData.map}`] = true;
        }
        navigateTo(`map/map_${nextData.map}.html`, nextData);
      });
  });

  // いいえボタンの処理
  $("#check-NG").on("click", function () {
    $(".check-con").hide();
    $(".dev-con").show();
  });
}

// -------------------- map_*.html（リアルマス）用 --------------------

function setupMapPage() {
  const data = getGameData(); // データの取得元をローカルストレージに対応
  updateStatsDisplay(data);

  // 結果を選択したときの処理
  $(".dev-result .row button").on("click", function () {
    const checkType = parseInt($(this).data("type"));
    const result = parseInt($(this).data("value"));
    const result2 = parseInt($(this).data("value2"));
    let message3;
    const message1 = $(this).text();
    let message2;

    let updatedValue, updatedValue2;
    const nextData = { ...data };

    if (checkType === 1) {
      updatedValue = data.money + result;
      nextData.money = updatedValue;
      message2 = "お金";
    } else if (checkType === 2) {
      updatedValue = data.power + result;
      nextData.power = updatedValue;
      message2 = "体力";
    } else if (checkType === 3) {
      updatedValue = data.study + result;
      nextData.study = updatedValue;
      message2 = "知力";
    } else if (checkType === 4) {
      updatedValue = data.money + result;
      updatedValue2 = data.study + result2;
      nextData.money = updatedValue;
      nextData.study = updatedValue2;
      message2 = "お金";
      message3 = "知力";
    } else if (checkType === 5) {
      updatedValue = data.power + result;
      updatedValue2 = data.study + result2;
      nextData.power = updatedValue;
      nextData.study = updatedValue2;
      message2 = "体力";
      message3 = "知力";
    }

    nextData.skip = true;

    $(".dev-con").hide();
    $(".check-con").show();

    // 結果表示
    if (checkType <= 3) {
      $(".check-text #check-text").html(
        `${message1}なので、${message2}が${result}増加し、${updatedValue}になります。よろしいですか？`
      );
    } else {
      $(".check-text #check-text").html(
        `${message1}なので、${message2}が${result}増加し、${updatedValue}になり、<br>${message3}が${result2}増加し、${updatedValue2}になります。よろしいですか？`
      );
    }

    // はいボタンの処理
    $("#map-OK")
      .off("click")
      .on("click", function () {
        navigateTo("../../check.html", nextData);
      });
  });

  $(".dev-result-testmoney .row button").on("click", function () {
    const result = parseInt($(this).data("value"));
    let message3;
    const message1 = $(this).text();
    let message2;

    let updatedValue;
    const nextData = { ...data };

    let resultMoney = (parseInt(data.study) + result * 10) * 10 + 500

    updatedValue = data.money + resultMoney;
    nextData.money = updatedValue;
    message2 = "お金";

    nextData.skip = true;

    $(".dev-con").hide();
    $(".check-con").show();

    // 結果表示
      $(".check-text #check-text").html(
        `${message1}なので、${message2}が${resultMoney}増加し、${updatedValue}になります。よろしいですか？`
      );

    // はいボタンの処理
    $("#map-OK")
      .off("click")
      .on("click", function () {
        navigateTo("../../check.html", nextData);
      });
  });

  // いいえボタンの処理
  $("#map-NG").on("click", function () {
    $(".check-con").hide();
    $(".dev-con").show();
  });
}

// OKボタンの処理
$("#next-btn").on("click", function () {
  $(".dev-con").hide();
  $(".player-con").show();
});

// ページ読み込み時の共通初期化
$(document).ready(function () {
  const currentURL = window.location.href;
  if (currentURL.includes("/check.html")) {
    setupCheckPage();
  } else if (currentURL.includes("/map/map_")) {
    setupMapPage();
  }
});