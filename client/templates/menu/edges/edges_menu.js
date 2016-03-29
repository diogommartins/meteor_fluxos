/**
 * Created by diogomartins on 3/10/16.
 */
Template.edgesMenu.helpers({
    items:[
        {href:"#/", icon:"fa-plus-square-o", content:"Inserir", action:function(){console.log('Insert')}},
        {href:"#/", icon:"fa-pencil-square-o", content:"Editar", action:function(){console.log('Edit')}},
        {href:"#/", icon:"fa-trash-o", content:"Deletar", action:function(){console.log('Deletar')}},
        {href:"#/", icon:"fa-info", content:"Detalhes", action:function(){console.log('Detalhes')}},
        {href:"#/", icon:"fa-clone", content:"Copiar", action:function(){console.log('Copiar')}},
        {href:"#/", icon:"fa-times", content:"Fechar", action:function(){console.log('Fechar')}}
    ]
});

Template.edgesMenu.events({
    'click .cn-button': function(event, template){
        const wrapper = template.find('.cn-wrapper');
        $(wrapper).toggleClass('opened-nav');
    }
});
