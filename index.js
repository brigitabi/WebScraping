const PORT = 8000;

const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();

const url = 'https://www.theguardian.com/technology/chatgpt';

axios(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const articles = [];

    $('.fc-item__content', html).each(function () {
      const title = $(this).text();
      const url = $(this).find('a').attr('href');
      const date = $(this).closest('.fc-item').find('.fc-item__timestamp').text();
      
      if (title.includes('ChatGPT')) {
      articles.push({
        title,
        url,
        date
      });
    }
    });

    // Sorting the articles array in descending order based on the date
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Generating an HTML response
    const generateHTMLResponse = () => `
      <html>
        <head>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <h1>Hey there! Here are your scraped articles📄</h1>
          <div class="articles">
            ${articles.map(article => `
              <div class="article">
                <div class="title">${article.title}</div>
                <div class="url">
                  <a href="${article.url}" target="_blank">${article.url}</a>
                </div>
                <div class="date">${article.date}</div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    // Defining a route on the router to handle the root URL
    router.get('/', (req, res) => {
      res.send(generateHTMLResponse());
    });

    // Registering the router with the app
    app.use('/', router);

    // Serving the static files (CSS file)
    app.use(express.static(path.join(__dirname, 'public')));

    // Starting the server and listen on the specified port
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
      console.log(`Open http://localhost:${PORT}/ to see the scraped data.`);
    });
  })
  .catch(err => console.log(err));