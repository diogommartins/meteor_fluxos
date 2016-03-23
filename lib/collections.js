/**
 * Created by diogomartins on 3/18/16.
 */
Nodes = new Mongo.Collection('nodes');
Nodes.attachSchema(new SimpleSchema({
    id_tipo_doc:{
        type: Number
    },
    data:{
        type: Object
    },
    'data.id':{
        type: String
    },
    'data.name':{
        type: String,
        label: "Descrição"
    },
    'data.tipo':{
        type: String,
        optional: true
    },
    'data.color':{
        type: String,
        optional: true,
        defaultValue: "#f0f0f0"
    },
    'position':{
        type: Object,
        optional: true
    },
    'position.x':{ type: Number, decimal: true },
    'position.y':{ type: Number, decimal: true },
    'group':{
        type: String,
        defaultValue: 'nodes'
    }
}));

Edges = new Mongo.Collection('edges');
Edges.attachSchema(new SimpleSchema({
    id_tipo_doc:{
        type: Number
    },
    data:{
        type: Object
    },
    'data.name':{
        type: String,
        label: 'Descrição'
    },
    'data.source':{
        type: Number,
        label: 'Origem'
    },
    'data.target':{
        type: Number,
        label: 'Destino'
    },
    'group':{
        type: String,
        defaultValue: 'edges'
    }
}));

CyGraphs = new Mongo.Collection('cygraphs');
CyGraphs.attachSchema(new SimpleSchema({
    id_tipo_doc:{
        type: Number
    },
    name:{
        type: String,
        optional: true
    }
}));
CyGraphs.helpers({
    nodes: function(){
        return Nodes.find({id_tipo_doc: this.id_tipo_doc});
    },
    edges: function(){
        return Edges.find({id_tipo_doc: this.id_tipo_doc});
    }
});