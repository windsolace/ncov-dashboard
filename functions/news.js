import fetch from "node-fetch";

const { NEWSAPIKEY } = process.env;
const API_ENDPOINT = "https://newsapi.org/v2/top-headlines?country=sg&q=coronavirus&language=en&apiKey="+ NEWSAPIKEY;

exports.handler = async (event, context) => {
    return fetch(API_ENDPOINT, { headers: { "Accept": "application/json" } })
        .then(response => response.json())
        .then(data => ({
            statusCode: 200,
            body: data
        }))
        .catch(error => ({ statusCode: 422, body: String(error) }));
};