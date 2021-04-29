import { MongoError } from 'mongodb'
import * as mongoose from 'mongoose'
import * as Models from 'src/models'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please define the DATABASE_URL environment variable inside .env')
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        bufferMaxEntries: 0,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then((mongoose) => {
        return mongoose
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}

interface Ingredient extends mongoose.Document {
  name: string
  amount: string
}

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
})

const Ingredient =
  (mongoose.models.Ingredient as mongoose.Model<Ingredient>) ||
  mongoose.model<Ingredient>('Ingredient', IngredientSchema)

interface Recipe extends mongoose.Document {
  name: string
  ingredients: [Ingredient, ...Ingredient[]]
  userEmail: string
}

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  ingredients: [IngredientSchema],
  userEmail: {
    type: String,
    required: true,
  },
})

const Recipe =
  (mongoose.models.Recipe as mongoose.Model<Recipe>) ||
  mongoose.model<Recipe>('Recipe', RecipeSchema)

export async function findRecipesByUserEmail(email: string) {
  await dbConnect()
  const recipes = await Recipe.find({ userEmail: email }).exec()
  return recipes.map(recipeToApiModel)
}

export async function findRecipeById(id: string) {
  await dbConnect()
  const recipe = await Recipe.findById(id).exec()
  return recipe ? recipeToApiModel(recipe) : null
}

export async function updateRecipe(id: string, body: Models.Recipe, email: string) {
  await dbConnect()
  return Recipe.updateOne(
    { _id: id, userEmail: email },
    {
      $set: {
        name: body.name,
        ingredients: body.ingredients,
      },
    }
  ).exec()
}

export async function createRecipeForUser(body: Models.CreateRecipe, email: string) {
  await dbConnect()
  const recipe = await Recipe.create({ ...body, userEmail: email })
  return recipeToApiModel(recipe)
}

export async function deleteRecipe(id: string, email: string) {
  await dbConnect()
  return Recipe.deleteOne({ _id: id, userEmail: email }).exec()
}

function recipeToApiModel({ _id, name, ingredients }: Recipe): Models.Recipe {
  return {
    id: _id.toString(),
    name,
    ingredients,
  }
}

export function isDuplicateKeyError(error: Error) {
  if (error instanceof MongoError) {
    return error.code === 11000
  }
  return false
}
