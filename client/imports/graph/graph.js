/**
 * Created by diogomartins on 3/10/16.
 */
import {CircularMenu} from './graph-menu';


export class Graph{
    constructor(cyGraph, containerId='cy'){
        this.id = cyGraph._id;
        this.container = document.getElementById(containerId);
        this.edges = [];
        this.nodes = [];
        //this._makeGraph();
        /** @type cytoscape */
        this.cy = undefined;
        this.edgesMenu = new CircularMenu($('#edges-menu')[0]);
        this.nodesMenu = new CircularMenu($('#nodes-menu')[0]);
        /** @type CircularMenu */
        this.visibleMenu = undefined;
        this.document = cyGraph;
        this.plugins = {};
    }
    
    registerPlugin(name, plugin){
        plugin.graphRendered = this;
        this.plugins[name] = plugin;
        
        return this;
    }

    showMenu(type, ...args) {
        this.hideMenu();
        /** @type CircularMenu */
        const menu = this[type];
        menu.show(...args);
        this.visibleMenu = menu;

        return menu;
    }

    hideMenu(){
        if (typeof this.visibleMenu !== 'undefined'){
            this.visibleMenu.hide();
            this.visibleMenu = undefined;
        }
    }

    hasNode(node){
        return this.nodes.filter(n => n.data.id === node.data.id).length !== 0;
    }

    addNode(name, fluxo) {
        var node = {
            data: {
                id: name,
                name: name,
                tipo: fluxo.TIPO_DESTINO.toString() + fluxo.ID_DESTINO.toString()
            }
        };
        if (!this.hasNode(node))
            this.nodes.push(node);
    }

    /**
     * retorna se o nó está ou não sendo arrastado pelo usuário 
     * @param node: Nodes
     * @return boolean
     */
    isGrabbed(node){
        const graphNode = this.cy.getElementById(node.data.id);
        return graphNode.grabbed();
    }

    /**
     * 
     * @param data: Object
     * @return Nodes
     */
    getElementByData(group, data){
        return this[group].find(ele => ele.data.id === data.id);
    }

    /**
     * 
     * @param id: String identificador único na collection Nodes
     * @return Nodes
     */
    getElementById(group, id){
        return this[group].find(ele => ele._id === id);
    }

    _tempNode(){
        return {
            graphId: this.id,
            group: 'nodes',
            data: {
                id: Date.now().toString(),
                graphId: this.id,
                name: 'Clique para editar',
                color:'rgb(100, 100, 100)'
            }
        }
    }

    /**
     *
     * @param {{x: number, y: number}} position
     */
    insertNewTempNode(position){
        var node = this._tempNode();
        node.position = position;
        Meteor.call('insertNode', node, function(error, newId){
            node._id = newId;
        });
    }
    
    _registerEventHandlers(){
        this.cy.on(FluxoEventHandlers.cytoscape);
        this.cy.nodes().on(FluxoEventHandlers.nodes);
        this.cy.edges().on(FluxoEventHandlers.edges);
        
        for(let p in this.plugins){
            if (typeof this.plugins[p].eventHandlers === 'function')
                this.cy.on(this.plugins[p].eventHandlers());
        }
    }
    
    addElement(group, element){
        this[group].push(element);
        this.cy.add(element).on(FluxoEventHandlers[group]);
    }

    removeElement(group, element){
        /** @type Array */
        const collection = this[group];
        var index = collection.indexOf(element);
        collection.splice(index, 1);
        let cyElement = this.cy.getElementById(element.data.id);
        cyElement.remove();
    }

    /**
     * Dada uma posição, a função retornará uma posição relativa ao deslocamento de pan e zoom
     * @param position
     * @returns {{x: number, y: number}}
     */
    relativePosition(position){
        const pan = this.cy.pan();
        const zoom = this.cy.zoom();
        return {
            x: position.x * zoom + pan.x,
            y: position.y * zoom + pan.y
        }
    }

    refresh(){
        this.cy.elements("node:visible").select().unselect();
    }
    
    load(elements){
        elements.forEach(element => this[element.group].push(element));
        this.cy.add(elements);
        this._registerEventHandlers();
        return this;
    }
    
    changeLayout(layout){
        this.cy.makeLayout({name: layout}).run();
    }

    applyStyle(layout='circle', directed=false){
        this.cy.style(cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'text-valign': 'center',
                'text-halign': 'center',
                'background-color': 'data(color)',
                'width': '2em',
                'height': '2em'
            })
            .selector('edge')
            .css({
                'width': 2,
                'line-color': '#777'
            })
            .selector(':selected')
            .css({
                'content': 'data(name)',
                'line-color': '#61bffc', // lightblue
                'text-outline-color': '#fff',
                'text-outline-width': 2,
                'target-arrow-color': '#61bffc'
            })
            .selector('.highlighted')
            .css({
                'background-color': '#2e6da4',
                'line-color': '#2e6da4',
                'target-arrow-color': '#2e6da4',
            })
            .selector('.walkedby')
            .css({
                'background-color': '#3f903f',
                'line-color': '#3f903f',
                'target-arrow-color': '#3f903f',
                'line-width': 2
            })
        );
        this.cy.layout({
            name: layout,
            //fit: true,
            padding: 10,
            directed: false,
            roots: "#node_1"
        });
        return this;
    }

    renderGraph(){
        var self = this;
        this.cy = cytoscape({
            container: this.container,

            zoom: 1,
            zoomingEnabled: false,

            ready: function(){
                window.graph = self;
                // todo: deveria escutar outro evento ou esse custom é aceitavel?
                $(self.container).trigger('graph.didRender', self);
            }
        });
        return this;
    }
}

this.Graph = Graph;
