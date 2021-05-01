import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, ButtonGroup, ButtonProps, Flex, Image, Spacer, Text } from '@chakra-ui/react'
import { signIn, signOut } from 'next-auth/client'
import * as React from 'react'

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

export interface NavigationBarProps {
  isLoggedIn: boolean
  onCreateRecipeClick(): void
}

export function NavigationBar({ isLoggedIn, onCreateRecipeClick }: NavigationBarProps) {
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
