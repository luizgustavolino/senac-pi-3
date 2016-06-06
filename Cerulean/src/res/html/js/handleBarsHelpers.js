
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
        {
            name:"Centrais",
            template:"centrais",
            next: {
                options:[
                    {
                        name: "Cadastrar",
                        next: "central.cadastrar"
                    }
                ]
            }
        },
        {
            name:"Rotas",
            template:"rotas",
            next: { options: []}
        }
    ]}