// // JavaScriptまたはjQuery
// $(window).on("beforeunload", function () {
//   // ユーザーに警告メッセージを表示させる
//   // 戻り値に文字列を設定すると、ブラウザがそのメッセージを含むダイアログを表示します。
//   // （最近のブラウザでは、セキュリティ上の理由からカスタムメッセージの表示は制御されますが、
//   //   ダイアログ自体は表示されます。）
//   return "ページを離れようとしています。データが保存されていませんが、よろしいですか？";
// });

// function saveData() {
//   $(window).off("beforeunload");
// }

// 職業のID・名前・給料を記した配列変数
const workName = [
  {
    id: 0,
    name: "未就職",
    money: 0,
  },
  {
    id: 1,
    name: "医師",
    money: 30000,
  },
  {
    id: 2,
    name: "銀行員",
    money: 20000,
  },
  {
    id: 3,
    name: "とび職人",
    money: 25000,
  },
  {
    id: 4,
    name: "警察官",
    money: 15000,
  },
  {
    id: 5,
    name: "平社員",
    money: 10000,
  },
];

// URLパラメータまたはローカルストレージからゲームデータを取得する共通関数
function getGameData() {
  const urlParams = new URLSearchParams(window.location.search);
  const data = {
    money: parseInt(urlParams.get("money")) || 0,
    power: parseInt(urlParams.get("power")) || 0,
    study: parseInt(urlParams.get("study")) || 0,
    map: parseInt(urlParams.get("map")) || 0,
    work: parseInt(urlParams.get("work")) || 0,
    skip: urlParams.get("skip"),
  };
  // URLパラメータにデータがない場合、ローカルストレージから取得
  if (Object.values(data).every((val) => !val)) {
    const savedData = localStorage.getItem("gameData");
    return savedData
      ? JSON.parse(savedData)
      : {
          money: 20000,
          power: 50,
          study: 50,
          map: 0,
          work: 0,
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
    work: data.work,
    skip: data.skip,
  }).toString();
  window.location.href = `${page}?${params}`;
}

// 画面のステータス表示を更新
function updateStatsDisplay(data) {
  $(".now-money").text(`現在の所持金: ${data.money}`);
  $(".now-power").text(`現在の体力: ${data.power}`);
  $(".now-study").text(`現在の知力: ${data.study}`);
  $(".now-map").text(`現在のマス: ${data.map}`);
}

function updateStatsDisplayLast(data) {
  $(".now-money").text(`所持金: ${data.money}（初期値から${data.money - 20000}増加）`);
  $(".now-power").text(`体力: ${data.power}（初期値から${data.power - 50}増加）`);
  $(".now-study").text(`知力: ${data.study}（初期値から${data.study - 50}増加）`);
}

function updateWorkDisplay(data) {
  // 1. data.work のIDに一致するオブジェクトを workName 配列から検索
  const currentWork = workName.find((work) => work.id === data.work);

  // 2. 職業名（name）が存在する場合に表示を更新
  if (currentWork) {
    $(".now-work").text(
      `現在の職業: ${currentWork.name}（給料: ${currentWork.money}）`
    );
  } else {
    // IDが見つからない場合の処理（例: エラーメッセージやデフォルト表示）
    $(".now-work").text("現在の職業: 不明");
    console.error(`職業ID ${data.work} に一致するデータが見つかりません。`);
  }
}

function updateWorkDisplayLast(data) {
  // 1. data.work のIDに一致するオブジェクトを workName 配列から検索
  const currentWork = workName.find((work) => work.id === data.work);

  // 2. 職業名（name）が存在する場合に表示を更新
  if (currentWork) {
    $(".now-work").text(
      `職業: ${currentWork.name}（給料: ${currentWork.money}）`
    );
  } else {
    // IDが見つからない場合の処理（例: エラーメッセージやデフォルト表示）
    $(".now-work").text("職業: 不明");
    console.error(`職業ID ${data.work} に一致するデータが見つかりません。`);
  }
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
        money: 20000,
        power: 50,
        study: 50,
        map: 0,
        work: 0,
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
  updateWorkDisplay(data);

  if (data.skip === "true" || data.skip === true) {
    $(".player-con").hide();
    $(".dev-con").show();
  }

  if (data.map === 65) {
    navigateTo(`finish.html`, data);
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
    const stopPoints = [10, 19, 40, 47, 54, 65];

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
  updateWorkDisplay(data);

  // 結果を選択したときの処理
  $(".dev-result .row button").on("click", function () {
    const checkType = parseInt($(this).data("type"));
    const result = parseInt($(this).data("value"));
    const result2 = parseInt($(this).data("value2"));
    const result3 = parseInt($(this).data("value3"));
    const message1 = $(this).text();
    let message2, message3, message4;

    let updatedValue, updatedValue2, updatedValue3;
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
    } else if (checkType === 6) {
      updatedValue = data.money + result;
      updatedValue2 = data.power + result2;
      nextData.money = updatedValue;
      nextData.power = updatedValue2;
      message2 = "お金";
      message3 = "体力";
    } else if (checkType === 7) {
      updatedValue = data.money + result;
      updatedValue2 = data.power + result2;
      updatedValue3 = data.study + result3;
      nextData.money = updatedValue;
      nextData.power = updatedValue2;
      nextData.study = updatedValue3;
      message2 = "お金";
      message3 = "体力";
      message4 = "知力";
    }

    nextData.skip = true;

    $(".dev-con").hide();
    $(".check-con").show();

    // 結果表示
    if (checkType <= 3) {
      $(".check-text #check-text").html(
        `${message1}なので、${message2}が${result}増加し、${updatedValue}になります。よろしいですか？`
      );
    } else if (checkType <= 6) {
      $(".check-text #check-text").html(
        `${message1}なので、${message2}が${result}増加し、${updatedValue}になり、<br>${message3}が${result2}増加し、${updatedValue2}になります。よろしいですか？`
      );
    } else {
      $(".check-text #check-text").html(
        `${message1}なので、${message2}が${result}増加し、${updatedValue}になり、<br>${message3}が${result2}増加し、${updatedValue2}になり、<br>${message4}が${result3}増加し、${updatedValue3}になります。よろしいですか？`
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

    let resultMoney =
      Math.round(
        parseInt((parseInt(data.study) + 100) * (1 + result * 0.1) * 5 + 3000) /
          100
      ) * 100;

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
