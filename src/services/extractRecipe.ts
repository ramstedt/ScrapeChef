import * as cheerio from 'cheerio';
import { Recipe } from '../types/recipe';

export const extractRecipe = (html: string): Recipe | null => {
  const $ = cheerio.load(html);

  const scripts = $('script[type="application/ld+json"]').toArray();
  for (const script of scripts) {
    const jsonLd = $(script).html();
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd);
        const findRecipe = (item: any): any => {
          if (!item) return null;
          if (Array.isArray(item)) {
            for (const subItem of item) {
              const found = findRecipe(subItem);
              if (found) return found;
            }
            return null;
          }
          if (typeof item['@type'] === 'string' && item['@type'] === 'Recipe') {
            return item;
          }
          if (
            Array.isArray(item['@type']) &&
            item['@type'].includes('Recipe')
          ) {
            return item;
          }
          if (item['@graph']) {
            return findRecipe(item['@graph']);
          }
          return null;
        };

        const recipeData = findRecipe(data);

        if (recipeData) {
          return {
            title: recipeData.name || 'Untitled Recipe',
            ingredients: recipeData.recipeIngredient || [],
            instructions: recipeData.recipeInstructions
              ? Array.isArray(recipeData.recipeInstructions)
                ? recipeData.recipeInstructions.map((step: any) =>
                    typeof step === 'string' ? step : step.text
                  )
                : [recipeData.recipeInstructions]
              : [],
            servings: recipeData.recipeYield,
          };
        }
      } catch (err) {
        console.warn('Failed to parse JSON-LD:', err);
      }
    }
  }

  const title = $('h1').first().text().trim() || 'Untitled Recipe';
  let ingredients = $('li[class*="ingredient"]')
    .map((_, el) => $(el).text().trim())
    .get();
  let instructions = $('div#mm-recipes-steps__content_1-0 ol li p')
    .map((_, el) => $(el).text().trim())
    .get();

  //ByTheForkful selectors
  const bytheforkfulName = $('h1.recipe-title').first().text().trim();
  if (bytheforkfulName) {
    const bytheforkfulIngredients = $('div.mv-create-ingredients ul li')
      .not('.adthrive-ad')
      .map((_, el) => $(el).text().trim())
      .get();
    const bytheforkfulInstructions = $('div.mv-create-instructions ol li')
      .not('.adthrive-ad')
      .map((_, el) => $(el).text().trim())
      .get();

    if (
      bytheforkfulIngredients.length > 0 ||
      bytheforkfulInstructions.length > 0
    ) {
      return {
        title: bytheforkfulName,
        ingredients: bytheforkfulIngredients,
        instructions: bytheforkfulInstructions,
      };
    }
  }

  if (ingredients.length === 0 && instructions.length === 0) {
    // Baka.se selectors
    const bakaIngredients = $(
      'div.recipe__recipe__ingredients__section ul.recipe__recipe__list li[itemprop="recipeIngredient"]'
    )
      .map((_, el) => $(el).text().trim())
      .get();
    const bakaInstructions = $(
      'div.recipe__recipe__instructions li[itemprop="recipeInstructions"] p'
    )
      .map((_, el) => $(el).text().trim())
      .get();
    const bakaTitle = $('h1').first().text().trim() || 'Untitled Recipe';

    if (bakaIngredients.length > 0 || bakaInstructions.length > 0) {
      return {
        title: bakaTitle,
        ingredients: bakaIngredients,
        instructions: bakaInstructions,
      };
    }

    return null;
  }

  return { title, ingredients, instructions };
};
