
// ---[ TEMPLATE LOADER ]---

cerulean.tpl = {
    precompiled_templates:{}
};

cerulean.tpl.show = function(tagID, templateName, data, callback){

	function display(){
		var tag = cerulean.dom.byID(tagID);
		if(tag) tag.innerHTML = cerulean.tpl.precompiled_templates[templateName](data);
        else sys.log("Empty tag: "+tagID);
        if(callback) callback();
	}

	if(cerulean.tpl.precompiled_templates[templateName]){
        display();
	}else{
		
        var r = new XMLHttpRequest();
        var base = sys.getPath("templates/");
        var loc = base + templateName+".template.html";
        
        r.onreadystatechange = function () {
            
            if (r.readyState != 4 && r.status != 200){
                sys.log("Error loading template "+templateName+" (code "+r.status+")")
            }else if(r.status == 200 && r.responseText){
                r.onreadystatechange = null;
                cerulean.tpl.precompiled_templates[templateName] = Handlebars.compile(r.responseText);
                display();    
            }
        };

        r.open("GET", loc, true);
        r.send();
	}
};