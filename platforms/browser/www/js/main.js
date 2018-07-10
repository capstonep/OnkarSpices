foodItemsArray = [];
angular.module('routerApp').controller('mainController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$(".optionBox").each(function(i) {
	    $(this).delay(100 * i).queue(function() {
	      $(this).addClass("animated bounceInLeft");
	      $(this).addClass("show");
	    })
	  })
	$scope.logout = function(){
		$state.go('login');
		localStorage.removeItem("orderItems");
	}
	$scope.cart = function(){
		$state.go('cart');
	}
	$scope.menuPage = function(){
		$state.go('menu');
	}
	$scope.settingsPage = function(){
		$state.go('settings');
	}
	$scope.flyerPage = function(){
		$state.go('flyer');
	}
	$scope.cardPage = function(){
		$state.go('card');
	}
}]);

angular.module('routerApp').controller('menuController', ['$scope', '$state', '$http', '$timeout', function ($scope, $state, $http, $timeout) {
	$(".loading").show();
	
	$http({
        method: "GET",
        url: "https://api.mlab.com/api/1/databases/stock-database/collections?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x"
    }).then(function mySuccess(response) {
        $scope.stockData = response.data;
		for (var i = 0; i < response.data.length; i++) {
            if (response.data[i] != "system.indexes") {
                $.ajax({
                    url: "https://api.mlab.com/api/1/databases/stock-database/collections/" + response.data[i] + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
                    type: "GET",
                    contentType: "application/json",
                    success: function(data) {
                        for (var j = 0; j < data.length; j++) {
                            var img_src = data[j].product_image;
                            if (img_src == undefined || img_src == "" || img_src == null) {
                                var img_src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png";
                            }
                            var html = '<li onclick="addToOrder(this)"><img src="' + img_src + '"><span class="prod_name">' + data[j].product_name + '</span><span class="price"> $' + data[j].product_price + '</span></li>'
                            $("#menu-list").append(html);
                        
                            
                        }
                        $("#menu-list li").each(function(i) {
                        	$(this).delay(100 * i).fadeIn(500).addClass("animated bounceInLeft");
						  })
                    }
                });
            }

        }
    }, function myError(response) {
    	$(".loading").hide();
    	$state.go('main');
    });

	$scope.back = function(){
		$state.go('main');
	}
	$scope.checkOut = function(){
		localStorage.setItem("orderItems", foodItemsArray);
		console.log(foodItemsArray.length);
		if(foodItemsArray.length != 0){
			$state.go('checkout');	
		}
		
	}
		
	$timeout( function(){
		foodItemsArray = [];
		if( localStorage.orderItems != undefined){
		var string = localStorage.orderItems;
		var array = string.split(",");
        for(var i = 0 ; i < array.length ; i++){
			$("#menu-list li").each(function(){
				if($(this).find(".prod_name").text() == array[i] && $(this).find(".price").text().replace("$", "") == array[i + 1]){
					$(this).addClass("selectedItem");
					foodItemsArray.push($(this).find(".prod_name").text(),$(this).find(".price").text().replace("$", ""));	
					var price = parseFloat($(this).find(".price").text().replace("$", ""));
					var prePrice = parseFloat($(".totalPrice .orignalPrice").text().replace("$", ""));
					var orignalPrice = (price + prePrice).toFixed(2);
					$(".totalPrice .orignalPrice").html("$"+orignalPrice);
					$(".loading").hide();
				}
			})
		}
	}
		console.log(foodItemsArray);
		$(".loading").hide();
    }, 5000 );
	
	
	
}]);


function addToOrder(e){
	if($(e).hasClass("selectedItem")){
		$(e).removeClass("selectedItem");
		var price = parseFloat($(e).find(".price").text().replace("$", ""));
		var prePrice = parseFloat($(".totalPrice .orignalPrice").text().replace("$", ""));
		var orignalPrice = (price - prePrice).toFixed(2);
		if(orignalPrice < 0){
			var orignalPrice = orignalPrice * -1;
		}
		$(".totalPrice .orignalPrice").html("$"+orignalPrice);
		var index = foodItemsArray.indexOf($(e).find(".prod_name").text());
		if(index > -1){
			foodItemsArray.splice(index,2);
		}
		
	}
	else{
		$(e).addClass("selectedItem");	
		var price = parseFloat($(e).find(".price").text().replace("$", ""));
		var prePrice = parseFloat($(".totalPrice .orignalPrice").text().replace("$", ""));
		var orignalPrice = (price + prePrice).toFixed(2);
		$(".totalPrice .orignalPrice").html("$"+orignalPrice);
		foodItemsArray.push($(e).find(".prod_name").text(),$(e).find(".price").text().replace("$", ""));
	}
	console.log(foodItemsArray);
}