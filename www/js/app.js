// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('login', {
    url: '/',
    controller: 'GameCtrl',
    templateUrl: 'templates/login.html'
  })
  .state('game', {
    url: '/game',
    controller: 'GameCtrl',
    templateUrl: 'templates/game.html'
  })


});

app.factory('Socket', function ($rootScope) {
  var socket = io.connect("http://bwactle-keysim.c9users.io:8080/");
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.controller('GameCtrl',function($scope,$location, Socket){

  Socket.on('players',function(data){
    console.log(data);
  });

  Socket.on('info',function(data){
    console.log("Info serveur");
    console.log(data);
  });

  Socket.on('message',function(data){
    console.log("Message serveur");
    console.log(data);
  });

  var objectWithApiKey = function(key,val){
    var obj = {
      "key": "def7487b11a56cbcbd2348b0edfe113c"
    }

    if(key) obj[key] = val;

    return obj;
  }

  $scope.launch = function(pseudo){
    Socket.emit('login',objectWithApiKey("login",pseudo));
    $location.path('/game');
  }

  $scope.move = function(direction){
    Socket.emit('move', objectWithApiKey("direction",direction))
  }

  $scope.attack = function(){
    Socket.emit('attack', objectWithApiKey(null,null));
  }
});
