gameApp.controller('MenuController',
    function($rootScope, $scope, constFactory, gameFactory) {


    // This function plays a sound.
    $scope.playSound = function() {

        gameFactory.playSound($rootScope.audioContext,
            constFactory.SOUND_MENU_BUTTON_CLICK);
    };

    $scope.singlePlayer = function() {

        $rootScope.gameType = constFactory.TYPE_SINGLE_PLAYER;
        this.playSound();
    }

    $scope.multiPlayer = function() {

        $rootScope.gameType = constFactory.TYPE_MULTI_PLAYER;
        this.playSound();
    }
});
