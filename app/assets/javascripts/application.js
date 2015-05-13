
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

var boxpolys;
var map;

$(function() {
	console.log('APP UP');
	$('#calc').on('click', calcRoute);
	$('#show-tolls').on('click', tollCall);
	$('#toll-bar').hide;

	var mapOptions = {
		zoom: 5,
		center: new google.maps.LatLng(40, -80.5),
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);	

});

	var calcRoute = function() {
		// var allTolls = tollCall();
		var routeBoxer = new RouteBoxer();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var directionsService = new google.maps.DirectionsService();
	
		//RouteBoxer
		clearBoxes();

		//Directions Request
		start = document.getElementById('start').value;
		end   = document.getElementById('end').value;
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
				
				originLat = response.routes[0].legs[0].start_location.A
				originLng = response.routes[0].legs[0].start_location.F
				destLat = response.routes[0].legs[0].end_location.A
				destLng = response.routes[0].legs[0].end_location.F

				var distance = parseFloat(1/10);
				var path = response.routes[0].overview_path;
				boxes = routeBoxer.box(path, distance);
				drawBoxes(boxes);
						
			} else { 
				alert("Directions query failed: " + status);
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
	
	var tollArr = []
	var tollAmtS = []
	var tollAmtN = []
	var tollBar = document.getElementById('toll-bar');
	var tollCall = function() {
		$.get('/tolls')
		 .success(function(tolls) {
			for (var t = 0; t < tolls.length; t++) {
			  for (var i = 0; i < boxes.length; i++) {
			    if ( boxes[i].Ea.j > tolls[t].latitude 
			      && boxes[i].Ea.A < tolls[t].latitude 
			      && boxes[i].va.j < tolls[t].longitude 
			      && boxes[i].va.A > tolls[t].longitude ){
			    	tollArr.push(tolls[t]);
			    	tollAmtS.push(tolls[t].s_amount);
			    	tollAmtN.push(tolls[t].n_amount);
				} 
				else { console.log('GOSH DARN IT') }	
			  }
			}
			$('#toll-bar').prepend('<ul>YOUR TOLLS</ul>');
			for (var a = 0; a < tollArr.length; a++) {
				if (originLat > destLat ) {
				$('#toll-bar').append('<ul>'+tollArr[a].name+'</ul>'+'<li>Southbound: $'+tollArr[a].s_amount+'</li>')	
				} else { $('#toll-bar').append('<ul>'+tollArr[a].name+'</ul>'+'<li>Northbound: $'+tollArr[a].n_amount+'</li>') }
		    	marker = new google.maps.Marker({
		    		position: new google.maps.LatLng(tollArr[a].latitude, tollArr[a].longitude),
		        	map: map
		      	});
			};	
		});
	};

