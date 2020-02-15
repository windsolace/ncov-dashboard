const fetch = require('node-fetch');

const NEWSAPIKEY = process.env.NEWSAPIKEY;

exports.handler = async (event) => {

    let API_ENDPOINT = "https://newsapi.org/v2/top-headlines?country=sg&q=coronavirus&language=en&apiKey=" + NEWSAPIKEY;

    return fetch(API_ENDPOINT, { headers: { "Accept": "application/json" } })
        .then(response => response.json()) 
        .then(data => ({
            api: API_ENDPOINT,
            statusCode: 200,
            body: JSON.stringify(data)
        }))
        .catch(error => ({ statusCode: 422, body: String(error) }));

};