/**
 * Created by diogomartins on 4/3/16.
 */
Template.chatBox.events({
    'submit .new-message': function(event, template){
        event.preventDefault();

        const newMessage = event.target.message;

        Chats.insert({
            id_tipo_doc: this.id_tipo_doc,
            content: newMessage.value,
            timestamp: new Date()
        });

        newMessage.value = "";
    }
});

Template.chatBox.helpers({
    messages: function(){
        return Chats.find({id_tipo_doc: this.id_tipo_doc});
    },
    onlineUsers: function(){
        return {
            usernames: "Um e dois",
            count: 6
        }
    },
    disabledAttr: function(){
        return Meteor.user() ? '' : 'disabled';
    }
});

Template.chatMessage.helpers({
    username: function(){
        return this.creator().username;
    },
    isRight: function(){
        return this.createdBy === Meteor.userId();
    }
});

Template.chatBox.rendered = function(){
    Template.chatMessage.rendered = function(){
        const FIXER_GAMBI = 50;
        const $container = $(".direct-chat-messages");

        $container.scrollTop($container[0].scrollHeight + FIXER_GAMBI);
    };
};