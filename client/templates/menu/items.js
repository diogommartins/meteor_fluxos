/**
 * Created by diogomartins on 3/16/16.
 */
Template.menuItem.helpers({

});

Template.menuItem.events({
    'click a': function(event, template){
        const menuItem = template.data;
        menuItem.action();
    }
});