
Template.graphContainer.created = function(){
    const id_tipo_doc = this.data.id_tipo_doc;

    Meteor.call('getFluxo', id_tipo_doc, function(error, elements){
        const graph = new Graph(id_tipo_doc).renderGraph();

        graph.cy.ready(function () {
            var cy = this;
            var cyGraph = CyGraphs.find({id_tipo_doc: id_tipo_doc});

            graph.load(elements).applyStyle(cyGraph.fetch()[0].layout);

            const nodes = Nodes.find({id_tipo_doc: id_tipo_doc});

            var nodesObserver = nodes.observeChanges({
                added: function (_id, newNode) {
                    if (!nodesObserver) return;
                    newNode._id = _id;
                    graph.addElement('nodes', newNode);
                },
                changed: function (nodeId, data) {
                    const node = graph.getNodeById(nodeId);
                    if ((typeof data.position !== 'undefined') && (!graph.isGrabbed(node))){
                        const currentPosition = graph.cy.$("#" + node.data.id).position();
                        if ((currentPosition.x !== data.position.x) ||
                            (currentPosition.y !== data.position.y)){
                            graph.cy.$("#" + node.data.id).position(data.position);
                        }
                        else{
                            console.log('Nada mudou, a verificação foi util.');
                        }
                    }
                    else if (typeof data.data === 'object'){
                        const updatedNodeData = data.data;
                        const node = graph.cy.getElementById(updatedNodeData.id);
                        node.data(updatedNodeData);
                    }
                },
                removed: function (nodeId) {
                    console.log("Removed " + nodeId);
                    let node = graph.getNodeById(nodeId);
                    graph.removeElement('nodes', node);
                    graph.refresh();
                }
            });
            cy.nodes().on({
                'drag': function(event){
                    const target = event.cyTarget;
                    const node = graph.getNodeByData(target.data());
                    const position = this.position();

                    if (typeof graph.visibleMenu !== 'undefined')
                        graph.visibleMenu.updatePosition(position);

                    const currentCyGraph = cyGraph.fetch()[0];
                    const layout = currentCyGraph.layout;
                    if (typeof layout === 'undefined' || layout !== 'preset'){
                        CyGraphs.update({_id:currentCyGraph._id}, {$set: {layout:'preset'} });
                        console.log("Atualizei layout");
                    }
                    Meteor.call('updateNodeData', node, {position: position});
                },
                'tap': function(event){
                    const target = event.cyTarget;
                    const node = graph.getNodeByData(target.data());
                    graph.showMenu('nodesMenu', event.originalEvent, node, event.cyRenderedPosition).changeBackgroundColor(node.data.color);
                }
            });
            cy.on({
                'tap': function(event){
                    const target = event.cyTarget;
                    if (target === this) {
                        graph.hideMenu();
                        if (event.originalEvent.ctrlKey) {
                            const position = graph.relativePosition(event.cyRenderedPosition);
                            graph.insertNewTempNode(position);
                        }
                    }
                },
                'pan': function (event) {
                    const pan = event.cyTarget.pan();
                    const zoom = event.cyTarget.zoom();

                    if (typeof graph.visibleMenu !== 'undefined') {
                        graph.visibleMenu.updatePosition({
                            x: graph.visibleMenu.position.x * zoom + pan.x,
                            y: graph.visibleMenu.position.y * zoom + pan.y
                        });
                    }
                },
                'layoutstop': function(event){
                    const elements = event.layout.options.eles.nodes();
                    elements.map(function(element){
                        const node = graph.getNodeByData(element.data());
                        const newPosition = element.position();
                        node.position = newPosition;
                        Meteor.call('updateNodeData', node, {position: newPosition});
                    });
                },
                'zoom': function (event) {
                    const zoom = event.cyTarget.zoom();
                    console.log("Zoom " + zoom);

                    //menu.updatePosition()
                    //menu.resize(factor);
                }
            });
            cy.edges().on({
                'mouseover': function(event){
                    let target = event.cyTarget;
                    target.css({'content': target.data().name});
                },
                'mouseout': function(event){
                    let target = event.cyTarget;
                    target.css({'content': ''});
                },
                'tap': function(event){
                    const edge = event.cyTarget.data();
                    graph.showMenu('edgesMenu', event.originalEvent, edge, event.cyRenderedPosition);
                }
            })
        });
    });

};


// Template => fluxo
Template.fluxo.helpers({
    name: function(){
        return CyGraphs.findOne({id_tipo_doc: this.id_tipo_doc}).name;
    }
});

Template.fluxo.events({
    'click .save-graph': function(event, template){
        /** @type Graph **/
        const graph = window.graph;
        var elements = graph.cy.elements().jsons();
        // Meteor.call('saveGraph', this.id_tipo_doc, elements);
        alert("Desabilitado: Nada acontece");
    }
});

Template.graphControlls.helpers({
    layouts: function(){
        // Todo: Tem que ter forma mais bonita de fazer isso... https://github.com/aldeed/meteor-simple-schema/issues/242
        const layouts = CyGraphs.simpleSchema()._schema.layout.allowedValues;
        
        return layouts.map(function(l){ return {name: l} });
    }
});

Template.graphControlls.events({
    'click a': function(event, template){
        event.preventDefault();
        const layout = this.name;
        /** @type Graph **/
        const graph = window.graph;
        // Meteor.call('changeGraphLayout', graph.id, layout);
        graph.changeLayout(layout);
    }
});
