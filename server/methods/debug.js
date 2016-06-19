/**
 * Created by diogomartins on 4/6/16.
 */
Meteor.methods({
    debugClear: function(){
        Edges.remove({});
        Nodes.remove({});
        CyGraphs.remove({});
        Chats.remove({});
    },
    getRandomMockUser: function(){
        let result = HTTP.get('https://randomuser.me/api/');
        if(result.statusCode === 200){
            const user  = result.data.results[0];
            let mockUser = {
                username: user.email,
                profile:{
                    fullname: `${user.name.first} ${user.name.last}`,
                    avatar: user.picture.medium
                }
            };
            return mockUser;
        }
    }
});