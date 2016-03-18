/**
 * Created by diogomartins on 3/18/16.
 */
Template.nodesMenu.helpers({
    items:[
        {href:"#/", icon:"fa-long-arrow-up", content:"Adicionar aresta", action:function(){console.log('Adicionar')}},
        {href:"#/", icon:"fa-plus-square-o", content:"Inserir", action:function(){console.log('Insert')}},
        {href:"#/", icon:"fa-pencil-square-o", content:"Editar", action:function(){console.log('Edit')}},
        {href:"#/", icon:"fa-trash-o", content:"Deletar", action:function(){
            console.log('Deletar')
        }},
        {href:"#/", icon:"fa-info", content:"Detalhes", action:function(){console.log('Detalhes')}}
    ]
});

Template.nodesMenu.events({
    'click .cn-button': function(event, template){
        const wrapper = template.find('.cn-wrapper');
        $(wrapper).toggleClass('opened-nav');
    }
});
