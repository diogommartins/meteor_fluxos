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
            var menu = new CircularMenu();
            Meteor.call('renderGraph', graph, function(){
                this.cy.on('click', 'edge', function(event){
                    const edge = this.data();
                    menu.show(event.originalEvent, edge, event.cyRenderedPosition);
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
                    'line-color': '#333'
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
