/**
 * Created by diogomartins on 6/13/16.
 */

import {ReactiveGraph} from '../imports/graph/graph-reactive.js';

Template.whiteboard.rendered = function(){
    var id_tipo_doc = 999;
    const graph = new ReactiveGraph(999).renderGraph();

    graph.cy.ready(function (){
        // todo: elements pode ser salvo e recuperado de uma sessão ou sempre começa do zero?
        const elements = [];
        graph.load(elements).applyStyle('preset');

    })
};