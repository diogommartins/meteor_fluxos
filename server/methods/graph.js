/**
 * Created by diogomartins on 4/6/16.
 */
Meteor.methods({
    getFluxo: function(id_tipo_doc){
        let fluxos = apiClient.get('V_FLUXOS', {
            ID_TIPO_DOC: id_tipo_doc,
            IND_ATIVO: 'S',
            LMIN: 1,
            LMAX: 1000
        });
        const graph = new FluxosParser(id_tipo_doc, fluxos.content).parse();

        Meteor.call('updateGraphDefinitions', graph);

        const edges = Edges.find({id_tipo_doc: id_tipo_doc}).fetch();
        const nodes = Nodes.find({id_tipo_doc: id_tipo_doc}).fetch();

        return edges.concat(nodes);
    },
    searchFluxos: function(name){
        let fluxos = apiClient.get('V_TIPOS_DOC', {
            DESCR_TIPO_DOC: name,
            LMIN: 1,
            LMAX: 100,
            ORDERBY: 'DESCR_TIPO_DOC'
        }, ['ID_TIPO_DOC', 'DESCR_TIPO_DOC'] );
        return fluxos.content;
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
    updateNodeData2: function(modifier, _id){
        console.log(`Atualizou no ${_id}    metodo deve ser renomeado`);
        return Nodes.update({_id: _id}, modifier);
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
    updateTramitacoes: function(id_documento){
        const tramitacoes = apiClient.call_procedure('TramitacoesComoGrafo', [{
            ID_DOCUMENTO: id_documento, 
            COD_OPERADOR: 9999
        }]);
        
        var uniqueCondition = tramitacao => ({ID_DOCUMENTO: tramitacao.ID_DOCUMENTO, SEQUENCIA: tramitacao.SEQUENCIA});
        
        tramitacoes.items.forEach(tramitacao => Tramitacoes.upsert(uniqueCondition(tramitacao.data), {$set: tramitacao.data}));
        Documentos.upsert({ID_DOCUMENTO: id_documento}, {$set: {ID_DOCUMENTO:id_documento, ID_TIPO_DOC: tramitacoes.id_tipo_doc}});
        
        return tramitacoes.id_tipo_doc;
    }
});