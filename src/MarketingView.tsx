import { Center, Container, Heading, Image, Link, Text } from '@chakra-ui/react'
import * as React from 'react'

export function MarketingView() {
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
