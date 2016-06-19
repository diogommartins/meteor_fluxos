/**
 * Created by diogomartins on 3/16/16.
 */
Router.configure({
    layoutTemplate: 'mainLayout'
});

Router.route('/', {
    name: 'home',
    template: 'search'
});

Router.route('/whiteboard', {
    name: 'graph.new',
    controller: 'AuthRequiredController',
    action: function(){
        Meteor.call('createNewGraph', function(error, newGraphId){
            if (typeof error === 'undefined'){
                Router.go('/whiteboard/' + newGraphId)
            } else{
                Router.go('/');  // todo: mandar para página de erro
            }
        });
    }
});

AuthRequiredController = RouteController.extend({
    onBeforeAction: function(){
        if (Meteor.userId()){
            this.next()
        } else {
            noty({
                layout: 'center',
                text: 'Você precisa estar logado!',
                modal: true,
                buttons: [
                    {
                        addClass: 'btn btn-primary',
                        text: 'Login',
                        onClick: function showModalLogin($noty) {
                            $noty.close();
                            $("#login-modal").modal();
                        }
                    },
                    {
                        addClass: 'btn btn-danger',
                        text: 'Sair',
                        onClick: function goHome($noty) {
                            $noty.close();
                            Router.go('home')
                        }
                    }
                ]
            });
        }
    }
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
    controller: 'AuthRequiredController',
    waitOn: function(){
        return Meteor.subscribe('myGraphs')
    },
    action: function(){
        this.render('graphs.thumbnail', {
            data: function(){
                return {
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
                noty({
                    text: `${error.errorType}: ${error.message}`,
                    type: 'error',
                    timeout: 5000,
                    modal: true,
                    callbacks: {
                        onClose: () => Router.go('home')
                    }
                });
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