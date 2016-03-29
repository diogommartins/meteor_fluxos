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


Template.addEdge.helpers({
    source: function(){
        /** @type Graph **/
        const graph = window.graph;
        /** @type Nodes **/
        return graph.visibleMenu.currentItem;
    },
    nodesOptions: function(){
        const id_tipo_doc = window.graph.id;
        const nodes = Nodes.find({id_tipo_doc}).fetch();
        return nodes.map( node => ({label: node.data.name, value: node.data.id}) );
    }
});

AutoForm.addHooks('addNewEdge', {
    before:{
        method: function(doc){
            doc.id_tipo_doc = window.graph.id;
            console.log(doc);
        }
    }
});

Template.addEdge.events({
   'submit': function(event, template){
       console.log('Submit !!!!');
   }
});