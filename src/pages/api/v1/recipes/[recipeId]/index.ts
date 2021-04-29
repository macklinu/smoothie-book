import { createApiHandler } from 'src/createApiHandler'
import * as db from 'src/mongodb'
import { withAuth } from 'src/withAuth'
import * as z from 'zod'

const Params = z.object({
  recipeId: z.string(),
})

// TODO implement update API
const updateRecipeHandler = withAuth(async (req, res, session) => {
  try {
    const { recipeId } = Params.parse(req.query)
    res.json({})
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

const deleteRecipeHandler = withAuth(async (req, res, session) => {
  try {
    const { recipeId } = Params.parse(req.query)
    const result = await db.deleteRecipe(recipeId, session.user.email)
    console.log(result)
    res.status(204).json({})
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default createApiHandler({
  put: updateRecipeHandler,
  delete: deleteRecipeHandler,
})
