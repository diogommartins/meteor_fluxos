/**
 * Created by diogomartins on 3/18/16.
 */
Template.nodesMenu.helpers({
    items:[
        {href:"#/", icon:"fa-long-arrow-up", content:"Adicionar aresta", action: node => Modal.show('addEdge', {node: node})},
        {href:"#/", icon:"fa-plus-square-o", content:"Inserir", action: node => console.log('Insert ', {node: node})},
        {href:"#/", icon:"fa-pencil-square-o", content:"Editar", action: node => Modal.show('updateNode', {node: node}) },
        {href:"#/", icon:"fa-trash-o", content:"Deletar", action: node => Meteor.call('removeNode', node)},
        {href:"#/", icon:"fa-info", content:"Detalhes", action: node => Modal.show('detailsNode', node) }
    ]
});

Template.nodesMenu.events({
    'click .cn-button': function(event, template){
        const wrapper = template.find('.cn-wrapper');
        $(wrapper).toggleClass('opened-nav');
    }
});

Template.addEdge.helpers({
    source: function(){
        return this.node;
    },
    nodesOptions: function(){
        const graphId = this.node.data.graphId;
        const nodes = Nodes.find({graphId}).fetch();

        nodes.sort((a,b) => a.data.name > b.data.name);
        return nodes.map( node => ({label: node.data.name, value: node.data.id}) );
    }
});

AutoForm.addHooks('addNewEdge', {
    before:{
        method: function(doc){
            /** @type Nodes **/
            const node = this.template.data.currentNode;
            doc.data.graphId = node.data.graphId;
            
            return doc;
        }
    }
});

Template.addEdge.events({
   'submit': function(event, template){
       Modal.hide('addEdge');
   }
});