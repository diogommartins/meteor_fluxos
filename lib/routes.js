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


GraphController = RouteController.extend({
    waitOn: function(){
        return [
            Meteor.subscribe('publicGraphs'),
            Meteor.subscribe('nodesAndEdges', this.params._id)
        ]
    },
    data: function(){
        const _id = this.params._id;
        const edges = Edges.find({graphId: _id}).fetch();
        const nodes = Nodes.find({graphId: _id}).fetch();

        return {
            cyGraph: CyGraphs.findOne(_id),
            elements: edges.concat(nodes)
        }
    }
});

Router.route('/whiteboard/:_id', {
    name: 'graph.edit',
    controller: 'GraphController',
    action: function(){
        this.render('whiteboard');
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
    controller: 'GraphController',
    action: function(){
        this.render('fluxo');
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