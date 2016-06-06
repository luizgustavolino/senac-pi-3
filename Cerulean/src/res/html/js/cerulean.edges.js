
// ---[ ARESTAS  ]---

cerulean.edges = {}
cerulean.edges.list = []
cerulean.edges.startCoordnate = null

cerulean.edges.make = function(from, to, _hidden){

	// Função auxiliar para procurar
	// se a ligação já existe
	var checkDontHave = function(b) {
		return function(a){
			if(a.cerulean.reversable){
				var first 	= a.cerulean.first
				var second 	= a.cerulean.second
				return (first != a && second != b) && (first != b && second != a)
			}else return (a.cerulean.to != b);
		}
	}

	// primeiro verifica se essa ligação
	// já não existe na ida ou volta
	if(!from.cerulean.edgesOut.every(checkDontHave(to))){
		sys.log("Essa ligação já existe!");
		return;
	}

	if(!to.cerulean.edgesOut.every(checkDontHave(from))){
		var convertedEdge = null;
		to.cerulean.edgesOut.every(function(edge){
			if(edge.cerulean.to == from){

				edge.cerulean.reversable = true
				edge.cerulean.from 		= null
				edge.cerulean.to 		= null
				edge.cerulean.first 	= from
				edge.cerulean.second 	= to
				edge.setOptions(mapStyles.ReversableEdge)

				from.cerulean.edgesOut.push(edge)
				to.cerulean.edgesIn.push(edge)
				convertedEdge = edge

				return false
			} else return true
		})
		return convertedEdge;
	}else{

		var edge = new google.maps.Polyline({
			path: [from.getPosition(), to.getPosition()],
        	map: cerulean.map.view
		});

		cerulean.edges.list.push(edge);
		edge.setOptions(mapStyles.Edge);

		if(_hidden){
    		edge.setMap(null);
    		edge.set('clickable', false);
		}else{
			edge.addListener('click', cerulean.edges.clickAndDeleteEdgeAction(edge));
		}

		edge.cerulean = {};
		edge.cerulean.reversable = false;
		edge.cerulean.from = from ;
		edge.cerulean.to = to;
		edge.cerulean.distance = cerulean.coordinates.distanceBetweenCoordinates(from, to);
		
		from.cerulean.edgesOut.push(edge);
		to.cerulean.edgesIn.push(edge);
		return edge;
	}
	
	cerulean.edges.updateUI()
}

cerulean.edges.counterPartOf = function(edge, coordinate){
	
	if(!edge || !coordinate || ! edge.cerulean || ! coordinate.cerulean){
		return null
	}
	
	if(edge.cerulean.reversable){	
		var first 	= edge.cerulean.first;
		var second 	= edge.cerulean.second;
		if(first == coordinate) return second;
		else if (second == coordinate) return first;
	}else{
		if(edge.cerulean.from == coordinate) return edge.cerulean.to;
		else if(edge.cerulean.to == coordinate) return edge.cerulean.from;
	}
}

cerulean.edges.remove = function(edge){

	if(edge.cerulean.reversable){
		edge.cerulean.first.cerulean.edgesIn.remove(edge)
		edge.cerulean.first.cerulean.edgesOut.remove(edge)
		edge.cerulean.second.cerulean.edgesIn.remove(edge)
		edge.cerulean.second.cerulean.edgesOut.remove(edge)
	}else{
		edge.cerulean.from.cerulean.edgesOut.remove(edge)
		edge.cerulean.to.cerulean.edgesIn.remove(edge)
	}

	google.maps.event.clearInstanceListeners(edge)
	edge.setMap(null)
	cerulean.edges.list.remove(edge)
	cerulean.edges.updateUI()
	cerulean.storage.serialize()
}

cerulean.edges.clickAndDeleteEdgeAction = function(edge){
	return function(){
		cerulean.edges.remove(edge)
	}
}

cerulean.edges.showAll = function(){
	for( var i = 0, n = cerulean.edges.list.length; i < n; ++i ) {
      cerulean.edges.list[i].setMap(cerulean.map.view);
    }
}

cerulean.edges.hideAll = function(){
	for( var i = 0, n = cerulean.edges.list.length; i < n; ++i ) {
      cerulean.edges.list[i].setMap(null);
    }
}

cerulean.edges.updateUI = function(){
	var connectedCount = cerulean.edges.list.length
	cerulean.dom.byID("arestas.cadastradas", ""+connectedCount)
	cerulean.dom.byID("arestas.cadastradas.descricao", connectedCount > 1 || connectedCount == 0 ?
		"Arestas cadastradas" : "Aresta cadastrada")
}

cerulean.edges.componentsOf = function(edge){
	if(edge.cerulean.reversable){
		return [edge.cerulean.first, edge.cerulean.second];
	}else{
		return [edge.cerulean.from, edge.cerulean.to];
	}
}

cerulean.edges.medianPoint = function(edge){
	
	var components = cerulean.edges.componentsOf(edge);

	var a = components[0]
	var b = components[1]

	var aLat = a.getPosition().lat();
	var aLng = a.getPosition().lng();
	var blat = b.getPosition().lat();
	var bLng = b.getPosition().lng();

	var lat = Math.min(aLat,blat) + Math.abs(aLat - blat)/2.0;
	var lng = Math.min(aLng,bLng) + Math.abs(aLng - bLng)/2.0;

	return new google.maps.LatLng({lat: lat, lng: lng});
}

cerulean.edges.seachEdgeForPosition = function(c, listMode){

	var edgeList = [];

	for (var i = cerulean.edges.list.length - 1; i >= 0; i--) {
		var edge = cerulean.edges.list[i]
		if(cerulean.edges.seachPositionInsideEdgeRadius(edge, c)){
			if(listMode) edgeList.push(edge);
			else return edge;
		}
	};

	return listMode ? edgeList : false;
}

cerulean.edges.seachPositionInsideEdgeRadius = function(edge, latLgn){
	var components = cerulean.edges.componentsOf(edge);
	var median = cerulean.edges.medianPoint(edge);
	var er = cerulean.coordinates.distanceBetweenPositions(median, components[0].getPosition());
	var cd = cerulean.coordinates.distanceBetweenPositions(median, latLgn);
	return cd < er
}

cerulean.edges.addDebugCircle = function(edge){

	var components = cerulean.edges.componentsOf(edge);
	var median = cerulean.edges.medianPoint(edge);
	var d = cerulean.coordinates.distanceBetweenPositions(median, components[0].getPosition());

	var debugCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: cerulean.map.view,
      center: median,
      radius: (d*40008000)/360
    });
	
    cerulean.map.view.setCenter(median);

}

cerulean.edges.perpendicularDistante = function(edge, point){

	var edgeComps = cerulean.edges.componentsOf(edge)

	if(edgeComps[0].getPosition().lat() > edgeComps[1].getPosition().lat()){
		var tmp = edgeComps[1]
		edgeComps[1] = edgeComps[0]
		edgeComps[0] = tmp
	}

	var c1x = edgeComps[0].getPosition().lng();
	var c1y = edgeComps[0].getPosition().lat();
	var c2x = edgeComps[1].getPosition().lng();
	var c2y = edgeComps[1].getPosition().lat();
	var px 	= point.lng();
	var py  = point.lat();

	var m = (c2y-c1y)/(c2x-c1x);
	var theta = Math.atan(m);

	var rc2 = rotate(c1x, c1y, c2x, c2y, theta)
	var rp 	= rotate(c1x, c1y, px, py, theta)

	if(sys.debug){
		if(c1y != rc2.y) sys.log("check point rotation!")
	}

	var distance = Math.abs(rp.y-c1y)
	var np 		= rotate(c1x, c1y, rp.x, rc2.y, theta*-1)
	
	if(sys.debug){
		var check 	= rotate(c1x, c1y, rc2.x, rc2.y, theta*-1)
		if(check.y != c2y) sys.log("check point rotation!")
	}

	return {d:distance, p: new google.maps.LatLng({lat: np.y, lng: np.x})}

} 
