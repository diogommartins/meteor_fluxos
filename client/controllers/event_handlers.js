/**
 * Created by diogomartins on 3/30/16.
 */
FluxoEventHandlers = {};

FluxoEventHandlers.edges = {
    'mouseover': function (event) {
        let target = event.cyTarget;
        target.css({'content': target.data().name});
    },
    'mouseout': function (event) {
        let target = event.cyTarget;
        target.css({'content': ''});
    },
    'tap': function (event) {
        const target = event.cyTarget;
        const edge = graph.getElementByData('edges', target.data());
        graph.showMenu('edgesMenu', event.originalEvent, edge, event.cyRenderedPosition);
    }
};

FluxoEventHandlers.nodes = {
    'dragstart': function(event){
        console.log("dragstart");
    },
    'dragend': function(event){
        console.log("dragend");
    },
    'drag': function(event){
        /**
         * todo: muita coisa acontecendo aqui. Isso pode ficar lento
         */
        const target = event.cyTarget;
        const node = graph.getElementByData('nodes', target.data());
        const position = this.position();

        const currentCyGraph = graph.collection.fetch()[0];
        const layout = currentCyGraph.layout;
        if ((typeof layout === 'undefined') || (layout !== 'preset')){
            CyGraphs.update({_id:currentCyGraph._id}, {$set: {layout:'preset'} });
        }
        Meteor.call('updateNodeData', node, {position: position});
    },
    'position': function(event){
        if (typeof graph.visibleMenu !== 'undefined')
            graph.visibleMenu.updatePosition(this.position());
    },
    'tap': function(event){
        event.stopPropagation();
        const target = event.cyTarget;
        const node = graph.getElementByData('nodes', target.data());
        graph.showMenu('nodesMenu', event.originalEvent, node, event.cyRenderedPosition).changeBackgroundColor(node.data.color);
    }
};

FluxoEventHandlers.cytoscape = {
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
            const node = graph.getElementByData('nodes', element.data());
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
};

