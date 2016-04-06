
Template.graphContainer.created = function(){
    const id_tipo_doc = this.data.id_tipo_doc;

    Meteor.call('getFluxo', id_tipo_doc, function(error, elements){
        const graph = new Graph(id_tipo_doc).renderGraph();

        graph.cy.ready(function () {
            const graphCanvasContainer = $(graph.container).children('div');
            graph.registerPlugin('canvasSketcher', new CanvasSketcher(graphCanvasContainer));
            
            const layout = graph.collection.fetch()[0].layout;
            graph.load(elements).applyStyle(layout);

            var edgesObserver = Edges.find({id_tipo_doc: id_tipo_doc}).observeChanges({
                added: function(_id, newEdge){
                    if (!edgesObserver) return;
                    newEdge._id = _id;
                    graph.addElement('edges', newEdge);
                },
                changed: function(_id, data){
                    if (typeof data.data === 'object'){
                        const updatedEdgeData = data.data;
                        graph.cy.getElementById(updatedEdgeData.id).data(updatedEdgeData);
                    }
                },
                removed: function(_id){
                    let edge = graph.getElementById('edges', _id);
                    graph.removeElement('edges', edge);
                    graph.refresh();
                    if (typeof graph.visibleMenu !== 'undefined'){
                        if (graph.visibleMenu.currentItem._id === edge._id){
                            graph.hideMenu();
                        }
                    }
                }
            });

            var nodesObserver = Nodes.find({id_tipo_doc: id_tipo_doc}).observeChanges({
                added: function (_id, newNode) {
                    if (!nodesObserver) return;
                    newNode._id = _id;
                    graph.addElement('nodes', newNode);
                },
                changed: function (_id, data) {
                    const node = graph.getElementById('nodes', _id);
                    if ((typeof data.position !== 'undefined') && (!graph.isGrabbed(node))){
                        const currentPosition = graph.cy.$("#" + node.data.id).position();

                        if (!_.isEqual(currentPosition, data.position.x)){
                            graph.cy.$("#" + node.data.id).position(data.position);
                        }
                    }
                    else if (typeof data.data === 'object'){
                        const updatedNodeData = data.data;
                        graph.cy.getElementById(updatedNodeData.id).data(updatedNodeData);
                    }
                },
                removed: function (_id) {
                    let node = graph.getElementById('nodes', _id);
                    graph.removeElement('nodes', node);
                    graph.refresh();
                }
            });
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



