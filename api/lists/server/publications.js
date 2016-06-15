/**
 * Created by diogomartins on 6/14/16.
 */
import { Meteor } from 'meteor/meteor';


Meteor.publish('publicGraphs', () => CyGraphs.find({}));
Meteor.publish('graphNodes', graphId => Nodes.find({graphId: graphId}));
Meteor.publish('graphEdges', graphId => Edges.find({graphId: graphId}));
Meteor.publish('chatMessages', graphId => Chats.find({graphId: graphId}));