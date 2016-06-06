
// --[ PERSISTÊNCIA ] ---

cerulean.rid = {current: 0};
cerulean.rid.next = function(){
	cerulean.rid.current = cerulean.rid.current+1;
	return cerulean.rid.current;
}

cerulean.storage = {};
cerulean.storage.serialize = function(){

	var central2String = function(c){
		var serialized = c.name + ";" + c.address + ";"
		serialized += c.location.lat()+";"+c.location.lng() + ";"
		serialized += c.bikers.join(",")
		return serialized
	}

	var coordinate2String = function(c){
		var serialized = c.cerulean.rid + ";" + c.getPosition().lat() + ";" + c.getPosition().lng()
		var reducer = function(previousValue, currentValue, index, array) {
			var destiny = cerulean.edges.counterPartOf(currentValue, c)
			if(destiny) return previousValue+","+parseInt(destiny.cerulean.rid)
			else previousValue[1][3];
		}

		var trigger = 1
		serialized += ";out:"
		c.cerulean.edgesOut.forEach(function(edge){
			var destiny = cerulean.edges.counterPartOf(edge, c)
			if(destiny) return serialized += (--trigger ? "," : "")+parseInt(destiny.cerulean.rid)
		})
		serialized += ";"
		return serialized
	}

	var outputCoordinates = "";
	cerulean.coordinates.list.forEach(function(c){
		outputCoordinates += coordinate2String(c) + "\n";
	});

	var outputCentrals = "";
	cerulean.centrals.list.forEach(function(c){
		outputCentrals += central2String(c) + "\n";
	});

	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("cerulean.coordinates", outputCoordinates);
		localStorage.setItem("cerulean.centrals", outputCentrals);
		sys.log("save...")
	}else{
		sys.log("locastorage is off!")
	}
}

cerulean.storage.deserialize = function(){
	if (typeof(Storage) !== "undefined") {
		
		var rawCoordnates = localStorage.getItem("cerulean.coordinates");
		if(!rawCoordnates) return;

		try{
			var lines = rawCoordnates.split("\n")
			var coordinatesObjs = {};

			lines.forEach(function(aline){
				var lineData = aline.split(";");
				if (lineData.length > 1){
					try{
						var rid = lineData[0];
						var lat = parseFloat(lineData[1]);
						var lng = parseFloat(lineData[2]);
						var point = cerulean.coordinates.add(lat,lng,rid, true);
						var eOut = new Array();
						
						if(parseInt(rid) > cerulean.rid.current){
							cerulean.rid.current = parseInt(rid);
						}

						if(lineData[3] != null){
							var rawOutIDs = lineData[3].split(":").splice(0)[1];
							eOut = rawOutIDs.split(",")
						}

						coordinatesObjs[rid] = {
							point:point,
							eout: eOut
						};

					}catch(err){
						sys.log(err)
					}
				}
			});


			for( key in coordinatesObjs){
				try{
					if (!coordinatesObjs.hasOwnProperty(key)) continue;
					var coordinateData = coordinatesObjs[key]
					var outs = coordinateData.eout
					for(index in outs){
						if (!outs.hasOwnProperty(index)) continue;
						var destiny = outs[index]
						if(destiny) {
							var e = cerulean.edges.make(coordinateData.point, coordinatesObjs[destiny].point, true);
							if(sys.debug) cerulean.edges.addDebugCircle(e)
						}
					}
				}catch(err){
					sys.log(err)
				}
			}
		}catch(err){ sys.log(err); }

		try{
			
			var rawCentrals = localStorage.getItem("cerulean.centrals");
			var lines = rawCentrals.split("\n")
			
			lines.forEach(function(aline){
				var lineData = aline.split(";");
				if (lineData.length > 1){
					var name = lineData[0];
					var address = lineData[1];
					var lat = parseFloat(lineData[2]);
					var lng = parseFloat(lineData[3]);
					var bikers = lineData[4] ? lineData[4].split(",") : [];
					var pnt = new google.maps.LatLng(lat,lng);
					cerulean.centrals.add(pnt, address, name, bikers);
				}
			})

		}catch(err){ sys.log(err); }

	}else{
		sys.log("locastorage is off!")
	}
}