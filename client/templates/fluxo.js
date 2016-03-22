
Template.graphContainer.created = function(){
    const id_tipo_doc = Number(this.data.id_tipo_doc);

    //let cyGraph = CyGraphs.findOne({id_tipo_doc: id_tipo_doc});

    Meteor.call('getFluxo', id_tipo_doc, function(error, elements){
        var graph = new Graph(id_tipo_doc).renderGraph();

        graph.cy.ready(function () {
            var cy = this;
            graph.load(elements).applyStyle('breadthfirst');

            var nodesObserver = Nodes.find({id_tipo_doc: id_tipo_doc}).observeChanges({
                added: function (_id, newNode) {
                    if (!nodesObserver) return;
                    newNode._id = _id;
                    graph.addElement('nodes', newNode);
                },
                changed: function () {
                    console.log("Mudou");
                    graph.refresh();
                },
                removed: function (nodeId) {
                    console.log("Removed");
                    let node = graph.getNodeById(nodeId);
                    graph.removeElement('nodes', node);
                    graph.refresh();
                }
            });

            cy.on('tap', event => {
                let target = event.cyTarget;
                if (target !== this) {
                    if (target.isEdge()) {
                        const edge = target.data();
                        graph.showMenu('edgesMenu', event.originalEvent, edge, event.cyRenderedPosition);
                    }
                    else if (target.isNode()) {
                        const node = graph.getNodeByData(target.data());
                        graph.showMenu('nodesMenu', event.originalEvent, node, event.cyRenderedPosition).changeBackgroundColor(node.color);
                    }
                } else if (target === this) {
                    graph.hideMenu();
                    if (event.originalEvent.ctrlKey) {
                        const position = graph.relativePosition(event.cyRenderedPosition);
                        graph.insertNewTempNode(position);
                    }
                } else{
                    console.log("Nunca deveria ter entrado aqui.");
                }
            });
            cy.on('taphold', event => {
                let target = event.cyTarget;
                if (target === cy) {
                    const position = graph.relativePosition(event.cyRenderedPosition);
                    graph.insertNewTempNode(position);
                }
            });
            cy.on('pan', function (event) {
                const pan = event.cyTarget.pan();
                const zoom = event.cyTarget.zoom();

                if (typeof graph.visibleMenu !== 'undefined') {
                    graph.visibleMenu.updatePosition({
                        x: graph.visibleMenu.position.x * zoom + pan.x,
                        y: graph.visibleMenu.position.y * zoom + pan.y
                    });
                }
            });
            cy.on('zoom', function (event) {
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

// Template => fluxo

Template.fluxo.events({
    'click .save-graph': function(event, template){
        /** @type Graph **/
        const graph = window.graph;
        var elements = graph.cy.elements().jsons();
        Meteor.call('saveGraph', this.id_tipo_doc, elements);
    }
});

