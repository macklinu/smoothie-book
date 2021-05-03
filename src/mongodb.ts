import { MongoError } from 'mongodb'
import * as mongoose from 'mongoose'
import * as Models from 'src/models'

// Modified from https://github.com/vercel/next.js/blob/v10.2.0/examples/with-mongodb-mongoose/utils/dbConnect.js

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
  console.log({ cached, globalMongoose: global.mongoose })
  if (!process.env.DATABASE_URL) {
    throw new Error('Please define the DATABASE_URL environment variable inside .env')
  }

  if (cached.conn) {
    console.log('Using cached mongoose connection')
    return cached.conn
  }

  if (!cached.promise) {
    console.log('Setting up mongoose connection')
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
  console.log('Connecting to mongoose')
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
  console.log('Finding recipes by userEmail')
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
  console.log('Updating recipe')
  return Recipe.findOneAndUpdate(
    { _id: id, userEmail: email },
    { name: body.name, ingredients: body.ingredients }
  )
}

export async function createRecipeForUser(body: Models.CreateRecipe, email: string) {
  await dbConnect()
  console.log('Creating recipe')
  const recipe = await Recipe.create({ ...body, userEmail: email })
  return recipeToApiModel(recipe)
}

export async function deleteRecipe(id: string, email: string) {
  await dbConnect()
  console.log('Deleting recipe')
  return Recipe.findOneAndDelete({ _id: id, userEmail: email })
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
