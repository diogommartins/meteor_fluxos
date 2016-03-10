/**
 * Created by diogomartins on 3/10/16.
 */
class Graph{
    constructor(fluxos){
        this.fluxos = fluxos;
        this.edges = [];
        this.nodes = [];
        this._makeGraph();
    }

    hasNode(node){
        return this.nodes.filter(function(n){return n.data.id === node.data.id}).length !== 0;
    }

    addNode(name, fluxo) {
        var node = {
            data: {
                id: name,
                name: name,
                tipo: fluxo.TIPO_DESTINO.toString() + fluxo.ID_DESTINO.toString()
            }
        };
        if (!this.hasNode(node))
            this.nodes.push(node);
    }

    _makeGraph(){
        var self = this;
        this.fluxos.forEach(function(fluxo){
            self.edges.push({
                data: {
                    source: fluxo.SITUACAO_ATUAL,
                    target: fluxo.SITUACAO_FUTURA,
                    name: fluxo.DESCR_FLUXO
                }
            });
            self.addNode(fluxo.SITUACAO_ATUAL, fluxo);
            self.addNode(fluxo.SITUACAO_FUTURA, fluxo);
        });
    }
}

this.Graph = Graph;
