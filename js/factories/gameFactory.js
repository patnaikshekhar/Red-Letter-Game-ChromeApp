gameApp.factory('gameFactory', function(constFactory, settingsFactory) {

    var factory = {};

    // This stores the main game state
    var gameState = null;
    var gameOutcome = null;

    // These variables hold the Images, Sound and Dictionary for the game
    var imgObj = {};
    var soundObj = {};
    var dictObj = {};

    // These are the call back functions which call the drawing functions
    var drawCallback = function() {};
    var errorCallback = function() {};
    var startClockCallback = function() {};
    var rightCallback = function() {};
    var wrongCallback = function() {};
    var existingWordCallback = function() {};
    var endMultiplayerGameCallback = function() {};
    var quitMultiplayerGameCallback = function() {};

    // This stores whether a single player or a multiplayer game
    // was started
    var mode = null;

    // This stores the list of words created
    var playerWordList = null;
    var opponentWordList = null;
    var playerScore = null;
    var opponentScore = null;
    var opponentName = null;

    function getRandomElement(arr) {
        var randomNumber = Math.floor(Math.random() * arr.length);
        return arr[randomNumber];
    };

    factory.getEndGameMessage = function() {
        if (gameOutcome === constFactory.WON_OUTCOME) {
            return getRandomElement(constFactory.END_GAME_MESSAGE_WIN);
        } else if (gameOutcome === constFactory.LOST_OUTCOME) {
            return getRandomElement(constFactory.END_GAME_MESSAGE_LOOSE);
        } else if (gameOutcome === constFactory.DRAW_OUTCOME) {
            return getRandomElement(constFactory.END_GAME_MESSAGE_DRAW);
        }
    };

    factory.getPlayerWordList = function () {
        return playerWordList;
    };

    factory.getOpponentWordList = function () {
        return opponentWordList;
    };

    factory.getPlayerScore = function () {
        return playerScore;
    };

    factory.getOpponentScore = function () {
        return opponentScore;
    };

    factory.getOpponentName = function () {
        return opponentName;
    };

    // This variable stores the web socket
    var websocket = null;

    // This function resets the game
    function reset() {
        playerWordList = [];
        opponentWordList = [];
        playerScore = 0;
        opponentScore = 0;
    }

    // This function calculates the score for a word
    function calculateScore(word) {

        var strength = 1;
        // Find letter strength
        for (i = 0; i < word.length; i++) {
            strength = strength * (gameState['strength'][
                word.charAt(i)] + 1);
        }

        return (word.length * strength);
    }

    // This function updates the usage
    function updateUsage(word) {

        for (var letter in gameState['usage']) {
            if (word.indexOf(letter) === -1) {
                // If not used then decrement
                gameState['usage'][letter] -= 1;
            } else {
                // If used then increment
                gameState['usage'][letter] += 1;
            }
        }
    }

    // This function updates the strength
    function updateStrength() {

        for (var letter in gameState['usage']) {

            var usage = gameState['usage'][letter];

            if (usage >= constFactory.USAGE_TIER_0) {

                gameState['strength'][letter] = constFactory.STRENGTH_0;

            } else if (usage < constFactory.USAGE_TIER_0 &&
                usage >= constFactory.USAGE_TIER_1) {

                gameState['strength'][letter] = constFactory.STRENGTH_1;

            } else if (usage < constFactory.USAGE_TIER_1 &&
                usage >= constFactory.USAGE_TIER_2) {

                gameState['strength'][letter] = constFactory.STRENGTH_2;

            } else if (usage < constFactory.USAGE_TIER_2 &&
                usage >= constFactory.USAGE_TIER_3) {

                gameState['strength'][letter] = constFactory.STRENGTH_3;

            } else {

                gameState['strength'][letter] = constFactory.STRENGTH_4;

            }
         }
    }

    // This function updates the game state and adds
    // the word to the players words
    function updateGameState(word) {

        // Calculate the new score
        var score = calculateScore(word);
        playerScore += score;

        // Update the usage
        updateUsage(word);

        // Update the strength
        updateStrength();

        // Add the word to the player list
        var word = {
            'word': word,
            'score': score
        }

        playerWordList.push(word);

    }

    factory.getGameState = function() {
        return gameState;
    };

    factory.setCallbacks = function(
        drawCallbackFn, errorCallbackfn, startClockCallbackfn,
        rightCallbackFn, wrongCallbackFn, existingWordCallbackFn,
        endMultiplayerGameCallbackFn, quitMultiplayerGameCallbackFn) {

        drawCallback = drawCallbackFn;
        errorCallback = errorCallbackfn;
        startClockCallback = startClockCallbackfn;
        rightCallback = rightCallbackFn;
        wrongCallback = wrongCallbackFn;
        existingWordCallback = existingWordCallbackFn;
        endMultiplayerGameCallback = endMultiplayerGameCallbackFn;
        quitMultiplayerGameCallback = quitMultiplayerGameCallbackFn;
    };

    // This function sets the assets which will be used
    // throughout the game
    factory.setAssets = function (img, sound, dict) {
        imgObj = img;
        soundObj = sound;
        dictObj = dict;
    };

    // This function plays a sound loaded in soundObj
    factory.playSound = function (context, soundId) {

        if (settingsFactory.getSoundStatus()) {
            var source = context.createBufferSource();
            source.buffer = soundObj[soundId];

            // Create a gain node.
            var gainNode = context.createGain();
            // Connect the source to the gain node.
            source.connect(gainNode);

            // Set the gain
            gainNode.gain.value = settingsFactory.getSoundVolume();

            // Connect the gain node to the destination.
            gainNode.connect(context.destination);

            source.start(0);
        }
    };

    // This function draws an image
    factory.drawImage = function(context, imageId, x, y) {
        context.drawImage(imgObj[imageId], x, y);
    }

    // This function generates the board for a single player game
    factory.generateSinglePlayerGame = function () {

        gameState = {};
        gameLetterGrid = [];
        gameLetterUsage = {};
        gameLetterStrength = {};

        for (row = 0; row < constFactory.ROW_TILES; row++) {

            var rowList = [];

            for (column = 0; column < constFactory.COLUMN_TILES; column++) {

                var randomLetter = getRandomElement(constFactory.LETTERS);

                gameLetterUsage[randomLetter] = 0;
                gameLetterStrength[randomLetter] = constFactory.STRENGTH_0;

                rowList.push(randomLetter);
            }

            gameLetterGrid.push(rowList);
        }

        gameState['grid'] = gameLetterGrid;
        gameState['usage'] = gameLetterUsage;
        gameState['strength'] = gameLetterStrength;
    };

    factory.startSinglePlayer = function () {
        // This function starts a single player game
        mode = constFactory.TYPE_SINGLE_PLAYER;
        reset();

        this.generateSinglePlayerGame();
        startClockCallback();
        drawCallback();
    };

    factory.startMultiplayer = function (startMultiplayerCallback) {
        // Start socket
        websocket = new WebSocket(constFactory.SOCKET_URL);
        // Hold the game until socket gets a game
        mode = constFactory.TYPE_MULTI_PLAYER;
        reset();

        websocket.onopen = function() {

            // Join the game once the socket is open
            var msg = JSON.stringify({
                'command': constFactory.JOIN_COMMAND,
                'name': settingsFactory.getPlayerName()
            });

            websocket.send(msg);
        };

        websocket.onerror = function() {
            errorCallback(constFactory.SERVER_CONNECT_ERROR_MSG);
        };

        websocket.onmessage = function (evt) {
            var message = JSON.parse(evt.data);
            console.log(message)
            if (message.command === constFactory.ERROR_COMMAND) {
                errorCallback(constFactory.SERVER_ERROR_MSG);
            }

            if (message.command === constFactory.START_COMMAND) {
                opponentName = message.opponentState.name;
                gameState = message.gameState;
                console.log('Got start message');
                startMultiplayerCallback();
            }

            if (message.command === constFactory.UPDATE_COMMAND) {
                gameState = message.gameState;
                opponentWordList = message.opponentState.wordList;
                opponentScore = message.opponentState.score;
                playerWordList = message.myState.wordList;
                playerScore = message.myState.score;
                drawCallback();
            }

            if (message.command === constFactory.VALIDATED_COMMAND) {
                if (message.result === constFactory.VALIDATION_OUTCOME_RIGHT) {
                    rightCallback();
                } else if (message.result === constFactory.VALIDATION_OUTCOME_WRONG) {
                    wrongCallback();
                } else if (message.result === constFactory.VALIDATION_OUTCOME_EXISTING) {
                    existingWordCallback();
                }
            }

            if (message.command === constFactory.FINAL_COMMAND) {
                gameOutcome = message.outcome;
                opponentScore = message.opponentState.score;
                playerScore = message.myState.score;

                endMultiplayerGameCallback();
            }

            if (message.command === constFactory.QUIT_COMMAND) {
                quitMultiplayerGameCallback();
            }
        };
    };

    function findWord(word) {
        for (var i = 0; i < playerWordList.length; i++) {
            if (playerWordList[i]['word'] === word) {
                return false;
            }
        }

        for (var i = 0; i < opponentWordList.length; i++) {
            if (opponentWordList[i]['word'] === word) {
                return false;
            }
        }

        return true;
    }

    factory.submitWord = function(word) {

        if (dictObj['dictionary'].indexOf(word) != -1) {

            // Check if word was already made
            if (findWord(word) === true) {
                if (mode === constFactory.TYPE_SINGLE_PLAYER) {

                    // If single player then calculate locally
                    updateGameState(word);
                    rightCallback();

                } else {
                    // Send the word to the server
                    // Join the game once the socket is open
                    var msg = JSON.stringify({
                        'command': constFactory.SUBMIT_COMMAND,
                        'word': word
                    });

                    websocket.send(msg);
                }

            } else {
                existingWordCallback();
            }


        } else {
            wrongCallback();
        }
    }

    factory.timerUp = function() {
        // Send the game has ended message
        var msg = JSON.stringify({
            'command': constFactory.END_COMMAND
        });

        websocket.send(msg);
    };

    return factory;
});
