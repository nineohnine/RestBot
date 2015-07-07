import { RestBot } from './lib/restbot/restbot';

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
