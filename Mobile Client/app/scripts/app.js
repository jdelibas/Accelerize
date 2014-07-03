'use strict';
/* global StatusBar */

angular.module('Accelerize', ['ionic','Accelerize-Controllers','Accelerize-Services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
