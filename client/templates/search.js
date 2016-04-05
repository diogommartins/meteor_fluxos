/**
 * Created by diogomartins on 3/31/16.
 */
Template.search.rendered = function(){
    $("#fluxoSearchForm input[name=fluxo]").focus();
};

Template.search.helpers({
    searchResults: function(){
        return Session.get('searchResults');
    },
    lastSearch: function(){
        return Session.get('lastSearch');
    }
});

Template.search.events({
    'submit #fluxoSearchForm': function(event, template){
        event.preventDefault();

        const input = event.target.fluxo;
        
        Session.set('lastSearch', input.value);
        
        Meteor.call('searchFluxos', input.value, function(error, elements){
            Session.set('searchResults', elements);
            $('html, body').animate({scrollTop: $("#search-results").offset().top}, 1800);
        });
    }
});
