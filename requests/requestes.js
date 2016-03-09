
var requester = {}

requester.mapBoxToken = "pk.eyJ1IjoibHVpemd1c3Rhdm9saW5vIiwiYSI6ImNpbGN5ZTVodjN3Ymp1ZWx6Ymlncmd4aWUifQ.-r2W2-C8SwFjz4wOzIlvHg"
requester.geoAPIPath  = "https://api.mapbox.com/geocoding/v5/mapbox.places/"

requester.searchForGeocodes = function(tagID) {
	var tag = document.getElementById(tagID);
	var content = tag.value
	var lines = content.split("\n")

	for (line in lines) {
		requester.makeRequest(lines[line])
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
		console.log(latlong)
	}
}



