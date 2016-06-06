
// --[ ROTAS ] ---

cerulean.rotes = {}

cerulean.rotes.selectCentral = function(name) {

	cerulean.centrals.list.forEach(function(c){
		if(c.name == name){
			cerulean.rotes.currentCentral = c
		}
	})

	cerulean.nav.pushController('rotas.buscar', {name:name})
}

cerulean.rotes.paths = []
cerulean.rotes.stats = ""

cerulean.rotes.drawPack = function(latLong, color){

	var mark = new google.maps.Marker(
		mapStyles.Package(latLong.lat(), latLong.lng(), color)
	)

	cerulean.rotes.paths.push(mark)
}

cerulean.rotes.drawPath = function(latLongList, color){

	var lines = new google.maps.Polyline({
		path: latLongList,
		geodesic: true,
		strokeColor: color,
		strokeOpacity: 1.0,
		strokeWeight: 4
	});

	lines.setMap(cerulean.map.view);
	cerulean.rotes.paths.push(lines);
}

cerulean.rotes.clear = function(){
	cerulean.rotes.paths.forEach(function(p){
		p.setMap(null);
	})
}

cerulean.rotes.doSearch = function(){

	var addressesField 	= cerulean.dom.byID("rotes.addresses");
	var addresses 		= addressesField.value;

	if(addresses == ""){
		cerulean.dom.addClass(addressesField, "emptyfield");
		return
	}

	var timer = new Date().getTime();
	cerulean.rotes.stats = "";

	cerulean.nav.setUserInteractionEnabled(false, true);
	cerulean.dom.swap("rotes.addresses.form", "rotes.geocoding")

	var addressesList = addresses.split("\n");
	cerulean.rotes.batchGeocode(addressesList, function(response){
		cerulean.rotes.dijkstra(cerulean.rotes.currentCentral, response);

		var end = new Date().getTime();
		cerulean.dom.byID("rotes.geocoding.timeTaken", (end - timer)/1000);
		cerulean.dom.byID("rotes.geocoding.stats", cerulean.rotes.stats);
		cerulean.dom.removeClass(cerulean.dom.byID("rotes.geocoding.timer"), "hidden")
	});
}

cerulean.rotes.batchGeocode = function(addresses, callback){

	var responsesNeeded = addresses.length;
	var validAddresses  = []
	var missCount 		= 0

	var markResponse = function(address, response){
		return function(response){

			if(response && response.lat() != 0 && cerulean.edges.seachEdgeForPosition(response)){
				validAddresses.push({address:address, point:response});
				cerulean.dom.byID("rotes.geocoding.count", validAddresses.length);
			}else{
				cerulean.dom.byID("rotes.geocoding.misscount", ++missCount);
				cerulean.dom.removeClass(cerulean.dom.byID("rotes.geocoding.misscountp"), "hidden");
				sys.log("Fora da malha: " + address)
			}

			if(--responsesNeeded == 0){
				callback(validAddresses);
			}
		}
	}

	for (var i = addresses.length - 1; i >= 0; i--) {
		cerulean.map.doGeocoding(addresses[i], markResponse(addresses[i]));	
	};
}

cerulean.rotes.dijkstra = function(startCentral, addresses){

	// 1- Inclui no grafo a sede e os endereços
	var searchOnEdges = function(point){

		var targetEdge;
		var targetPoint;
		var minDistance = undefined;

		var all = cerulean.edges.seachEdgeForPosition(point, true);
		all.forEach(function(probeEdge){
			var p = cerulean.edges.perpendicularDistante(probeEdge, point)
			if(p.d < minDistance || minDistance == undefined){
				minDistance = p.d
				targetEdge = probeEdge
				targetPoint = p.p
			}
		})

		if(sys.debug){
			cerulean.edges.addDebugCircle(targetEdge)
			cerulean.coordinates.add(targetPoint.y, targetPoint.x)
		}

		return {
			edge: targetEdge,
			point: targetPoint
		}
	}

	var edgeData = []
	edgeData.push({tag:"central", pack:searchOnEdges(startCentral.location)})
	addresses.forEach(function(adr){
		edgeData.push({tag:adr.address, pack:searchOnEdges(adr.point)})
	})
	
	// 2 - Cria o grafo, adicionando os pacote e a central
	var graph = new Graph();
	cerulean.coordinates.list.forEach(function(c){
		
		var outs = {}

		c.cerulean.edgesOut.forEach(function(edge){

			var end = cerulean.edges.counterPartOf(edge, c);
			var skip = false;
			var distance;

			edgeData.every(function(interEdge){
				if(interEdge.pack.edge == edge){

					var inDistance = cerulean.coordinates.distanceBetweenPositions(c.getPosition(), interEdge.pack.point)
					outs[interEdge.tag] = inDistance

					var outData = {}
					var outDistance = cerulean.coordinates.distanceBetweenPositions(interEdge.pack.point, end.getPosition())
					outData[end.cerulean.rid] = outDistance
					graph.addVertex(interEdge.tag, outData);

					skip = true
					return false

				}else return true
			});

			if(!skip){
				outs[end.cerulean.rid] = edge.cerulean.distance
			}
			
		})
		
		graph.addVertex(c.cerulean.rid, outs);
	})

	// 2 - Pesa o custo entre cada pacote
	var chart = {};
	var ways = addresses.slice(0);
	ways.push({address:"central"});
	ways.forEach(function(mAdr){
		var outs = {};
		ways.forEach(function(nAdr){
			if(mAdr != nAdr){
				var path = graph.shortestPath(mAdr.address,nAdr.address).concat([mAdr.address]).reverse();
				if(path){
					var distance = graph.totalDistanceOfPath(path);
					outs[nAdr.address] = {distance:distance, path:path}
				}
			}
		});
		chart[mAdr.address] = outs
	});

	// 3 - Escolhe a rota
	var visited = ["central"];
	var finalPath = [];
	var totalDistance = 0;

	var getShortest = function(current){
		
		var min 	= 9999;
		var address = null;

		for(key in current){

			if (!current.hasOwnProperty(key)) continue;
			var next = current[key];

			if (!visited.length || visited.every(function(v){ return v != key})){
				if(next.distance < min){
					min = next.distance;
					address = key;
				}
			}
		}

		if(address != null){
			visited.push(address);
			totalDistance += min;
			return {name: address, data:chart[address]};
		}else{
			return null;
		}
	}

	var visit = function(place, start){
		var nextshort = getShortest(start);
		finalPath.push(place);
		if(!nextshort){
			return;
		}else {
			visit(nextshort.name, nextshort.data);
		}
	}

	visit("central", chart["central"]);

	// 4 - Avalia o caminho pela quantidade de pessoas
	var bikeCount = startCentral.bikers.length;
	var packForBiker = {};
	if(bikeCount > addresses.length){
		for (var i = addresses.length - 1; i >= 0; i--) {
			var biker  = startCentral.bikers[i];
			var address = addresses[i];
			packForBiker[biker] = [address];
		};
	}else{

		var eachDistance = totalDistance/bikeCount;
		var currentAddressCount = 0;
		

		for (var i = 0; i < startCentral.bikers.length; i++) {

			var stepCount = 0;
			var biker = startCentral.bikers[i];

			for ( /**/ ; currentAddressCount < addresses.length; currentAddressCount++) {
				
				var currentAddress = addresses[currentAddressCount];
				if(packForBiker[biker] == null) packForBiker[biker] = [];
				packForBiker[biker].push(currentAddress.address);

				if(currentAddressCount == addresses.length -1) break;

				var nextAddress = addresses[currentAddressCount+1];
				var stepSize = chart[currentAddress.address][nextAddress.address].distance;
				stepCount += stepSize;

				if(stepCount > eachDistance || addresses.length - currentAddressCount == startCentral.bikers.length - i) {
					currentAddressCount++;
					break;
				}
			}
		}
	}

	var colorForBiker = {}
	for (var i = 0; i < startCentral.bikers.length; i++) {
		var colors = ["#6BC6E4", "#6B6CE4", "#6CECD1", "#6CEC7A", "#B0EC28"]
		colorForBiker[startCentral.bikers[i]] = colors[i%5];
	};

	var drawPathForBiker = function(bikerName, packs){
		
		if(!packs) return;

		packs.unshift("central")
		var paths = [];

		var searchInAddresses = function(tag){

			if(tag == "central"){
				return startCentral.location;
			}

			for (var i = addresses.length - 1; i >= 0; i--) {
				var ad = addresses[i];
				if(ad.address == tag) return ad.point;
			};
		}

		var allCooridnates = []
		for (var i = 0; i < packs.length -1; i++) {
			
			var pack = chart[packs[i]][packs[i+1]];
			if(!pack || !pack.path) continue;

			for (var n = 0; n < pack.path.length; n++) {
				var itemTag = pack.path[n];
				var from = searchInAddresses(itemTag)
				
				if(from == null) {
					var fromObj = cerulean.coordinates.fromRid(itemTag);
					if(fromObj) from = fromObj.getPosition();
					else sys.log("not found: "+item)
				}else if(itemTag != "central"){
					cerulean.rotes.drawPack(from, colorForBiker[bikerName]);
				}

				allCooridnates.push({lat:from.lat(), lng:from.lng() })

			}
		};

		cerulean.rotes.drawPath(allCooridnates, colorForBiker[bikerName]);
	
	}

	startCentral.bikers.forEach(function(bikerName){
		drawPathForBiker(bikerName, packForBiker[bikerName]);
	})

	cerulean.nav.setUserInteractionEnabled(true);
}

