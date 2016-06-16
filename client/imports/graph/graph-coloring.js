/**
 * Created by diogomartins on 6/13/16.
 */
import {GraphAdjacencyHelper} from './graph-adjacency';
import {Meteor} from 'meteor/meteor';
import { Session } from 'meteor/session'

export class GraphColoringHelper{
    constructor(){
        /** @type: Graph */
        this.graph = undefined;
        this.colors = [];
    }

    newColor(){
        var color = randomColor({format: 'rgb'});

        if (_.contains(this.colors, color))
            return this.newColor();

        return color;
    }

    shouldReactToEvents(){
        return Session.get('autoColor');
    }

    getColor(i){
        while (this.colors.length <= i){
            this.colors.push(this.newColor());
        }
        return this.colors[i];
    }

    updateNodeColor(elementId, colorId){
        const node = this.graph.getElementByData('nodes', {id: elementId});
        const data = {'data.color': this.getColor(colorId)};
        Meteor.call('updateNodeData', node, data);
    }

    graphDidChange(){
        if (this.shouldReactToEvents())
            this.colorNodes();
    }

    /**
     * Escuta os eventos de add e remove de elementos no grafo
     *
     * @returns {{add: function, remove: function}}
     */
    eventHandlers(){
        return {
            add: () => this.graphDidChange(),
            remove: () => this.graphDidChange()
        }
    }

    /**
     * 1. Color first vertex with first color.
     * 2. Do following for remaining V-1 vertices.
     * a) Consider the currently picked vertex and color it with the
     * lowest numbered color that has not been used on any previously
     * colored vertices adjacent to it. If all previously used colors
     * appear on vertices adjacent to v, assign a new color to it.
     */
    colorNodes(){
        const aList = this.graph.plugins.adjacencyHelper.list(),
            nodes = Object.keys(aList),
            V = nodes.length,
            result = {};

        for (let node of nodes)
            result[node] = -1;

        // Assign the first color to first vertex
        result[nodes[0]] = 0;

        const available = new Array(V);

        for (let cr = 0; cr < V; cr++)
            available[cr] = false;

        for (let u=0; u<V; u++){
            const connections = GraphAdjacencyHelper.dataFromCollection(aList[nodes[u]].connected, 'id');

            for (let conn of connections) {
                if (result[conn] != -1)
                    available[result[conn]] = true;
            }

            // Find the first available color
            let color;
            for (color = 0; color < V; color++) {
                if (available[color] == false)
                    break;
            }

            result[nodes[u]] = color; // Assign the found color

            this.updateNodeColor(nodes[u], color);

            // Reset the values back to false for the next iteration
            for (let conn of connections) {
                if (result[conn] != -1)
                    available[result[conn]] = false;
            }
        }

        //Object.keys(result).forEach(ele => console.log(ele, '->', this.getColor(result[ele])));
    }

}