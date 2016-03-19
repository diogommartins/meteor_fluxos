/**
 * Created by diogomartins on 3/10/16.
 */
class Graph{
    constructor(id, fluxos){
        this.id = id;
        this.fluxos = fluxos;
        this.edges = [];
        this.nodes = [];
        this.nodeColors = {};
        this._makeGraph();
        this._addColorDataToNodes();
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

    _makeGraph(){
        var self = this;
        this.fluxos.forEach(function(fluxo){
            self.edges.push({
                data: {
                    source: fluxo.SITUACAO_ATUAL,
                    target: fluxo.SITUACAO_FUTURA,
                    name: fluxo.DESCR_FLUXO
                }
            });
            self.addNode(fluxo.SITUACAO_ATUAL, fluxo);
            self.addNode(fluxo.SITUACAO_FUTURA, fluxo);
        });
        this._updateDataModel();
    }

    _updateDataModel(){
        const fluxo = {id_tipo_doc: this.id, edges: this.edges, nodes: this.nodes};
        Meteor.call('updateFluxos', fluxo);
    }

    _colorForNode(node){
        if (!this.nodeColors.hasOwnProperty(node.data.tipo))
            this.nodeColors[node.data.tipo] = randomColor({format: 'rgb'});
        return this.nodeColors[node.data.tipo];
    }

    _addColorDataToNodes(){
        var self = this;
        this.nodes.forEach(node => {node.data.color = self._colorForNode(node)});
    }

    static _tempNode(){
        return {
            group: 'nodes',
            data: {
                id:'tempNode_' + Date.now(),
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
        var node = Graph._tempNode();
        node.position = position;

        this.cy.add(node);
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

    renderGraph(){
        var self = this;
        this.cy = cytoscape({
            container: document.getElementById('cy'),

            zoom: 1,
            zoomingEnabled: false,

            layout: {
                name: 'breadthfirst', // breadthfirst 'cose' sao os unicos rasoáveis
                //fit: true,
                padding: 30,
                directed: true,
                roots: "#1"
            },

            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'content': 'data(name)',
                    'background-color': 'data(color)'
                })
                .selector('edge')
                .css({

                    'target-arrow-shape': 'triangle',
                    'width': 4,
                    'line-color': '#ddd',
                    'target-arrow-color': '#ddd'
                })
                .selector(':selected')
                .css({
                    'content': 'data(name)',
                    'line-width': 2,
                    'line-color': '#61bffc', // lightblue
                    'text-outline-color': '#fff',
                    'text-outline-width': 3
                })
                .selector('.highlighted')
                .css({
                    'background-color': '#61bffc',
                    'line-color': '#61bffc',
                    'target-arrow-color': '#61bffc'
                }),

            elements:{
                nodes: function(){return self.nodes},
                edges: self.edges
            },
            ready: function(){
                window.cy = this;
                Meteor.call('updateFluxos');
            }
        });
    }
}

this.Graph = Graph;
