import { RestBot } from './lib/restbot/restbot';

var bot = new RestBot(
    {
        base: 'https://api.github.com',
    }
);

var params = {
    q: "language:python",
    sort: "stars",
    order: "desc"
};

bot.get('/search/repositories', params)
    .then(
        (res) => {
            console.log("RESPONSE", res.response);
        }
    );
