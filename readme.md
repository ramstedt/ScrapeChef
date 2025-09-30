# ScrapeChef

## Description

ScrapeChef is a web scraping tool designed to specifically extract recipes from websites. The idea sprouted from the frustration of heavy, bloated blog-like recipe sources.

## Tech Stack

- Node.js
- TypeScript
- Cheerio
- Express
- Playwright

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/eramstedt/ScrapeChef.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ScrapeChef
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the project:

   ```bash
   npm start
   ```

## Usage

The project runs on port 3000 by default. Open your browser and navigate to:

```
http://localhost:3000
```

Enter a URL for the recipe you wish to extract.

## API Usage

You can also use the API directly with a curl command:

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/your-recipe-url"}'
```

Replace `https://example.com/your-recipe-url` with the actual recipe URL you want to scrape.

## Testing

The following websites have been tested and confirmed compatible with this project:

- Allrecipes.com
- Recept.se
- Ica.se/recept
- Tasteline.se
- Bytheforkful.com
- Bbc.co.uk/food/recipes
