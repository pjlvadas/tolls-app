
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
	$('#calc').on('click', 'button', calcRoute);

	var mapOptions = {
		zoom: 5,
		center: new google.maps.LatLng(40, -80.5),
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var routeBoxer = new RouteBoxer();
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();	


	var calcRoute = function() {
	debugger;
		//RouteBoxer
		clearBoxes();

		//Directions Request
		var start = document.getElementById('start').value;
		var end   = document.getElementById('end').value;
		var request = {
			  origin: start,
			  destination: end,
			  travelMode: google.maps.TravelMode.DRIVING
			};

		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById('directions-panel'));

		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				
				var distance = parseFloat(1/20);
				var path = response.routes[0].overview_path;
				var boxes = routeBoxer.box(path, distance);
				drawBoxes(boxes);

				// for (var i = 0; i < boxes.length; i++) {
				// 		var nBound = boxes[i].Ea.j;
				// 		var sBound = boxes[i].Ea.A;
				// 		var wBound = boxes[i].wa.j;
				// 		var eBound = boxes[i].wa.A;
				// 	if ( nBound < tollLat && sBound > tollLat && wBound < tollLng && eBound > tollLng ) {
						
				// 	}
				// }
			} 
			else { alert("Directions query failed: " + status);
			}
		});
	};

	var drawBoxes = function(boxArray) {
		boxpolys = new Array(boxArray.length);
		for (var i = 0; i < boxArray.length; i++) {
			boxpolys[i] = new google.maps.Rectangle({
				bounds: boxArray[i],
				fillOpacity: 0,
				strokeOpacity: 1.0,
				strokeColor: '#000000',
				strokeWeight: 1,
				map: map
			});
		}
	};

	var clearBoxes = function() {
		if (boxpolys != null) {
			for (var i = 0; i < boxpolys.length; i++ ) {
				boxpolys[i].setMap(null);
			};
		}
		boxpolys = null;
	};

	var tollCall = function() {
		$.get('/tolls')
		.done(function(tolls) {

		})
	};


});





