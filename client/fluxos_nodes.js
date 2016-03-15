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

            Meteor.call('renderGraph', graph, function(){
                var cy = this.cy;   // Depois do render, cy está em window.cy
                var menu = new CircularMenu($('.component-circular-menu')[0]);

                cy.on('click', function(event){
                    var target = event.cyTarget;
                    if (target !== cy){
                        if (target.isEdge()){
                            const fluxo = target.data();
                            menu.show(event.originalEvent, fluxo, event.cyRenderedPosition);
                            menu.currentEdge = fluxo;
                        } else
                        if (target.isNode()){
                            console.log("Node edit... Por enquanto, nada faz");
                            menu.hide();
                        }
                    } else if (target === cy){
                        const pan = event.cyTarget.pan();
                        const zoom = event.cyTarget.zoom();

                        const node = {
                            group:'nodes',
                            data: {id:'ttt', color:'rgb(0,0,255)'},
                            position:{
                                x: event.cyRenderedPosition.x * zoom + pan.x,
                                y: event.cyRenderedPosition.y * zoom + pan.y
                            }
                        };
                        cy.remove('node#ttt');
                        cy.add(node);
                        menu.hide();
                    }
                });
                cy.on('pan',function(event){
                    const pan = event.cyTarget.pan();
                    const zoom = event.cyTarget.zoom();

                    if(menu.isOpen()) {
                        var x =  menu.position.x * zoom + pan.x;
                        var y = menu.position.y * zoom + pan.y;

                        menu.updatePosition(x, y);
                    }
                });
                cy.on('zoom',function(event){
                    const zoom = event.cyTarget.zoom();
                    console.log("Zoom " + zoom);

                    //menu.updatePosition()
                    //menu.resize(factor);
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
                nodes: graph.nodes,
                edges: graph.edges
            },
            ready: function(){
                window.cy = this;
            }
        });
    }
});
