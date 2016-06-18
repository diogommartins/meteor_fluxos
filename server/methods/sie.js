/**
 * Created by diogomartins on 6/18/16.
 */
Meteor.methods({
    getDocumento: (id_tipo_doc) =>{
        let fluxos = apiClient.get('V_FLUXOS', {
            ID_TIPO_DOC: id_tipo_doc,
            IND_ATIVO: 'S',
            LMIN: 1,
            LMAX: 1000
        });
        const graph = new FluxosParser(id_tipo_doc, fluxos.content).parse();
        const async = Meteor.call('updateGraphDefinitions', graph);

        return Meteor.wrapAsync(async);
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
     * @param graph: {{nodes:[], edges:[], name:String, graphId:Number}}
     */
    updateGraphDefinitions: function(graph){
        let sieDocumento = Documentos.findOne({id_tipo_doc: graph.id_tipo_doc});
        var cyGraphId;

        if (typeof sieDocumento !== 'undefined') {
            cyGraphId = sieDocumento.graphId;
        }
        else {
            // Ainda não existe um grafo
            cyGraphId = CyGraphs.insert({
                name: graph.name,
                kind: 'fluxo',
                layout: 'circle',
                options: {
                    isDirected: true
                }
            });
            Documentos.insert({
                id_tipo_doc: graph.id_tipo_doc,
                graphId: cyGraphId
            })
        }

        var uniqueNodeCondition = function(node){
            return {graphId: cyGraphId, 'data.id': node.data.id};
        };

        var uniqueEdgeCondition = function(edge){
            return {graphId: cyGraphId, 'data.source': edge.data.source, 'data.target': edge.data.target};
        };

        graph.nodes.forEach(function(node){
            node.data.graphId = cyGraphId;
            Nodes.upsert(uniqueNodeCondition(node), {$set: node})
        });

        graph.edges.forEach(function(edge){
            edge.data.graphId = cyGraphId;
            Edges.upsert(uniqueEdgeCondition(edge), {$set: edge})
        });
        console.log('hmm ', cyGraphId);

        return cyGraphId;
        // CyGraphs.upsert({graphId: cyGraphId}, {$set: {name: graph.name, kind: 'fluxo'}});
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
    },
});