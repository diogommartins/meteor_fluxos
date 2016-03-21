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
            const elements = parser.parse();
            
            Meteor.call('updateGraphDefinitions', elements);
            return {
                name: elements.name,
                edges: Edges.find({id_tipo_doc: Number(id_tipo_doc)}).fetch(),
                nodes: Nodes.find({id_tipo_doc: Number(id_tipo_doc)}).fetch()
            };
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
    removeNode: function(node){
        Nodes.remove(node._id);
    },
    /**
     *
     * @param id: Number
     * @param elements: [Objects]
     * @returns Number
     */
    saveGraph: function(id, elements){
        id = Number(id);
        let result = CyGraphs.upsert({id_tipo_doc: id}, {$set: {id_tipo_doc: id, elements:elements}});
        console.log(elements[0]);
        return result.numberAffected;
    }
});
