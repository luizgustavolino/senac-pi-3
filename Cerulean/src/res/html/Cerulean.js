
var cerulean = {}


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

java.log("Cerulean JS loaded");