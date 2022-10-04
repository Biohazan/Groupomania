import errorLogo from '../assets/404.svg'
// import colors from '../../utils/styles/colors'
import styled from 'styled-components'

const ErrorComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const ErrorTitle = styled.h1`
  margin-top: 60px;
  font-size: 31px;

`
const ErrorSubtitle = styled.h1`
padding: 30px;
  font-size: 31px;
  text-align: center;
`
const ErrorImage = styled.img`
  max-width: 550px;
  margin: 30px;
`

function Error() {
  return (
    <ErrorComponent >
      <ErrorTitle >Oups...</ErrorTitle>
      <ErrorImage src={errorLogo} alt="logo erreur" />
      <ErrorSubtitle>
      Il semblerait que la page que vous cherchez n’existe pas
      </ErrorSubtitle>
    </ErrorComponent>
  )
}

export default Error