/**
 * Created by diogomartins on 6/14/16.
 */
import { Meteor } from 'meteor/meteor';

Meteor.publish('myGraphs', () => CyGraphs.find({owner: this.userId}));
Meteor.publish('publicGraphs', () => CyGraphs.find({}));
Meteor.publish('nodesAndEdges', graphId => [ Nodes.find({graphId: graphId}), Edges.find({graphId: graphId}) ]);
Meteor.publish('chatMessages', graphId => Chats.find({graphId: graphId}));

Meteor.publish('documentos', () => Documentos.find({}));
Meteor.publish('users.publicData', () => Meteor.users.find({}, {fields: {'_id': 1, 'profile': 1}}));