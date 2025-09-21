let money = 0;
let power = 0;
let study = 0;
let map = 0;
let checkMap, checkResult;

const currentURL = window.location.href;
console.log(currentURL);
runOnSpecificPage();

// 特定のURLでのみ実行する関数（chack.html）
function runOnSpecificPage() {
  if (currentURL.includes("/check.html")) {
    showMoney();
  }
}

// index.html専用
function startGame() {
  const button = document.querySelector(".title-con button");

  button.style.transition = "transform 0.2s ease-out";
  button.style.transform = "scale(1.2)";

  // 0.2秒待つ（スケールアップアニメーションが終わるのを待つ）
  setTimeout(() => {
    button.style.transition = "transform 0.5s ease-out";
    button.style.transform = "scale(0)";

    // 0.5秒待つ（スケールダウンアニメーションが終わるのを待つ）
    setTimeout(() => {
      money = 10000;
      power = 40;
      study = 40;
      checkPageSkip();
    }, 500);
  }, 200);
}

// check.htmlへの遷移・Skip遷移はすべてこれで行う
function checkPageNormal() {
  window.location.href = `check.html?money=${money}&power=${power}&study=${study}&map=${map}`;
}

function checkPageSkip() {
  window.location.href = `check.html?money=${money}&power=${power}&study=${study}&map=${map}&skip=true`;
}

// check.html dev用
function showMoney() {
  const urlParams = new URLSearchParams(window.location.search);
  const nowMoney = urlParams.get("money");
  const nowPower = urlParams.get("power");
  const nowStudy = urlParams.get("study");
  const nowMap = urlParams.get("map");
  const skipCheck = urlParams.get("skip");
  money = parseInt(nowMoney);
  power = parseInt(nowPower);
  study = parseInt(nowStudy);
  map = parseInt(nowMap);
  console.log(nowMoney);
  document.getElementById("now-money").innerHTML = `現在の所持金: ${nowMoney}`;
  document.getElementById("now-power").innerHTML = `現在の体力: ${nowPower}`;
  document.getElementById("now-study").innerHTML = `現在の知力: ${nowStudy}`;
  document.getElementById("now-map").innerHTML = `現在のマス: ${nowMap}`;
  if (skipCheck == "true") {
    $(".player-con").hide();
    $(".dev-con").show();
  }
}

// check・OKボタンがクリックされた時の処理
$("#ok-btn").on("click", function () {
  $(".player-con").hide();
  $(".dev-con").show();
});

// check・マスを選択したときの処理
$(".dice-result .row button").on("click", function () {
  const diceRoll = parseInt($(this).text());

  checkMap = map + diceRoll;

  $(".dev-con").hide();
  $(".check-con").show();

  document.getElementById(
    "check-map"
  ).innerHTML = `${diceRoll}マス進み、今回止まるマスは、「${checkMap}」です。よろしいですか？`;
});

// check・はいを押したときの処理
$("#check-NG").on("click", function () {
  $(".check-con").hide();
  $(".dev-con").show();
});

// check・いいえを押したときの処理
$("#check-OK").on("click", function () {
  map = checkMap;
  window.location.href = `map/map_${map}.html?money=${money}&power=${power}&study=${study}`;
});

// map・結果を選択したときの処理
$(".dev-result .row button").on("click", function () {
  const ratio = parseInt($(".dev-result").attr("id"));
  console.log(ratio);
  const result = parseInt($(this).attr("id"));
  const message = $(this).text();

  checkResult = ratio * result;

  $(".dev-con").hide();
  $(".check-con").show();

  document.getElementById(
    "check-text"
  ).innerHTML = `${message}なので、「${checkResult}」です。よろしいですか？`;
});
