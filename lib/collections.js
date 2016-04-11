/**
 * Created by diogomartins on 3/18/16.
 */
Schemas = {};
if (Meteor.isClient){ Template.registerHelper("Schemas", Schemas) }

Collections = {};
if (Meteor.isClient){ Template.registerHelper("Collections", Collections) }

/**
 * Debugging
 */
SimpleSchema.debug = true;
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
        type: String,
        label: "Identificador único do nó no grafo"
    },
    'data.id_tipo_doc':{
        type: Number,
        optional: true
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
    'position.x':{ type: Number, decimal: true, label:"Posição em X"},
    'position.y':{ type: Number, decimal: true, label:"Posição em  Y"},
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
    'data.id':{
        type: String,
        label: 'Identificador único da aresta no grafo'
    },
    'data.id_tipo_doc':{
        type: Number,
        optional: true
    },
    'data.name':{
        type: String,
        label: 'Descrição'
    },
    'data.source':{
        type: String,
        label: 'Origem'
    },
    'data.target':{
        type: String,
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

/**
 * NodeColors
 */

NodeColors = Collections.NodeColors = new Mongo.Collection('nodecolors');
NodeColors.attachSchema(new SimpleSchema({
    key:{
        type: String
    },
    color:{
        type: String
    }
}));

/**
 * Chat
 */

Chats = Collections.Chats = new Mongo.Collection('chats');
Schemas.ChatsSchema = new SimpleSchema({
    id_tipo_doc:{
        type: Number
    },
    timestamp:{
        type: Date
    },
    content:{
        type: String
    },
    createdBy:{
        type: String,
        autoValue:function(){
            return this.userId
        }
    }

});
Chats.helpers({
    creator: function(){
        return Meteor.users.findOne(this.createdBy);
    },
    prettyDate: function(){
        return moment(this.timestamp).fromNow()
    }
});
Chats.attachSchema(Schemas.ChatsSchema);

/**
 * SChemas que eu não sei onde enfiar... todo
 */
Schemas.newEdgeSchema = new SimpleSchema({
    data:{
        type: Object
    },
    'data.id_tipo_doc':{
        type: Number,
        optional: true
    },
    'data.name':{
        type: String,
        label: 'Descrição'
    },
    'data.source':{
        type: String,
        label: 'Origem'
    },
    'data.target':{
        type: String,
        label: 'Destino'
    }
});

Tramitacoes = Collections.Tramitacoes = new Mongo.Collection('tramitacoes');
Documentos = Collections.Documentos = new Mongo.Collection('documentos');


Meteor.users.helpers({
    names: function(){
        return this.profile.fullname.trim().split(" ");
    },
    firstname: function(){
        return this.names()[0];
    },
    shortname: function(){
        const names = this.names();
        return (names.length > 1) ? names[0] + " " + names[names.length -1] : names[0];
    }
});

