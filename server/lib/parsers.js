/**
 * Created by diogomartins on 3/18/16.
 */
class FluxosParser{
    constructor(id, fluxos){
        this.id = Number(id);
        this.fluxos = fluxos;
        this._edges = [];
        this._nodes = [];
    }

    hasNode(node){
        return this._nodes.filter(n => n.data.id === node.data.id).length !== 0;
    }

    addNode(name, fluxo) {
        const node = {
            id_tipo_doc: this.id,
            data: {
                id: String(name),
                name: String(name),
                tipo: fluxo.TIPO_DESTINO.toString() + fluxo.ID_DESTINO.toString()
            }
        };
        if (!this.hasNode(node))
            this._nodes.push(node);
    }

    parse() {
        const gambiDescricaoTipoDocumento = this.fluxos[0].DESCR_TIPO_DOC.trimRight();
        this.fluxos.forEach(fluxo => {
            this._edges.push({
                id_tipo_doc: this.id,
                data: {
                    source: fluxo.SITUACAO_ATUAL,
                    target: fluxo.SITUACAO_FUTURA,
                    name: fluxo.DESCR_FLUXO
                }
            });
            this.addNode(fluxo.SITUACAO_ATUAL, fluxo);
            this.addNode(fluxo.SITUACAO_FUTURA, fluxo);
        });
        return { nodes: this._nodes, edges: this._edges, name: gambiDescricaoTipoDocumento };
    }
}

this.FluxosParser = FluxosParser;