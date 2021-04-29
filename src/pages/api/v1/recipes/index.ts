import * as mongodb from 'mongodb'
import { createApiHandler } from 'src/createApiHandler'
import { CreateRecipe, Recipe } from 'src/models'
import * as db from 'src/mongodb'
import { withAuth } from 'src/withAuth'

const getRecipesHandler = withAuth(async (req, res, session) => {
  try {
    const recipes = await db.findRecipesByUserEmail(session.user.email)
    res.json(recipes.map((recipe) => Recipe.parse(recipe)))
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

const createRecipeHandler = withAuth(async (req, res, session) => {
  try {
    const body = CreateRecipe.parse(req.body)
    const recipe = await db.createRecipeForUser(body, session.user.email)
    res.json(Recipe.parse(recipe))
  } catch (error) {
    console.error(error)
    if (error instanceof mongodb.MongoError) {
      switch (error.code) {
        case 11000:
          return res.status(400).json({
            errors: {
              name: 'Recipe with name already exists',
            },
          })
      }
    }
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default createApiHandler({
  get: getRecipesHandler,
  post: createRecipeHandler,
})
