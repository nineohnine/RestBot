import http from 'http';
import https from 'https';

export class RestBot {

    constructor(options, respObj){

        this.base = options.base;
        this._pathToAPI = options.pathToAPI || '';
        this.port = options.port || undefined;
        this.headers = options.headers;
        this.responseType = options.responseType || '';
        this.scheme = options.scheme || undefined;

        if(this.scheme == undefined || this.scheme == null){
            if(this.base.indexOf("http") != -1){
                var bases = this.base.split(':');
                this.scheme = bases[0];

                bases = this.base.split('//');
                this.base = '';

                for(var i = 1; i < bases.length; i++){
                    this.base += bases[i];
                }

                console.log("new base", this.base)

            }

            if(this.scheme == undefined) this.scheme = 'http';

        }


        this.withCredentials = options.withCredentials || false;

        this.http = this.scheme == 'https' ? https : http;

        if(this.port == undefined) this.port = this.scheme == 'https' ? 443 : 80;

        this._currReqPath = [];

        this._request = options.prevRequest || null;

        this._response = respObj != undefined ? this._parseResponse(respObj) : null;

    }

    _buildReqOptions(){

        return {
            hostname: this.base,
            port: this.port,
            headers: this.headers,
            withCredentials: this.withCredentials,
            responseType: this.responseType
        };

    }

    static _restBotFactory(opts, res){

        return new RestBot(opts, res);

    }

    _parseResponse(response){

        response = response != undefined ? response : this._response;

        let resp = response.getResponse(this._request.xhr);


        try {
            resp = JSON.parse(resp);
        }
        catch(e){
            console.log("json parse err:", e)
        }


        return resp.items;

    }

    _buildQueryParams(params){
        let qParams = '?';
        let i = 1;

        console.log("params object", params);

        for(let k in params){

            if(i == Object.keys(params).length){
                qParams += k + '=' + params[k];
            }
            else {
                qParams += k + '=' + params[k] + '&';
            }

            i++;

        }

        return qParams;

    }

    _buildFullPath(){

        let path = this._pathToAPI;

        for(let i = 0; i < this._currReqPath.length; i++){
            path += this.currReqPath[i];
        }

        return path;

    }

    get response(){
        return this._response;
    }

    get request(){
        return this._request;
    }

    getRestBotOpts(){

        return {
            base: this.base,
            protocol: this.protocol,
            port: this.port,
            headers: this.headers,
            responseType: this.responseType,
            scheme: this.scheme,
            withCredentials: this.withCredentials,
            prevRequest: this._request
        }

    }

    get(path, params){
        //path = this._currResPath.join('/')

        let options = this._buildReqOptions();

        options.path = (this._buildFullPath() + path);

        options.method = 'GET';

        if(params != undefined) options.path += this._buildQueryParams(params);

        console.log('params', options.path);

        return new Promise((resolve, reject) => {

            let resp;

            this._request = this.http.request(options, (res) => {});

            this._request.on('response', (res) => {
                resp = res;
            });

            this._request.on('close', () => {
                resolve(
                    RestBot._restBotFactory(
                        this.getRestBotOpts(),
                        resp
                    )
                );
            });

            this._request.on('error', (e) => {
                reject(e);
            });

            this._request.end();

        });
    }
}
