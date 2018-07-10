angular.module('routerApp').controller('checkOutController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
	$(".loading").show();
	$scope.back = function(){
		$state.go('menu');
	}
	var username = localStorage.username;
	$.ajax({
        url: "https://api.mlab.com/api/1/databases/client/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            var firstname = $("#firstname").val(data[0].firstname);
		    var contact = $("#contact").val(data[0].contact);
		    var streetName = $("#streetName").val(data[0].streetName);
		    var housenumber = $("#housenumber").val(data[0].housenumber);
		    var city = $("#city").val(data[0].city);
		    var zip = $("#zip").val(data[0].zip);
		    $(".loading").hide();
        }
    });
	var string = localStorage.orderItems;
	var array = string.split(",");

	for(var i = 0 ; i < array.length ; i++){
		var html = '<div class="prod">';
			html += '			<h6>'+array[i]+'</h6>';
			html += '			<span>Quantity: </span><input type="number" value="1" class="form-control" id="quantity" onkeyup="multiplyQuantity(this)">';
			html += '			<span class="amount">'+array[i+1]+'</span>';
			html += '		</div>';
			$("#orderedItems .secondDiv").append(html);
		i++;
	}
	start();
	$scope.confirmOrder = function(){
		var lastConfirmedItems = []
		var orderName = $("#orderName").val();
		var username = localStorage.username;
		if(orderName == "" || orderName == null || orderName == undefined){
			$("#orderName").addClass("error");
		}
		else{
			$(".secondDiv .prod").each(function(){
				var prod_name = $(this).find("h6").text();
				lastConfirmedItems.push(prod_name);
				var prod_quantity = $(this).find(".form-control").val();
				lastConfirmedItems.push(prod_quantity);
				var prod_price = $(this).find(".amount").text();
				lastConfirmedItems.push(prod_price);
			})
			lastConfirmedItems.push("Order Amount");
			lastConfirmedItems.push("--");
			lastConfirmedItems.push($(".prod .orderAmount").text());
			lastConfirmedItems.push("HST (13%)");
			lastConfirmedItems.push("--");
			lastConfirmedItems.push($(".prod .hstAmount").text());

			lastConfirmedItems.push("Final Amount");
			lastConfirmedItems.push("--");
			lastConfirmedItems.push($(".prod .finalAmount").text());
			console.log(lastConfirmedItems);
			var firstname = $("#firstname").val();
		    var contact = $("#contact").val();
		    var streetName = $("#streetName").val();
	    var housenumber = $("#housenumber").val();
	    var city = $("#city").val();
	    var zip = $("#zip").val();
			$(".loading").show();
			if(firstname == "" || firstname == undefined || firstname == null ||
				contact == "" || contact == undefined || contact == null ){
				alert("Please Enter Required Data !!")
			}else{
				$.ajax({
	                url: "https://api.mlab.com/api/1/databases/booked-orders/collections/" + username + "?apiKey=i9w9qf8oKzBj9x1vB_Cmb4W0li9JCI1x",
	                data: JSON.stringify({
	                    "orderItems": lastConfirmedItems,
	                    "username":username,
	                    "contact_name":firstname,
	                    "conatct_number":contact,
	                    "streetName":streetName,
	                    "housenumber": housenumber,
	                    "city": city,
	                    "zip":zip,
	                    "orderName":orderName,
	                    "orderStatus":"new",
	                }),
	                type: "POST",
	                contentType: "application/json",
	                success: function (data) {
	                    $state.go('confirmOrder');
	                    $(".loading").hide();
	                    localStorage.removeItem("orderItems");
	                }
	            });
			}
			
		}
	}
}]);

function multiplyQuantity(e){
	
	var string = localStorage.orderItems;
	var array = string.split(",");
	var incAmoutn = $(e).val();
	if(incAmoutn == "" || incAmoutn == undefined){
		var incAmoutn = 0;
	}
	var newAmount = (array[$(e).parent().index() + ($(e).parent().index() + 1)] * incAmoutn).toFixed(2);
	$(e).parent().find(".amount").html(newAmount);
	$("#totalAmount .orderAmount").text(0)
	start();
}

function start(){
	
	$("#orderedItems .prod .amount").each(function(){

		var price = parseFloat($(this).text());
		var prePrice = parseFloat($("#totalAmount .orderAmount").text());
		var orignalPrice = (price + prePrice).toFixed(2);
		//console.log(price+"+"+prePrice+"="+orignalPrice);
		$(" .orderAmount").html(orignalPrice);
	});
	var orderAmount = parseFloat($(" .orderAmount").text());
	var deliveryCharge = parseFloat($(" .deliveryAmount").text());
	var total = orderAmount + deliveryCharge;
	var hst = ((13 * total)/100).toFixed(2);
	$(" .hstAmount").html(hst);

	var hstAmount = parseFloat($(" .hstAmount").text());
	var amountToPay = (orderAmount + deliveryCharge + hstAmount).toFixed(2);
	$(" .finalAmount").html(amountToPay);
}