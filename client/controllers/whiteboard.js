/**
 * Created by diogomartins on 6/13/16.
 */

import {ReactiveGraph} from '../imports/graph/graph-reactive.js';
import {GraphAdjacencyHelper} from '../imports/graph/graph-adjacency.js';
import {GraphColoringHelper} from '../imports/graph/graph-coloring.js';


Template.whiteboard.rendered = function(){
    const cyGraph = this.data;
    const graph = new ReactiveGraph(cyGraph).renderGraph();

    graph.cy.ready(function (){
        const edges = Edges.find({graphId: graph.id}).fetch();
        const nodes = Nodes.find({graphId: graph.id}).fetch();
        
        const elements = edges.concat(nodes);

        graph.registerPlugin('adjacencyHelper', new GraphAdjacencyHelper());
        graph.registerPlugin('coloringHelper', new GraphColoringHelper());

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