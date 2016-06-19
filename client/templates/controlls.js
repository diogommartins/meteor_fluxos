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
        // Meteor.call('changeGraphLayout', graphRendered.id, layout);
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

/**
 * Graph is directed Toggler
 */

Template.isDirectedButton.helpers({
    icon: function(){
        return this.cyGraph.options.isDirected ? 'glyphicon glyphicon-expand' : 'glyphicon glyphicon-unchecked';
    },
    text: function(){
        return this.cyGraph.options.isDirected ? 'Direcionado': 'Não-direcionado';
    }
});

Template.isDirectedButton.events({
    click: function(){
        CyGraphs.update(this.cyGraph._id, {$set:{'options.isDirected': !this.cyGraph.options.isDirected}});
    }
});

Template.autoColoringBurron.helpers({
    btnClass: function(){
        return Session.get('autoColor') ? 'btn-success' : 'btn-danger';
    },
    'text': function(){
        return Session.get('autoColor') ? 'Autocolor on' : 'Autocolor off';
    }
});

Template.autoColoringBurron.events({
    'click': function(){
        /** @type: ReactiveGraph */
        const graph = window.graph;
        Session.set('autoColor', !Session.get('autoColor'));
        const event = Session.get('autoColor') ? 'start.coloring.graph' : 'stop.coloring.graph';
        console.log(event);
        graph.cy.trigger(event);
    }
});