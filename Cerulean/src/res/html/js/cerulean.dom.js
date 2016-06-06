
// ---[ DOM ]---

cerulean.dom = {}
cerulean.dom.addClass = function(tag, className){
	if(!tag) return;
	if(tag.className == null){
		tag.className = className
	}else if(tag.className.indexOf(className) == -1){
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
	if(!tag || !tag.className) return;
	if(tag.className.indexOf(className) != -1){
		var regex = new RegExp('(?:^|\\s)'+className+'(?!\\S)',"g");
		tag.className = tag.className.replace( regex ,'')
	}
}

cerulean.dom.swap = function(divOut, divIn) {
	cerulean.dom.addClass(cerulean.dom.byID(divOut), "hidden");
	cerulean.dom.removeClass(cerulean.dom.byID(divIn), "hidden");
}