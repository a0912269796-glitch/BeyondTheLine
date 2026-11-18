
/* =========================================
   界線之外 Beyond the Line
   第一版遊戲程式
========================================= */

// ===== 1. 遊戲狀態 =====

let currentScene = "start";
let collectedEvidence = [];
let choicesMade = [];

// ===== 2. 證據資料 =====

const evidenceData = {
  messages: {
    name: "訊息紀錄",
    description: "對方在被要求停止聯絡後，仍持續傳送訊息。"
  },

  witness: {
    name: "朋友證詞",
    description: "朋友曾聽當事人說明不希望繼續被聯絡。"
  },

  timeline: {
    name: "事件時間軸",
    description: "整理不同日期發生的事件與接觸情況。"
  }
};

// ===== 3. 劇情資料 =====

const scenes = {

  // 第一幕：開始
  start: {
    chapter: "第一章：未讀訊息",
    speaker: "旁白",
    text: "晚上九點，林予安正在宿舍準備明天的課程。手機突然響起，一則熟悉的訊息出現在螢幕上。",

    choices: [
      {
        text: "查看訊息",
        next: "message"
      },
      {
        text: "先找朋友聊聊",
        next: "friend"
      }
    ]
  },

  // 查看訊息
  message: {
    chapter: "第一章：未讀訊息",
    speaker: "林予安",
    text: "我明明已經說過不希望再收到訊息，為什麼對方還是不斷聯絡我？",

    choices: [
      {
        text: "保留訊息紀錄",
        next: "friend",
        evidence: "messages"
      },
      {
        text: "先去找朋友討論",
        next: "friend"
      }
    ]
  },

  // 朋友視角
  friend: {
    chapter: "第二章：另一個視角",
    speaker: "陳以晴",
    text: "予安最近看起來很困擾。我想先了解發生什麼事情，再看看能提供什麼協助。",

    choices: [
      {
        text: "聆聽予安的經歷",
        next: "investigation",
        evidence: "witness"
      },
      {
        text: "一起整理事件經過",
        next: "investigation",
        evidence: "timeline"
      }
    ]
  },

  // 調查階段
  investigation: {
    chapter: "第三章：拼湊線索",
    speaker: "旁白",
    text: "現在，你需要根據目前掌握的資訊，判斷下一步應該如何調查。",

    choices: [
      {
        text: "檢視目前證據",
        action: "showEvidence"
      },
      {
        text: "進行案件分析",
        next: "analysis"
      }
    ]
  },

  // 推理階段
  analysis: {
    chapter: "第三章：案件分析",
    speaker: "調查人員",
    text: "判斷事件是否涉及跟蹤騷擾，需要綜合檢視行為方式、反覆或持續情形、違反意願、性或性別關聯，以及對生活造成的影響等法律要件。目前最適合的做法是什麼？",

    choices: [
      {
        text: "整理更多事實，確認法律要件",
        next: "goodEnding"
      },
      {
        text: "只憑單一訊息就認定已構成犯罪",
        next: "badEnding"
      }
    ]
  },

  // 結局 A
  goodEnding: {
    chapter: "結局：持續調查",
    speaker: "旁白",
    text: "你選擇進一步確認事實與法律要件。案件仍需要調查，但你已學會不能只依單一線索下結論。",

    choices: [
      {
        text: "重新開始遊戲",
        action: "restart"
      }
    ]
  },

  // 結局 B
  badEnding: {
    chapter: "結局：證據不足",
    speaker: "旁白",
    text: "你過早作出判斷。單一訊息未必足以證明所有法律要件，但這不代表當事人的困擾不值得重視。你可以重新整理線索。",

    choices: [
      {
        text: "重新開始遊戲",
        action: "restart"
      }
    ]
  }
};

// ===== 4. 取得 HTML 元素 =====

const mainMenu = document.getElementById("main-menu");
const gameScreen = document.getElementById("game-screen");
const aboutScreen = document.getElementById("about-screen");

const chapterTitle = document.getElementById("chapter-title");
const speakerName = document.getElementById("speaker-name");
const dialogueText = document.getElementById("dialogue-text");
const choicesContainer = document.getElementById("choices");

const evidencePanel = document.getElementById("evidence-panel");
const evidenceList = document.getElementById("evidence-list");

// ===== 5. 畫面切換 =====

function showScreen(screen) {
  mainMenu.hidden = true;
  gameScreen.hidden = true;
  aboutScreen.hidden = true;
  evidencePanel.hidden = true;

  screen.hidden = false;
}

// ===== 6. 顯示劇情 =====

function showScene(sceneId) {
  const scene = scenes[sceneId];

  if (!scene) {
    console.error("找不到場景：", sceneId);
    return;
  }

  currentScene = sceneId;

  chapterTitle.textContent = scene.chapter;
  speakerName.textContent = scene.speaker;
  dialogueText.textContent = scene.text;

  choicesContainer.innerHTML = "";

  scene.choices.forEach(choice => {
    const button = document.createElement("button");

    button.textContent = choice.text;

    button.addEventListener("click", () => {
      makeChoice(choice);
    });

    choicesContainer.appendChild(button);
  });
}

// ===== 7. 處理玩家選擇 =====

function makeChoice(choice) {

  choicesMade.push(choice.text);

  // 如果選項包含證據，就加入證據欄
  if (choice.evidence) {
    collectEvidence(choice.evidence);
  }

  // 執行特殊功能
  if (choice.action === "showEvidence") {
    openEvidence();
    return;
  }

  if (choice.action === "restart") {
    restartGame();
    return;
  }

  // 切換下一個場景
  if (choice.next) {
    showScene(choice.next);
  }
}

// ===== 8. 蒐集證據 =====

function collectEvidence(evidenceId) {

  if (!collectedEvidence.includes(evidenceId)) {
    collectedEvidence.push(evidenceId);
    console.log("取得證據：", evidenceData[evidenceId].name);
  }
}

// ===== 9. 顯示證據欄 =====

function openEvidence() {
  evidenceList.innerHTML = "";

  if (collectedEvidence.length === 0) {
    const item = document.createElement("li");
    item.textContent = "目前尚未取得任何證據。";
    evidenceList.appendChild(item);
  } else {
    collectedEvidence.forEach(id => {
      const evidence = evidenceData[id];

      const item = document.createElement("li");
      const name = document.createElement("strong");
      const description = document.createElement("p");

      name.textContent = evidence.name;
      description.textContent = evidence.description;

      item.appendChild(name);
      item.appendChild(description);
      evidenceList.appendChild(item);
    });
  }

  evidencePanel.hidden = false;
}

// ===== 10. 關閉證據欄 =====

function closeEvidence() {
  evidencePanel.hidden = true;
}

// ===== 11. 開始遊戲 =====

function startGame() {
  collectedEvidence = [];
  choicesMade = [];

  showScreen(gameScreen);
  showScene("start");
}

// ===== 12. 重新開始 =====

function restartGame() {
  startGame();
}

// ===== 13. 按鈕事件 =====

document.getElementById("start-btn")
  .addEventListener("click", startGame);

document.getElementById("about-btn")
  .addEventListener("click", () => {
    showScreen(aboutScreen);
  });

document.getElementById("back-menu-btn")
  .addEventListener("click", () => {
    showScreen(mainMenu);
  });

document.getElementById("evidence-btn")
  .addEventListener("click", openEvidence);

document.getElementById("close-evidence-btn")
  .addEventListener("click", closeEvidence);

// ===== 14. 初始畫面 =====

showScreen(mainMenu);
