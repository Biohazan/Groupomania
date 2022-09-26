import styled from 'styled-components'
import { StyledHomeButton } from '../utils/styles/button'
import colors from '../utils/colors'
import { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useFetch } from '../utils/hooks/useFetch'
import { useViewPass } from '../utils/hooks/useViewPass'
import { authContext } from '../utils/context/Auth'

const SignUpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 7vh;
`
const Title = styled.h1`
  color: white;
  font-size: 25px;
  text-align: center;
`
const FormWrapper = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  margin-top: 5vh;
  opacity: 0;
  transform: translateY(60px);
  animation: loginTranslate 1s ease-in-out forwards;
  @keyframes loginTranslate {
    to {
      transform: translate(0);
      opacity: 1;
    }
  }
`
const PseudoWrapper = styled.div`
  margin: 5px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: white;
  padding: 15px;
  border: 0.5px solid ${colors.secondary};
  border-radius: 15px;
  & #pseudo {
    border-radius: 5px;
    border: none;
    padding: 5px;
    margin-right: 30px;
  }
`
const MailWrapper = styled.div`
  margin: 5px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: white;
  padding: 15px;
  border: 0.5px solid ${colors.secondary};
  border-radius: 15px;
  & #mail{
    border-radius: 5px;
    border: none;
    padding: 5px;
    margin-right: 30px;
  }
`
const PasswordWrapper = styled.div`
  margin: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: white;
  padding: 15px;
  border: 0.5px solid ${colors.secondary};
  border-radius: 15px;
  & #password {
    border-radius: 5px;
    border: none;
    padding: 5px;
  }
  & #check {
    cursor: pointer;
    margin-left: 12px;
    &:hover {
      transform: scale(1.1);
    }
  }
`
const ButtStyle = {
  marginTop: '20px ',
}
const ButtonSignUp = {
  padding: '10px',
  marginTop: '10px',
  fontSize: '10px',
}

function SignUpForm({ setSelectedSignUp, setSelectedLogin }) {
  const [inputMailValue, setMailValue] = useState('')
  const [inputPseudoValue, setPseudoValue] = useState('')
  const [inputPassValue, setPassValue] = useState('')
  const {colorView, passType, viewPass} = useViewPass()
  const [url, setUrl] = useState('')
  let formToSend = {
    pseudo: inputPseudoValue,
    email: inputMailValue,
    password: inputPassValue,
  }
  const {  fetchError } = useFetch(url, formToSend)
  const { isAuthed } =useContext(authContext)
  
  return (
    <SignUpWrapper>
      {isAuthed === true && <Navigate to={"/dashboard"} />}
      <Title>
        Pour vous inscrire, <br />
        Merci de remplir les champs :
      </Title>
      {fetchError !== [] && fetchError.map((error) => <span>{error}</span>)}
      <FormWrapper onSubmit={(e) => e.preventDefault()}>
        <PseudoWrapper>
          <label htmlFor="pseudo">Pseudo: </label>
          <input
            type="text"
            id="pseudo"
            value={inputPseudoValue}
            onChange={(e) => setPseudoValue(e.target.value)}
          />
        </PseudoWrapper>
        <MailWrapper>
          <label htmlFor="mail">Email: </label>
          <input
            type="text"
            id="mail"
            value={inputMailValue}
            onChange={(e) => setMailValue(e.target.value)}
          />
        </MailWrapper>
        <PasswordWrapper>
          <label htmlFor="password">Mot de passe: </label>
          <div>
          <input
            type={passType}
            id="password"
            value={inputPassValue}
            onChange={(e) => setPassValue(e.target.value)}
          />
          <span
            type="checkbox"
            id="check"
            onClick={() => viewPass()}
            style={colorView}
            className="fa-solid fa-eye"
          />
          </div>
        </PasswordWrapper>
        <StyledHomeButton
          type="submit"
          id="enter"
          style={ButtStyle}
          onClick={() => setUrl(`http://localhost:4000/api/auth/signup`)}
        >
          S'enregistrer
        </StyledHomeButton>
        <StyledHomeButton
          onClick={() => {
            setSelectedSignUp(false)
            setSelectedLogin(true)
          }}
          style={ButtonSignUp}
        >
          Connection
        </StyledHomeButton>
      </FormWrapper>
    </SignUpWrapper>
  )
}

export default SignUpForm
