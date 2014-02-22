var gameApp = angular.module('gameApp', ['ngRoute', 'ngAnimate']);

gameApp.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        controller: 'SplashController',
        templateUrl: '../html/splash.html'
    })
    .when('/error', {
        controller: 'ErrorController',
        templateUrl: '../html/error.html'
    })
    .when('/settings', {
        controller: 'SettingsController',
        templateUrl: '../html/settings.html'
    })
    .when('/menu', {
        controller: 'MenuController',
        templateUrl: '../html/menu.html'
    })
    .when('/singlePlayer', {
        controller: 'GameController',
        templateUrl: '../html/game.html'
    })
    .when('/multiPlayer', {
        controller: 'GameController',
        templateUrl: '../html/game.html'
    })
    .when('/help', {
        controller: 'HelpController',
        templateUrl: '../html/help.html'
    })
    .when('/about', {
        controller: 'AboutController',
        templateUrl: '../html/about.html'
    })
    .otherwise({ redirectTo: '/menu' });
});


document.addEventListener('DOMContentLoaded', function(e) {
    // Attach the event to the close button on the main form
    // The main form is not tied to a controller
    var closeButton = document.querySelector('#close-button');

    closeButton.addEventListener('click', function(e) {
        window.close();
    });
});
