/**
 * Created by diogomartins on 4/3/16.
 */
Template.chatBox.events({
    'submit .new-message': function(event, template){
        event.preventDefault();

        const form = event.target;
        const newMessage = form.message.value;

        Chats.insert({
            id_tipo_doc: this.id_tipo_doc,
            content: newMessage,
            timestamp: new Date()
        });

        form.message.value = "";
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