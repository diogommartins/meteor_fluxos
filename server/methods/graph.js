/**
 * Created by diogomartins on 4/6/16.
 */
Meteor.methods({
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
        edge.graphId = edge.data.graphId;
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
            { graphId: id },
            { $set: {graphId: id, elements:elements} });
        return result.numberAffected;
    },
    changeGraphLayout: function(id_tipo_doc, layout){
        console.log("changeGraphLayout: Tem certeza que você queria estar me chamando?");
        CyGraphs.update({graphId: id_tipo_doc}, {$set:{layout: layout}});
    },
    createNewGraph: function(){
        return CyGraphs.insert({name: 'Sem nome'});
    },
    
    updateGraphThumbnail: function(_id, png){
        const graph = CyGraphs.findOne(_id);
        if (graph.isOwnder()){
            CyGraphs.update(_id, {$set: {thumbnail: png}});
        } else{
            // todo
            console.log("Não é dono, deveria fazer alguma coisa...");    
        }
    }
});