/**
 * Created by diogomartins on 6/13/16.
 */

import {ReactiveGraph} from '../imports/graph/graph-reactive.js';

Template.whiteboard.rendered = function(){
    const cyGraph = this.data;
    const graph = new ReactiveGraph(cyGraph).renderGraph();


    graph.cy.ready(function (){
        // todo: elements pode ser salvo e recuperado de uma sessão ou sempre começa do zero?
        const edges = Edges.find({graphId: graph.id}).fetch();
        const nodes = Nodes.find({graphId: graph.id}).fetch();
        
        const elements = edges.concat(nodes);
        graph.load(elements).applyStyle(cyGraph.layout);

    })
};