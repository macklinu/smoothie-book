import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  Box,
  BoxProps,
  Button,
  ButtonGroup,
  ButtonProps,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Input,
  Link,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetServerSideProps } from 'next'
import { getSession, signIn, signOut, useSession } from 'next-auth/client'
import * as React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
  useRecipes,
  useUpdateRecipeMutation,
} from 'src/apiHooks'
import { CreateRecipe, Recipe } from 'src/models'
import { ZodSchema } from 'zod'

function RecipeCard({
  name,
  ingredients,
  ...rest
}: BoxProps & Pick<Recipe, 'name' | 'ingredients'>) {
  return (
    <Box p={5} shadow='md' borderWidth='1px' width='100%' cursor='pointer' {...rest}>
      <Heading fontSize='lg'>{name}</Heading>
      <List mt={4}>
        {ingredients.map((ingredient, index) => (
          <ListItem key={`${ingredient.name}-${index}`}>
            {ingredient.amount} {ingredient.name}
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

function PrimaryButton(props: ButtonProps) {
  return <Button variant='solid' colorScheme='red' {...props} />
}

function HeaderLogo() {
  return (
    <Flex alignItems='center'>
      <Image src='/cup-with-straw.png' w={8} h={8} />
      <Text fontWeight='bold' fontSize='xl'>
        Smoothie Book
      </Text>
    </Flex>
  )
}

interface NavigationBarProps {
  isLoggedIn: boolean
  onCreateRecipeClick(): void
}

function NavigationBar({ isLoggedIn, onCreateRecipeClick }: NavigationBarProps) {
  return (
    <Box p={4} bgColor='red.100'>
      <Flex alignItems='center'>
        <HeaderLogo />
        <Spacer />
        <ButtonGroup spacing={2}>
          {isLoggedIn ? (
            <Button leftIcon={<AddIcon />} onClick={onCreateRecipeClick}>
              Create Recipe
            </Button>
          ) : null}
          {isLoggedIn ? (
            <PrimaryButton onClick={() => signOut()}>Sign Out</PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => signIn('auth0')}>Sign In</PrimaryButton>
          )}
        </ButtonGroup>
      </Flex>
    </Box>
  )
}

const IndexPage = () => {
  const [session] = useSession()
  const isLoggedIn = React.useMemo(() => !!session, [session])
  const createRecipeModal = useDisclosure()
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | undefined>(undefined)
  return (
    <>
      <NavigationBar isLoggedIn={isLoggedIn} onCreateRecipeClick={createRecipeModal.onOpen} />
      <Container maxW='container.xl'>
        {isLoggedIn ? (
          <LoggedInView
            onCreateRecipeClick={createRecipeModal.onOpen}
            onViewRecipeClick={(recipe) => {
              setSelectedRecipe(recipe)
            }}
          />
        ) : (
          <LoggedOutView />
        )}
      </Container>
      {createRecipeModal.isOpen ? <CreateRecipeModal onClose={createRecipeModal.onClose} /> : null}
      {selectedRecipe ? (
        <UpdateRecipeModal
          recipe={selectedRecipe}
          onClose={() => {
            setSelectedRecipe(undefined)
          }}
        />
      ) : null}
    </>
  )
}

interface LoggedInViewProps {
  onCreateRecipeClick(): void
  onViewRecipeClick(recipe: Recipe): void
}

function LoggedInView({ onCreateRecipeClick, onViewRecipeClick }: LoggedInViewProps) {
  const recipes = useRecipes()
  return (
    <>
      <Grid templateColumns='repeat(3, 1fr)' gap={4} p={4}>
        {recipes.isSuccess
          ? recipes.data.map((recipe) => (
              <GridItem>
                <RecipeCard
                  key={recipe.id}
                  name={recipe.name}
                  ingredients={recipe.ingredients}
                  onClick={() => {
                    onViewRecipeClick(recipe)
                  }}
                />
              </GridItem>
            ))
          : null}
        {/* TODO support empty state? */}
        <GridItem>
          <Box
            as='button'
            borderStyle='dashed'
            borderWidth={4}
            p={12}
            width='100%'
            onClick={onCreateRecipeClick}
          >
            <Flex direction='column' alignItems='center'>
              <AddIcon h={8} w={8} color='gray.600' my={2} />
              <Text>Add a New Recipe</Text>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
    </>
  )
}

interface CreateRecipeModalProps {
  onClose(): void
}

function CreateRecipeModal({ onClose }: CreateRecipeModalProps) {
  const createRecipe = useCreateRecipeMutation()
  return (
    <Modal isOpen onClose={onClose} closeOnEsc={false} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Recipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RecipeForm<CreateRecipe>
            formId='createRecipe'
            schema={CreateRecipe}
            defaultValues={{
              name: '',
              ingredients: [{ name: '', amount: '' }],
            }}
            onSubmit={(values) => {
              createRecipe.mutate(values, {
                onSuccess() {
                  onClose()
                },
              })
            }}
            isNameInvalid={!!createRecipe.error?.response?.data?.errors?.name}
            nameErrorMessage={createRecipe.error?.response?.data?.errors?.name}
          />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing={2}>
            <Button variant='ghost' onClick={onClose}>
              Close
            </Button>
            <Button
              type='submit'
              colorScheme='green'
              mr={3}
              form='createRecipe'
              isLoading={createRecipe.isLoading}
            >
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

interface UpdateRecipeModalProps {
  recipe: Recipe
  onClose(): void
}

function UpdateRecipeModal({ recipe, onClose }: UpdateRecipeModalProps) {
  const updateRecipe = useUpdateRecipeMutation()
  const deleteRecipe = useDeleteRecipeMutation()
  const isRecipeBeingModified = updateRecipe.isLoading || deleteRecipe.isLoading
  return (
    <Modal isOpen onClose={onClose} closeOnEsc={false} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Recipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RecipeForm<Recipe>
            formId='recipe'
            schema={Recipe}
            defaultValues={recipe}
            onSubmit={(values) => {
              updateRecipe.mutate(values)
            }}
            isNameInvalid={!!updateRecipe.error?.response?.data?.errors?.name}
            nameErrorMessage={updateRecipe.error?.response?.data?.errors?.name}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='red'
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this recipe?')) {
                deleteRecipe.mutate(recipe, {
                  onSuccess() {
                    onClose()
                  },
                })
              }
            }}
          >
            Delete
          </Button>
          <Spacer />
          <ButtonGroup spacing={2}>
            <Button variant='ghost' onClick={onClose}>
              Close
            </Button>
            <Button
              type='submit'
              colorScheme='green'
              mr={3}
              form='recipe'
              disabled={isRecipeBeingModified}
              isLoading={isRecipeBeingModified}
            >
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

interface RecipeFormProps<T extends CreateRecipe> {
  formId: string
  onSubmit(values: T): void
  schema: ZodSchema<T>
  defaultValues?: T

  isNameInvalid?: boolean
  nameErrorMessage?: string
}

function RecipeForm<T extends CreateRecipe>({
  formId,
  onSubmit,
  schema,
  defaultValues,
  isNameInvalid = false,
  nameErrorMessage,
}: RecipeFormProps<T>) {
  const { formState, register, control, handleSubmit } = useForm<CreateRecipe>({
    mode: 'onSubmit',
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  })
  const ingredients = useFieldArray({
    control: control,
    name: 'ingredients',
  })
  return (
    <form
      id={formId}
      onSubmit={handleSubmit(async (values) => {
        onSubmit(values as T)
      })}
    >
      <Stack spacing={4}>
        <FormControl id='name' isInvalid={!!formState.errors.name || isNameInvalid}>
          <FormLabel>Name</FormLabel>
          <Input type='text' {...register('name')} autoFocus />
          <FormHelperText>Give your smoothie a unique name.</FormHelperText>
          <FormErrorMessage>{formState.errors.name?.message ?? nameErrorMessage}</FormErrorMessage>
        </FormControl>
        <Spacer my={4} />
        {ingredients.fields.map((field, index) => {
          return (
            <Flex key={field.id} my={2}>
              <FormControl flexGrow={1} isInvalid={!!formState.errors.ingredients?.[index]?.name}>
                <FormLabel display='flex' flexDirection='row' alignItems='center'>
                  <Text>Ingredient</Text>
                  <IconButton
                    ml={2}
                    aria-label='Delete'
                    size='xs'
                    icon={<DeleteIcon />}
                    onClick={() => {
                      if (ingredients.fields.length > 1) {
                        ingredients.remove(index)
                      }
                    }}
                    disabled={ingredients.fields.length === 1}
                  />
                </FormLabel>
                <Input
                  type='text'
                  key={`name-${field.id}`}
                  {...register(`ingredients.${index}.name` as const)}
                  defaultValue={field.name}
                />
                <FormErrorMessage>
                  {formState.errors.ingredients?.[index]?.name?.message}
                </FormErrorMessage>
              </FormControl>
              <Spacer mx={2} />
              <FormControl
                flexBasis={40}
                isInvalid={!!formState.errors.ingredients?.[index]?.amount}
              >
                <FormLabel>Amount</FormLabel>
                <Input
                  type='text'
                  key={`amount-${field.id}`}
                  {...register(`ingredients.${index}.amount` as const)}
                  defaultValue={field.amount}
                />
                <FormErrorMessage>
                  {formState.errors.ingredients?.[index]?.amount?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
          )
        })}
        <Flex>
          <Spacer />
          <Button
            aria-label='Add'
            size='xs'
            leftIcon={<AddIcon />}
            onClick={() => {
              ingredients.append({ name: '', amount: '' })
            }}
          >
            Add Ingredient
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}

function LoggedOutView() {
  return (
    <Container maxWidth='container.xl' py={4}>
      <Center flexDirection='column'>
        <Heading>Welcome to Smoothie Book</Heading>
        <Text>Sign in to start collecting your smoothie recipes!</Text>
        <Image
          py={4}
          src='https://images.unsplash.com/photo-1550461716-dbf266b2a8a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=960&q=80'
        />
        <Text fontSize='small' color='gray.700'>
          Photo by{' '}
          <Link
            color='blue.500'
            href='https://unsplash.com/@gabriellefaithhenderson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'
          >
            Gabrielle Henderson
          </Link>{' '}
          on{' '}
          <Link
            color='blue.500'
            href='https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'
          >
            Unsplash
          </Link>
        </Text>
      </Center>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  return {
    props: { session },
  }
}

export default IndexPage
