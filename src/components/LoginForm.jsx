import {  useContext, useState } from 'react'
import styled from 'styled-components'
import colors from '../utils/colors'
import { StyledHomeButton } from '../utils/styles/button'
import { size } from '../utils/breakpoint'
import { Navigate } from 'react-router-dom'
import { useFetch } from '../utils/hooks/useFetch'
import { useViewPass } from '../utils/hooks/useViewPass'
import { authContext } from '../utils/context/Auth'

const MailWrapper = styled.div`
  margin: 5px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: white;
  padding: 15px;
  border: 0.5px solid ${colors.secondary};
  border-radius: 15px;
  & #mail {
    border-radius: 5px;
    border: none;
    padding: 5px;
    margin-right: 30px;
  }
`
const PasswordWrapper = styled.div`
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  margin-top: 5vh;
  opacity: 0;
  transform: translateY(-60px);
  animation: loginTranslate 1s ease-in-out forwards;
  @keyframes loginTranslate {
    to {
      transform: translate(0);
      opacity: 1;
    }
  }
  @media ${size.mobileM} {
    margin-top: 0px;
  }
`
const ButtonEnter = {
  alignSelf: 'center',
}
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
`

const ButtonSignUp = {
  padding: '10px',
  marginTop: '10px',
  fontSize: '10px',
}

function LoginForm({ setSelectedSignUp }) {
  const [inputMailValue, setMailValue] = useState('')
  const [inputPassValue, setPassValue] = useState('')
  const {colorView, passType, viewPass} = useViewPass()
  const { isAuthed } = useContext(authContext)

  const [url, setUrl] = useState('')
  let formToSend = {
    email: inputMailValue,
    password: inputPassValue,
  }
  const { fetchError } = useFetch(url, formToSend)

  return (
    <FormWrapper onSubmit={(e) => e.preventDefault()}>
      {fetchError !== [] && fetchError.map((error) => <span>{error}</span>)}
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
      <ButtonWrapper>
        <StyledHomeButton
          type="submit"
          id="enter"
          style={ButtonEnter}
          onClick={() => setUrl(`http://localhost:4000/api/auth/login`)}
        >
          Entrer !
        </StyledHomeButton>
        <StyledHomeButton
          onClick={() => setSelectedSignUp(true)}
          style={ButtonSignUp}
        >
          S'enregister
        </StyledHomeButton>
      </ButtonWrapper>
      {isAuthed === true && <Navigate to={"/dashboard"} replace/>}
    </FormWrapper>
  )
}

export default LoginForm
