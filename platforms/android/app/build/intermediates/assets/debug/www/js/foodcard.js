angular.module('routerApp').controller('foodcardController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.mainPage = function(){
		$state.go('main');
	}
	
}]);