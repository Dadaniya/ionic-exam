// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'service', 'directive'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,$httpProvider) {
        $httpProvider.defaults.useXDomain=true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $ionicConfigProvider.platform.android.tabs.position("bottom");
        $ionicConfigProvider.tabs.style('standard');//有的android手机tabs跑到了顶部，而在ios或者ipad上tabs还是在底部的，
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html'
                    }
                }
            })

            .state('app.home', {
                url: '/home',
              cache:false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('exam', {
                url: '/exam/:offset/:num/:category',
                cache:'false',
                templateUrl: 'templates/exam.html',
                controller: 'ExamCtrl'

            })
          .state('subscript',{
            url:'/subscript',
            templateUrl:'templates/subscript.html',
            controller:'SubscriptCtrl',
          })


        // if none of the above states are matched
        $urlRouterProvider.otherwise('/app/home');
    });
