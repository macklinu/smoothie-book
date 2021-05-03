import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from '@chakra-ui/react'
import * as React from 'react'
import { useDeleteRecipeMutation, useUpdateRecipeMutation } from 'src/apiHooks'
import { Recipe } from 'src/models'
import { RecipeForm } from 'src/RecipeForm'

export interface UpdateRecipeModalProps {
  recipe: Recipe
  onClose(): void
}

export function UpdateRecipeModal({ recipe, onClose }: UpdateRecipeModalProps) {
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
            disabled={isRecipeBeingModified}
            isLoading={isRecipeBeingModified}
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
