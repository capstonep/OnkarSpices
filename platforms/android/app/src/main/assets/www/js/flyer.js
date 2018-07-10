angular.module('routerApp').controller('flyerController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.mainPage = function(){
		$state.go('main');
	}
	
}]);