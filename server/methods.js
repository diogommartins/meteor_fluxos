/**
 * Created by diogomartins on 3/10/16.
 */
Meteor.methods({
    getFluxo: function(id_tipo_doc){
        const url = "http://sistemas.unirio.br/api/V_FLUXOS?FORMAT=JSON&LMAX=100&ID_TIPO_DOC="+id_tipo_doc+"&IND_ATIVO=S&API_KEY=9287c7e89bc83bbce8f9a28e7d448fa7366ce23f163d2c385966464242e0b387e3a34d0e205cb775d769a44047995075&LMIN=1";
        console.log("Consultando: " + url);

        const result = HTTP.get(url);
        if (result.statusCode == 200){
            const fluxos = result.data.content;
            const graph = new FluxosParser(id_tipo_doc, fluxos).parse();

            Meteor.call('updateGraphDefinitions', graph);

            const edges = Edges.find({id_tipo_doc: id_tipo_doc}).fetch();
            const nodes = Nodes.find({id_tipo_doc: id_tipo_doc}).fetch();

            return edges.concat(nodes);
        }
        else{
            console.log("ERRO AO CONSULTAR TIPO " + id_tipo_doc);
        }
    },
    /**
     * 
     * @param graph: {{nodes:[], edges:[], name:String, id_tipo_doc:Number}}
     */
    updateGraphDefinitions: function(graph){
        var uniqueNodeCondition = function(node){
            return {id_tipo_doc: node.id_tipo_doc, 'data.id': node.data.id};
        };
        var uniqueEdgeCondition = function(edge){
            return {id_tipo_doc: edge.id_tipo_doc, 'data.source': edge.data.source, 'data.target': edge.data.target};
        };
        graph.nodes.forEach(node => Nodes.upsert(uniqueNodeCondition(node), {$set: node}));
        graph.edges.forEach(edge => Edges.upsert(uniqueEdgeCondition(edge), {$set: edge}));
        
        CyGraphs.upsert({id_tipo_doc: graph.id_tipo_doc}, {$set: {name: graph.name}});
    },
    /**
     * Remove nó no array de elements do grafo correspondente
     * @param node: Nodes
     */
    removeNode: function(node){
        return Nodes.remove({_id: node._id});
    },
    /**
     * Insere nó no array de elements do grafo correspondente 
     * @param node: Nodes
     * @return newId: Number
     */
    insertNode: function(node){
        return Nodes.insert(node);
    },
    updateNodeData: function(node, data){
        return Nodes.update({_id: node._id}, {$set: data});
    },
    /**
     * Insere aresta no array de elements do grafo correspondente
     * @param edge: Edges
     * @return newId: Number
     */
    insertEdge: function(edge){
        edge.id_tipo_doc = edge.data.id_tipo_doc;
        edge.data.id = 'temp_' + Date.now().toString();
        console.log("Inserindo nova aresta");
        return Edges.insert(edge);
    },
    updateEdgeData: function(modifier, _id){
        return Edges.update({_id: _id}, modifier);
    },
    /**
     * Remove aresta no array de elements do grafo correspondente
     * @param edge: Edges
     */
    removeEdge: function(edge){
        return Edges.remove({_id: edge._id});
    },
    /**
     *
     * @param id: Number
     * @param elements: [Objects]
     * @returns Number
     */
    saveGraph: function(id, elements){
        id = Number(id);
        let result = CyGraphs.upsert(
            { id_tipo_doc: id },
            { $set: {id_tipo_doc: id, elements:elements} });
        return result.numberAffected;
    },
    changeGraphLayout: function(id_tipo_doc, layout){
        console.log("changeGraphLayout: Tem certeza que você queria estar me chamando?");
        CyGraphs.update({id_tipo_doc: id_tipo_doc}, {$set:{layout: layout}});
    },
    debugClear: function(){
        Edges.remove({});
        Nodes.remove({});
        CyGraphs.remove({});
    }
});
