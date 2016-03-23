/**
 * Created by diogomartins on 3/16/16.
 */
Router.configure({
   layoutTemplate: 'main'
});
//
//Router.route('/', {
//    template: 'fluxo',
//    data: function(){
//        Router.go('fluxo', {_id:217});
//    }
//});

Router.route('/fluxo/:_id', {
    template: 'fluxo',
    data: function(){
        return {
            id_tipo_doc: Number(this.params._id)
        }
    }
});