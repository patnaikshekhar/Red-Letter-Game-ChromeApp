gameApp.controller('SplashController',
    function($rootScope, $scope, $http, $location, $q, $window,
        gameFactory, constFactory, settingsFactory) {

    var imgObj = {};
    var soundObj = {};
    var dictObj = {};
    var settingsObj = {};

    init();

    // These function fetch the images sound and assets
    function fetchImages(key, value, assetObj, resolve, reject) {
        assetObj[key] = new Image();
        assetObj[key].src = value;

        assetObj[key].onload = function() {
            resolve();
        }

        assetObj[key].onerror = function() {
            reject();
        }
    }

    function fetchSounds(key, value, assetObj, resolve, reject) {
        $http.get(value, {responseType: 'arraybuffer'}).success(
        function(blob) {
            $rootScope.audioContext.decodeAudioData(
                blob, function(buffer) {
                assetObj[key] = buffer;
                resolve();
            }, function() {
                reject();
            });
        }).error(function() {
            reject();
        });
    }

    function fetchAssets(key, value, assetObj, resolve, reject) {
        $http.get(value).success(
        function(data) {
            assetObj[key] = data;
            resolve();
        }).error(function() {
            reject();
        });
    }

    function fetchSettings(key, value, assetObj, resolve, reject) {
        chrome.storage.sync.get(value, function(items) {
                assetObj[key] = items[value];
                resolve();
            }
        );
    }

    // This function loads assets into the factory objects
    function loadAssets(assets, assetObj, dataFetchFn,
        progressCallback) {

        var promises = [];

        angular.forEach(assets, function(value, key) {

            var def = $q.defer();
            var promise = def.promise;

            promise.then(function() {
                progressCallback();
            });

            promises.push(promise);

            resolveDefer = function () {
                if(!$scope.$$phase) {
                    $scope.$apply(function() {
                        def.resolve();
                    });
                } else {
                    def.resolve();
                }
            }

            rejectDefer = function() {
                if(!$scope.$$phase) {
                    $scope.$apply(function() {
                        def.reject();
                    });
                } else {
                    def.reject();
                }
            }

            dataFetchFn(key, value, assetObj, resolveDefer, rejectDefer);

        });

        return promises;
    }

    function progressCallback() {
        $scope.progress += 1;
        var length = Object.keys(constFactory.images).length +
            Object.keys(constFactory.sounds).length +
            Object.keys(constFactory.assets).length +
            Object.keys(constFactory.settings).length;

        $scope.progressBar = (($scope.progress / length) * 100);
    }

    function successCallback() {

        // Set the Objects on the respective factories
        gameFactory.setAssets(imgObj, soundObj, dictObj);
        settingsFactory.setAll(settingsObj);

        if (settingsObj["Settings Set"] === true) {
            $location.path('menu');
        } else {
            $location.path('settings');
        }
    }

    function errorCallback() {
        $rootScope.errorMessage = constFactory.LOAD_ERROR_MSG;
        $location.path('error');
    }

    function init() {

        // This sets the load progress to 0
        $scope.progress = 0;
        $scope.progressBar = 0;

        // Initalize the Audio
        $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;
        $rootScope.audioContext = new AudioContext();

        // Start the asset load process
        var imgPromises = loadAssets(constFactory.images, imgObj,
            fetchImages, progressCallback);

        var soundPromises = loadAssets(constFactory.sounds, soundObj,
            fetchSounds, progressCallback);

        var assetPromises = loadAssets(constFactory.assets, dictObj,
            fetchAssets, progressCallback);

        var settingsPromises = loadAssets(constFactory.settings, settingsObj,
            fetchSettings, progressCallback);

        var allPromises = imgPromises.concat(soundPromises).
            concat(assetPromises).concat(settingsPromises);

        $q.all(allPromises).then(
            function() {
                successCallback();
            }, function() {
                errorCallback();
            }
        );
    }
});
