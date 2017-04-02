/*
module.exports = {
	//var x = document.getElementById("demo");

	foo: function getLocation() {
		return 5;
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition);
	        return 3;
	    } else { 
	    	return 4;
	        //x.innerHTML = "Geolocation is not supported by this browser.";
	    }
	},

	bar: function showPosition(position) {
	    //x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
		console.log("this is working!");
		return position.coords.latitude;
	}

};
*/

(function() {
    var noGeolocation = function() {
        alert("For some reason we are unable to find your location. Sorry.");
    };

    if (!navigator.geolocation || !document.querySelector) {
        noGeolocation();
    }
    else {
        navigator.geolocation.getCurrentPosition(
            function(p) {
                document.querySelector("[name='latitude']").value = p.coords.latitude;
                document.querySelector("[name='longitude']").value = p.coords.longitude;
                document.querySelector("[type='submit']").removeAttribute("disabled");
            },
            function(err) {
                noGeolocation();
            }
        );
    }
})();