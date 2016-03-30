/**
 * Created by diogomartins on 3/30/16.
 */
Template.updateEdge.helpers({
    isAdmin: function(){
        return true;
    },
    autoSaveMode: function(){
        return true;    
    },
    edge: function(){
        /** @type Edges */
        return window.graph.edgesMenu.currentItem;
    }
});