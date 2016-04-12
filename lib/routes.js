/**
 * Created by diogomartins on 3/16/16.
 */
Router.configure({
   layoutTemplate: 'mainLayout'
});


Router.route('/', {
   template: 'search'
});

Router.route('/fluxo/:id_tipo_doc', {
    template: 'fluxo',
    data: function(){
        return {
            id_tipo_doc: Number(this.params.id_tipo_doc)
        }
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