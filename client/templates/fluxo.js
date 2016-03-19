Template.graphContainer.created = function(){
    var id_tipo_doc = this.data.id_tipo_doc;
    Meteor.call('getFluxo', id_tipo_doc, function(error, fluxos){
        var graph = new Graph(id_tipo_doc, fluxos);
        graph.renderGraph();

        graph.cy.ready(function(){
            var cy = this;

            cy.on('tap', event => {
                var target = event.cyTarget;
                if (target !== cy){
                    if (target.isEdge()){
                        let edge = target.data();
                        graph.showMenu('edgesMenu', event.originalEvent, edge, event.cyRenderedPosition);
                    }
                    else if (target.isNode()){
                        let node = target.data();
                        graph.showMenu('nodesMenu', event.originalEvent, node, event.cyRenderedPosition).changeBackgroundColor(node.color);
                    }
                } else if (target === cy){
                    graph.hideMenu();
                    if (event.originalEvent.ctrlKey){
                        const position = graph.relativePosition(event.cyRenderedPosition);
                        graph.insertNewTempNode(position);
                    }
                }
            });
            cy.on('taphold', event => {
                var target = event.cyTarget;
                if (target === cy){
                    const position = graph.relativePosition(event.cyRenderedPosition);
                    graph.insertNewTempNode(position);
                }
            });
            cy.on('pan',function(event){
                const pan = event.cyTarget.pan();
                const zoom = event.cyTarget.zoom();

                if(typeof graph.visibleMenu !== 'undefined'){
                    graph.visibleMenu.updatePosition({
                        x: graph.visibleMenu.position.x * zoom + pan.x,
                        y: graph.visibleMenu.position.y * zoom + pan.y
                    });
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
};

Template.graphContainer.events({
    'nodeDidChange': function(event, template){
        console.log('nodeDidChange');
    },
    'graphDidUpdate': function(event, template){
        console.log('nodeDidChange');
    }
});