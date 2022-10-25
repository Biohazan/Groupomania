import { useContext, useState } from 'react'
import styled from 'styled-components'
import { StyledHomeButton } from '../utils/styles/button'
import { size } from '../utils/breakpoint'
import { Navigate } from 'react-router-dom'
import viewPass from '../utils/hooks/viewPass'
import { ProfileContext } from '../utils/context/Profile'
import { authContext } from '../utils/context/Auth'
import fetchApi from '../utils/hooks/fetchApi'

const MailWrapper = styled.div``
const PasswordWrapper = styled.div`
  position: relative;
`
const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
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
  const { setProfile } = useContext(ProfileContext)
  const { login, isAuthed } = useContext(authContext)
  const [fetchError, setFetchError] = useState([])

  const loginForm = {
    email: inputMailValue,
    password: inputPassValue,
  }

  function sendLogin(e) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('login', JSON.stringify(loginForm))
    const option = {
      method: 'POST',
      data: formData,
    }
    fetchApi(`api/user/login`, option).then((res) => {
      if (res.status === 200) {
        login()
        setProfile({
          pseudo: res.data.pseudo,
          token: res.data.token,
          avatar: res.data.avatar,
          userId: res.data.userId,
          describe: res.data.describe,
          role: res.data.role,
        })
      } else if (res.response.status === 401)
      setFetchError(res.response.data.message)
    })
  }

  return (
    <FormWrapper onSubmit={(e) => sendLogin(e)}>
      <MailWrapper className="formInput">
        <label htmlFor="mail">Email: </label>
        <input
          type="text"
          id="mail"
          value={inputMailValue}
          onChange={(e) => setMailValue(e.target.value)}
        />
      </MailWrapper>
      <PasswordWrapper className="formInput">
        <label htmlFor="password">Mot de passe: </label>
        <div>
          <input
            type="password"
            id="password"
            value={inputPassValue}
            onChange={(e) => setPassValue(e.target.value)}
          />
          <span
            type="checkbox"
            onClick={(e) => viewPass(e)}
            className="fa-solid fa-eye check"
          />
        </div>
      </PasswordWrapper>
      {fetchError && Array.isArray(fetchError) ? (
        fetchError.map((err) => <span key={err}>{err}</span>)
      ) : (
        <span>{fetchError}</span>
      )}
      <ButtonWrapper>
        <StyledHomeButton type="submit" id="enter" style={ButtonEnter}>
          Entrer !
        </StyledHomeButton>
        <StyledHomeButton
          onClick={() => setSelectedSignUp(true)}
          style={ButtonSignUp}
        >
          S'enregister
        </StyledHomeButton>
      </ButtonWrapper>
      {isAuthed === true && <Navigate to={'/dashboard'} />}
    </FormWrapper>
  )
}

export default LoginForm
