import styled from 'styled-components'

export const StyledHomeButton = styled.button`
  color: white;
  text-shadow: 1px 1px black;
  font-size: 15px;
  font-weight: bold;
  background-color: #fff;
  background-image: linear-gradient(126deg, #4f9df9, #ffd7d7);
  padding: 16px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  animation: ButtonHover 0.3s ease-in-out reverse;
  &:hover {
    transform: scale(1.1);
    transition: all 0.3s ease-in-out;
    box-shadow: -10px 0px 20px #4f9df9, 10px 10px 20px -5px #ffd7d7;
  }
  @keyframes ButtonHover {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.1);
      box-shadow: -10px 0px 20px #4f9df9, 10px 10px 20px -5px #ffd7d7;
    }
  }
`
