import {ReactiveGraph} from '../imports/graph/graph-reactive.js';

var snapper;

Template.graphContainer.rendered = function(){
    const cyGraph = this.data.cyGraph;
    const graph = new ReactiveGraph(cyGraph).renderGraph();

    graph.cy.ready(() => {
        graph.load(this.data.elements).applyLayout(cyGraph.layout, cyGraph.options.isDirected);

        if(cyGraph.owner === Meteor.userId()){
            snapper = setInterval(function(){
                Meteor.call('updateGraphThumbnail', cyGraph._id, graph.getSnapshot());
            }, 5*1000)
        }
    })
};

Template.graphContainer.onDestroyed(function(){
    clearInterval(snapper);
});


// Template => fluxo
Template.fluxo.helpers({
    name: function(){
        return CyGraphs.findOne({id_tipo_doc: this.id_tipo_doc}).name;
    }
});

Template.fluxo.events({
    'click .save-graph': function(event, template){
        /** @type Graph **/
        const graph = window.graph;
        var elements = graph.cy.elements().jsons();
        // Meteor.call('saveGraph', this.id_tipo_doc, elements);
        alert("Desabilitado: Nada acontece");
    }
});



