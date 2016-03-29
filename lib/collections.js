/**
 * Created by diogomartins on 3/18/16.
 */
Schemas = {};
Collections = {};
/**
 * Nodes
 */
Nodes = Collections.Nodes = new Mongo.Collection('nodes');
Schemas.NodeSchema = new SimpleSchema({
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
});
Nodes.attachSchema(Schemas.NodeSchema);

/**
 * Edges
 */
Edges = Collections.Edges = new Mongo.Collection('edges');
Schemas.EdgeSchema = new SimpleSchema({
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
});
Edges.attachSchema(Schemas.EdgeSchema);

/**
 * Coleção de título, nós, arestas e layout a ser renderizado de um grafo Cytoscape
 * 
 * @type {Mongo.Collection}
 */
CyGraphs = Collections.CyGraphs = new Mongo.Collection('cygraphs');
Schemas.CyGraphSchema = new SimpleSchema({
    id_tipo_doc:{
        type: Number
    },
    name:{
        type: String,
        optional: true
    },
    layout:{
        type: String,
        optional: true,
        allowedValues: ['preset', 'circle', 'concentric', 'breadthfirst', 'cose']
    }
});
CyGraphs.attachSchema(Schemas.CyGraphSchema);

CyGraphs.helpers({
    nodes: function(){
        return Nodes.find({id_tipo_doc: this.id_tipo_doc});
    },
    edges: function(){
        return Edges.find({id_tipo_doc: this.id_tipo_doc});
    }
});

NodeColors = Collections.NodeColors = new Mongo.Collection('nodecolors');
NodeColors.attachSchema(new SimpleSchema({
    key:{
        type: String
    },
    color:{
        type: String
    }
}));Pequena