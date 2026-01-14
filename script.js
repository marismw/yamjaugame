// Main script for handling different game logics

document.addEventListener('DOMContentLoaded', () => {
    // --- Truth or Dare Game Logic ---
    const truthDareGameArea = document.querySelector('.truth-dare-game-area');
    if (truthDareGameArea) {
        const allQuestions = [
            /* 真心話 Truth Questions (25 questions) */
            { text: '你醉過最尷尬的一次經歷是什麼？', type: 'truth' },
            { text: '在場哪一個人最有可能成為你的理想型？', type: 'truth' },
            { text: '你做過最後悔的一件事是什麼？', type: 'truth' },
            { text: '有沒有一件你一直不敢跟父母說的事？是什麼？', type: 'truth' },
            { text: '如果可以刪掉一段記憶，你會刪掉哪一段？', type: 'truth' },
            { text: '你最害怕什麼？為什麼？', type: 'truth' },
            { text: '你至今做過最瘋狂的事情是什麼？', type: 'truth' },
            { text: '你對愛情/婚姻的看法是什麼？', type: 'truth' },
            { text: '說一個你從未告訴任何人的秘密。', type: 'truth' },
            { text: '你覺得自己的優點和缺點各是什麼？', type: 'truth' },
            { text: '你曾經喜歡過在場的哪個人？', type: 'truth' },
            { text: '如果你能改變一件事，你會改變過去的什麼？', type: 'truth' },
            { text: '你最想去哪裡旅行？與誰同行？', type: 'truth' },
            { text: '你對「報復」的看法是什麼？', type: 'truth' },
            { text: '你認為人生中最重要的事情是什麼？', type: 'truth' },
            { text: '描述一下你理想中的約會。', type: 'truth' },
            { text: '你相信有真愛嗎？', type: 'truth' },
            { text: '你上次哭是什麼時候？為什麼？', type: 'truth' },
            { text: '你認為自己最吸引人的地方是什麼？', type: 'truth' },
            { text: '你曾經做過最讓你感到驕傲的事情是什麼？', type: 'truth' },
            { text: '如果你能擁有任何超能力，你會選擇哪一種？', type: 'truth' },
            { text: '說出你對坐在你對面的人的真實想法。', type: 'truth' },
            { text: '你最尷尬的時刻是什麼？', type: 'truth' },
            { text: '你最後悔沒有做的事情是什麼？', type: 'truth' },
            { text: '你最大的夢想是什麼？', type: 'truth' },

            /* 大冒險 Dare Questions (25 questions) */
            { text: '馬上公開唱一段歌（至少 10 秒）。', type: 'dare' },
            { text: '拿起手機，發一個只有表情符號的限時動態。', type: 'dare' },
            { text: '接下來三分鐘內，別人說什麼你都要回答「好啊」。', type: 'dare' },
            { text: '讓你右手邊的人幫你設計一個新暱稱，並在今晚都用這個暱稱。', type: 'dare' },
            { text: '接受大家指定的一種飲法，喝一小杯。', type: 'dare' },
            { text: '學一種動物的叫聲或動作，持續 30 秒。', type: 'dare' },
            { text: '用慢動作走去指定地點再走回來。', type: 'dare' },
            { text: '打電話給一個你不常聯絡的朋友，說「我愛你」。', type: 'dare' },
            { text: '用腳趾夾東西吃。', type: 'dare' },
            { text: '大聲說出你暗戀的對象（如果有的話）。', type: 'dare' },
            { text: '跟坐在你左邊的人跳一段舞。', type: 'dare' },
            { text: '模仿一個卡通人物的聲音，講一段話。', type: 'dare' },
            { text: '吃下一勺「神秘醬料」（可以是任何無害的醬料組合）。', type: 'dare' },
            { text: '蒙眼走動 1 分鐘，由其他人引導。', type: 'dare' },
            { text: '用最誇張的方式讚美在場的每一個人。', type: 'dare' },
            { text: '穿上別人的鞋子走一圈。', type: 'dare' },
            { text: '在臉上畫一個搞怪圖案。', type: 'dare' },
            { text: '用屁股寫出你的名字。', type: 'dare' },
            { text: '向窗外大喊「我好靚仔/靚女啊！」', type: 'dare' },
            { text: '擺出一個奇怪的姿勢，讓大家拍照。', type: 'dare' },
            { text: '講一個你最爛的笑話。', type: 'dare' },
            { text: '在接下來的 5 分鐘內，每次說話前都要加一個奇怪的口頭禪。', type: 'dare' },
            { text: '給右邊的人一個熱情擁抱。', type: 'dare' },
            { text: '假裝自己是一個外國遊客，向在場的人問路。', type: 'dare' },
            { text: '用筷子夾一粒花生。', type: 'dare' }
        ];

        let availableQuestions = [];
        let drawnCount = 0;
        let currentMode = 'random'; // Default mode: random, truth, dare

        const modeButtons = document.querySelectorAll('.mode-button');
        const questionTypeElement = document.getElementById('question-type');
        const questionTextElement = document.getElementById('question-text');
        const drawButton = document.getElementById('draw-button');
        const restartButton = document.getElementById('restart-button');
        const ageGroupSelect = document.getElementById('age-group-select');
        const customAgeGroupInput = document.getElementById('custom-age-group');
        const relationshipSelect = document.getElementById('relationship-select');
        const customRelationshipInput = document.getElementById('custom-relationship');
        const occasionSelect = document.getElementById('occasion-select');
        const customOccasionInput = document.getElementById('custom-occasion');
        const generateAiQuestionsBtn = document.getElementById('generate-ai-questions-btn');
        const aiStatusMessage = document.getElementById('ai-status-message');

        // Function to toggle custom input visibility
        function toggleCustomInput(selectElement, customInput) {
            if (selectElement.value === 'custom') {
                customInput.style.display = 'inline-block';
                customInput.focus();
            } else {
                customInput.style.display = 'none';
                customInput.value = ''; // Clear custom input when not in use
            }
        }

        // Event listeners for dropdowns to show/hide custom inputs
        if (ageGroupSelect) {
            ageGroupSelect.addEventListener('change', () => toggleCustomInput(ageGroupSelect, customAgeGroupInput));
        }
        if (relationshipSelect) {
            relationshipSelect.addEventListener('change', () => toggleCustomInput(relationshipSelect, customRelationshipInput));
        }
        if (occasionSelect) {
            occasionSelect.addEventListener('change', () => toggleCustomInput(occasionSelect, customOccasionInput));
        }

        // --- AI Question Generation Logic ---
        if (generateAiQuestionsBtn) {
            generateAiQuestionsBtn.addEventListener('click', async () => {
                generateAiQuestionsBtn.disabled = true; // Disable button during loading
                aiStatusMessage.style.display = 'block';
                aiStatusMessage.textContent = 'AI 題目生成中，請稍候...';
                aiStatusMessage.style.color = '#fbc02d'; // Accent yellow for loading

                const ageGroup = ageGroupSelect.value === 'custom' ? customAgeGroupInput.value : ageGroupSelect.value;
                const relationship = relationshipSelect.value === 'custom' ? customRelationshipInput.value : relationshipSelect.value;
                const occasion = occasionSelect.value === 'custom' ? customOccasionInput.value : occasionSelect.value;

                if (!ageGroup || !relationship || !occasion || (ageGroupSelect.value === 'custom' && !customAgeGroupInput.value) || (relationshipSelect.value === 'custom' && !customRelationshipInput.value) || (occasionSelect.value === 'custom' && !customOccasionInput.value)) {
                    aiStatusMessage.textContent = '請選擇或輸入所有自訂選項！';
                    aiStatusMessage.style.color = '#d32f2f'; // Red for error
                    generateAiQuestionsBtn.disabled = false;
                    return;
                }

                try {
                    // Make fetch call to the backend endpoint
                    const response = await fetch('/api/generate-questions', { // Assuming /api/generate-questions is hosted correctly
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ageGroup, relationship, occasion }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const newQuestions = await response.json();

                    if (newQuestions && newQuestions.length > 0) {
                        allQuestions.length = 0; // Clear existing questions
                        allQuestions.push(...newQuestions); // Add new AI generated questions
                        aiStatusMessage.textContent = `已載入 ${newQuestions.length} 條自訂題目！ (Fixed JSON from Backend)`;
                        aiStatusMessage.style.color = '#2e7d32'; // Green for success
                        initializeTruthDareGame(currentMode); // Re-initialize game with new questions
                    } else {
                        throw new Error('後端未能生成有效題目，或返回空題庫。');
                    }
                } catch (error) {
                    console.error('AI 生成題目失敗:', error);
                    aiStatusMessage.textContent = `生成題目失敗: ${error.message}，請檢查後端服務。`;
                    aiStatusMessage.style.color = '#d32f2f'; // Red for error
                } finally {
                    generateAiQuestionsBtn.disabled = false; // Re-enable button
                }
            });
        }

        // The generateDummyQuestions function is no longer needed after integrating with actual backend endpoint



        function initializeTruthDareGame(mode = currentMode) {
            currentMode = mode;
            // Update active state of buttons
            modeButtons.forEach(button => {
                button.classList.remove('active');
                if (button.id === `mode-${mode}`) {
                    button.classList.add('active');
                }
            });

            // Filter questions based on mode
            let filteredQuestions;
            if (currentMode === 'truth') {
                filteredQuestions = allQuestions.filter(q => q.type === 'truth');
            } else if (currentMode === 'dare') {
                filteredQuestions = allQuestions.filter(q => q.type === 'dare');
            } else {
                filteredQuestions = [...allQuestions]; // Random mode
            }

            availableQuestions = [...filteredQuestions]; // Reset available questions
            drawnCount = 0;
            
            questionTextElement.textContent = '點擊模式按鈕開始抽題！';
            questionTypeElement.textContent = '';
            questionTypeElement.className = 'type-text'; // Reset class
            drawButton.disabled = false;
        }

        function drawTruthDareQuestion() {
            if (availableQuestions.length === 0) {
                questionTextElement.textContent = '所有題目已用完，請重新開始。';
                questionTypeElement.textContent = '';
                questionTypeElement.className = 'type-text';
                drawButton.disabled = true;
                return;
            }

            // Remove animation class to trigger reflow
            questionTextElement.classList.remove('fade-in');
            questionTypeElement.classList.remove('fade-in');
            
            void questionTextElement.offsetWidth; // Trigger reflow

            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            const drawnQuestion = availableQuestions[randomIndex];

            questionTextElement.textContent = drawnQuestion.text;
            questionTypeElement.textContent = drawnQuestion.type === 'truth' ? '真心話' : '大冒險';

            // Add animation class
            questionTextElement.classList.add('fade-in');
            questionTypeElement.classList.add('fade-in');

            // Update class for styling
            questionTypeElement.className = 'type-text ' + (drawnQuestion.type === 'truth' ? 'type-truth' : 'type-dare') + ' fade-in';

            availableQuestions.splice(randomIndex, 1); // Remove drawn question to avoid repetition
            drawnCount++;

            if (availableQuestions.length === 0) {
                drawButton.disabled = true;
            }
        }

        // Event Listeners for Truth or Dare buttons
        if (drawButton) {
            drawButton.addEventListener('click', drawTruthDareQuestion);
        }
        if (restartButton) {
            restartButton.addEventListener('click', () => initializeTruthDareGame(currentMode));
        }

        // Event Listeners for Mode Selection
        modeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const selectedMode = event.currentTarget.id.replace('mode-', '');
                
                // If mode changed, re-initialize
                if (selectedMode !== currentMode) {
                    initializeTruthDareGame(selectedMode);
                    drawTruthDareQuestion(); // Auto draw first question
                } else {
                    // Same mode clicked again, just draw next question
                    drawTruthDareQuestion();
                }
            });
        });

        // Initialize game when page loads
        initializeTruthDareGame('random');
    }

    // --- Dai Pai Dong Game Logic ---
    const dpdGamePlaySection = document.querySelector('.game-play-section');
    if (dpdGamePlaySection) {
        const suits = [
            { name: 'clubs', symbol: '♣' },
            { name: 'diamonds', symbol: '♦' },
            { name: 'hearts', symbol: '♥' },
            { name: 'spades', symbol: '♠' }
        ];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        let fullDeck = [];
        let availableCards = [];
        let drawnCardCount = 0;

        const cardSymbolElement = document.getElementById('card-symbol');
        const cardRankElement = document.getElementById('card-rank');
        const cardDescriptionElement = document.getElementById('card-description');
        const currentCardCountElement = document.getElementById('current-card-count');
        const drawnCardContainer = document.getElementById('drawn-card-container'); // New element to show/hide
        const drawCardButton = document.getElementById('draw-card-btn');
        const resetGameButton = document.getElementById('reset-game-btn');

        // Helper to get card description based on rank
        function getCardDescription(rank) {
            switch (rank) {
                case 'A': return '抽到呢張牌，你可以公開點名一位玩家，叫對方即刻飲一啖或一杯。';
                case '2': return '抽到呢張牌，你暫時變成陪飲員：之後無論邊個玩家要飲，你都要一齊跟飲，直到下一個人再抽到 2 先解除。';
                case '3': return '抽到呢張牌，開始玩大細波：做大波手勢要講『細波』，做細波手勢要講『大波』。動作同講嘢唔一致，或者反應太慢嗰位要飲一啖。';
                case '4': return '抽到呢張牌，你可以加一條新規矩入遊戲。其後犯規嘅玩家都要飲一啖。之後再有人抽到 4，可以選擇新增規矩，或者修改／取消之前嘅規矩。';
                case '5': return '抽到呢張牌，全枱即刻玩一局圍枚（玩法由大家事先講清楚），輸嘅嗰位要飲一啖。';
                case '6': return '抽到呢張牌，你要出一個 Topic，然後玩家輪流回答。講唔出、講重複或者離題太遠嗰位，要飲一啖。';
                case '7': return '抽到呢張牌，開始玩拍 7：玩家輪流報數，遇到包含『7』或者係 7 嘅倍數嘅數字，要以拍手代替唔可以講出口，並且輪回上一位繼續。報錯、唔拍手或者時機錯咗嗰位，要飲一啖。';
                case '8': return '抽到呢張牌，就攞到一張廁所通行證，可以保留；之後想去廁所時，用呢張牌報備，其餘冇牌嘅人理論上唔可以隨便離枱，除非大家同意。';
                case '9': return '抽到呢張牌，大家由 1 開始報數。有人同時講同一個數字、重複講過嘅數字，或者變成最後一個先開口嗰位，都要飲一啖。';
                case '10': return '抽到呢張牌，你變成癡線佬，之後期間你講嘅嘢其他玩家都唔應該正面回應；一旦有人忍唔住應你，就要飲一啖。';
                case 'J': return '抽到呢張牌，你上一位抽牌嗰個玩家要飲一杯。';
                case 'Q': return '抽到呢張牌，你下一位準備抽牌嗰個玩家要先飲一啖。';
                case 'K': return '抽到呢張牌，簡單直接由你自己飲一啖或一杯。';
                case 'Joker': return '抽到呢張牌可以當「免死牌」，保留一次免飲機會，需要用嘅時候攞出嚟豁免一個懲罰。';
                default: return '';
            }
        }

        function createFullDeck() {
            fullDeck = [];
            suits.forEach(suit => {
                ranks.forEach(rank => {
                    fullDeck.push({ rank: rank, suit: suit.name, symbol: suit.symbol, description: getCardDescription(rank) });
                });
            });
            fullDeck.push({ rank: 'Joker', suit: 'none', symbol: '★', description: getCardDescription('Joker') }); // First Joker
            fullDeck.push({ rank: 'Joker', suit: 'none', symbol: '★', description: getCardDescription('Joker') }); // Second Joker
        }

        function initializeDpdGame() {
            createFullDeck();
            availableCards = [...fullDeck];
            drawnCardCount = 0;
            updateDpdUI();
            
            cardSymbolElement.textContent = '';
            cardRankElement.textContent = '';
            cardRankElement.className = 'card-rank'; // Reset class
            cardDescriptionElement.textContent = '點擊抽牌按鈕開始遊戲！';
            drawnCardContainer.style.display = 'none'; // Hide initially

            drawCardButton.disabled = false;
        }

        function drawCard() {
            if (availableCards.length === 0) {
                cardDescriptionElement.textContent = '所有牌已抽完，請再來一局！';
                cardSymbolElement.textContent = '';
                cardRankElement.textContent = '';
                cardRankElement.className = 'card-rank';
                drawCardButton.disabled = true;
                return;
            }

            const randomIndex = Math.floor(Math.random() * availableCards.length);
            const drawnCard = availableCards[randomIndex];

            cardSymbolElement.textContent = drawnCard.symbol;
            cardRankElement.textContent = drawnCard.rank === 'Joker' ? '' : drawnCard.rank;
            cardDescriptionElement.textContent = drawnCard.description;
            
            // Apply color for suits
            if (drawnCard.suit === 'hearts' || drawnCard.suit === 'diamonds') {
                cardSymbolElement.classList.add('red-suit');
                cardRankElement.classList.add('red-suit');
            } else {
                cardSymbolElement.classList.remove('red-suit');
                cardRankElement.classList.remove('red-suit');
            }

            // For Jokers, only show rank as Joker
            if (drawnCard.rank === 'Joker') {
                cardRankElement.textContent = 'Joker'; // Show 'Joker' on rank
                cardSymbolElement.textContent = ''; // Clear symbol for Joker
            }
            drawnCardContainer.style.display = 'flex'; // Show the drawn card container

            availableCards.splice(randomIndex, 1);
            drawnCardCount++;
            updateDpdUI();

            if (availableCards.length === 0) {
                drawCardButton.disabled = true;
            }
        }

        function updateDpdUI() {
            currentCardCountElement.textContent = drawnCardCount;
        }

        function resetDpdGame() {
            if (confirm('確定要重新開始嗎？所有已抽的牌會被重置。')) {
                initializeDpdGame();
            }
        }

        // Event Listeners for Dai Pai Dong
        if (drawCardButton) {
            drawCardButton.addEventListener('click', drawCard);
        }
        if (resetGameButton) {
            resetGameButton.addEventListener('click', resetDpdGame);
        }

        initializeDpdGame();
    }
});
