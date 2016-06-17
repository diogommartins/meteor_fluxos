/**
 * Created by diogomartins on 3/16/16.
 */
Router.configure({
    layoutTemplate: 'mainLayout'
});

Router.route('/', {
    template: 'search'
});

Router.route('/whiteboard', function(){
    Meteor.call('createNewGraph', function(error, newGraphId){
        if (typeof error === 'undefined'){
            Router.go('/whiteboard/' + newGraphId)
        } else{
            Router.go('/');  // todo: mandar para página de erro
        }
    });
});

Router.route('/whiteboard/:_id', {
    waitOn: function(){
        return [
            Meteor.subscribe('publicGraphs'),
            Meteor.subscribe('graphNodes', this.params._id),
            Meteor.subscribe('graphEdges', this.params._id)
        ]
    },
    action: function(){
        this.render('whiteboard', {
            data: () => CyGraphs.findOne(this.params._id)
        });
    }
});

Router.route('/graphs/public', {
    waitOn: function(){
        return Meteor.subscribe('publicGraphs')
    },
    action: function(){
        this.render('graphs.thumbnail', {
            data: function(){
                return{
                    graphs: CyGraphs.find()
                }
            }
        });
    }
});

Router.route('/graphs/owned', {
    waitOn: function(){
        return Meteor.subscribe('myGraphs')
    },
    action: function(){
        this.render('graphs.thumbnail', {
            data: function(){
                return{
                    graphs: CyGraphs.find({owner: Meteor.userId()})
                }
            }
        });
    }
});

Router.route('/fluxo/:_id', {
    waitOn: function(){
        return [
            Meteor.subscribe('publicGraphs'),
            Meteor.subscribe('graphNodes', this.params._id),
            Meteor.subscribe('graphEdges', this.params._id)
        ]
    },
    action: function(){
        this.render('fluxo', {
            data: () => CyGraphs.findOne(this.params._id)
        });
    }
});

Router.route('/tramitacoes/:id_documento', {
    template: 'tramitacoes',
    data: function(){
        return{
            id_documento: Number(this.params.id_documento)
        }
    }
});