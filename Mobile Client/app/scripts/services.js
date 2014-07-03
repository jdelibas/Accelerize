'use strict';

angular.module('Accelerize-Services', [])

.service('accelerometer', function() {

  this.get = function(callback){
    if(typeof(cordova) !== 'undefined'){
      navigator.accelerometer.watchAcceleration(
        function(success){
          //console.log(success);
          callback(success);
        },
        function(err){
          console.log(err);
        },{
          frequency: 100
        });
    } else {
      console.log('No cordova, run on mobile.');
    }
  };

})

.service('server', function() {

  this.load = function(url, callback){

    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url + '/socket.io/socket.io.js';

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);

  };

});