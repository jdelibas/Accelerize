'use strict';
/* global io */
angular.module('Accelerize-Controllers', [])

.controller('index-controller', function($scope, $rootScope, accelerometer, server) {
	$scope.accData = {};
	$scope.serverStatus = 'Not Connected';
	$scope.serverReady = false;
	$scope.submitServer = 'http://192.168.0.3:1337';

	accelerometer.get(function(data){
		if(!$rootScope.$$phase){
			$rootScope.$apply(function() {
				$scope.accData = data;
			});
		}

		if($scope.serverReady === true){
			$scope.socket.emit('Accelerize', { acceleration: $scope.accData },function(){});
		}
	});

	$scope.submit = function(url){
		console.log(url);
		server.load(url,function(){
			console.log('loaded');
			$scope.socket = io.connect(url);

			if(!$rootScope.$$phase){
				$rootScope.$apply(function() {
					$scope.serverStatus = 'Connected';
				});
			}

			$scope.serverReady = true;
			$scope.socket.emit('Accelerize', { msg: 'Mobile has connected' },
				function(){});
		});
	};

	$scope.disconnect = function(){
		$scope.socket.disconnect();
		if(!$rootScope.$$phase){
			$rootScope.$apply(function() {
				$scope.serverStatus = 'Disconnected';
			});
		}
	};

});