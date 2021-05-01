import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { CreateRecipe } from 'src/models'
import { ZodSchema } from 'zod'

export interface RecipeFormProps<T extends CreateRecipe> {
  formId: string
  onSubmit(values: T): void
  schema: ZodSchema<T>
  defaultValues?: T
  nameErrorMessage?: string
}

export function RecipeForm<T extends CreateRecipe>({
  formId,
  onSubmit,
  schema,
  defaultValues,
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
        <FormControl
          id='name'
          isInvalid={Boolean(formState.errors.name) || Boolean(nameErrorMessage)}
        >
          <FormLabel>Name</FormLabel>
          <Input type='text' {...register('name')} autoFocus />
          <FormHelperText>Give your smoothie a unique name.</FormHelperText>
          <FormErrorMessage>{formState.errors.name?.message ?? nameErrorMessage}</FormErrorMessage>
        </FormControl>
        <Spacer my={4} />
        {ingredients.fields.map((field, index) => {
          return (
            <Flex key={field.id} my={2}>
              <FormControl
                flexGrow={1}
                isInvalid={Boolean(formState.errors.ingredients?.[index]?.name)}
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
                isInvalid={Boolean(formState.errors.ingredients?.[index]?.amount)}
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
