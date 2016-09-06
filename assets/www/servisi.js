var map;
var marker = [];
var zadnjaLokacija = [];
var watchid;
var reviewsPlaces = [];
var token;

function onDeviceReady() {
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;        
	//prikaz posljednjih login podataka
	document.getElementById('username').value= window.localStorage.getItem("username");
	document.getElementById('password').value= window.localStorage.getItem("password");
	document.addEventListener("backbutton", onBackKeyDown, false);
}
function onBackKeyDown () {
	if ($.mobile.activePage.is('#index')){
		navigator.notification.confirm( 'Da li želite odustati od aplikacije?', AlertConfirmed, 'eTourist', ["Ne", "Odustani"]); 
	}
	else {
		navigator.app.backHistory();
	}
}
function AlertConfirmed(buttonIndex) {
	if(buttonIndex==1){
		navigator.app.backHistory();
	}else if (buttonIndex==2){
		navigator.app.exitApp();
	}
}

function login(){
	//preuzimanje vrijednosti
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	if(username != '' && password!= '') {
		//spasavanje login podataka u cache, za iduće pokretanje aplikacije
		window.localStorage.setItem("username", username);
		window.localStorage.setItem("password", password);
	}
	s_prijava(username, password);
}

function IdiNaPocetnu(){
	$.mobile.changePage("#vacancy");
}

function idiNaVacancy() {
	$.mobile.changePage("#vacancyView");
}

function s_prijava(us, ps) {
	var markers = '{ "username":"' + us + '","password":"' + ps + '"}';

	$.ajax({
		type: "POST",
		url: "https://e-tourist-api.herokuapp.com/login",
		// The key needs to match your method's input parameter (case-sensitive).
		data: markers,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data)
		{
			//alert(JSON.stringify(data))
			var username = data.username;
			token = data.token;
			IdiNaPocetnu();
		},
		error: function(errMsg) {
			alert (JSON.stringify(errMsg));    
		}
	});
}

function provjeraInterneta() {
	$.get( "https://e-tourist-api.herokuapp.com/status", function( data ) {
		alert(data);
	});
}

function register() {
	//validirajRegistraciju(username, password, firstname, lastname, image, email, displayname, address, phonenumber)
	var username = document.getElementById('usernamer').value;
	var password = document.getElementById('passwordr').value;
	var firstname = document.getElementById('firstname').value;
	var lastname = document.getElementById('lastname').value;
	var email = document.getElementById('emailr').value;
	var displayname = document.getElementById('displayname').value;
	var address = document.getElementById('address').value;
	var phonenumber = document.getElementById('phonenumber').value;
	var image = "";
	s_register(username, password, firstname, lastname, image, email, displayname, address, phonenumber);
}

function s_register(username, password, firstname, lastname, img, email, displayname, address, phonenumber) {
	var image = "data:image/png;base64,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";
	var markers = '{ "username":"' + username + '","password":"' + 
	password + '","firstName":"' + firstname + '","lastName":"' + 
	lastname + '","image": { "image":"' + image + '"},"email":"' + 
	email + '","displayName":"' + displayname + '","address":"' + address +
	'","phoneNumber":"' + phonenumber + '"}';

	$.ajax({
		type: "POST",
		url: "https://e-tourist-api.herokuapp.com/registration",
		// The key needs to match your method's input parameter (case-sensitive).
		data: markers,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data)
		{
			alert (JSON.stringify(data.message))
			/*
			var valid = data.valid;
			if (valid == true) 
			{

				$.ajax({
					type: "POST",
					url: "https://e-tourist-api.herokuapp.com/registration",
					// The key needs to match your method's input parameter (case-sensitive).
					data: markers,
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function(data)
					{

					},
					error: function(errMsg) {
						alert (JSON.stringify(errMsg.message));    
					}763
				});
			}
			else {
				alert(data.message + "");
			}
			*/
		},
		error: function(errMsg) {
			alert (JSON.stringify(errMsg.message));    
		}
	});
}

function getVacancies() {
	$.ajax({
		type: "GET",
		url: "https://e-tourist-api.herokuapp.com/reviews?placeName=&placeType=1",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data)
		{
			$("#vacancy-content tbody > tr").remove();
			for (var i = 0; i < data.length; i++) {
				var obj = JSON.stringify(data[i].place.geoData.name);
				var name = obj.slice(1, obj.length-1);
				$('#vacancy-content').append('<tr onclick="viewVacancy(' + JSON.stringify(data[i].id) + ')"><td colspan="2"><img src="jquery.mobile/images/way.png">' + name + '</td></tr>');
			}
		},
		error: function(errMsg) {
			alert (JSON.stringify(errMsg) + "");    
		}
	});
}

function viewVacancy(id) {
	$.ajax({
		type: "GET",
		url: "https://e-tourist-api.herokuapp.com/reviews/"+id,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data)
		{
			$("#vacancy-vacancyView tbody > tr").remove();
			var grad = JSON.stringify(data.place.geoData.name);
			grad = grad.slice(1,grad.length-1);
			var opis = JSON.stringify(data.text);
			opis = opis.slice(1,opis.length-1);
			$('#vacancy-vacancyView').append('<tr><td><h1>' + grad + '</h1></td></tr><tr><td>'+ opis +'</td></tr><tr><td>PRIKAZ NA MAPI</td></tr>');
		},
		error: function(errMsg) {
			alert (JSON.stringify(errMsg) + "");    
		}
	});
	idiNaVacancy();
}

function getReviews() {
	$.ajax({
		type: "GET",
		url: "https://e-tourist-api.herokuapp.com/reviews?placeName=&placeType=3",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data)
		{
			$("#review-content tbody > tr").remove();
			for (var i = 0; i < data.length; i++) {
				var obj = JSON.stringify(data[i].place.geoData.name);
				var name = obj.slice(1, obj.length-1);
				var ID = JSON.stringify(data[i].place.id);
				var ime = name;
				var lat = JSON.stringify(data[i].place.geoData.latitude);
				var long = JSON.stringify(data[i].place.geoData.longitude);
				var apla = lat.slice(0, 6);
				var aplo = long.slice(0,6);
				reviewsPlaces.push ({
					id: ID,
					name: ime,
					latitude: lat,
					longitude: long,
					aplatitude : apla,
					aplongitude : aplo
				});
				//alert (JSON.stringify(reviewsPlaces[reviewsPlaces.length-1]));
				$('#review-content').append('<tr><td colspan="2"><img src="jquery.mobile/images/user.png">' + name + '</td></tr>');
			}
		},
		error: function(errMsg) {
			alert (JSON.stringify(errMsg) + "");    
		}
	});
}

function getDeviceLocation() {
	var options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
	};

	function success(pos) {
		var crd = pos.coords;
		console.log('Your current position is:');
		console.log('Latitude : ' + crd.latitude);
		console.log('Longitude: ' + crd.longitude);
		console.log('More or less ' + crd.accuracy + ' meters.');
		$('#lon').text(crd.longitude);
		$('#lat').text(crd.latitude);
		var aproximateLat = crd.latitude + "";
		var aproximateLon = crd.longitude + "";
		var skracenaLat = aproximateLat.slice(0,6);
		var skracenaLon = aproximateLon.slice(0,6);
		zadnjaLokacija[0] = ({
			lat: skracenaLat,
			lon: skracenaLon
		});
		if (aproximateLon != null) posjetioMjesto(aproximateLat, aproximateLon);
		map.setCenter({lat: crd.latitude, lng: crd.longitude});
		marker.push(new google.maps.Marker({position: {lat: crd.latitude, lng: crd.longitude}, map: map}));
		map.setZoom(15);
	};

	function error(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	};

	navigator.geolocation.getCurrentPosition(success, error, options);
	//calculateApproximate();
}

function spyMe() {
	function onSuccess(pos) {
		var crd = pos.coords;
		console.log('Your current position is:');
		console.log('Latitude : ' + crd.latitude);
		console.log('Longitude: ' + crd.longitude);
		console.log('More or less ' + crd.accuracy + ' meters.');
		$('#lon').text(crd.longitude);
		$('#lat').text(crd.latitude);
		map.setCenter({lat: crd.latitude, lng: crd.longitude});
		marker.push(new google.maps.Marker({position: {lat: crd.latitude, lng: crd.longitude}, map: map}));
		map.setZoom(15);
	};
	// onError Callback receives a PositionError object
	//
	function onError(error) {
		//alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
	}
	// Options: throw an error if no update is received every 30 seconds.
	//
	watchid = navigator.geolocation.watchPosition(onSuccess, onError, {
		timeout : 100000
	});
}

function stopTrackingMe() {
	navigator.geolocation.clearWatch(watchid);
	for (var i = 0; i < marker.length; i++) {
		marker[i].setMap(null);
	}
	marker = [];
}
function calculateApproximate() {
	var nasao = false;
	if (reviewsPlaces.length > 0)
	if (marker.length > 0) 
	for (var i = 0; i < reviewsPlaces.length; i++) {
		//alert (JSON.stringify(zadnjaLokacija));
		var axlat = JSON.stringify(zadnjaLokacija[zadnjaLokacija.length-1].lat);
		axlat = axlat.slice(1,axlat.length-1);
		var axlon = JSON.stringify(zadnjaLokacija[zadnjaLokacija.length-1].lon);
		axlon = axlon.slice(1, axlon.length-1);
		if (axlat == reviewsPlaces[i].aplatitude) {
			alert("BLIZU SI: " + reviewsPlaces[i].name + ";" + reviewsPlaces[i].aplatitude + ";" +  axlat);
			nasao = true;
		}
		else;// alert ("NISI BLIZU: " + reviewsPlaces[i].name + ";" + reviewsPlaces[i].aplatitude + ";" +  axlat);
	}
	if (!nasao) alert ("OTISAO KOD DADE, VJEROVATNO PRAŠUMA"); 
}

function posjetioMjesto(lat, lon) {
	//alert(lat + ":" + lon); 
	var markers = '{ "place": { "geoData": { "name": "Sarajevo",  "latitude": ' + lat + ', "longitude": '+ lon + '}, "objectType":1 } }';

	$.ajax({
		type: "POST",
		url: "https://e-tourist-api.herokuapp.com/visits/create?token=" + token,
		// The key needs to match your method's input parameter (case-sensitive).
		data: markers,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data)
		{
			alert(JSON.stringify(data.message))
		},
		error: function(errMsg) {
			alert (JSON.stringify(errMsg));    
		}
	});
}