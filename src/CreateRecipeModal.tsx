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
} from '@chakra-ui/react'
import * as React from 'react'
import { useCreateRecipeMutation } from 'src/apiHooks'
import { CreateRecipe } from 'src/models'
import { RecipeForm } from 'src/RecipeForm'

export interface CreateRecipeModalProps {
  onClose(): void
}

export function CreateRecipeModal({ onClose }: CreateRecipeModalProps) {
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
