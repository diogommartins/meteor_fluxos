/**
 * Created by diogomartins on 6/15/16.
 */
/**
 * Created by diogomartins on 6/15/16.
 */
export class GraphAdjacencyHelper{
    constructor(){
        /** @type: Graph */
        this.graph = undefined;
    }

    /**
     * Dada uma `collection`, a função retorna um array com as `property`
     *
     * @param collection: cytoscape.collection
     * @param property: String
     * @returns {Array}
     */
    static dataFromCollection(collection, property){
        const names = [];
        collection.each((i, node) => names.push(node.data()[property]));
        return names;
    }

    /**
     * Retorna uma "lista" de adjacência, na forma de um objecto, em que cada propriedade
     * é um node, identificiado pelo seu atributo `id` e um atributo `connected`, correspondente
     * a uma `Collection` de outros `nodes` conectados.
     *
     * @returns {{}}
     */
    list(){
        const container = {};

        for (let node of this.graph.nodes){
            const element = this.graph.cy.$("#" + node.data.id);
            const connected = element.neighbourhood().nodes();

            container[node.data.id] = {
                name: node.data.name,
                connected: connected
            };
        }

        return container;
    }

    /**
     * Matriz de adjacência
     *
     * todo: Melhorar essa documentação
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
     * Método para auxiliar a impressão de listas e matrizes no console em formato humano
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