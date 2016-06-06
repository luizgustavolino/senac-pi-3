
// ---[ VÉRTICES  ]---

cerulean.coordinates = {}
cerulean.coordinates.list = []

cerulean.coordinates.add = function(_lat, _lng, _rrid, _hidden) {
	
	if(sys.debug) sys.log("adding coordinate: " + _lat +" , " + _lng)

	var point = new google.maps.Marker(mapStyles.Vertice(_lat, _lng));
	point.cerulean = {rid: _rrid ? _rrid : cerulean.rid.next(), edgesIn:[], edgesOut:[]}
	cerulean.coordinates.list.push(point);
    cerulean.coordinates.updateUI();

    if(_hidden){
    	point.setMap(null);
    	point.set('clickable', false);
		point.set('draggable', false);
    }else{
    	point.addListener('click', cerulean.coordinates.clickAndDelegateAction(point));
		point.addListener('drag', cerulean.coordinates.dragAction(point));
    }

    return point;
}

cerulean.coordinates.clickAndDelegateAction = function(point){
	return function(){

		var allEdges = new Array()
		point.cerulean.edgesOut.forEach(function(e){allEdges.push(e)});
		point.cerulean.edgesIn.forEach(function(e){allEdges.push(e)});

		allEdges.forEach(function(e){
			cerulean.edges.remove(e);
		})

		google.maps.event.clearInstanceListeners(point)
		point.set('draggable', false)
		point.setMap(null)

		cerulean.coordinates.list.remove(point)
		cerulean.coordinates.updateUI()
		cerulean.storage.serialize()
	}
}

cerulean.coordinates.clickAndMakeEdgeAction = function(point){
	return function(){

		if(cerulean.edges.startCoordnate != point){
			if(cerulean.edges.startCoordnate != null){
				cerulean.edges.make(cerulean.edges.startCoordnate, point);
				cerulean.edges.startCoordnate.set("icon", mapStyles.standingVerticeIcon);
				cerulean.storage.serialize();
			}
			cerulean.edges.startCoordnate = point
			point.set("icon", mapStyles.startVerticeIcon);
		}else{
			cerulean.coordinates.clearFirstSelection();
		}
		
	}
}

cerulean.coordinates.clearFirstSelection = function(){
	if(cerulean.edges.startCoordnate){
		cerulean.edges.startCoordnate.set("icon", mapStyles.standingVerticeIcon);
		cerulean.edges.startCoordnate = null
	}
}

cerulean.coordinates.dragAction = function(c){
	return function(){
		c.cerulean.edgesIn.forEach(function(inEdge){
			if(inEdge.cerulean.reversable){
				var d = (inEdge.cerulean.first == c) ? inEdge.cerulean.second : inEdge.cerulean.first
				inEdge.setPath([d.getPosition(), c.getPosition()])
			}else{
				inEdge.setPath([inEdge.cerulean.from.getPosition(), c.getPosition()])
			}
		})

		c.cerulean.edgesOut.forEach(function(outEdge){
			if(!outEdge.cerulean.reversable){
				outEdge.setPath([c.getPosition(), outEdge.cerulean.to.getPosition()])
			}
		})
	}
}

cerulean.coordinates.hideAll = function(){
	cerulean.coordinates.list.forEach(
		function(elm){ elm.setMap(null) }
	)
}

cerulean.coordinates.showAll = function(){
	cerulean.coordinates.list.forEach(
		function(elm){ elm.setMap(cerulean.map.view)}
	)
}

cerulean.coordinates.updateUI = function(){
	
	var disconectedCount 	= 0
	var registeredCount 	= cerulean.coordinates.list.length
	cerulean.coordinates.list.forEach(function(coordinate){
		if(coordinate.cerulean.edgesIn.length == 0 && coordinate.cerulean.edgesOut.length == 0){
			disconectedCount++;
		}
	});
	
	cerulean.dom.byID("vertices.cadastrados", ""+cerulean.coordinates.list.length)
	cerulean.dom.byID("vertices.isolados", ""+disconectedCount)	

	cerulean.dom.byID("vertices.isolados.descricao", disconectedCount > 1 || disconectedCount == 0 ?
		"Vértices desconectados" : "Vértice desconectado")
	cerulean.dom.byID("vertices.cadastrados.descricao", registeredCount > 1 || registeredCount == 0 ?
		"Vértices cadastrados" : "Vértice cadastrado")	
	
}

cerulean.coordinates.distanceBetweenCoordinates = function(a, b){
	return cerulean.coordinates.distanceBetweenPositions(a.getPosition(), b.getPosition())	
}

cerulean.coordinates.distanceBetweenPositions = function(a, b){

	var alat = a.lat();
	var alng = a.lng();

	var blat = b.lat();
	var blng = b.lng();

	var distance = Math.sqrt(Math.pow((blat - alat), 2) + Math.pow((blng - alng), 2));
    return distance;

}

