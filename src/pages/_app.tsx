import { type AppType } from "next/app"
import { api } from "~/utils/api"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import "~/styles/globals.css"
import { Toaster } from "react-hot-toast"
import Head from "next/head"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
      }}>
      <Head>
        <title>Bird App</title>
        <meta name="description" content="bird app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
