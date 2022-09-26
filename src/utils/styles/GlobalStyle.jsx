import { createGlobalStyle } from 'styled-components'
import colors from '../colors'

const GlobalStyle = createGlobalStyle`
    * {
        font-family: 'Lato', Helvetica, sans-serif;
    }
    body {
        margin: 0px;
        background-color: ${colors.thirth};
        background: repeating-radial-gradient(60% 70% at 0 100%,#ffd7d7 -6%,#4f9df9 80%,#ffd7d7 370%);
    }
    body, html {
        height: 100%;
    }
`

export default GlobalStyle
