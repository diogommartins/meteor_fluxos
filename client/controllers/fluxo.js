import {ReactiveGraph} from '../imports/graph/graph-reactive.js';


Template.graphContainer.rendered = function(){
    const cyGraph = this.data;
    const graph = new ReactiveGraph(cyGraph).renderGraph();
    Meteor.call('getFluxo', 217, function(error, elements){
        console.log('shit');        
    });
    graph.cy.ready(function (){
        const edges = Edges.find({graphId: graph.id}).fetch();
        const nodes = Nodes.find({graphId: graph.id}).fetch();
        const elements = edges.concat(nodes);

        graph.load(elements).applyStyle(cyGraph.layout);

        if(cyGraph.owner === Meteor.userId()){
            console.log("Dono");
            setInterval(function(){
                let snapshot = graph.cy.png({
                    full: true,
                    maxWidth: 300,
                    maxHeight: 300
                });
                Meteor.call('updateGraphThumbnail', cyGraph._id, snapshot);
            }, 5*1000)
        }
    })
};


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



