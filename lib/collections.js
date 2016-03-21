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
    'position.x':{ type: Number },
    'position.y':{ type: Number }
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
    }
}));

CyGraphs = new Mongo.Collection('cygraphs');