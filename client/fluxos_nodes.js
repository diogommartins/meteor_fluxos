/**
 * Created by diogomartins on 3/8/16.
 */
Session.setDefault('nodes', []);
Session.setDefault('edges', []);

Template.searchForm.events({
    'submit': function(e){
        e.preventDefault();
        const id_tipo_doc = e.target.id_tipo_doc.value;

        Meteor.call('getFluxo', id_tipo_doc, function(error, fluxos){
            var graph = new Graph(fluxos);
            var menu = new CircularMenu($('.component-circular-menu')[0]);
            Meteor.call('renderGraph', graph, function(){
                this.cy.on('click', 'edge', function(event){
                    const fluxo = this.data();
                    menu.show(event.originalEvent, fluxo, event.cyRenderedPosition);
                    menu.currentTarget = fluxo;
                });
                this.cy.on('unselect', 'edge', function(event){
                    const previousTarget = event.cyTarget.data();
                    if(typeof menu.currentTarget !== 'undefined')
                        menu.currentTarget = undefined;
                    else
                        menu.hide();

                });
                this.cy.on('pan',function(event){
                    if(menu.isOpen()) {
                        var pan = event.cyTarget.pan();

                        var x = menu.position.x + pan.x;
                        var y = menu.position.y + pan.y;

                        menu.updatePosition(x, y);
                    }
                });
                this.cy.on('zoom',function(event){
                    const factor = event.cyTarget.zoom();
                    console.log("Zoom " + factor);
                    menu.resize(factor);
                });
            });
        });

        e.target.id_tipo_doc.value = '';
    }
});


Meteor.methods({
    renderGraph: function(graph){
        var colors = {};
        graph.nodes.forEach(function(node){
            if (typeof colors[node.data.tipo] === 'undefined')
                colors[node.data.tipo] = randomColor({format: 'rgb'});
            node.data.color = colors[node.data.tipo];
        });
        cytoscape({
            container: document.getElementById('cy'),
            zoomingEnabled: false,
            userZoomingEnabled: false,
            panningEnabled: false,
            userPanningEnabled: false,


            layout: {
                name: 'breadthfirst', // breadthfirst 'cose' sao os unicos rasoáveis
                fit: true,
                padding: 30,
                directed: true,
                roots: "#1"
            },

            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'content': 'data(id)',
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
                    'line-width': 3,
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
                nodes: graph.nodes,
                edges: graph.edges
            },
            ready: function(){
                window.cy = this;
            }
        });
    }
});
