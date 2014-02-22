gameApp.controller('SettingsController',
    function($scope, settingsFactory) {

        init();

        function init() {

            $scope.playerName = settingsFactory.getPlayerName();
            $scope.soundStatus = settingsFactory.getSoundStatus();
            $scope.soundVolume = settingsFactory.getSoundVolume();

            // Need a bit of jQuery use the switch and slider
            // Change this once slider and switch are ported
            // to Angular
            $('#SettingsSoundEnabled').bootstrapSwitch();
            $('#SettingsSoundVol').slider();

            // Set the default values on these controls
            $('#SettingsSoundEnabled').bootstrapSwitch(
                'setState', $scope.soundStatus);

            $('#SettingsSoundVol').slider('setValue', $scope.soundVolume);

            // Set event listeners
            $('#SettingsSoundEnabled').on('switch-change',
                function (e, data) {
                    $scope.soundStatus = data.value;
                }
            );

            $('#SettingsSoundVol').slider()
              .on('slideStop', function(ev) {
                $scope.soundVolume = ev.value;
            });
        }

        $scope.saveSettings = function() {

            // Save the attributes to chrome storage and update the settings
            settingsFactory.setPlayerName($scope.playerName);
            settingsFactory.setSoundStatus($scope.soundStatus);
            settingsFactory.setSoundVolume($scope.soundVolume);
        }
    }
);
