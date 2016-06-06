
// ---[ CENTRAIS ]---

cerulean.centrals = {};
cerulean.centrals.list = [];

cerulean.centrals.doRegister = function(){
	if(cerulean.centrals.inProgressRegister){
		var p = cerulean.centrals.inProgressRegister;
		cerulean.centrals.add(p.location, p.address, p.name, p.bikers)	
		cerulean.centrals.cancelRegister();
		cerulean.storage.serialize();
	}
}

cerulean.centrals.add = function(location, address, name, bikers){	

	var marker = new google.maps.Marker({
        map: cerulean.map.view,
        icon: mapStyles.centralMarker,
        position: location
   	});

   	marker.infowindow = new google.maps.InfoWindow({
    	content: "<div class='info'><b>"+name+"</b><br/>Ciclistas: "+bikers.join(", ")+"</div>"
  	});

  	marker.addListener('click', function() {
    	marker.infowindow.open(cerulean.map.view, marker);
  	});

	cerulean.centrals.list.push({
		location:location,
		address:address,
		name: name,
		marker: marker,
		bikers: bikers
	});

	var successDiv = cerulean.dom.byID("central.register.success");
	var confirmDiv = cerulean.dom.byID("central.register.accept");
	cerulean.dom.addClass(confirmDiv, "hidden");
	cerulean.dom.removeClass(successDiv, "hidden");
	
}

cerulean.centrals.cancelRegister = function(){
	if(cerulean.centrals.inProgressRegister){
		cerulean.centrals.inProgressRegister.marker.setMap(null)
		cerulean.centrals.inProgressRegister = null
	}
}

cerulean.centrals.makeOptionsArray = function(){
	var response = [];
	cerulean.centrals.list.forEach(function(central){
		response.push({
			name: central.name,
			next: "rotas.buscar"
		})
	});
	return {options:response};
}

cerulean.centrals.searchBeforeRegister = function(tag, className){

	var addressField 	= cerulean.dom.byID("central.address")
	var nameField 		= cerulean.dom.byID("central.name")
	var bikersField 	= cerulean.dom.byID("central.bikers")
	var address 		= addressField.value
	var name 			= nameField.value
	var bikers 			= bikersField.value

	if(name == ""){
		cerulean.dom.addClass(nameField, "emptyfield");
		return
	}

	if(address == ""){
		cerulean.dom.addClass(addressField, "emptyfield");
		return
	}

	if(bikers == ""){
		cerulean.dom.addClass(bikersField, "emptyfield");
		return
	}else{
		
		var bikersRegex = /([a-zA-Z| |,]+)/;
		var rxResults 	= bikersRegex.exec(bikers)
		var rxData 		= rxResults ? rxResults[0] : "";

		if(rxData.length != bikers.length){
			cerulean.dom.addClass(bikersField, "emptyfield");
			return;
		}
	}

	var tempBikersList 	= bikers.split(",");
	var bikersList 		= [];
	for (var i = tempBikersList.length - 1; i >= 0; i--) {
		var aBiker = tempBikersList[i];
		aBiker = aBiker.trim();
		if(aBiker != "") bikersList.push(aBiker);
	};

	cerulean.nav.setUserInteractionEnabled(false, true);
	cerulean.map.doGeocoding(address, function(response){
		
		cerulean.nav.setUserInteractionEnabled(true);

		if(response.lat() != 0 && response.lng() != 0){
			if(cerulean.edges.seachEdgeForPosition(response)){
				
				cerulean.map.view.setCenter(response);

				var marker = new google.maps.Marker({
	                map: cerulean.map.view,
	                icon: mapStyles.tempCentralMarker,
	                position: response
	            });

				cerulean.centrals.inProgressRegister = {
					location: response,
					address: address,
					name: name,
					marker: marker,
					bikers: bikersList
				}

				cerulean.dom.swap("central.register.form", "central.register.accept")
				return
			}

		}

		cerulean.dom.swap("central.register.form", "central.register.erro")
		
	})
}