/**
 * Created by diogomartins on 3/16/16.
 */
Template.menuItem.helpers({
    node: function(){
        return window.graph.nodesMenu.currentItem;
    }
});

Template.menuItem.events({
    'click a': function(event, template){
        const node = window.graph.nodesMenu.currentItem;
        const menuItem = template.data;
        menuItem.action(node);
    }
});