/**
 * Created by diogomartins on 3/10/16.
 */
Template.circularMenu.helpers({
    items:[
        {href:"#", content:"Inserir", action:function(){console.log('Yeah,bitch')}},
        {href:"#", content:"Editar", action:function(){console.log('Yeah,bitch')}},
        {href:"#", content:"Deletar"},
        {href:"#", content:"Detalhes"},
        {href:"#", content:"Copiar"}
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