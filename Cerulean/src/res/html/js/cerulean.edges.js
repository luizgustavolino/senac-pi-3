
// ---[ ARESTAS  ]---

cerulean.edges = {}
cerulean.edges.list = []
cerulean.edges.startCoordnate = null

cerulean.edges.make = function(from, to){

	// Função auxiliar para procurar
	// se a ligação já existe
	var checkDontHave = function(b) {
		return function(a){
			if(a.cerulean.reversable){
				var first 	= a.cerulean.first
				var second 	= a.cerulean.second
				return (first != a && second != b) && (first != b && second != a)
			}else return (a.cerulean.to != b);
		}
	}

	// primeiro verifica se essa ligação
	// já não existe na ida ou volta
	if(!from.cerulean.edgesOut.every(checkDontHave(to))){
		sys.log("Essa ligação já existe!");
		return;
	}

	if(!to.cerulean.edgesOut.every(checkDontHave(from))){
		to.cerulean.edgesOut.every(function(edge){
			if(edge.cerulean.to == from){

				edge.cerulean.reversable = true
				edge.cerulean.from 		= null
				edge.cerulean.to 		= null
				edge.cerulean.first 	= from
				edge.cerulean.second 	= to
				edge.setOptions(mapStyles.ReversableEdge)

				from.cerulean.edgesOut.push(edge)
				to.cerulean.edgesIn.push(edge)

				return false
			} else return true
		})
		return;
	}else{

		var edge = new google.maps.Polyline({
			path: [from.getPosition(), to.getPosition()],
        	map: cerulean.map.view
		});

		cerulean.edges.list.push(edge);
		edge.setOptions(mapStyles.Edge);

		edge.addListener('click', cerulean.edges.clickAndDeleteEdgeAction(edge));
		edge.cerulean = {};
		edge.cerulean.rid = cerulean.rid.next();
		edge.cerulean.reversable = false;
		edge.cerulean.from = from ;
		edge.cerulean.to = to;
		
		from.cerulean.edgesOut.push(edge);
		to.cerulean.edgesIn.push(edge);
	}
	
	cerulean.edges.updateUI()
}

cerulean.edges.remove = function(edge){

	if(edge.cerulean.reversable){
		edge.cerulean.first.cerulean.edgesIn.remove(edge)
		edge.cerulean.first.cerulean.edgesOut.remove(edge)
		edge.cerulean.second.cerulean.edgesIn.remove(edge)
		edge.cerulean.second.cerulean.edgesOut.remove(edge)
	}else{
		edge.cerulean.from.cerulean.edgesOut.remove(edge)
		edge.cerulean.to.cerulean.edgesIn.remove(edge)
	}

	google.maps.event.clearInstanceListeners(edge)
	edge.setMap(null)
	cerulean.edges.list.remove(edge)
	cerulean.edges.updateUI()
}

cerulean.edges.clickAndDeleteEdgeAction = function(edge){
	return function(){
		cerulean.edges.remove(edge)
	}
}

cerulean.edges.updateUI = function(){
	var connectedCount = cerulean.edges.list.length
	cerulean.dom.byID("arestas.cadastradas", ""+connectedCount)
	cerulean.dom.byID("arestas.cadastradas.descricao", connectedCount > 1 || connectedCount == 0 ?
		"Arestas cadastradas" : "Aresta cadastrada")
}