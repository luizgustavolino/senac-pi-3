
Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

// FROM: http://stackoverflow.com/questions/3954438/remove-item-from-array-by-value
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

cerulean.nav.map =
	{ options: [
        {
        	name:"Malha",
        	template:"malha",
        	next: {
        		options:[
        		{
        			name: "Vértices",
        			next: "vertices"
        		},
        		{
        			name: "Arestas",
        			next: "arestas"
        		}
        		]
        	}
        },
        { name:"Centrais", template:"centrais" },
        { name:"Rotas", template:"rotas" }
    ]}