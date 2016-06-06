
// --[ PUSH/POP ACTIONS ] ---

cerulean.nav.onPush["malha"] = function (){
	cerulean.map.view.set('styles', mapStyles.Mesh)
	cerulean.coordinates.showAll()
	cerulean.edges.showAll()
}

cerulean.nav.onPop["malha"] = function (){
	cerulean.map.view.set('styles', mapStyles.Road)
	cerulean.coordinates.hideAll()
	cerulean.edges.hideAll()
}

cerulean.nav.onPush["vertices"] = function (){
	
	cerulean.map.view.addListener('click', function(e) {
    	cerulean.coordinates.add(e.latLng.lat(), e.latLng.lng());
    	cerulean.storage.serialize();
 	});

 	cerulean.map.view.set('cursor', 'crosshair')
 	cerulean.coordinates.updateUI()

	cerulean.coordinates.list.forEach(function(coordinate){
		coordinate.set('clickable', true);
		coordinate.set('draggable', true)
		coordinate.addListener('click', cerulean.coordinates.clickAndDelegateAction(coordinate));
		coordinate.addListener('drag', cerulean.coordinates.dragAction(coordinate));
	});
}

cerulean.nav.onPop["vertices"] = function (){

	google.maps.event.clearInstanceListeners(cerulean.map.view)

	cerulean.coordinates.list.forEach(function(coordinate){
		coordinate.set('clickable', false);
		coordinate.set('draggable', false);
		google.maps.event.clearInstanceListeners(coordinate);
	});

}

cerulean.nav.onPush["arestas"] = function (){

	cerulean.edges.updateUI();

	cerulean.coordinates.list.forEach(function(c){
		c.set('clickable', true);
		c.addListener('click', cerulean.coordinates.clickAndMakeEdgeAction(c));
	});

	cerulean.edges.list.forEach(function(e){
		e.addListener('click', cerulean.edges.clickAndDeleteEdgeAction(e));
		e.set('clickable', true);
	});
}

cerulean.nav.onPop["arestas"] = function (){

	cerulean.coordinates.clearFirstSelection()

	cerulean.coordinates.list.forEach(function(c){
		c.set('clickable', false);
		google.maps.event.clearInstanceListeners(c)
	});
	cerulean.edges.list.forEach(function(e){
		e.set('clickable', false);
		google.maps.event.clearInstanceListeners(e)
	});
}

cerulean.nav.onPop["central.cadastrar"] = function (){
	cerulean.centrals.cancelRegister()
}

cerulean.nav.dataFor["rotas"] = function(){
	return cerulean.centrals.makeOptionsArray()
}

