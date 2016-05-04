

var loader = {}
loader.precompiled_templates = {}

loader.show = function(tagID, templateName, data){

	function display(){
		var tag = document.getElementById(tagID);
		tag.innerHTML = loader.precompiled_templates[templateName](data)
	}

	if(loader.precompiled_templates[templateName]){
		display()
	}else{
		var r = new XMLHttpRequest();
		var loc = "templates/"+templateName+".template.html?rand=" + Math.random()
		r.open("GET", loc, true);
		r.onreadystatechange = function () {
  			if (r.readyState != 4 || r.status != 200) return;
  			loader.precompiled_templates[templateName] = Handlebars.compile(r.responseText);
			display()
		};
		r.send();
	}
}