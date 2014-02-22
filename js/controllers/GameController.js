gameApp.controller('GameController', function($rootScope, $scope, $route,
    $location, $interval, gameFactory, constFactory, settingsFactory) {

    // This stores the state of the tile
    var tileState = null;

    // This stores the game clock
    var clock = null;

    init();

    function applyOnScope(func) {
        if(!$scope.$$phase) {
            $scope.$apply(function() {
                func();
            });
        } else {
            func();
        }
    }

    // This function generates the board for a single player game
    function initTileState() {

        tileState = [];

        for (row = 0; row < constFactory.ROW_TILES; row++) {

            var tileStateRow = [];

            for (col = 0; col < constFactory.COLUMN_TILES; col++) {
                tileStateRow.push(constFactory.TILE_STATE_NORMAL);
            }

            tileState.push(tileStateRow);
        }

    }

    // This function takes X and Y coordinates and returns the
    // Row and Column of the box which is selected
    function getBox(X, Y) {

        for (row = 0; row < constFactory.ROW_TILES; row++) {
            for (col = 0; col < constFactory.COLUMN_TILES; col++) {

                var boxLeft = col * (constFactory.TILE_WIDTH +
                    constFactory.TILE_GAP)
                var boxTop = row * (constFactory.TILE_HEIGHT +
                    constFactory.TILE_GAP)

                if ((X >= boxLeft &&
                    X <= boxLeft + constFactory.TILE_WIDTH) &&
                    (Y >= boxTop &&
                    Y <= boxTop + constFactory.TILE_HEIGHT)) {

                    return [row, col];
                }
            }
        }

        return null;
    }

    // This function changes the state of the tile and redraws
    // the tile
    function changeTileState(row, col, state, gameState) {
        tileState[row][col] = state;
        drawTile($scope.ctx, row, col, gameState);
    }

    // This function selects the box to highlight
    function highlightBox(mouseX, mouseY) {

        var coords = getBox(mouseX, mouseY);

        if (coords != null) {

            var gameState = gameFactory.getGameState();

            // Reset the existing highlighted arrow()
            for (row = 0; row < constFactory.ROW_TILES; row++) {
                for (col = 0; col < constFactory.COLUMN_TILES; col++) {

                    // If a tile was highlighted
                    // Then un-highlight it
                    if (tileState[row][col] ===
                        constFactory.TILE_STATE_HIGHLIGHTED) {

                        changeTileState(row, col,
                            constFactory.TILE_STATE_NORMAL, gameState);
                    }
                }
            }

            // Highlight the new box
            if (tileState[coords[0]][coords[1]] ===
                constFactory.TILE_STATE_NORMAL) {

                changeTileState(coords[0], coords[1],
                    constFactory.TILE_STATE_HIGHLIGHTED, gameState);
            }
        }
    }

    // This function removes all the selected tiles
    function resetSelectedTiles() {

        var gameState = gameFactory.getGameState();

        for (row = 0; row < constFactory.ROW_TILES; row++) {
            for (col = 0; col < constFactory.COLUMN_TILES; col++) {
                if (tileState[row][col] == constFactory.TILE_STATE_SELECTED) {

                    changeTileState(row, col,
                        constFactory.TILE_STATE_NORMAL,
                        gameState);

                }
            }
        }
    }

    // This function draws a tile in the specified location
    function drawTile(ctx, row, col, gameState) {

        var xCoord = col * (constFactory.TILE_WIDTH + constFactory.TILE_GAP);
        var yCoord = row * (constFactory.TILE_HEIGHT + constFactory.TILE_GAP);

        var image = null;
        var letter = gameState['grid'][row][col];
        var strength = gameState['strength'][letter];

        if (tileState[row][col] === constFactory.TILE_STATE_NORMAL) {

            if(strength === constFactory.STRENGTH_1) {
                image = "Tile Red 1";
            } else if (strength === constFactory.STRENGTH_2) {
                image = "Tile Red 2";
            } else if (strength === constFactory.STRENGTH_3) {
                image = "Tile Red 3";
            } else if (strength === constFactory.STRENGTH_4) {
                image = "Tile Red 4";
            } else {
                image = "Tile Normal";
            }

        } else if (tileState[row][col] === constFactory.TILE_STATE_HIGHLIGHTED) {
            image = "Tile Highlighted";
        } if (tileState[row][col] === constFactory.TILE_STATE_SELECTED) {
            image = "Tile Selected";
        }

        gameFactory.drawImage(ctx, image, xCoord, yCoord);

        ctx.font = constFactory.TILE_FONT;
        ctx.textAlign = 'center';
        ctx.fillText(gameState['grid'][row][col],
            xCoord + constFactory.TILE_WIDTH / 2,
            yCoord + constFactory.TILE_WIDTH - constFactory.TILE_FONT_PAD_Y);
    }

    function startClock() {
        // This function will start the game clock
        $scope.gameStarted = true;
        $scope.time = constFactory.GAME_TIME;
        $scope.timerClass = "timer-normal";

        clock = $interval(function() {

            if ($scope.time === 0) {
                $interval.cancel(clock);
                $scope.timerClass = "timer-normal";
                endGame();
            } else {
                $scope.time -= 1;
            }

            if ($scope.time == constFactory.TIMER_ANIMATE) {
                $scope.timerClass = "timer-animated";
                gameFactory.playSound($rootScope.audioContext, 'Timer Alert');
            }

        }, 1000);
    }

    function draw() {
        // This function is called to draw the game state

        // Clear the board
        $scope.ctx.clearRect(
            0,
            0,
            constFactory.CANVAS_WIDTH,
            constFactory.CANVAS_HEIGHT
        );

        // Get the current game state
        var gameState = gameFactory.getGameState();

        if (gameState !== null) {
            for (row = 0; row < constFactory.ROW_TILES; row++) {
                for (col = 0; col < constFactory.COLUMN_TILES; col++) {
                    drawTile($scope.ctx, row, col, gameState);
                }
            }
        }

        // Update score and word lists
        gameStateUpdated();
    }

    function error(errorMessage) {
        // This function is called when an error occurs
        applyOnScope(function() {
            $rootScope.errorMessage = errorMessage;

            if ($scope.waitingForOtherPlayer) {
                // If the waiting dialog is open then first close
                $('#waitingDialog').modal('hide');
                $('#waitingDialog').on('hidden.bs.modal', function (e) {
                    applyOnScope(function() {
                        $scope.waitingForOtherPlayer = false;
                        $location.path('/error');
                    });
                });
            } else {
                $location.path('/error');
            }
        });
    }

    function endGame() {
        // This function is called when the game ends

        if ($rootScope.gameType === constFactory.TYPE_SINGLE_PLAYER) {
            applyOnScope(function() {
                $scope.endGameMessage = constFactory.END_GAME_MESSAGE_SINGLE_PLAYER;
            });
        } else {
            gameFactory.timerUp();
        }

        $('#endGameDialog').modal({
            'keyboard': false,
            'backdrop': 'static'
        });

        applyOnScope(function() { $scope.gameStarted = false; });
    }

    function startMultiplayerGameCallback() {
        // This function is called when the multiplayer game can start

        $('#waitingDialog').modal('hide');
        $('#waitingDialog').on('hidden.bs.modal', function (e) {
            $scope.waitingForOtherPlayer = false;
            startClock();
            draw();
        });
    }

    function endMultiplayerGameCallback() {
        // This function is called when the multiplayer game ends
        applyOnScope(function() {
            $scope.score = gameFactory.getPlayerScore();
            $scope.opponentScore = gameFactory.getOpponentScore();
            $scope.endGameMessage = gameFactory.getEndGameMessage();
        });
    }

    function quitMultiplayerGameCallback() {
        // This function is called when the other player quits

        applyOnScope(function() {
            $scope.endGameMessage = constFactory.END_GAME_MESSAGE_QUIT;
        });

        $('#endGameDialog').modal({
            'keyboard': false,
            'backdrop': 'static'
        });

        applyOnScope(function() { $scope.gameStarted = false; });
    }

    function init() {
        // Get the context
        $scope.canvas = document.getElementById('gameCanvas');
        $scope.ctx = $scope.canvas.getContext('2d');

        // Initialize the tile state
        initTileState();

        // Set the initial word to nothing
        $scope.word = "";
        $scope.score = 0;
        $scope.time = null;
        $scope.playerName = settingsFactory.getPlayerName();
        $scope.gameStarted = false;

        // Set the callbacks
        gameFactory.setCallbacks(draw, error, startClock,
            wordMade, wordNotMade, wordExists,
            endMultiplayerGameCallback, quitMultiplayerGameCallback
        );

        // Start the game
        if ($rootScope.gameType === constFactory.TYPE_SINGLE_PLAYER) {
            gameFactory.startSinglePlayer();
        } else {

            // Display waiting dialog
            $('#waitingDialog').modal({
                'keyboard': false,
                'backdrop': 'static'
            });
            gameFactory.startMultiplayer(startMultiplayerGameCallback);
            $scope.waitingForOtherPlayer = true;
        }
    }

    // This function removes a letter from the word
    function removeLetter(letter) {
        var findLetter = letter;
        var word = $scope.word;
        var newWord = "";

        for (i = word.length - 1; i >= 0; i--) {
            if (word.charAt(i) !== findLetter) {
                newWord += word.charAt(i);
            } else {
                findLetter = "";
            }
        }

        $scope.word = newWord;
    }

    // This function is called when a word is made
    function wordMade() {
        // Draw and play happy sound
        draw();
        gameFactory.playSound($rootScope.audioContext, 'Made Word');
    }

    // This function is called when an incorrect word is made
    function wordNotMade() {
        gameFactory.playSound($rootScope.audioContext, 'Failed Word');
    }

    // This function is called when a word has already been made
    function wordExists() {
        gameFactory.playSound($rootScope.audioContext, 'Failed Word');
    }

    // This function handles mouse movement
    $scope.mouseMove = function(event) {

        var rect = $scope.canvas.getBoundingClientRect();

        var mouseX = event.pageX - rect.left;
        var mouseY = event.pageY - rect.top;

        highlightBox(mouseX, mouseY);
    };

    // This function handles the mouse click event
    $scope.mouseClick = function(event) {

        var rect = $scope.canvas.getBoundingClientRect();
        var mouseX = event.pageX - rect.left;
        var mouseY = event.pageY - rect.top;

        var coords = getBox(mouseX, mouseY);

        if (coords != null) {

            var currentTile = tileState[coords[0]][coords[1]];
            var gameState = gameFactory.getGameState();

            if (currentTile === constFactory.TILE_STATE_NORMAL
                || currentTile === constFactory.TILE_STATE_HIGHLIGHTED) {

                // Add the letter to the word
                $scope.word +=  gameState['grid'][coords[0]][coords[1]];

                changeTileState(coords[0], coords[1],
                    constFactory.TILE_STATE_SELECTED, gameState);

                gameFactory.playSound($rootScope.audioContext,
                    'Select Letter');

            } else if (currentTile === constFactory.TILE_STATE_SELECTED) {

                // remove the letter from the word
                removeLetter(gameState['grid'][coords[0]][coords[1]]);

                changeTileState(coords[0], coords[1],
                    constFactory.TILE_STATE_HIGHLIGHTED, gameState);
            }
        }
    };

    $scope.submit = function() {
        // Check the word against the game factory
        gameFactory.submitWord($scope.word);
        $scope.word = "";
        resetSelectedTiles();
    };

    $scope.cancel = function() {
        $scope.word = "";
        resetSelectedTiles();
    };

    function closeModal(callback) {

        gameFactory.playSound($rootScope.audioContext,
            constFactory.SOUND_MENU_BUTTON_CLICK);

        $('#endGameDialog').modal('hide');
        $('#endGameDialog').on('hidden.bs.modal', function (e) {
            callback();
        });
    }

    function gameStateUpdated() {
        applyOnScope(function() {
            $scope.playerWords = gameFactory.getPlayerWordList();
            $scope.opponentWords = gameFactory.getOpponentWordList();
            $scope.score = gameFactory.getPlayerScore();
            $scope.opponentName = gameFactory.getOpponentName();
            $scope.opponentScore = gameFactory.getOpponentScore();
        });
    };

    $scope.backToMenu = function() {
        closeModal(function() {
            applyOnScope(function() {
                $location.path('/menu');
            });
        });
    };

    $scope.playAgain = function() {
        closeModal(function() {
            applyOnScope(function() {
                $route.reload();
            });
        });
    };
});
