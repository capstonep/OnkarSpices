angular.module('routerApp').controller('cartController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$scope.mainPage = function(){
		$state.go('main');
	}
	$scope.refreshPage = function(){
		$("#allOrders").html("");
		var username = localStorage.username;
		$.ajax({
	        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
	        type: "GET",
	        contentType: "application/json",
	        success: function (data) {
	        	if(data.length == 0){
	        		$state.go('main');
	        		$(".loading").hide();
	        	}else{
	        		for(var i = 0 ; i < data.length ; i++){
		            	var finalPrice = data[i].orderItems.length - 1;
		            	var html = '<li>';
							html +='<span class="orderStatus">'+data[i].orderName+'</span>';
							html +='<span class="amountToBePaid">$'+data[i].orderItems[finalPrice]+'</span>';
							html +='<hr>';
							html +='Status: <span class="status">'+data[i].orderStatus+'</span><br>';
							html +='<span>If you want to delete order please call to Onkar Foods !!</span>';
							html +='</li>';
						$("#allOrders").append(html);
						$(".loading").hide();
		            }
	        	}
	            
	        }
	    });
	}
	$(".loading").show();
	$("#allOrders").html("");
	var username = localStorage.username;
	$.ajax({
        url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
        	if(data.length == 0){
        		$state.go('main');
        		$(".loading").hide();
        	}else{
        		for(var i = 0 ; i < data.length ; i++){
	            	var finalPrice = data[i].orderItems.length - 1;
	            	var html = '<li>';
						html +='<span class="orderStatus">'+data[i].orderName+'</span>';
						html +='<span class="amountToBePaid">$'+data[i].orderItems[finalPrice]+'</span>';
						html +='<hr>';
						html +='Status: <span class="status">'+data[i].orderStatus+'</span>';
						html +='</li>';
					$("#allOrders").append(html);
					$(".loading").hide();
	            }
        	}
            
        }
    });
}]);