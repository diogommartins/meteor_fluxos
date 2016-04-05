Template.modalLogin.events({
    'submit #login-form': function(event, template){
        event.preventDefault();
        const form = event.target;
        const username = form.login_username.value;
        const password = form.login_password.value;

        Meteor.loginWithLDAP(username, password, {
            dn: `uid=${username},ou=people,dc=unirio,dc=br`
        }, function(err) {
            if (!err){
                $("#login-modal").modal('hide');
            } else{
                event.target.login_username.value = "";
                event.target.login_password.value = "";
            }
        });
    },
    'click .logout-button': function(event, template){
        Meteor.logout();
    }
});

Template.modalLogin.helpers({
    merda: function(){
        return currentUser;
    }    
});
