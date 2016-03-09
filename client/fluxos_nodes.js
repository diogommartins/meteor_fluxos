/**
 * Created by diogomartins on 3/8/16.
 */
Session.setDefault('nodes', []);
Session.setDefault('edges', []);

Template.searchForm.events({
    'submit': function(e){
        e.preventDefault();
        const id_tipo_doc = e.target.id_tipo_doc.value;

        Meteor.call('getFluxo', id_tipo_doc, function(error, response){
            var nodes = [];
            response.forEach(function(node, index, array){
                nodes.push({
                    data: {
                        id: node.ID_FLUXO,
                        name: node.DESCR_FLUXO,
                        faveColor: '#6FB1FC',
                        faveShape: 'ellipse'
                    },
                    situacao_atual: node.SITUACAO_ATUAL,
                    situacao_futura: node.SITUACAO_FUTURA
                });
            });
            Session.set('nodes', nodes);

            var edges = [];
            nodes.forEach(function(node, index, array){
                var matches = array.filter(function(other){return node.situacao_futura === other.situacao_atual});
                matches.forEach(function(match){
                   edges.push({
                       data: {
                           source: node.data.id,
                           target: match.data.id,
                           faveColor: '#6FB1FC'
                       }
                   });
                });
                Session.set('edges', edges);

            });

        });
        console.log(nodes);
        Meteor.call('renderGraph');

        e.target.id_tipo_doc.value = '';
    }
});


Meteor.methods({
    renderGraph: function(){
        cytoscape({
            container: document.getElementById('cy'),

            layout: {
                name: 'breadthfirst', // 'cose' sao os unicos rasoáveis
                fit: true,
                padding: 10
            },

            //style: cytoscape.stylesheet()
            //    .selector('node')
            //    .css({
            //        'width': 'mapData(weight, 40, 80, 20, 60)',
            //        'content': 'data(name)',
            //        'text-valign': 'center',
            //        'text-halign': 'center',
            //        'text-outline-width': 2,
            //        'text-outline-color': 'data(faveColor)',
            //        'background-color': 'data(faveColor)',
            //        'color': '#fff'
            //    })
            //    .selector(':selected')
            //    .css({
            //        'border-width': 3,
            //        'border-color': '#333'
            //    })
            //    .selector('edge')
            //    .css({
            //        'opacity': 0.666,
            //        'width': 'mapData(strength, 70, 100, 2, 6)',
            //        'target-arrow-shape': 'triangle',
            //        'source-arrow-shape': 'circle',
            //        'line-color': 'data(faveColor)',
            //        'source-arrow-color': 'data(faveColor)',
            //        'target-arrow-color': 'data(faveColor)'
            //    })
            //    .selector('edge.questionable')
            //    .css({
            //        'line-style': 'dotted',
            //        'target-arrow-shape': 'diamond'
            //    })
            //    .selector('.faded')
            //    .css({
            //        'opacity': 0.25,
            //        'text-opacity': 0
            //    }),

            elements:{
                nodes: Session.get('nodes'),
                edges: Session.get('edges')
            },
            ready: function(){
               window.cy = this;
            }
        });
    }
});