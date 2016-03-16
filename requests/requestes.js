// k-means


var requester = {}

requester.mapBoxToken = "pk.eyJ1IjoibHVpemd1c3Rhdm9saW5vIiwiYSI6ImNpbGN5ZTVodjN3Ymp1ZWx6Ymlncmd4aWUifQ.-r2W2-C8SwFjz4wOzIlvHg"
requester.geoAPIPath  = "https://api.mapbox.com/geocoding/v5/mapbox.places/"

requester.searchForGeocodes = function(tagID) {
	var tag = document.getElementById(tagID);
	var content = tag.value
	var lines = content.split("\n")

	for (line in lines) {
		if (lines[line] != ""){
			requester.makeRequest(lines[line])
		}else{
			alert("Preencha os endereços, um por linha\nExemplo: Avenida Paulista, 1000")
			return
		}
	}
	
}

requester.makeRequest = function(address) {

	console.log("Requesting: "+address)

	var url = requester.geoAPIPath
	url += address
	url += ".json?country=br&access_token="
	url += requester.mapBoxToken

	var r = new XMLHttpRequest();
	r.open("GET", url, true);
	var localRequester = requester
	r.onreadystatechange = function () {
  		if (r.readyState != 4 || r.status != 200) return;
  			var geoCodedAdress = JSON.parse(r.responseText);
  			localRequester.digestAddress(geoCodedAdress)
		};
	r.send();
}


requester.digestAddress = function(addressObject){
	if(addressObject.features.length > 0){
		var latlong = addressObject.features[0].center
		var response = latlong[1]+", "+latlong[0]
		requester.appendResponse("geocodes", response)

		L.marker([latlong[1], latlong[0]], {
    		icon: L.mapbox.marker.icon({
        		'marker-size': 'large',
        		'marker-symbol': 'circle',
        		'marker-color': '#fa0'
    	})}).addTo(map);
	}
}

requester.clearResponse = function(divName){
	var tag = document.getElementById(divName);
	tag.value = ""
}

requester.appendResponse = function(divName, newContent){
	var tag = document.getElementById(divName);
	tag.value += newContent + "\n"
}