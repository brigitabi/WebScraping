const PORT = 8000

const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();

const url = 'https://www.theguardian.com/technology/chatgpt'

axios(url)
    .then(response => { 
        const html = response.data
        const $ = cheerio.load(html)
        const articles = []


        $('.fc-item__title', html).each(function() {
            const title = $(this).text()
            const url = $(this).find('a').attr('href')
            const date = $(this).closest('.fc-item').find('.fc-item__timestamp').text();

            articles.push({
                title, 
                url,
                date
            })
        })
        console.log(articles)
    }).catch(err => console.log(err))

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))