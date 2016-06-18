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
    name: 'graph.edit',
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
    name: 'graphs.list',
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
    name: 'graphs.owned',
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

Router.route('/documento/:id_tipo_doc', {
    name: 'fluxo.find',
    waitOn: function(){
        return Meteor.subscribe('documentos')
    },
    action: function(){
        const id_tipo_doc = Number(this.params.id_tipo_doc);

        Meteor.call('getDocumento', id_tipo_doc, (error, result) =>{
            if (error){
                console.log(error);
            }
            const documento = Documentos.findOne({id_tipo_doc: id_tipo_doc});
            Router.go('fluxo.edit', {_id: documento.graphId});
        });
    }
});

Router.route('/fluxo/:_id', {
    name: 'fluxo.edit',
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