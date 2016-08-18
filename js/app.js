// Define the `app` module
var app = angular.module('app', [ 'ngWebSocket' ]);

app.factory('WSFactory', function($websocket) {
	// Open a WebSocket connection
	var ws = $websocket('ws://echo.websocket.org/');
	var collection = [];

	ws.onOpen(function() {
		console.log('connection open');
		ws.send({
			message: "On Open Test"
		});
	});

	ws.onError(function(event) {
		console.log('connection Error', event);
	});

	ws.onMessage(function(event) {
		console.log('message: ', event);
		console.log(event.data);
		collection.push(JSON.parse(event.data));
		console.log(collection);
	});

	return {
		collection : collection,
		status : function() {
			return ws.readyState;
		},
		send : function(payload) {
			if (angular.isString(payload)) {
				ws.send(payload);
			} else if (angular.isObject(payload)) {
				ws.send(JSON.stringify(payload));
			}
		},

	};
});

app.controller('PayloadController', function($scope, WSFactory) {
	$scope.payload = {
		message : ""
	};
	$scope.sendPayload = function() {
		WSFactory.send($scope.payload);
		$scope.payload = {
			message : ""
		};
	}
	$scope.output = WSFactory.collection;
});