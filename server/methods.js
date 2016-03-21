/**
 * Created by diogomartins on 3/10/16.
 */
Meteor.methods({
    getFluxo: function(id_tipo_doc){
        var url = "http://sistemas.unirio.br/api/FLUXOS?FORMAT=JSON&FIELDS=DESCR_FLUXO%2CSITUACAO_ATUAL%2CSITUACAO_FUTURA%2CTIPO_DESTINO%2CID_DESTINO%2CID_FLUXO&LMAX=100&ID_TIPO_DOC="+id_tipo_doc+"&IND_ATIVO=S&API_KEY=9287c7e89bc83bbce8f9a28e7d448fa7366ce23f163d2c385966464242e0b387e3a34d0e205cb775d769a44047995075&LMIN=1";
        console.log("Consultando: " + url);

        var result = HTTP.get(url);
        if (result.statusCode == 200){
            var fluxos = result.data.content;
            Fluxos.upsert({id_tipo_doc:id_tipo_doc}, {$set: {fluxos:fluxos}});
            var parser = new FluxosParser(fluxos);
            const grafo = parser.parse();
            return grafo;
        }
        else{
            console.log("ERRO AO CONSULTAR TIPO " + id_tipo_doc);
        }
    }
});
