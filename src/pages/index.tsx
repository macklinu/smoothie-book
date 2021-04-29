import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  Box,
  BoxProps,
  Button,
  ButtonGroup,
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
import { useCreateRecipeMutation, useRecipes } from 'src/apiHooks'
import { CreateRecipe, Recipe } from 'src/models'

function RecipeCard({
  name,
  ingredients,
  ...rest
}: BoxProps & Pick<Recipe, 'name' | 'ingredients'>) {
  return (
    <Box p={5} shadow='md' borderWidth='1px' width='100%' {...rest}>
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

const IndexPage = () => {
  const [session, isSessionLoading] = useSession()
  const createRecipeModal = useDisclosure()
  return (
    <>
      <Box p={4} bgColor='red.100'>
        <Flex alignItems='center'>
          <Flex alignItems='center'>
            <Image src='/cup-with-straw.png' w={8} h={8} />
            <Text fontWeight='bold' fontSize='xl'>
              Smoothie Book
            </Text>
          </Flex>
          <Spacer />
          <ButtonGroup spacing={2}>
            {session ? (
              <Button leftIcon={<AddIcon />} onClick={createRecipeModal.onOpen}>
                Create Recipe
              </Button>
            ) : null}
            {session ? (
              <Button
                variant='solid'
                colorScheme='red'
                isLoading={isSessionLoading}
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant='solid'
                colorScheme='red'
                isLoading={isSessionLoading}
                onClick={() => signIn('auth0')}
              >
                Sign In
              </Button>
            )}
          </ButtonGroup>
        </Flex>
      </Box>
      <Container maxW='container.xl'>
        {session ? (
          <LoggedInView onCreateRecipeClick={createRecipeModal.onOpen} />
        ) : (
          <LoggedOutView />
        )}
      </Container>
      {createRecipeModal.isOpen ? (
        <CreateRecipeModal
          onClose={createRecipeModal.onClose}
          onSubmit={(recipe) => {
            createRecipeModal.onClose()
          }}
        />
      ) : null}
    </>
  )
}

interface LoggedInViewProps {
  onCreateRecipeClick(): void
}

function LoggedInView({ onCreateRecipeClick }: LoggedInViewProps) {
  const recipes = useRecipes()
  return (
    <>
      <Grid templateColumns='repeat(3, 1fr)' gap={4} p={4}>
        {recipes.isSuccess
          ? recipes.data.map((recipe) => (
              <GridItem>
                <RecipeCard key={recipe.id} name={recipe.name} ingredients={recipe.ingredients} />
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
  onSubmit(recipe: CreateRecipe): void
}

// TODO improve interface to use form for viewing/updating recipe too
function CreateRecipeModal({ onClose, onSubmit }: CreateRecipeModalProps) {
  const { formState, register, control, handleSubmit } = useForm<CreateRecipe>({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      ingredients: [{ name: '', amount: '' }],
    },
    resolver: zodResolver(CreateRecipe),
  })
  const ingredients = useFieldArray({
    control: control,
    name: 'ingredients',
  })
  const createRecipe = useCreateRecipeMutation()
  return (
    <Modal isOpen onClose={onClose} closeOnEsc={false} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Recipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            onSubmit={handleSubmit(async (values) => {
              await createRecipe.mutateAsync(values, {
                onSuccess() {
                  onClose()
                },
              })
            })}
            id='createRecipe'
          >
            <Stack spacing={4}>
              <FormControl
                id='name'
                isInvalid={
                  !!formState.errors.name || !!createRecipe.error?.response?.data?.errors?.name
                }
              >
                <FormLabel>Name</FormLabel>
                <Input type='text' {...register('name')} />
                <FormHelperText>Give your smoothie a unique name.</FormHelperText>
                <FormErrorMessage>
                  {formState.errors.name?.message ??
                    createRecipe.error?.response?.data?.errors?.name}
                </FormErrorMessage>
              </FormControl>
              <Spacer my={4} />
              {ingredients.fields.map((field, index) => {
                return (
                  <Flex key={field.id} my={2}>
                    <FormControl
                      flexGrow={1}
                      isInvalid={!!formState.errors.ingredients?.[index]?.name}
                    >
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
              isLoading={formState.isSubmitting}
            >
              Submit
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// TODO implement
function LoggedOutView() {
  return <div>Logged Out</div>
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  return {
    props: { session },
  }
}

export default IndexPage
