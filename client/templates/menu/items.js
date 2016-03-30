/**
 * Created by diogomartins on 3/16/16.
 */
Template.menuItem.helpers({
    node: function(){
        return window.graph.nodesMenu.currentItem;
    }
});

Template.menuItem.events({
    'click': function(event, template){
        event.preventDefault();
        const item = window.graph.nodesMenu.currentItem;
        const menuItem = template.data;
        menuItem.action(item);
    }
});