
// --[ PERSISTÊNCIA ] ---

cerulean.rid = {current: 0};
cerulean.rid.next = function(){
	cerulean.rid.current = cerulean.rid.current+1;
	return ""+cerulean.rid.current;
}

cerulean.storage = {};
cerulean.storage.serialize = function(){
	
	var output = ""

	var coordinate2String = function(c){
		var serialized = c.cerulean.rid + ";" + c.getPosition().lat() + ";" + c.getPosition().lng()
		var reducer = function(previousValue, currentValue, index, array) {
			return previousValue+(index == 0 ? "" : ",")+currentValue.cerulean.rid
		}
		serialized += c.cerulean.edgesIn.reduce(reducer,";in:");
		serialized += c.cerulean.edgesOut.reduce(reducer,";out:");
		return serialized
	}

	cerulean.coordinates.list.forEach(function(c){
		output += coordinate2String(c) + "\n";
	});

	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("cerulean.coordinates", output);
	}else{
		sys.log("locastorage is off!")
	}
}

cerulean.storage.deserialize = function(){
	if (typeof(Storage) !== "undefined") {
		
		var rawCoordnates = localStorage.getItem("cerulean.coordinates");
		var lines = rawCoordnates.split("\n")
		var coordinatesObjs = new Array();

		lines.forEach(function(aline){
			var lineData = aline.split(";");
			var rid = parseInt(lineData[0]);
			var lat = parseFloat(lineData[1]);
			var lng = parseFloat(lineData[2]);
			var point = cerulean.coordinates.add(lat,lng,rid);
			coordinatesObjs.push(point);
		});
		//alert('loading: '+lines)
	}else{
		sys.log("locastorage is off!")
	}
}