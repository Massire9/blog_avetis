import "../styles/globals.css"
import { AppContextProvider } from "../src/components/AppContext"
import Navbar from "../src/components/Navbar"
function MyApp({ Component, pageProps, ...otherProps }) {
  return (
    <AppContextProvider>
      <Navbar />
      <Component {...pageProps} {...otherProps} />
    </AppContextProvider>
  )
}

export default MyApp
