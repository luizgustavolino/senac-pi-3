
var cerulean = {}



// ---[ NavController   ]---

cerulean.nav = {}
cerulean.nav.stack = []
cerulean.nav.counter = 1

cerulean.nav.setRootController = function(templateName, data){
	var controller = cerulean.nav.makeControllerForTemplate(templateName, data)
	cerulean.nav.stack = [controller]
}

cerulean.nav.makeControllerForTemplate = function(templateName, data){

	var newController = document.createElement('div');
	newController.className = "nav viewing"
	newController.id = "nav"+(cerulean.nav.counter++)

	var tag = document.getElementById("menu-content");
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

	setTimeout(function(){
		cerulean.dom.addClass(prevController, "hidden")
		cerulean.nav.setUserInteractionEnabled(true)
	}, 360);
}

cerulean.nav.popController = function() {

	cerulean.nav.setUserInteractionEnabled(false);
	var poppedController = cerulean.nav.stack.pop()
	var newTopController = cerulean.nav.stack.last()

	cerulean.dom.removeClass(newTopController, "hidden");
	cerulean.dom.removeClass(newTopController, "pushed");
	cerulean.dom.removeClass(newTopController, "viewing");
	
	setTimeout(function(){
		//poppedController.remove()
		cerulean.nav.setUserInteractionEnabled(true)
	}, 360);
}

cerulean.nav.setUserInteractionEnabled = function(enabled){
	if(!enabled && !cerulean.nav.overlay){
		cerulean.nav.overlay = document.createElement('div');		
		cerulean.dom.addClass(cerulean.nav.overlay, "overlay");
		var tag = document.getElementById("body");
		tag.appendChild(cerulean.nav.overlay);
	}else if(enabled && cerulean.nav.overlay){
		cerulean.nav.overlay.remove()
		cerulean.nav.overlay = null
	}
}

// ---[ GoogleMaps API  ]---

cerulean.map = {}

cerulean.map.style = mapStyle;
cerulean.map.view = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: {lat: -23.5607558, lng: -46.6597692},
    styles: cerulean.map.style,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    scrollwheel: false,
    noClear: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
    }
});

// ---[ DOM             ]---

cerulean.dom = {}
cerulean.dom.addClass = function(tag, className){
	if(tag.className.indexOf(className) == -1){
		tag.className += " " + className;
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
		var tag = document.getElementById(tagID);
		tag.innerHTML = cerulean.tpl.precompiled_templates[templateName](data)
	}

	if(cerulean.tpl.precompiled_templates[templateName]){
            display();
	}else{
		
            var r = new XMLHttpRequest();
            var base = java.getJARPath("templates/");
            var loc = base + templateName+".template.html";
            java.log("loading html template: " + loc);
            
            r.open("GET", loc, true);
            r.onreadystatechange = function () {
                
                if (r.readyState != 4 || r.status != 200){
                    java.log("Error loading template "+templateName+" (code "+r.status+")")
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

java.log("Cerulean JS loaded");