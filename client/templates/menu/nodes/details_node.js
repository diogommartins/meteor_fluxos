/**
 * Created by diogomartins on 3/31/16.
 */
Template.detailsNode.helpers({
    connectedEdges: function(){
        /** @type: Graph */
        const graph = window.graph;
        const connectedElemsEdges =  graph.cy.getElementById(this.data.id).connectedEdges();
        return connectedElemsEdges.map(edge => edge.data());
    }
});