/**
 * Created by diogomartins on 3/10/16.
 */
Template.edgesMenu.helpers({
    items:[
        {content:"Inserir", href:"#/", icon:"fa-plus-square-o", action:function(){console.log('Insert')}},
        {content:"Editar", href:"#/", icon:"fa-pencil-square-o", action:function(){console.log('Edit')}},
        {content:"Deletar", href:"#/", icon:"fa-trash-o", action: edge => Meteor.call('removeEdge', edge)},
        {content:"Detalhes", href:"#/", icon:"fa-info", action:function(){console.log('Detalhes')}},
        {content:"Copiar", href:"#/", icon:"fa-clone", action:function(){console.log('Copiar')}},
        {content:"Fechar", href:"#/", icon:"fa-times", action:function(){console.log('Fechar')}}
    ]
});

Template.edgesMenu.events({
    'click .cn-button': function(event, template){
        const wrapper = template.find('.cn-wrapper');
        $(wrapper).toggleClass('opened-nav');
    }
});
