import { RestBot } from './lib/restbot/restbot';
import $ from 'jquery';

console.log('RestBot', RestBot);

var bot = new RestBot(
    {
        base: 'https://api.github.com',
        port: 443
    }
);

bot.get('/search/repositories?q=language:python&sort=stars&order=desc')
    .then(
        (res) => {
            console.log("RESPONSE", res.response);
        }
    );
