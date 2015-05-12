
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require underscore
//= require backbone
//= require handlebars
//= require_self
//= require_tree ./backbone/routers
//= require_tree ./backbone/models
//= require_tree ./backbone/collections
//= require_tree ./backbone/views
//= require_tree ./templates
//= require_tree .
var App = {
	Models: {}, 
	Collections: {}, 
	Views: {}, 
	Routers: {}
};

$(function() {
	console.log('APP UP');
	
	var mapOptions = {
		zoom: 5,
		center: new google.maps.LatLng(40, -80.5),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	$('#calc').on('click', 'button', calcRoute);

	// App.plazasCollection = new App.Collections.Plazas();
	// App.plazasCollection.fetch();
	// App.tollsCollection = new App.Collections.Tolls();
	// App.tollsCollection.fetch();

	// App.router = new App.router();
	// Backbone.history.start();
});

var calcRoute = function() {
    clearBoxes();
	
	//Marker
    var myLatlng = new google.maps.LatLng(39.682395, -75.498417)		
	marker = new google.maps.Marker({
   	 	position: myLatlng,
    	title:"Hello World!"
	});

	//RouteBoxer
	routeBoxer = new RouteBoxer();


	//Directions Request
	var start = document.getElementById('start').value;
	var end   = document.getElementById('end').value;
	var request = {
		origin: start,
		destination: end,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('directions-panel'));

	directionsService = new google.maps.DirectionsService();
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			
			var distance = parseFloat(1/20);
			var path = response.routes[0].overview_path;
			var boxes = routeBoxer.box(path, distance);
			drawBoxes(boxes);
			// for (var i = 0; i < boxes.length; i++) {
			// 	var bounds = boxes[i];
			//  marker.setMap(map);
			// }
			// for (var i = 0; i < boxes.length; i++) {
			// 	if ( 
			// 		   boxes[i].Ea.j < tollLat
			// 		&& boxes[i].Ea.A > tollLat
			// 		&& boxes[i].wa.j < tollLng
			// 		&& boxes[i].wa.A > tollLng )
			// }
		} else {
			alert("Directions query failed: " + status);
		}
	});
}





