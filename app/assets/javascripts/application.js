
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

	// Sets default map view
	mapOptions = {
		zoom: 5,
		center: new google.maps.LatLng(38.803057, -80.527466),
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};

	//Grabs div in which map will be displayed, provides default view
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);	

});

	var calcRoute = function() {	
		// Defining the necessary variables for GoogleMaps and RouteBoxer
		var routeBoxer = new RouteBoxer();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var directionsService = new google.maps.DirectionsService();
	
		//RouteBoxer function
		clearBoxes();

		//Directions request begins by grabbing user input values
		start = document.getElementById('start').value;
		end   = document.getElementById('end').value;
  	    		
		//Necessary paramaters for directions request
		var request = {
			  origin: start,
			  destination: end,
			  travelMode: google.maps.TravelMode.DRIVING
			};

		//Sets the div in which the map with directions will be rendered
		directionsDisplay.setMap(map);

		//Sets the div in which the directions text will be rendered
		directionsDisplay.setPanel(document.getElementById('directions-panel'));

		//Directions function
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			

			//Variables set to determine direction of the route
				originLat = response.routes[0].legs[0].start_location.A
				originLng = response.routes[0].legs[0].start_location.F
				destLat = response.routes[0].legs[0].end_location.A
				destLng = response.routes[0].legs[0].end_location.F

			//Variables set for box calculations and drawing
				var distance = parseFloat(1/10);
				var path = response.routes[0].overview_path;
				boxes = routeBoxer.box(path, distance);
				drawBoxes(boxes);
						
			} else { 
				alert("Directions query failed: " + status);
			  }
		});
		// $('#control').append('<button id="show-tolls">Show Tolls</button>');
	};

// Draws boxes covering the entire route
// Box coordinates and size are calculated during the Directions Service request
	var drawBoxes = function(boxes) {
		boxpolys = new Array(boxes.length);
		for (var i = 0; i < boxes.length; i++) {
			boxpolys[i] = new google.maps.Rectangle({
				bounds: boxes[i],
				fillOpacity: 0,
				strokeOpacity: .7,
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
	
	//Setting empty arrays for future logic and calculations
	var tollArr = []
	var tollAmtS = []
	var tollAmtN = []
	var tollBar = document.getElementById('toll-bar');
	
	//Retrives toll information from the database
	var tollCall = function() {
		$.get('/tolls')
		 .success(function(tolls) {
		
		// Logic to determine if a toll exists within the route
		// Determines if the toll lat/long are within the boundaries of any box
			for (var t = 0; t < tolls.length; t++) {
			  for (var i = 0; i < boxes.length; i++) {

			    if ( boxes[i].za.j > tolls[t].latitude 
			      && boxes[i].za.A < tolls[t].latitude 
			      && boxes[i].ra.j < tolls[t].longitude 
			      && boxes[i].ra.A > tolls[t].longitude ){
			    //Dividing info into pertinent arrays
			    //Important to separate tolls paid going north vs. south	
			    	tollArr.push(tolls[t]);
			    	tollAmtS.push(tolls[t].s_amount);
			    	tollAmtN.push(tolls[t].n_amount);
				} 
				else { console.log('GOSH DARN IT') }	
			  }
			};

			//Logic for displaying toll amounts based on route direction
			for (var a = 0; a < tollArr.length; a++) {
				if (originLat > destLat ) {
					if (tollArr[a].s_amount > 0) {
				$('#toll-bar').append('<ul>'+tollArr[a].name+'</ul>'+'<li>Southbound: $'+tollArr[a].s_amount+'</li>')	
				}} else { 
					if (tollArr[a].n_amount > 0) {
						$('#toll-bar').append('<ul>'+tollArr[a].name+'</ul>'+'<li>Northbound: $'+tollArr[a].n_amount+'</li>') }}
		    
		    //Adds pins to tolls existing on the route
			
		    var image = 'https://lh5.googleusercontent.com/yFkBYo63yVcDjYf3GwIIhJE_3tZYY3nKumf3fcDdV6-vpYZ_5M9RKSCrBl-QWzVcgSu0HcynkFTMFvU=w1168-h658'
			var marker = new google.maps.Marker({
			    	position: new google.maps.LatLng(tollArr[a].latitude, tollArr[a].longitude),
			        map: map,
			        icon: image
			    });
		    };

		    //Calculating sum of all tolls paid, appending to div
		    var total = 0;	
			for (var b = 0; b < tollArr.length; b++ ) {
				if (originLat > destLat ) {
					total += tollArr[b].s_amount;
				} else { total += tollArr[b].n_amount }
			};
				$('#toll-bar').prepend('<ul id="toll-total">Total: $'+total+'</ul>')
				
		});
	};

