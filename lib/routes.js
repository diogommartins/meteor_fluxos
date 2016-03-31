/**
 * Created by diogomartins on 3/16/16.
 */
Router.configure({
   layoutTemplate: 'main'
});


Router.route('/', {
   template: 'search'
});

Router.route('/fluxo/:_id', {
    template: 'fluxo',
    data: function(){
        return {
            id_tipo_doc: Number(this.params._id)
        }
    }
});