Handlebars.registerHelper("icon", function (type) {
    
	var tag 	= "<span class=\""+type+"\">"
	tag 		+= "<img src=\""

	switch(type){
		case "go":
			tag += ""
			break
		default: break
	}

	tag += "\"/>"
	return tag
});