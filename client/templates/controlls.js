/**
 * Created by diogomartins on 3/31/16.
 */
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

/**
 *  Autosave Toggler
 */

Template.autoSaveButton.helpers({
    'btnClass': function(){
        return Session.get('autoSave') ? 'btn-success' : 'btn-danger';
    },
    'btnContent': function(){
        return Session.get('autoSave') ? 'Autosave ligado' : 'Autosave desligado';
    }
});

Template.autoSaveButton.events({
    'click': function(){
        Session.set('autoSave', !Session.get('autoSave'));
        console.log("Toggling autosave ", Session.get('autoSave'));
    }
});