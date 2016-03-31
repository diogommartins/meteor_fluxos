/**
 * Created by diogomartins on 3/30/16.
 */
Template.updateNode.helpers({
    node: function(){
        const node = window.graph.nodesMenu.currentItem;
        return Nodes.findOne(node._id);
    }    
});