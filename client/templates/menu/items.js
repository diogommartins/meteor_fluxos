/**
 * Created by diogomartins on 3/16/16.
 */
Template.menuItem.events({
    'click a': function(event, template){
        event.preventDefault();
        /** @type Graph */
        const graph = window.graph;
        const item = graph.visibleMenu.currentItem;
        const menuItem = template.data;
        
        menuItem.action(item);
        graph.hideMenu();
    }
});