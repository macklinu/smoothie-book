import { createApiHandler } from 'src/createApiHandler'
import { Recipe } from 'src/models'
import { deleteRecipe, isDuplicateKeyError, updateRecipe } from 'src/mongodb'
import { withAuth } from 'src/withAuth'
import * as z from 'zod'

const Params = z.object({
  recipeId: z.string(),
})

const updateRecipeHandler = withAuth(async (req, res, session) => {
  try {
    const { recipeId } = Params.parse(req.query)
    const body = Recipe.parse(req.body)
    const result = await updateRecipe(recipeId, body, session.user.email)
    if (result.ok) {
      res.status(204).json({})
    } else {
      res.status(404).json({ error: 'Not Found' })
    }
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(400).json({
        errors: {
          name: 'Recipe with name already exists',
        },
      })
    }
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

const deleteRecipeHandler = withAuth(async (req, res, session) => {
  try {
    const { recipeId } = Params.parse(req.query)
    const result = await deleteRecipe(recipeId, session.user.email)
    if (result.ok) {
      res.status(204).json({})
    } else {
      res.status(404).json({ error: 'Not Found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default createApiHandler({
  put: updateRecipeHandler,
  delete: deleteRecipeHandler,
})
