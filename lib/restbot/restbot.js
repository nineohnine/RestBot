import http from 'http';
import https from 'https';

export class RestBot {

    constructor(options, respObj){

        this.base = options.base;
        this.port = options.port;
        this.headers = options.headers;
        this.responseType = options.responseType || '';
        this.scheme = options.scheme;

        if(this.scheme == undefined || this.scheme == null){

            var bases = this.base.split(':');
            this.scheme = bases[0];

            bases = this.base.split('//');
            this.base = '';

            for(var i = 1; i < bases.length; i++){
                this.base = this.base + bases[i];
            }

        }

        this.withCredentials = options.withCredentials || false;

        this.http = this.scheme == 'https' ? https : http;

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

    get response(){
        return this._response;
    }

    get request(){
        return this._request;
    }

    getRestBotOpts(){

        return {
            base: this.base,
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
        options.path = path;
        options.method = 'GET';

        return new Promise((resolve, reject) => {
            let resp;

            this._request = this.http.request(options, (res) => {

             //   res.on('data', (data) => {
             //   });

            });

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
