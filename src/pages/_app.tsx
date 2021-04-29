import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'next-auth/client'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
