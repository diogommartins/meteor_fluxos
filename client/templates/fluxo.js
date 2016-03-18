Template.graphContainer.created = function(){
    var id_tipo_doc = this.data.id_tipo_doc;
    Meteor.call('getFluxo', id_tipo_doc, function(error, fluxos){
        var graph = new Graph(fluxos);
        graph.renderGraph();

        graph.cy.ready(function(){
            var cy = this;

            cy.on('click', function(event){
                var target = event.cyTarget;
                if (target !== cy){
                    if (target.isEdge()){
                        const edge = target.data();
                        graph.showMenu('edgesMenu', event.originalEvent, edge, event.cyRenderedPosition);
                        //graph.edgesMenu.show(event.originalEvent, fluxo, event.cyRenderedPosition);
                    }
                    else if (target.isNode()){
                        const node = target.data();
                        graph.showMenu('nodesMenu', event.originalEvent, node, event.cyRenderedPosition);
                    }
                } else if (target === cy){
                    graph.hideMenu();
                    if (event.originalEvent.ctrlKey){
                        const pan = event.cyTarget.pan();
                        const zoom = event.cyTarget.zoom();

                        const node = {
                            group:'nodes',
                            data: {
                                id:'tempNode_' + Date.now(),
                                name: 'Clique para editar',
                                color:'rgb(100, 100, 100)'
                            },
                            position:{
                                x: event.cyRenderedPosition.x * zoom + pan.x,
                                y: event.cyRenderedPosition.y * zoom + pan.y
                            }
                        };
                        cy.add(node);
                    }
                }
            });
            cy.on('pan',function(event){
                const pan = event.cyTarget.pan();
                const zoom = event.cyTarget.zoom();

                if(typeof graph.visibleMenu !== 'undefined' && graph.visibleMenu.isOpen()){
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