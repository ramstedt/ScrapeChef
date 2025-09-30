import { Request, Response } from 'express';
import { fetchPage } from '../services/fetchPage';
import { extractRecipe } from '../services/extractRecipe';
import { Recipe } from '../types/recipe';

export const extractRecipeController = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid URL.' });
  }

  try {
    const html: string = await fetchPage(url);
    const recipe: Recipe | null = extractRecipe(html);

    if (!recipe) {
      return res.status(404).json({ error: 'No recipe found.' });
    }

    return res.status(200).json(recipe);
  } catch (err) {
    console.error('Error extracting recipe:', err);
    return res
      .status(500)
      .json({ error: 'Failed to fetch or extract recipe.' });
  }
};
