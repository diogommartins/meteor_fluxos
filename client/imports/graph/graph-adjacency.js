/**
 * Created by diogomartins on 6/15/16.
 */
/**
 * Created by diogomartins on 6/15/16.
 */
export class GraphAdjacencyHelper{
    constructor(){
        /** @type: Graph */
        this.graph = undefined
    }

    static dataFromCollection(collection, property){
        const names = [];
        collection.each((i, node) => names.push(node.data()[property]));
        return names;
    }

    list(){
        const container = {};

        if (this.graph.isDirected()){
            for (let node of this.graph.nodes){
                const element = this.graph.cy.$("#" + node.data.id);
                const connected = element.neighbourhood().nodes();

                container[node.data.id] = {
                    name: node.data.name,
                    connected: connected
                };
            }
        }

        return container;
    }

    /**
     *
     * @returns {{}}
     */
    matrix(){
        const m = {};

        for (let row of this.graph.nodes){
            m[row.data.id] = {};

            const element = this.graph.cy.$("#" + row.data.id);
            const connected = element.neighbourhood().nodes();
            const ids = this.dataFromCollection(connected, 'id');

            for (let col of this.graph.nodes){
                m[row.data.id][col.data.id] = _.contains(ids, col.data.id) ? 1: 0;
            }
        }
        return m;
    }

    /**
     *
     * @param arg: {{data:Object, type:String}}
     */
    prettyPrint(arg){
        switch (arg.type){
            case "matrix":
                console.table(arg.data);
                break;
            case "list":
                for (let key of Object.keys(arg.data)){
                    const item = arg.data[key];
                    const names = this.dataFromCollection(item.connected, 'name');
                    console.log(item.name, '->', names.join(', '));
                }
                break;
        }
    }
}