/**
 * Created by diogomartins on 3/31/16.
 */
Template.search.created = function(){
    Session.set('searchResults', []);
};

Template.search.helpers({
    searchResults: function(){
        return Session.get('searchResults');
    }
});

Template.search.events({
    'change [name=fluxo]': function(event, template){
        let input = $(event.target).val();
        if (input.length > 3){
            let data = Meteor.call('searchFluxos', input, function(error, elements){
                Session.set('searchResults', elements);
            });    
        }
    }
});
