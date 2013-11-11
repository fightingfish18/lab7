//William Smyth May
//2013-11-11
//This is JavaScript file for lab 7
//creates and populates the google map on the earthquake page

/* earthquakes.js
    Script file for the INFO 343 Lab 7 Earthquake plotting page

    SODA data source URL: https://soda.demo.socrata.com/resource/earthquakes.json
    app token (pass as '$$app_token' query string param): Hwu90cjqyFghuAWQgannew7Oi
*/

//create a global variable namespace based on usgs.gov
//this is how JavaScript developers keep global variables
//separate from one another when mixing code from different
//sources on the same page
var gov = gov || {};
gov.usgs = gov.usgs || {};

//base data URL--additional filters may be appended (see optional steps)
//the SODA api supports the cross-origin resource sharing HTTP header
//so we should be able to request this URL from any domain via AJAX without
//having to use the JSONP technique
gov.usgs.quakesUrl = 'https://soda.demo.socrata.com/resource/earthquakes.json?$$app_token=Hwu90cjqyFghuAWQgannew7Oi';

//current earthquake dataset (array of objects, each representing an earthquake)
gov.usgs.quakes;

//reference to our google map
gov.usgs.quakesMap;

//AJAX Error event handler
//just alerts the user of the error
$(document).ajaxError(function(event, jqXHR, err){
    alert('Problem obtaining data: ' + jqXHR.statusText);
});

//Window.onload function
$(function() {
	$('.message').html('Loading... <img src="img/loading.gif">'); //Loading icon while JSON request is made
	getQuakes(); //calls function for obtaining JSON and creating the map
});

//This function makes and processes the JSON request
function getQuakes() {
	$.getJSON(gov.usgs.quakesUrl, function(quakes) {
		$('.message').html('Displaying ' + quakes.length + ' earthquakes');
		gov.usgs.quakesMap = new google.maps.Map($('.map-container')[0], {
			center: new google.maps.LatLng(0,0),
			zoom: 2,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			streetViewControl: false
		});
		addQuakeMarkers(quakes, gov.usgs.quakesMap); //adds markers for each quake
	});
	
//This function adds markers to the Google maps object
function addQuakeMarkers(quakes, map) {
	for (var i = 0; i < quakes.length; i++) {
		var quake = quakes[i];
		if (quake.location) { //Verifies that latitude and longitude are provided for the given quake
			quake.mapMarker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(quake.location.latitude, quake.location.longitude)
			});
		}
		var infoWindow = new google.maps.InfoWindow({ //Info window for users to click
			content: new Date(quake.datetime).toLocaleString() + ': magnitude ' + quake.magnitude + ' at depth of ' + quake.depth + ' meters'
		});
		registerInfoWindow(map, quake.mapMarker, infoWindow); //applies the info window to each marker
	}
}

//Opens the info window when the marker is clicked
function registerInfoWindow(map, marker, infoWindow) {
	google.maps.event.addListener(marker, 'click', function() {
		if (gov.usgs.iw) { //if another window is open, it will be closed.
			gov.usgs.iw.close();
		}
		gov.usgs.iw = infoWindow;
		infoWindow.open(map, marker);
	});
}
		

