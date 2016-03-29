/**
 * Created by diogomartins on 3/10/16.
 */
class Graph{
    constructor(id){
        this.id = id;
        this.edges = [];
        this.nodes = [];
        this.nodeColors = {};
        //this._makeGraph();
        /** @type cytoscape */
        this.cy = undefined;
        this.edgesMenu = new CircularMenu($('#edges-menu')[0]);
        this.nodesMenu = new CircularMenu($('#nodes-menu')[0]);
        /** @type CircularMenu */
        this.visibleMenu = undefined;
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
    getNodeByData(data){
        return this.nodes.find(ele => ele.data.id === data.id);
    }

    /**
     * 
     * @param id: String identificador único na collection Nodes
     * @return Nodes
     */
    getNodeById(id){
        return this.nodes.find(ele => ele._id === id);
    }

    _colorForNode(node){
        if (!this.nodeColors.hasOwnProperty(node.data.tipo))
            this.nodeColors[node.data.tipo] = randomColor({format: 'rgb'});
        return this.nodeColors[node.data.tipo];
    }

    _addColorDataToNodes(){
        for(let node of this.nodes){
            if (typeof node.data.color === 'undefined')
                node.data.color = this._colorForNode(node);
        }
    }

    _tempNode(){
        return {
            id_tipo_doc: this.id,
            group: 'nodes',
            data: {
                id: Date.now().toString(),
                id_tipo_doc: this.id,
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
    
    addElement(group, element){
        this[group].push(element);
        this.cy.add(element);
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
        this._addColorDataToNodes();
        this.cy.add(elements);
        return this;
    }
    
    changeLayout(layout){
        this.cy.makeLayout({name: layout}).run();
    }

    applyStyle(layout='circle'){
        this.cy.style(cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'background-color': 'data(color)',
                'width': '2em',
                'height': '2em'
            })
            .selector('edge')
            .css({
                'target-arrow-shape': 'triangle',
                'width': 2,
                'line-color': '#777',
                'target-arrow-color': '#666'
            })
            .selector(':selected')
            .css({
                'content': 'data(name)',
                'line-width': 2,
                'line-color': '#61bffc', // lightblue
                'text-outline-color': '#fff',
                'text-outline-width': 2,
                'target-arrow-color': '#61bffc'
            })
            .selector('.highlighted')
            .css({
                'background-color': '#61bffc',
                'line-color': '#61bffc',
                'target-arrow-color': '#61bffc'
            })
        );
        this.cy.layout({
            name: layout,
            //fit: true,
            padding: 30,
            directed: true,
            roots: "#1"
        });
        return this;
    }

    renderGraph(){
        var self = this;
        this.cy = cytoscape({
            container: document.getElementById('cy'),

            zoom: 1,
            zoomingEnabled: false,

            ready: function(){
                window.graph = self;
            }
        });
        return this;
    }
}

this.Graph = Graph;
