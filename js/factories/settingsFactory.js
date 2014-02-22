gameApp.factory('settingsFactory', function(constFactory) {

    var factory = {};

    var playerName = "";
    var soundStatus = null;
    var soundVolume = "";
    var settingsSet = false;

    // These are helper methods
    function getValueOrDefault(value, defaultValue) {
        if (value == null || value == undefined) {
            return defaultValue;
        } else {
            return value;
        }
    }

    // This method updates the chrome storage
    function updateStorage(key, value) {

        var saveObj = {};
        saveObj[key] = value;

        if (settingsSet !== true) {
            settingsSet = true;
            saveObj["settingsSet"] = settingsSet;
        }

        chrome.storage.sync.set(saveObj, function() {});
    }

    factory.setAll = function (settingsObj) {
        settingsSet = settingsObj["Settings Set"];

        this.setPlayerName(settingsObj["Player Name"]);

        this.setSoundStatus(
            soundStatus = settingsObj["Sound Status"]);

        this.setSoundVolume(
            soundVolume = settingsObj["Sound Volume"]);
    };

    factory.getPlayerName = function() {
        return playerName;
    };

    factory.setPlayerName = function(name) {
        playerName = getValueOrDefault(name, constFactory.SETTING_NAME);
        updateStorage("playerName", playerName);
    };

    factory.getSoundStatus = function() {
        return soundStatus;
    };

    factory.setSoundStatus = function(status) {
        soundStatus = getValueOrDefault(status,
            constFactory.SETTING_SND_STATUS);
        updateStorage("soundStatus", soundStatus);
    };

    factory.getSoundVolume = function() {
        return soundVolume;
    };

    factory.setSoundVolume = function(volume) {
        soundVolume = getValueOrDefault(volume,
            constFactory.SETTING_SND_VOL);
        updateStorage("soundVolume", soundVolume);
    };

    return factory;

});
