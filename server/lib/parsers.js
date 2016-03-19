/**
 * Created by diogomartins on 3/18/16.
 */
class FluxosParser{
    constructor(fluxos){
        this.fluxos = fluxos;
        this._edges = [];
        this._nodes = [];
    }

    hasNode(node){
        return this.nodes.filter(n => n.data.id === node.data.id).length !== 0;
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
            this._nodes.push(node);
    }

    parse() {
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
        return { nodes: this._nodes, edges: this._edges };
    }
}

this.FluxosParser = FluxosParser;