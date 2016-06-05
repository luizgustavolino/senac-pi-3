
Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

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
        { name:"Rotas", template:"rotas" },
        { name:"Salvar", template:"salvar",next: { options:[] }}
    ]}