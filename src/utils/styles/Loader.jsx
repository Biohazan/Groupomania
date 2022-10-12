import styled, { keyframes } from 'styled-components'
import colors from '../colors'

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
    transform: rotate(360deg);
    }
`
export const Loader = styled.div`
  position: fixed;
  margin-top: 150px;
  padding: 70px;
  border: 6px solid ${colors.secondary};
  border-bottom-color: transparent;
  border-radius: 90px;
  animation: ${rotate} 1s infinite linear;
  height: 0;
  width: 0;
`
