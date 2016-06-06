
// ---[ NavController   ]---

cerulean.nav = {}
cerulean.nav.stack = []
cerulean.nav.counter = 1
cerulean.nav.onPush  = {}
cerulean.nav.onPop  = {}
cerulean.nav.dataFor = {}

cerulean.nav.setRootController = function(templateName, data){
	var controller = cerulean.nav.makeControllerForTemplate(templateName, data)
	cerulean.nav.stack = [controller]
}

cerulean.nav.makeControllerForTemplate = function(templateName, data){

	var newController = document.createElement('div');
	newController.className = "nav viewing"
	newController.templateName = templateName
	newController.id = "nav"+(cerulean.nav.counter++)

	if(cerulean.nav.dataFor[templateName]){
		data = cerulean.nav.dataFor[templateName]()
	}
	
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

cerulean.nav.setUserInteractionEnabled = function(enabled, showLoading){

	if(!enabled && !cerulean.nav.overlay){
		cerulean.nav.overlay = document.createElement('div');		
		cerulean.dom.addClass(cerulean.nav.overlay, "overlay");
		var tag = cerulean.dom.byID("body");
		tag.appendChild(cerulean.nav.overlay);
	}else if(enabled && cerulean.nav.overlay){
		cerulean.nav.overlay.remove()
		cerulean.nav.overlay = null
	}

	if(cerulean.nav.overlay && showLoading){
		cerulean.dom.addClass(cerulean.nav.overlay, "loading")
	}else if(cerulean.nav.overlay){
		cerulean.dom.removeClass(cerulean.nav.overlay, "loading")
	}
}