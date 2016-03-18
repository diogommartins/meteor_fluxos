/**
 * Created by diogomartins on 3/8/16.
 */
Session.setDefault('nodes', []);
Session.setDefault('edges', []);

Template.searchForm.events({
    'submit': function(e){
        e.preventDefault();
        //const id_tipo_doc = e.target.id_tipo_doc.value;
        e.target.id_tipo_doc.value = '';
    }
});
