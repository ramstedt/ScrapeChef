import express from 'express';
import { extractRecipeController } from './controllers/extractController';
import { fetchPage } from './services/fetchPage';
import { extractRecipe } from './services/extractRecipe';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send(`
    <html>
      <head>
        <title>ScrapeChef</title>
        <style>
          body { font-family: Verdana, sans-serif; margin: 2rem; }
          input[type="text"] { width: 400px; }
          pre { background: #f4f4f4; padding: 1rem; }
        </style>
      </head>
      <body>
        <h1>ScrapeChef</h1>
        <form method="POST" action="/extract">
          <label for="url">Recipe URL:</label><br/>
          <input type="text" id="url" name="url" placeholder="Paste recipe URL here" required /><br/><br/>
          <button type="submit">Extract Recipe</button>
        </form>
      </body>
    </html>
  `);
});

app.post('/extract', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.send('<p style="color:red;">Please provide a valid URL.</p>');
  }

  try {
    const html = await fetchPage(url);
    const recipe = extractRecipe(html);
    res.send(`
      <html>
        <head>
          <title>ScrapeChef - Recipe Result</title>
          <style>
            body { font-family: Courier New, sans-serif; margin: 2rem; }
            pre { background: #f4f4f4; padding: 1rem; white-space: pre-wrap; word-wrap: break-word; }
            a { display: inline-block; margin-top: 1rem; }
          </style>
        </head>
        <body>
          <h1>Extracted Recipe</h1>
          <pre>${JSON.stringify(recipe, null, 2)}</pre>
          <a href="/">Back</a>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error(err);
    res.send(
      `<p style="color:red;">Error extracting recipe: ${
        err.message || err
      }</p><a href="/">Back</a>`
    );
  }
});

app.post('/api/extract', extractRecipeController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ScrapeChef running on port ${PORT}`);
});
