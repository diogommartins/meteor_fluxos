/**
 * Created by diogomartins on 3/18/16.
 */
class FluxosParser{
    constructor(id, fluxos){
        this.id = id;
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
                tipo: String(fluxo.TIPO_DESTINO) + String(fluxo.ID_DESTINO),
                id_tipo_doc: this.id
            },
            group: 'nodes'
        };
        node.data.color = this._colorForNode(node); // eca !

        if (!this.hasNode(node))
            this._nodes.push(node);
    }
    // Todo: Essa classe deveria realizar esse tipo de acesso a dados ?
    _colorForNode(node){
        let nodeColor = NodeColors.findOne({key: node.data.tipo});
        if (typeof nodeColor === 'undefined'){
            nodeColor = {
                key: node.data.tipo,
                color: randomColor({format: 'rgb'})
            };
            NodeColors.insert(nodeColor);
        }
        return nodeColor.color;
    }

    parse() {
        const gambiDescricaoTipoDocumento = this.fluxos[0].DESCR_TIPO_DOC.trimRight();
        for(let fluxo of this.fluxos){
            this._edges.push({
                id_tipo_doc: this.id,
                data: {
                    id: String(fluxo.ID_FLUXO),
                    source: String(fluxo.SITUACAO_ATUAL),
                    target: String(fluxo.SITUACAO_FUTURA),
                    name: String(fluxo.DESCR_FLUXO).trim(),
                    id_tipo_doc: this.id
                },
                group: 'edges'
            });
            this.addNode(fluxo.SITUACAO_ATUAL, fluxo);
            this.addNode(fluxo.SITUACAO_FUTURA, fluxo);
        }
        return { 
            id_tipo_doc: this.id,
            nodes: this._nodes, 
            edges: this._edges,
            name: gambiDescricaoTipoDocumento 
        };
    }
}

this.FluxosParser = FluxosParser;