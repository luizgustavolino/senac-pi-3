
var cerulean = {}



// ---[ NavController   ]---

cerulean.nav = {}
cerulean.nav.stack = []
cerulean.nav.counter = 1
cerulean.nav.onPush  = {}
cerulean.nav.onPop  = {}

cerulean.nav.setRootController = function(templateName, data){
	var controller = cerulean.nav.makeControllerForTemplate(templateName, data)
	cerulean.nav.stack = [controller]
}

cerulean.nav.makeControllerForTemplate = function(templateName, data){

	var newController = document.createElement('div');
	newController.className = "nav viewing"
	newController.templateName = templateName
	newController.id = "nav"+(cerulean.nav.counter++)

	var tag = cerulean.dom.byID("menu-content");
	tag.appendChild(newController);
	cerulean.tpl.show(newController.id, templateName, data)
	return newController

}

cerulean.nav.pushController = function( templateName, data) {
	
	cerulean.nav.setUserInteractionEnabled(false);
	var controller = cerulean.nav.makeControllerForTemplate(templateName, data);
	var prevController = cerulean.nav.stack.last()

	cerulean.dom.removeClass(prevController, "viewing");
	cerulean.dom.addClass(prevController, "pushed");
	cerulean.nav.stack.push(controller);

	var backBtn = cerulean.dom.byID("back-button");
	cerulean.dom.removeClass(backBtn, "hidden")
	
	setTimeout(function(){

		if(cerulean.nav.onPush[templateName]){
			cerulean.nav.onPush[templateName]()
		}

		cerulean.dom.removeClass(backBtn, "transparent")
		cerulean.nav.setUserInteractionEnabled(true)

	}, 360);
}

cerulean.nav.popController = function() {

	cerulean.nav.setUserInteractionEnabled(false);
	var poppedController = cerulean.nav.stack.pop()
	var newTopController = cerulean.nav.stack.last()

	cerulean.dom.removeClass(newTopController, "pushed");
	cerulean.dom.addClass(newTopController, "viewing");

	if(cerulean.nav.stack[0] == newTopController){
		var backBtn = cerulean.dom.byID("back-button")
		cerulean.dom.addClass(backBtn, "transparent");
	}
	
	setTimeout(function(){

		if(cerulean.nav.onPop[poppedController.templateName]){
			cerulean.nav.onPop[poppedController.templateName]()
		}

		poppedController.remove()
		cerulean.nav.setUserInteractionEnabled(true)
	}, 360);
}

cerulean.nav.setTitle = function(newTitle) {
	var tag = cerulean.dom.byID("title");
	tag.innerHTML = newTitle
}

cerulean.nav.setUserInteractionEnabled = function(enabled){
	if(!enabled && !cerulean.nav.overlay){
		cerulean.nav.overlay = document.createElement('div');		
		cerulean.dom.addClass(cerulean.nav.overlay, "overlay");
		var tag = cerulean.dom.byID("body");
		tag.appendChild(cerulean.nav.overlay);
	}else if(enabled && cerulean.nav.overlay){
		cerulean.nav.overlay.remove()
		cerulean.nav.overlay = null
	}
}

// ---[ GoogleMaps API  ]---

cerulean.map = {}

cerulean.map.view = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: {lat: -23.5607558, lng: -46.6597692},
    styles: mapStyles.Road,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    minZoom: 16,
    maxZoom: 18,
    scrollwheel: false,
    noClear: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
    }
});

// ---[ VÉRTICES  ]---

cerulean.coordinates = {}
cerulean.coordinates.list = []
cerulean.coordinates.add = function(_lat, _lng) {

	var point = new google.maps.Marker(mapStyles.Vertice(_lat, _lng));
	point.addListener('click', cerulean.coordinates.clickAndDelegateAction(point));
	point.cerulean = {edgesIn:[], edgesOut:[]}

	cerulean.coordinates.list.push(point)
    cerulean.coordinates.updateCount()
}

cerulean.coordinates.updateCount = function(){
	
	var disconectedCount = 0
	var allCoordinates = cerulean.coordinates.list.length
	for (var i = 0; i < allCoordinates; i++) {
		var n = cerulean.coordinates.list[i]
		if(n.cerulean && n.cerulean.arestas && n.cerulean.arestas.length == 0){
			disconectedCount++;
		}
	};
	
	cerulean.dom.byID("vertices.cadastrados", allCoordinates)
	cerulean.dom.byID("vertices.isolados", disconectedCount)	
}

cerulean.coordinates.clickAndDelegateAction = function(point){
	return function(){

		google.maps.event.clearInstanceListeners(point)
		point.set('draggable', false)
		point.setMap(null)

		var index = cerulean.coordinates.list.indexOf(point)
		cerulean.coordinates.list.splice(index,1)
		cerulean.coordinates.updateCount()
	}
}

cerulean.coordinates.clickAndMakeEdgeAction = function(point){
	return function(){
		if(cerulean.edges.startCoordnate == null){
			cerulean.edges.startCoordnate = point
			point.set("icon", mapStyles.startVerticeIcon);
		}else{
			if(cerulean.edges.startCoordnate != point){
				cerulean.edges.make(cerulean.edges.startCoordnate, point)
			}
			cerulean.edges.startCoordnate.set("icon", mapStyles.standingVerticeIcon);
			cerulean.edges.startCoordnate = null
		}
	}
}

cerulean.edges = {}
cerulean.edges.list = []
cerulean.edges.startCoordnate = null
cerulean.edges.make = function(from, to){

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
		to.cerulean.edgesOut.every(function(edge){
			if(edge.cerulean.to == from){

				edge.cerulean.reversable = true
				edge.cerulean.from 		= null
				edge.cerulean.to 		= null
				edge.cerulean.first 	= from
				edge.cerulean.second 	= to
				edge.setOptions(mapStyles.ReversableEdge)

				from.cerulean.edgesOut.push(edge)
				from.cerulean.edgesIn.push(edge)

				return false
			} else return true
		})
		return;
	}else{

		var edge = new google.maps.Polyline({
			path: [from.getPosition(), to.getPosition()],
        	map: cerulean.map.view
		});

		edge.setOptions(mapStyles.Edge)
		
		edge.addListener('click', function(){
			google.maps.event.clearInstanceListeners(edge)
			edge.setMap(null)
		});

		edge.cerulean = {}
		edge.cerulean.reversable = false
		edge.cerulean.from = from 
		edge.cerulean.to = to
		
		from.cerulean.edgesOut.push(edge)
		to.cerulean.edgesIn.push(edge)
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

// ---[ DOM ]---

cerulean.dom = {}
cerulean.dom.addClass = function(tag, className){
	if(tag.className.indexOf(className) == -1){
		tag.className += " " + className;
	}
}

cerulean.dom.byID = function(_id, _newInner){
	if(_newInner){
		var element = cerulean.dom.byID(_id);
		if(element) element.innerHTML = _newInner
		return element
	}else{
		return document.getElementById(_id);
	}
}

cerulean.dom.removeClass = function(tag, className) {
	if(tag.className.indexOf(className) != -1){
		var regex = new RegExp('(?:^|\\s)'+className+'(?!\\S)',"g");
		tag.className = tag.className.replace( regex ,'')
	}
}

// ---[ TEMPLATE LOADER ]---

cerulean.tpl = {
    precompiled_templates:{}
};

cerulean.tpl.show = function(tagID, templateName, data){

	function display(){
		var tag = cerulean.dom.byID(tagID);
		tag.innerHTML = cerulean.tpl.precompiled_templates[templateName](data)
	}

	if(cerulean.tpl.precompiled_templates[templateName]){
            display();
	}else{
		
        var r = new XMLHttpRequest();
        var base = sys.getPath("templates/");
        var loc = base + templateName+".template.html";
        sys.log("loading html template: " + loc);
        
        r.open("GET", loc, true);
        r.onreadystatechange = function () {
            
            if (r.readyState != 4 || r.status != 200){
                sys.log("Error loading template "+templateName+" (code "+r.status+")")
            }
            
            cerulean.tpl.precompiled_templates[templateName] = Handlebars.compile(r.responseText);
            display();
        };
        r.send();
	}
};

// ----[ JS Extensions ] ---

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

// --[ PUSH/POP ACTIONS ] ---

cerulean.nav.onPush["malha"] = function (){
	cerulean.map.view.set('styles', mapStyles.Mesh)
	cerulean.coordinates.showAll()
}

cerulean.nav.onPop["malha"] = function (){
	cerulean.map.view.set('styles', mapStyles.Road)
	cerulean.coordinates.hideAll()
}

cerulean.nav.onPush["vertices"] = function (){
	
	cerulean.map.view.addListener('click', function(e) {
    	cerulean.coordinates.add(e.latLng.lat(), e.latLng.lng());
 	});

 	cerulean.map.view.set('cursor', 'crosshair')
 	cerulean.coordinates.updateCount()

 	var allCoordinates = cerulean.coordinates.list.length
	for (var i = 0; i < allCoordinates; i++) {
		var n = cerulean.coordinates.list[i]
		n.set('clickable', true); n.set('draggable', true)
		n.addListener('click', cerulean.coordinates.clickAndDelegateAction(n));
	};
}

cerulean.nav.onPop["vertices"] = function (){
	google.maps.event.clearInstanceListeners(cerulean.map.view)

	var allCoordinates = cerulean.coordinates.list.length
	for (var i = 0; i < allCoordinates; i++) {
		var n = cerulean.coordinates.list[i]
		n.set('clickable', false);
		n.set('draggable', false)
		google.maps.event.clearInstanceListeners(n)
	};

}

cerulean.nav.onPush["arestas"] = function (){
	
 	var allCoordinates = cerulean.coordinates.list.length
	for (var i = 0; i < allCoordinates; i++) {
		var n = cerulean.coordinates.list[i]
		n.set('clickable', true);
		n.set('draggable', false)
		n.addListener('click', cerulean.coordinates.clickAndMakeEdgeAction(n));
	};
}

// --- [ EOF ] ---
sys.log("Cerulean JS loaded");