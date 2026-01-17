// Define Game Data
const ROLES_DATA = {
    '村民': { count: 3, type: 'good' },
    '狼人': { count: 2, type: 'evil' },
    '預言家': { count: 1, type: 'good' },
    '強盜': { count: 1, type: 'good' },
    '搗蛋鬼': { count: 1, type: 'good' },
    '皮匠': { count: 1, type: 'neutral' },
    '酒鬼': { count: 1, type: 'good' },
    '獵人': { count: 1, type: 'good' },
    '守夜人': { count: 2, type: 'good' },
    '失眠者': { count: 1, type: 'good' },
    '爪牙': { count: 1, type: 'evil' },
    '化身幽靈': { count: 1, type: 'any' } // Special role that can be any type
};

const RECOMMENDED_CONFIGS = {
    4: { '狼人': 2, '預言家': 1, '強盜': 1, '搗蛋鬼': 1, '酒鬼': 1, '村民': 1, total: 7 }, // N+3 = 4+3 = 7 cards
    5: { '狼人': 2, '預言家': 1, '強盜': 1, '搗蛋鬼': 1, '酒鬼': 1, '失眠者': 1, '村民': 1, total: 8 }, // N+3 = 5+3 = 8 cards
    6: { '化身幽靈': 1, '狼人': 2, '預言家': 1, '強盜': 1, '搗蛋鬼': 1, '酒鬼': 1, '失眠者': 1, '村民': 1, total: 9 }, // N+3 = 6+3 = 9 cards
    7: { '化身幽靈': 1, '狼人': 2, '預言家': 1, '強盜': 1, '搗蛋鬼': 1, '酒鬼': 1, '失眠者': 1, '村民': 1, '皮匠': 1, total: 10 }, // N+3 = 7+3 = 10 cards
    8: { '化身幽靈': 1, '狼人': 2, '爪牙': 1, '預言家': 1, '強盜': 1, '搗蛋鬼': 1, '酒鬼': 1, '失眠者': 1, '村民': 1, '獵人': 1, total: 11 }, // N+3 = 8+3 = 11 cards
    9: { '化身幽靈': 1, '狼人': 2, '爪牙': 1, '預言家': 1, '強盜': 1, '搗蛋鬼': 1, '酒鬼': 1, '失眠者': 1, '村民': 1, '獵人': 1, '皮匠': 1, total: 12 }  // N+3 = 9+3 = 12 cards
};

const WAKE_UP_ORDER = [
    '化身幽靈', '狼人', '爪牙', '守夜人', '預言家', '強盜', '搗蛋鬼', '酒鬼', '失眠者'
];

// Global game state
let players = [];
let centerCards = [];
let dealtRoles = {}; // Stores the actual roles dealt in this game instance
let currentPlayerCount = 4; // Default player count
let customRoleQuantities = {};
let currentWakeUpIndex = 0;

// --- DOM Elements ---
const playerCountInput = document.getElementById('player-count');
const useRecommendedConfigBtn = document.getElementById('use-recommended-config');
const toggleCustomConfigBtn = document.getElementById('toggle-custom-config');
const dealCardsBtn = document.getElementById('deal-cards');
const customConfigArea = document.getElementById('custom-config-area');
const roleQuantityInputsDiv = document.getElementById('role-quantity-inputs');
const totalCardsNeededSpan = document.getElementById('total-cards-needed');
const currentSelectedCardsSpan = document.getElementById('current-selected-cards');
const gameResultsDiv = document.getElementById('game-results');
const initialDealMessageDiv = document.getElementById('initial-deal-message');
const startPlayerViewBtn = document.getElementById('start-player-view-btn');

const playerFlowDiv = document.getElementById('player-flow');
const currentPlayerIdSpan = document.getElementById('current-player-id');

const nightStartContainer = document.getElementById('night-start-container');
let startNightButton = null; // Changed to let to be assigned dynamically

const wakeUpOrderContainer = document.getElementById('wake-up-order-container');
const showNextWakeUpRoleBtn = document.getElementById('show-next-wake-up-role');
const currentWakeUpRoleSpan = document.getElementById('current-wake-up-role');
const daytimeVotingArea = document.getElementById('daytime-voting-area');
const voteButtonsDiv = document.getElementById('vote-buttons');
const submitVoteBtn = document.getElementById('submit-vote');
const voteResultsDiv = document.getElementById('vote-results');
const finalVotesUl = document.getElementById('final-votes');
const eliminatedPlayerSpan = document.getElementById('eliminated-player');
const finalVictoryConditionP = document.getElementById('final-victory-condition');
const restartGameBtn = document.getElementById('restart-game-btn');

// --- Utility Functions ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function hideElement(element) {
    if (element) element.classList.add('hidden');
}

function showElement(element) {
    if (element) element.classList.remove('hidden');
}

let currentPlayerIndex = 0;

// --- Game Logic Functions ---

function initializeGame() {
    playerCountInput.value = currentPlayerCount;
    generateCustomRoleInputs();
    updateCustomConfigDisplay();
    applyRecommendedConfig();
    
    // Initial state: hide initial message and player flow
    hideElement(gameResultsDiv);
    hideElement(initialDealMessageDiv);
    hideElement(playerFlowDiv);
    hideElement(nightStartContainer);
    hideElement(wakeUpOrderContainer);
    hideElement(daytimeVotingArea);
    
    // Attach restart listener
    if (restartGameBtn) {
        restartGameBtn.addEventListener('click', resetGame);
    }

    // Show initial game setup controls
    document.querySelector('.game-controls').classList.remove('hidden');
}

function generateCustomRoleInputs() {
    roleQuantityInputsDiv.innerHTML = '';
    for (const role in ROLES_DATA) {
        const div = document.createElement('div');
        div.classList.add('custom-config-item');
        div.innerHTML = `
            <span>${role}</span>
            <input type="number" min="0" max="${ROLES_DATA[role].count}" value="0" data-role="${role}">
        `;
        roleQuantityInputsDiv.appendChild(div);
        const input = div.querySelector('input');
        input.addEventListener('change', (e) => {
            customRoleQuantities[role] = parseInt(e.target.value);
            updateCustomConfigDisplay();
        });
        customRoleQuantities[role] = 0;
    }
}

function updateCustomConfigDisplay() {
    const needed = parseInt(playerCountInput.value) + 3;
    totalCardsNeededSpan.textContent = needed;
    let currentSelected = 0;
    for (const role in customRoleQuantities) {
        currentSelected += customRoleQuantities[role];
    }
    currentSelectedCardsSpan.textContent = currentSelected;

    if (currentSelected !== needed) {
        currentSelectedCardsSpan.style.color = 'red';
    } else {
        currentSelectedCardsSpan.style.color = 'green';
    }
}

function applyRecommendedConfig() {
    currentPlayerCount = parseInt(playerCountInput.value);
    const config = RECOMMENDED_CONFIGS[currentPlayerCount];

    for (const role in ROLES_DATA) {
        customRoleQuantities[role] = 0;
    }

    if (config) {
        for (const role in config) {
            if (role !== 'total') {
                customRoleQuantities[role] = config[role];
            }
        }
    }
    roleQuantityInputsDiv.querySelectorAll('input').forEach(input => {
        const role = input.dataset.role;
        input.value = customRoleQuantities[role] || 0;
    });
    updateCustomConfigDisplay();
}

function dealCards() {
    currentPlayerCount = parseInt(playerCountInput.value);
    const requiredCards = currentPlayerCount + 3;

    let currentSelected = 0;
    for (const role in customRoleQuantities) {
        currentSelected += customRoleQuantities[role];
    }

    if (currentSelected !== requiredCards) {
        alert(`錯誤：選定的牌數 (${currentSelected}) 不等於所需牌數 (${requiredCards})！`);
        return;
    }

    let deck = [];
    dealtRoles = {}; 
    for (const role in customRoleQuantities) {
        for (let i = 0; i < customRoleQuantities[role]; i++) {
            deck.push(role);
            dealtRoles[role] = (dealtRoles[role] || 0) + 1;
        }
    }

    shuffleArray(deck);

    players = [];
    for (let i = 0; i < currentPlayerCount; i++) {
        const role = deck.pop();
        players.push({ id: i + 1, name: `玩家${i + 1}`, originalRole: role, currentRole: role, votedFor: null });
    }

    centerCards = [];
    for (let i = 0; i < 3; i++) {
        const role = deck.pop();
        centerCards.push({ id: `center-${i + 1}`, originalRole: role, currentRole: role });
    }
    
    showElement(gameResultsDiv);
    showElement(initialDealMessageDiv); 
    hideElement(playerFlowDiv);
    hideElement(nightStartContainer);
    hideElement(wakeUpOrderContainer);
    hideElement(daytimeVotingArea);
    showElement(restartGameBtn); // Show restart button after dealing cards

    currentPlayerIndex = 0; 
}

function startPlayerView() {
    hideElement(initialDealMessageDiv);
    showElement(playerFlowDiv);
    renderPlayerViewTurn();
}

function renderPlayerViewTurn() {
    const player = players[currentPlayerIndex];
    const playerFlowContent = `
        <div class="player-turn">
            <h3>輪到邊個睇身份？</h3>
            <p>玩家 <span id="current-player-id">${player.id}</span></p>
            <input type="text" id="player-name-input" placeholder="輸入呢個玩家名" value="${player.name}">
            <button id="show-player-role-btn">畀佢睇身份</button>
            <div id="player-role-display-area" class="player-role-display-area hidden"></div>
            <button id="next-player-btn" class="hidden">睇完畀下一個</button>
        </div>
    `;
    playerFlowDiv.innerHTML = playerFlowContent;

    document.getElementById('show-player-role-btn').onclick = showCurrentRole;
    document.getElementById('next-player-btn').onclick = nextPlayer;
    document.getElementById('player-name-input').onchange = (e) => { players[currentPlayerIndex].name = e.target.value; };
}

function showCurrentRole() {
    const currentPlayer = players[currentPlayerIndex];
    const roleDisplayArea = document.getElementById('player-role-display-area');
    const nextBtn = document.getElementById('next-player-btn');
    const showRoleBtn = document.getElementById('show-player-role-btn');
    
    showElement(roleDisplayArea);
    roleDisplayArea.innerHTML = `<h2 class="role-display-intro">你係<span class="role-display-name">${currentPlayer.originalRole}！</span></h2>`;
    
    showElement(nextBtn);
    nextBtn.disabled = false;
    nextBtn.textContent = '睇完畀下一個';

    showRoleBtn.disabled = true;
}

function nextPlayer() {
    players[currentPlayerIndex].name = document.getElementById('player-name-input').value || `玩家${players[currentPlayerIndex].id}`;
    
    hideElement(document.getElementById('player-role-display-area'));
    
    currentPlayerIndex++;
    
    if (currentPlayerIndex >= players.length) {
        hideElement(playerFlowDiv);
        showElement(nightStartContainer);
        document.getElementById('start-night-button').onclick = startNightPhase;
    } else {
        renderPlayerViewTurn();
    }
}

function startNightPhase() {
    hideElement(nightStartContainer);
    showElement(wakeUpOrderContainer);
    currentWakeUpIndex = 0;
    displayNextWakeUpRole();
}

function displayNextWakeUpRole() {
    if (currentWakeUpIndex < WAKE_UP_ORDER.length) {
        currentWakeUpRoleSpan.textContent = WAKE_UP_ORDER[currentWakeUpIndex];
        currentWakeUpIndex++;
    } else {
        currentWakeUpRoleSpan.textContent = '夜晚階段結束，進入白天討論！';
        hideElement(wakeUpOrderContainer);
        startDayPhase();
    }
}

function startDayPhase() {
    showElement(daytimeVotingArea);
    generateVoteButtons();
    hideElement(voteResultsDiv);
}

function generateVoteButtons() {
    voteButtonsDiv.innerHTML = '';
    players.forEach(player => {
        const button = document.createElement('button');
        button.classList.add('player-for-vote');
        button.textContent = player.name;
        button.dataset.playerId = player.id;
        button.addEventListener('click', () => toggleVote(player.id));
        voteButtonsDiv.appendChild(button);
    });
}

let selectedVote = null;
function toggleVote(playerId) {
    if (selectedVote) {
        const prevSelectedBtn = document.querySelector(`#daytime-voting-area .player-for-vote[data-player-id="${selectedVote}"]`);
        if (prevSelectedBtn) prevSelectedBtn.classList.remove('selected');
    }
    
    if (selectedVote === playerId) {
        selectedVote = null;
    } else {
        selectedVote = playerId;
        const currentSelectedBtn = document.querySelector(`#daytime-voting-area .player-for-vote[data-player-id="${selectedVote}"]`);
        if (currentSelectedBtn) currentSelectedBtn.classList.add('selected');
    }
}

function submitVote() {
    if (!selectedVote) {
        alert('請選擇一位玩家投票。');
        return;
    }

    const targetPlayerId = parseInt(selectedVote);

    players.forEach(p => p.votedFor = targetPlayerId);

    calculateVoteResults();
    determineVictoryCondition();
    showElement(voteResultsDiv);
}

function calculateVoteResults() {
    const voteCounts = {};
    players.forEach(player => {
        if (player.votedFor) {
            voteCounts[player.votedFor] = (voteCounts[player.votedFor] || 0) + 1;
        }
    });

    let maxVotes = 0;
    let potentialEliminated = [];

    finalVotesUl.innerHTML = '';
    let voteSummary = '投票結果: ';
    for (const playerId in voteCounts) {
        const count = voteCounts[playerId];
        const playerName = players.find(p => p.id === parseInt(playerId)).name;
        voteSummary += `${playerName} (${count}票), `;
        const li = document.createElement('li');
        li.textContent = `${playerName}: ${count} 票`;
        finalVotesUl.appendChild(li);

        if (count > maxVotes) {
            maxVotes = count;
            potentialEliminated = [parseInt(playerId)];
        } else if (count === maxVotes) {
            potentialEliminated.push(parseInt(playerId));
        }
    }
    voteSummary = voteSummary.slice(0, -2); 

    if (potentialEliminated.length === 1) {
        const eliminatedPlayer = players.find(p => p.id === potentialEliminated[0]);
        eliminatedPlayerSpan.textContent = `${eliminatedPlayer.name} (${eliminatedPlayer.currentRole})`;
        eliminatedPlayer.eliminated = true;
    } else {
        eliminatedPlayerSpan.textContent = '平票，無人出局。' + voteSummary;
    }
}

function determineVictoryCondition() {
    const allCardsInPlay = players.map(p => p.originalRole).concat(centerCards.map(c => c.originalRole));
    let finalPlayerRoles = players.map(p => ({ id: p.id, name: p.name, role: p.currentRole }));

    let resultText = '';

    // Check for Tanner win condition first as it's a solo win
    const tannerRole = players.find(p => p.originalRole === '皮匠');
    const eliminatedPlayer = players.find(p => p.eliminated);

    if (tannerRole && eliminatedPlayer && eliminatedPlayer.id === tannerRole.id && !allCardsInPlay.includes('狼人')) {
        finalVictoryConditionP.textContent = `${tannerRole.name} (皮匠) 獨贏！ (皮匠出局且無狼人出局)`;
        return;
    }

    const allFinalRoles = finalPlayerRoles.map(p => p.role).concat(centerCards.map(c => c.currentRole));
    const werewolves = finalPlayerRoles.filter(p => p.role === '狼人' && !p.eliminated);
    const anyWerewolfEliminated = eliminatedPlayer && eliminatedPlayer.currentRole === '狼人';

    if (allFinalRoles.includes('狼人')) {
        if (anyWerewolfEliminated) {
            finalVictoryConditionP.textContent = '好人贏！ (至少一個狼人被票出局拉)';
        } else {
            finalVictoryConditionP.textContent = '狼人贏！ (冇狼人被票出局)';
        }
    } else if (allFinalRoles.includes('爪牙')) {
        const minion = finalPlayerRoles.find(p => p.role === '爪牙');
        if (eliminatedPlayer && eliminatedPlayer.id !== minion.id) {
            finalVictoryConditionP.textContent = `${minion.name} (爪牙) 贏！ (冇狼人，爪牙以外嘅人被票出局)`;
        } else if (eliminatedPlayer && eliminatedPlayer.id === minion.id) {
            finalVictoryConditionP.textContent = '好人贏！ (冇狼人，爪牙被票出局拉)';
        } else {
            finalVictoryConditionP.textContent = '好人贏！ (冇狼人，冇人出局)';
        }
    } else {
        finalVictoryConditionP.textContent = '好人贏！ (冇狼人、冇爪牙)';
    }

    if (finalVictoryConditionP.textContent === '') {
        finalVictoryConditionP.textContent = '遊戲結束，結果待定或好人獲勝。你會想再玩一局來確認誰是贏家嗎？也許用不同的角色組合？';
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', initializeGame);

playerCountInput.addEventListener('change', () => {
    currentPlayerCount = parseInt(playerCountInput.value);
    if (currentPlayerCount < 3 || currentPlayerCount > 10) {
        alert('玩家人數必須在 3-10 之間。');
        playerCountInput.value = 4; // Reset to default
        currentPlayerCount = 4;
    }
    updateCustomConfigDisplay();
});

useRecommendedConfigBtn.addEventListener('click', () => {
    hideElement(customConfigArea);
    applyRecommendedConfig();
});

toggleCustomConfigBtn.addEventListener('click', () => {
    customConfigArea.classList.toggle('hidden');
    if (!customConfigArea.classList.contains('hidden')) {
        generateCustomRoleInputs(); 
        for (const role in customRoleQuantities) {
            const input = roleQuantityInputsDiv.querySelector(`input[data-role="${role}"]`);
            if (input) input.value = customRoleQuantities[role];
        }
    }
    updateCustomConfigDisplay();
});

dealCardsBtn.addEventListener('click', dealCards);
startPlayerViewBtn.addEventListener('click', startPlayerView);
showNextWakeUpRoleBtn.addEventListener('click', displayNextWakeUpRole);
submitVoteBtn.addEventListener('click', submitVote);

function resetGame() {
    // Reset all global game state variables
    players = [];
    centerCards = [];
    dealtRoles = {};
    currentPlayerCount = 4;
    customRoleQuantities = {};
    currentWakeUpIndex = 0;
    currentPlayerIndex = 0;

    // Clear UI elements
    hideElement(gameResultsDiv);
    hideElement(initialDealMessageDiv);
    hideElement(playerFlowDiv);
    hideElement(nightStartContainer);
    hideElement(wakeUpOrderContainer);
    hideElement(daytimeVotingArea);
    hideElement(voteResultsDiv);
    voteButtonsDiv.innerHTML = '';
    finalVotesUl.innerHTML = '';
    eliminatedPlayerSpan.textContent = '';
    finalVictoryConditionP.textContent = '';
    currentWakeUpRoleSpan.textContent = '';

    generateCustomRoleInputs();
    updateCustomConfigDisplay();
    applyRecommendedConfig();

    showElement(document.querySelector('.game-controls'));
}

// Initial setup for the restart button
document.addEventListener('DOMContentLoaded', () => {
    if (restartGameBtn) {
        restartGameBtn.addEventListener('click', resetGame);
    }
});
+++++++ REPLACE
