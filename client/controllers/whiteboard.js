/**
 * Created by diogomartins on 6/13/16.
 */

import {ReactiveGraph} from '../imports/graph/graph-reactive.js';
import {GraphAdjacencyHelper} from '../imports/graph/graph-adjacency.js';
import {GraphColoringHelper} from '../imports/graph/graph-coloring.js';

var snapper;

Template.whiteboard.rendered = function(){
    const cyGraph = this.data.cyGraph;
    const graph = new ReactiveGraph(cyGraph).renderGraph();

    graph.cy.ready(() => {
        graph.registerPlugin('adjacencyHelper', new GraphAdjacencyHelper());
        graph.registerPlugin('coloringHelper', new GraphColoringHelper());

        graph.load(this.data.elements).applyStyle(cyGraph.layout);
        
        if(cyGraph.owner === Meteor.userId()){
            snapper = setInterval(function(){
                Meteor.call('updateGraphThumbnail', cyGraph._id, graph.getSnapshot());
            }, 5*1000)
        }
    })
};

Template.whiteboard.onDestroyed(function(){
   clearInterval(snapper);
});