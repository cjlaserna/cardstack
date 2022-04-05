// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react"

// 2. Add your color mode config
const config = {
    initialColorMode: "light", // options are light or dark
    useSystemColorMode: false, // options are true or false
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme