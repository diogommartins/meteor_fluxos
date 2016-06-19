/**
 * Created by diogomartins on 6/14/16.
 */
import {Graph} from './graph.js';

export class ReactiveGraph extends Graph{
    constructor(cyGraph, containerId='cy'){
        super(cyGraph, containerId);
        this.edgesObserver = undefined;
        this.nodesObserver = undefined;
        this.cyGraphsObserver = undefined;
    }
    /**
     *
     * @returns {{added: added, changed: changed, removed: removed}}
     */
    edgesObserverHandler(){
        return {
            added: (_id, newEdge) => {
                if (typeof this.edgesObserver === 'undefined') return;
                newEdge._id = _id;
                this.addElement('edges', newEdge);
            },
            changed: (_id, data) => {
                if (typeof data.data === 'object'){
                    const updatedEdgeData = data.data;
                    this.cy.getElementById(updatedEdgeData.id).data(updatedEdgeData);
                }
            },
            removed: (_id) => {
                let edge = this.getElementById('edges', _id);
                this.removeElement('edges', edge);
                this.refresh();
                if (typeof this.visibleMenu !== 'undefined'){
                    if (this.visibleMenu.currentItem._id === edge._id){
                        this.hideMenu();
                    }
                }
            }
        }
    }

    /**
     *
     * @returns {{added: added, changed: changed, removed: removed}}
     */
    nodesObserverHandler(){
        return {
            added: (_id, newNode) => {
                if (typeof this.nodesObserver === 'undefined') return;
                newNode._id = _id;
                this.addElement('nodes', newNode);
            },
            changed: (_id, data) => {
                const node = graph.getElementById('nodes', _id);
                if ((typeof data.position !== 'undefined') && (!this.isGrabbed(node))){
                    const currentPosition = this.cy.$("#" + node.data.id).position();

                    if (!_.isEqual(currentPosition, data.position.x)){
                        this.cy.$("#" + node.data.id).position(data.position);
                    }
                }
                else if (typeof data.data === 'object'){
                    const updatedNodeData = data.data;
                    this.cy.getElementById(updatedNodeData.id).data(updatedNodeData);
                }
            },
            removed: (_id) => {
                let node = this.getElementById('nodes', _id);

                this.removeElement('nodes', node);
                this.refresh();
            }
        }
    }

    cyGraphsObserverHandler(){
        return {
            changed: (_id, data) => {
                if (typeof data.options.isDirected !== 'undefined'){
                    (data.options.isDirected) ? this.applyStyle('directed') : this.applyStyle('undirected');
                }
                console.log(_id, data);
            }
        }
    }

    __observeChanges(){
        this.edgesObserver = Edges.find({graphId: this.id}).observeChanges(this.edgesObserverHandler());
        this.nodesObserver = Nodes.find({graphId: this.id}).observeChanges(this.nodesObserverHandler());
        this.cyGraphsObserver = CyGraphs.find(this.id, {fields: {options: 1, layout: 1, privacy: 1}}).observeChanges(this.cyGraphsObserverHandler());
    }

    renderGraph(){
        super.renderGraph();
        this.cy.ready(() => this.__observeChanges());
        return this;
    }
}

this.ReactiveGraph = ReactiveGraph;