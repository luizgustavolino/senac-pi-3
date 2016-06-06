
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

cerulean.rotes.doSearch = function(){

	var addressesField 	= cerulean.dom.byID("rotes.addresses");
	var addresses 		= addressesField.value;

	if(addresses == ""){
		cerulean.dom.addClass(addressesField, "emptyfield");
		return
	}

	cerulean.nav.setUserInteractionEnabled(false, true);
	cerulean.dom.swap("rotes.addresses.form", "rotes.geocoding")

	var addressesList = addresses.split("\n");
	cerulean.rotes.batchGeocode(addressesList, function(response){
		cerulean.rotes.dijkstra(cerulean.rotes.currentCentral, response);
	});
}

cerulean.rotes.batchGeocode = function(addresses, callback){

	var responsesNeeded = addresses.length;
	var validAddresses  = []
	var missCount 		= 0

	var markResponse = function(address, response){
		return function(response){

			if(response.lat() != 0 && cerulean.edges.seachEdgeForPosition(response)){
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

	var metaGraph = new Graph();
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
	var visited = []
	var findShortest = function(current){
		var min = 9999;
		var result;
		current.outs.forEach(function(next){
			if(next.distance < min){
				min = next.distance;
				
			}
		})
	}



	cerulean.nav.setUserInteractionEnabled(true);
}

