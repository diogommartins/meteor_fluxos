/**
 * Created by diogomartins on 3/10/16.
 */
Template.circularMenu.helpers({
    items:[
        {href:"#", icon:"fa-plus-square-o", content:"Inserir", action:function(){console.log('Insert')}},
        {href:"#", icon:"fa-pencil-square-o", content:"Editar", action:function(){console.log('Edit')}},
        {href:"#", icon:"fa-trash-o", content:"Deletar", action:function(){console.log('Deletar')}},
        {href:"#", icon:"fa-info", content:"Detalhes", action:function(){console.log('Detalhes')}},
        {href:"#", icon:"fa-clone", content:"Copiar", action:function(){console.log('Copiar')}}
    ]
});

Template.circularMenu.events({
    'click .cn-button': function(event, template){
        const wrapper = template.find('.cn-wrapper');
        $(wrapper).toggleClass('opened-nav');
    }
});


Template.menuItem.helpers({

});

Template.menuItem.events({
    'click a': function(event, template){
        const menuItem = template.data;
        menuItem.action();
    }
});