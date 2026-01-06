// 定義所有牌及其規則的資料結構
const allCardRules = {
    'A': { title: 'A - 指人飲', rule: '指定任意一個人飲一啖' },
    '2': { title: '2 - 陪飲', rule: '無論邊個玩家要飲，抽到陪飲嘅人都要同佢一齊飲，直到下一個人抽到 2 為止' },
    '3': { title: '3 - 大細波', rule: '玩家用手做出大波嘅動作，要講「細波」，相反做出細波嘅動作，就要講「大波」，做錯嘅玩家飲一啖' },
    '4': { title: '4 - 開規矩', rule: '自定一個規則，例如「唔比講『我』字」，遊戲期間講「我」字嘅玩家就要飲一啖。之後抽到 4 嘅玩家可以繼續開新嘅規矩（都可以取消之前嘅規矩），直到遊戲結束' },
    '5': { title: '5 - 圍枚', rule: '一人出一隻手，打開嘅係 5，唔開就唔計數，輪到估哩一 round 有幾多人打開手（5、10、15……/1隻、2隻、3隻）並嗌出數字，可以自定規則要邊個飲，例如嗌中嘅人下家飲、嗌唔中嘅人都要飲' },
    '6': { title: '6 - 開 TOPIC', rule: '自定一個 Topic 話題，例如「澳門有咩酒吧」，玩家要輪流一人講出一間澳門酒吧嘅名，講唔出或者講重複就要飲一啖' },
    '7': { title: '7 - 拍柒', rule: '玩家隨機講出一個數字，要跟順序，例如上家嗌 9，下家就要跟住嗌 10。當有 7 或者係 7 嘅倍數嘅數字出現就要用拍手代替，並且輪翻到上家繼續嗌。當嗌到數字 7 或者 7 嘅倍數唔有拍手嘅玩家，要飲一啖' },
    '8': { title: '8 - 去廁所', rule: '抽到哩張牌嘅玩家可以 keep 住，等需要去廁所嘅時候用' },
    '9': { title: '9 - 撞機', rule: '所有玩家任意由 1 開始數數，同時講出相同數字嘅玩家、重複已經講過嘅數字或者講出最後一個數字嘅玩家飲一啖' },
    '10': { title: '10 - 癡線佬', rule: '抽中 10 嘅玩家就係「癡線佬」，其他玩家如果答「癡線佬」講嘅嘢就要飲一啖' },
    'J': { title: 'J - 上家飲', rule: '抽到哩張牌嘅上一個玩家飲一啖' },
    'Q': { title: 'Q - 下家飲', rule: '抽到哩張牌嘅下一個玩家飲一啖' },
    'K': { title: 'K - 自己飲', rule: '抽到哩張牌嘅玩家要自己飲一啖' },
    // 假設JOKER有兩張
    'JOKER1': { title: 'JOKER - 免飲', rule: '' }, // JOKER 免飲，沒有額外規則說明
    'JOKER2': { title: 'JOKER - 免飲', rule: '' } // 另一張 JOKER
};

let allGameCards = []; // 用於保存所有遊戲牌的原始副本
let availableCards = []; // 用於抽牌的當前可用牌組
let cardsDrawnCount = 0; // 記錄已抽牌數量

function initializeCards() {
    const suits = ['_club', '_diamond', '_heart', '_spade']; 
    allGameCards = []; // 清空原始牌組
    // 為每種普通牌添加四個花色
    ['A','2','3','4','5','6','7','8','9','10','J','Q','K'].forEach(cardName =>{
        suits.forEach(suit => {
            allGameCards.push({ name: cardName, suit: suit, displayTitle: allCardRules[cardName].title, displayRule: allCardRules[cardName].rule });
        });
    });
    // 添加兩張JOKER
    allGameCards.push({ name: 'JOKER1', suit: '', displayTitle: allCardRules['JOKER1'].title, displayRule: allCardRules['JOKER1'].rule });
    allGameCards.push({ name: 'JOKER2', suit: '', displayTitle: allCardRules['JOKER2'].title, displayRule: allCardRules['JOKER2'].rule });
    
    availableCards = [...allGameCards]; // 複製一份原始牌組作為可用牌組
    shuffleCards();
    cardsDrawnCount = 0; // 重置已抽牌數量
}

function shuffleCards() {
    for (let i = availableCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableCards[i], availableCards[j]] = [availableCards[j], availableCards[i]]; // Fisher-Yates shuffle
    }
}

// 獲取 DOM 元素
const drawCardBtn = document.getElementById('dpd-draw-card-btn');
const resetGameBtn = document.getElementById('dpd-reset-game-btn');
const drawnCardTitle = document.getElementById('dpd-drawn-card-title');
const drawnCardRule = document.getElementById('dpd-drawn-card-rule');
const currentCardCount = document.getElementById('dpd-current-card-count');
const totalCardCount = document.getElementById('dpd-total-card-count');

// 抽牌功能函式
function drawRandomCard() {
    if (availableCards.length === 0) {
        drawnCardTitle.textContent = '所有牌都已抽完！';
        drawnCardRule.textContent = '請點擊「再嚟一鋪」重新開始。';
        drawCardBtn.disabled = true; // 禁用抽牌按鈕
        return;
    }

    const drawnCard = availableCards.pop(); // 抽最後一張牌（已洗牌）
    cardsDrawnCount++; // 增加已抽牌數量
    updateCardCountDisplay(); // 更新顯示

    drawnCardTitle.textContent = drawnCard.displayTitle;
    drawnCardRule.textContent = drawnCard.displayRule;

    // 如果抽完最後一張牌，禁用抽牌按鈕
    if (availableCards.length === 0) {
        drawCardBtn.disabled = true;
    }
}

// 更新抽牌數量顯示
function updateCardCountDisplay() {
    currentCardCount.textContent = cardsDrawnCount;
    totalCardCount.textContent = allGameCards.length; // 確保顯示的是實際的總牌數
}

// 重置遊戲功能函式 (帶確認)
function resetGameWithConfirmation() {
    const confirmation = confirm('確定要重新開始遊戲嗎？所有已抽嘅牌都會重置喎！');
    if (confirmation) {
        initializeCards(); // 重新初始化並洗牌
        drawCardBtn.disabled = false; // 啟用抽牌按鈕
        drawnCardTitle.textContent = '點擊按鈕，開始抽牌！';
        drawnCardRule.textContent = '';
        updateCardCountDisplay(); // 重置後更新顯示
    }
}

// 為抽牌按鈕添加事件監聽器
drawCardBtn.addEventListener('click', drawRandomCard);

// 為重置按鈕添加事件監聽器 (呼叫帶確認的函式)
resetGameBtn.addEventListener('click', resetGameWithConfirmation);

// 網頁載入時初始化牌組
initializeCards();

// 初始化顯示 (第一次載入頁面時)
drawnCardTitle.textContent = '點擊按鈕，開始抽牌！';
drawnCardRule.textContent = '';
updateCardCountDisplay();
