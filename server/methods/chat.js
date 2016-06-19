/**
 * Created by diogomartins on 6/18/16.
 */


Meteor.methods({
    'chat.newMessage': function newMessage(msg){
        // todo: feito dessa forma para que não seja necessária nenhuam validação extra no método
        return Chats.insert({
            graphId: msg.graphId,
            content: msg.content
        });
    }
});