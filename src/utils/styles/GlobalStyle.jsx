import { createGlobalStyle } from 'styled-components'
import colors from '../colors'

const GlobalStyle = createGlobalStyle`
    * {
        font-family: 'Lato', Helvetica, sans-serif;
    }
    body {
        margin: 0px;
        color: white;
        background-color: ${colors.thirth};
        background: repeating-radial-gradient(60% 70% at 0 100%,#ffd7d7 -6%,#4f9df9 80%,#ffd7d7 370%);
    }
    body, html, #root {
        height: 100%;
    }
    & a {
        text-decoration: none;
        color: inherit;
    }
    // Home page
    & .formInput {
        margin: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 10px;
        border: 0.5px solid ${colors.secondary};
        border-radius: 15px;
        & input {
            border-radius: 5px;
            border: none;
            padding: 5px;
        }
    }
    & .checkProfile {
        margin-left: 12px;
        cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
    }
    & .check {
        position: absolute;
        bottom: 16px;
        cursor: pointer;
        margin-left: 12px;
    &:hover {
      transform: scale(1.1);
    }
  }
    // Animation for hover
    & .hoverDiv {
        transition: all 200ms ease-in-out;
        &:hover {
        text-shadow: 0.5px 0.5px ${colors.thirth};
        transform: scale(1.05);
        }
    }
    // style of textarea
    & .textAreaStyle {
        border: none;
        resize: none;
        overflow: hidden;
        outline: none;
        border-radius: 15px;
        padding: 5px;
    }
    // Tooltip
    *[data-title] {
        position: relative;
}
    *[data-title]:hover:after {
        font-family: 'Lato', Helvetica, sans-serif;
        position: absolute;
        content: attr(data-title);
        background-color: ${colors.thirth};
        color: #fff;
        white-space: nowrap;
        top: 4vh;
        white-space: nowrap;
        padding: 5px 15px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: normal;
}
`

export default GlobalStyle
