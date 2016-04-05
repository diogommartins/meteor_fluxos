/**
 * Created by diogomartins on 3/31/16.
 */
var Unirio = {};

Unirio.APIServers = {
    PRODUCTION: "sistemas.unirio.br/api",
    DEVELOPMENT: "teste.sistemas.unirio.br/api",
    LOCAL: "localhost:8000/api",
    PRODUCTION_DEVELOPMENT: "sistemas.unirio.br/api_teste"
};

class API{
    constructor(key, server=Unirio.APIServers.LOCAL, secure=false){
        this._key = key;
        this.server = server;
        this._protocol = secure ? 'https': 'http';
    }
    _url_with_path(path){
        return `${this._protocol}://${this.server}/${path}`;
    }
    get(path, params={}, fields=[]){
        const url = this._url_with_path(path);
        const payload = this._parsePayload(params, fields);
        const result = HTTP.get(url, {data: payload});
        if (result.statusCode == 200) {
            return result.data;
        }
    }
    _parsePayload(params, fields){
        return Object.assign(params, {
            FIELDS: fields.join(),
            API_KEY: this._key,
            FORMAT: 'JSON'
        })
    }
}

Unirio.API = API;

this.Unirio = Unirio;