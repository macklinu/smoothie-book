import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'next-auth/client'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <>
            <Head>
              <title>Smoothie Book</title>
              <meta charSet='utf-8' />
              <meta name='viewport' content='initial-scale=1.0, width=device-width' />
              <link rel='shortcut icon' href='/favicon.ico' />
            </Head>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
