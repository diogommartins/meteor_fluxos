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
            const parser = new FluxosParser(id_tipo_doc, fluxos);
            const graph = parser.parse();
            
            const elements = [];
            // Meteor.call('saveGraph', id_tipo_doc, elements);

            Meteor.call('updateGraphDefinitions', graph);
            const edges = Edges.find({id_tipo_doc: Number(id_tipo_doc)}).fetch();
            const nodes = Nodes.find({id_tipo_doc: Number(id_tipo_doc)}).fetch();

            elements.push(...edges, ...nodes);
            return elements;
        }
        else{
            console.log("ERRO AO CONSULTAR TIPO " + id_tipo_doc);
        }
    },
    updateGraphDefinitions: function(elements){
        var uniqueNodeCondition = function(node){
            return {id_tipo_doc: node.id_tipo_doc, 'data.id': node.data.id};
        };
        var uniqueEdgeCondition = function(edge){
            return {id_tipo_doc: edge.id_tipo_doc, 'data.source': edge.data.source, 'data.target': edge.data.target};
        };
        elements.nodes.forEach(node => Nodes.upsert(uniqueNodeCondition(node), {$set: node}));
        elements.edges.forEach(edge => Edges.upsert(uniqueEdgeCondition(edge), {$set: edge}));
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
        return Edges.insert(edge);
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
    }
});
