/**
 * Created by diogomartins on 4/3/16.
 */
//import { Session } from 'meteor/session'
Meteor.startup(function(){
    Session.setDefault({
        autoSave: true,
        autoColor: false,
        askConfirmationOnDelete: false,
        enableChat: true,
        showEdgesNameOnMouseOver: true,
        chatAutoScrollEnabled: true,
        lastSearch: "",
        searchResults: []
    });
});

