import { createGlobalStyle } from 'styled-components'
import colors from '../colors'
import { size } from '../breakpoint'

const GlobalStyle = createGlobalStyle`
    * {
        font-family: 'Lato', Helvetica, sans-serif;
        /* font-size: 13px;
            @media ${size.mobileM} {
                 font-size: 14px;
            } */
    }
    body {
        margin: 0px;
        color: white;
        background-color: ${colors.thirth};
        background: repeating-radial-gradient(60% 70% at 0 100%,#ffd7d7 -6%,#4f9df9 80%,#ffd7d7 370%);
    }
    body, html {
        height: 100%;
    }
    & a {
        text-decoration: none;
        color: inherit;
    }
    & .hoverDiv {
        transition: all 200ms ease-in-out;
        &:hover {
        text-shadow: 0.5px 0.5px black;
        }
    }
    & .textAreaStyle {
        border: none;
        resize: none;
        overflow: auto;
        outline: none;
    }
`

export default GlobalStyle
