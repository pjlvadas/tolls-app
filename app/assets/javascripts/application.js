
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
		// var icons = {
		// 	start: new google.maps.MarkerImage(
		// 		'https://lh3.googleusercontent.com/pTGdUa6U45dAk24bGVRMzqLrTOYqPc4IcAj9zj0dNUmEDRf2JuDaaiGwugU-SBtxh3Q-jxhLlpe5Op8=w1379-h658',
		// 		new google.maps.Size(44,32),
		// 		new google.maps.Point(0,0),
		// 		new google.maps.Point(22,32)),
		// 	end: new google.maps.MarkerImage(
		// 		'https://lh5.googleusercontent.com/TTHZMmll0-fbwHMKqgF-JBIxT7ThXMyLZQ3yX4TQ0_EC-tFFjY3Yg-2FYDfHUEnMNtmpGzsqVEsKzE8=w1379-h658',
		// 		new google.maps.Size(44,32),
		// 		new google.maps.Point(0,0),
		// 		new google.maps.Point(22,32)
		// 		)
		// };
		//Directions function
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			
			//Origin/Destination Icons	
				// new google.maps.Marker({
				// 	map: response.routes[0].legs[0].start_location, 
				// 	icon: icons.start, 
				// 	title: 'Origin'
				// });
				// new google.maps.Marker({
				// 	map: response.routes[0].legs[0].end_location, 
				// 	icon: icons.end, 
				// 	title: 'Destination'
				// });
			

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
				debugger;
						
			} else { 
				alert("Directions query failed: " + status);
			  }
		});
		// $('#control').append('<button id="show-tolls">Show Tolls</button>');
	};

	// var makeMarker = function(position, icon, title) {
	// 	new google.maps.Marker({
	// 		map: map,
	// 		icon: icon,
	// 		title: title
	// 	});
	// }


// Draws boxes covering the entire route
// Box coordinates and size are calculated during the Directions Service request
	var drawBoxes = function(boxArray) {
		boxpolys = new Array(boxArray.length);
		for (var i = 0; i < boxArray.length; i++) {
			boxpolys[i] = new google.maps.Rectangle({
				bounds: boxArray[i],
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
			    if ( boxes[i].Da.j > tolls[t].latitude 
			      && boxes[i].Da.A < tolls[t].latitude 
			      && boxes[i].va.j < tolls[t].longitude 
			      && boxes[i].va.A > tolls[t].longitude ){
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
				$('#toll-bar').append('<ul>'+tollArr[a].name+'</ul>'+'<li>Southbound: $'+tollArr[a].s_amount+'</li>')	
				} else { $('#toll-bar').append('<ul>'+tollArr[a].name+'</ul>'+'<li>Northbound: $'+tollArr[a].n_amount+'</li>') }
		    
		    //Adds pins to tolls existing on the route
			
		    var image = 'https://lh5.googleusercontent.com/jMrZunZEoKSDTmz6aYAnzFuNg5dDMn4RSB-6CSHr5jMctS-9SXbI9ZYLfwfHVxPQiz16Hr88_bFCZ3c=w989-h658'
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

