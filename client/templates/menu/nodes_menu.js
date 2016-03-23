/**
 * Created by diogomartins on 3/18/16.
 */
Template.nodesMenu.helpers({
    items:[
        {href:"#/", icon:"fa-long-arrow-up", content:"Adicionar aresta", action: node => Modal.show('addEdge')},
        {href:"#/", icon:"fa-plus-square-o", content:"Inserir", action: node => {console.log('Insert')}},
        {href:"#/", icon:"fa-pencil-square-o", content:"Editar", action: node => Modal.show('exampleModal') },
        {href:"#/", icon:"fa-trash-o", content:"Deletar", action: node => Meteor.call('removeNode', node)},
        {href:"#/", icon:"fa-info", content:"Detalhes", action: node => {
            console.log('Detalhes')
        }}
    ],
    /**
     * 
     * @return Nodes
     */
    node: function(){
        return window.graph.nodesMenu.currentItem;
    }
});

Template.nodesMenu.events({
    'click .cn-button': function(event, template){
        const wrapper = template.find('.cn-wrapper');
        $(wrapper).toggleClass('opened-nav');
    }
});

Template.exampleModal.helpers({
    /**
     *
     * @return Nodes
     */
    node: function(){
        return window.graph.nodesMenu.currentItem;
    }
});

Template.exampleModal.events({
   'keyup input': function(event, template){
       const field = event.target.name;
       /** @type Graph **/
       const graph = window.graph;
       const node = graph.nodesMenu.currentItem;
       
       let data = {};
       data[field] = event.target.value;
       
       Meteor.call('updateNodeData', node, data);
   }
});
