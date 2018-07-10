

document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    //
function onDeviceReady() {
    window.FirebasePlugin.getToken(function(token) {
		// save this server-side and use it to push notifications to this device
		console.log(token);
	}, function(error) {
	    console.log(error);
	});
}