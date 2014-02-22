gameApp.factory('constFactory', function() {

    var factory = {};

    // These are the dimentions of the canvas
    factory.CANVAS_WIDTH = 400;
    factory.CANVAS_HEIGHT = 400;

    // These are the number of tiles in a row and column
    factory.ROW_TILES = 5;
    factory.COLUMN_TILES = 5;

    // These are the number of tiles in a row and column in px
    factory.TILE_WIDTH = 70;
    factory.TILE_HEIGHT = 70;
    factory.TILE_GAP = 12;

    factory.TILE_FONT_SIZE = 60;
    factory.TILE_FONT = factory.TILE_FONT_SIZE + "px Arial";
    factory.TILE_FONT_PAD_Y = 12;

    // These store the various assets that need to be loaded
    factory.assets = {
        'dictionary': '../assets/dictionary.json'
    };

    factory.sounds = {
        'Failed Word': '../sounds/failed_word.ogg',
        'Made Word': '../sounds/made_word.ogg',
        'Select Letter': '../sounds/select_letter.ogg',
        'Menu Button': '../sounds/menu_button.ogg',
        'Timer Alert': '../sounds/timer_alert.ogg'
    };

    factory.images = {
        'Tile Normal': '../images/tile_normal.png',
        'Tile Red 1': '../images/tile_red1.png',
        'Tile Red 2': '../images/tile_red2.png',
        'Tile Red 3': '../images/tile_red3.png',
        'Tile Red 4': '../images/tile_red4.png',
        'Tile Selected': '../images/tile_selected.png',
        'Tile Highlighted': '../images/tile_highlighted.png'
    };

    factory.settings = {
        "Settings Set": "settingsSet",
        "Player Name": "playerName",
        "Sound Status": "soundStatus",
        "Sound Volume": "soundVolume"
    };

    // These are the default setting values
    factory.SETTING_NAME = 'Unknown Player';
    factory.SETTING_SND_STATUS = true;
    factory.SETTING_SND_VOL = 0.9;

    // These are a list of the error messages
    factory.LOAD_ERROR_MSG =
        "An error occured while loading the assets for the game.";
    factory.SERVER_ERROR_MSG =
        "An error occured while the server was trying to process the message";
    factory.SERVER_CONNECT_ERROR_MSG =
        "An error occured when connecting to the server.";

    // The sounds to be played are described here
    factory.SOUND_MENU_BUTTON_CLICK = 'Menu Button';

    factory.LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                       'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                       'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                       'Y', 'Z'];

    // This is the strength of the tiles which determines the score
    factory.STRENGTH_0 = 0;
    factory.STRENGTH_1 = 1;
    factory.STRENGTH_2 = 2;
    factory.STRENGTH_3 = 3;
    factory.STRENGTH_4 = 4;

    // These are the constants that store whether its a single player
    // game or a mulitplayer game
    factory.TYPE_SINGLE_PLAYER = 0;
    factory.TYPE_MULTI_PLAYER = 1;

    // This stores the state of the tiles
    factory.TILE_STATE_NORMAL = 0;
    factory.TILE_STATE_HIGHLIGHTED = 1;
    factory.TILE_STATE_SELECTED = 2;

    // These constants store the usage tiers
    factory.USAGE_TIER_0 = -2;
    factory.USAGE_TIER_1 = -4;
    factory.USAGE_TIER_2 = -6;
    factory.USAGE_TIER_3 = -8;
    factory.USAGE_TIER_4 = -10;

    // This is the time the game runs for in Seconds
    factory.GAME_TIME = 90;

    // This is controls when the timer starts to animate
    factory.TIMER_ANIMATE = 10;

    // These are contants for the multiplayer connections
    //factory.SOCKET_URL = "ws://localhost:8888/websocket";
    factory.SOCKET_URL = "ws://redletter.herokuapp.com/websocket";

    factory.WON_OUTCOME = 'won';
    factory.LOST_OUTCOME = 'lost';
    factory.DRAW_OUTCOME = 'draw';

    /*  These are a list of commands communcated between the client
        and the server */

    // Indicates that an error occurred. This is from Server -> Client
    factory.ERROR_COMMAND = 'error';

    // Indicate that the game has started. This is from Server -> Client
    factory.START_COMMAND = 'start';

    // Submit a word to the server. This is from Client -> Server
    factory.SUBMIT_COMMAND = 'submit';

    // Validates a word and sends true if valid Server -> Client
    factory.VALIDATED_COMMAND = 'validated';

    // Indicates when the game state has changed Server -> Client
    factory.UPDATE_COMMAND = 'update';

    // Indicates that a client wants to join the game Client -> Server
    factory.JOIN_COMMAND = 'join';

    // Indicates that the game has ended Client -> Server
    factory.END_COMMAND = 'end';

    // Indicates that both the players are finished with the game Server -> Client
    factory.FINAL_COMMAND = 'final';

    // Indicates that both the players are finished with the game Server -> Client
    factory.QUIT_COMMAND = 'quit';


    // These are a list of validation outcomes
    factory.VALIDATION_OUTCOME_RIGHT = 'right';
    factory.VALIDATION_OUTCOME_WRONG = 'wrong';
    factory.VALIDATION_OUTCOME_EXISTING = 'existing';

    // These are the end game messages shown when the game is over
    factory.END_GAME_MESSAGE_SINGLE_PLAYER =
    "Thank you for playing. Try the Multiplayer Mode";

    factory.END_GAME_MESSAGE_WIN = [
        "You Win! You're awesome.",
        "What!!! You totally won.",
        "Good Job. You win!!"
    ];

    factory.END_GAME_MESSAGE_LOOSE = [
        "Oh shucks. You Lost :(",
        "Oh you lost. Better luck next time",
        ":( you lost. Try again next time",
        "We lost - We'll get him next time."
    ];

    factory.END_GAME_MESSAGE_DRAW = [
        "Bummer. Its a draw.",
        "Shucks, its a draw.",
        "Oh man.. We almost won."
    ];

    factory.END_GAME_MESSAGE_QUIT = "Your opponent ran away!";

    return factory;

});
