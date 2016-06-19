/**
 * Created by diogomartins on 4/3/16.
 */
Template.chatBox.events({
    'submit .new-message': function(event, template){
        event.preventDefault();
        let newMessage = event.target.message;

        Meteor.call('chat.newMessage', { graphId: this.cyGraph._id, content: newMessage.value });

        newMessage.value = "";
    },
    "click [data-widget='remove']": function(event, template){
        $(event.delegateTarget).hide();
    },
    "click [data-widget='collapse']": function(event, template){
        $(event.delegateTarget).find('.box-body').slideToggle('slow');
    }
});

Template.chatBox.helpers({
    messages: function(){
        return Chats.find({graphId: this.cyGraph._id});
    },
    onlineUsers: function(){
        return {
            usernames: "Um e dois",
            count: 6
        }
    },
    disabledAttr: function(){
        return Meteor.user() ? '' : 'disabled';
    },
    newMessagePlaceholder: function(){
        const user = Meteor.user();
        return user ? `Comunique-se, ${user.firstname()}!` : "Autentique-se para enviar mensagens"
    }
});

Template.chatMessage.helpers({
    username: function(){
        return this.creator().shortname();
    },
    isRight: function(){
        return this.createdBy === Meteor.userId();
    },
    avatar: function(){
        const user = this.creator();
        if (typeof user.profile.avatar === 'string'){
            return user.profile.avatar;
        }
        return "http://bootdey.com/img/Content/user_1.jpg" 
    }
});

Template.chatBox.rendered = function(){
    Meteor.subscribe('chatMessages', this.data.cyGraph._id);
    Meteor.subscribe('users.publicData');

    Template.chatMessage.rendered = function(){
        if (Session.get("chatAutoScrollEnabled")) {
            const FIXER_GAMBI = 50;
            const $container = $(".direct-chat-messages");

            $container.scrollTop($container[0].scrollHeight + FIXER_GAMBI);
        }
    };
};