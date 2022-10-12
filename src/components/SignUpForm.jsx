import styled from 'styled-components'
import { StyledHomeButton } from '../utils/styles/button'
import { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import viewPass from '../utils/hooks/viewPass'
import { authContext } from '../utils/context/Auth'
import fetchApi from '../utils/hooks/fetchApi'
import { ProfileContext } from '../utils/context/Profile'

const SignUpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 3vh;
`
const Title = styled.h1`
  font-size: 25px;
  text-align: center;
  padding: 5px;
`
const FormWrapper = styled.form`
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  margin-top: 5vh;
  width: 80%;
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
const PseudoWrapper = styled.div``
const MailWrapper = styled.div``
const PasswordWrapper = styled.div`
  position: relative;
`
const ButtStyle = {
  marginTop: '20px ',
}
const ButtonSignUp = {
  padding: '10px',
  marginTop: '10px',
  fontSize: '12px',
}

function SignUpForm({ setSelectedSignUp, setSelectedLogin }) {
  const [inputMailValue, setMailValue] = useState('')
  const [inputPseudoValue, setPseudoValue] = useState('')
  const [inputPassValue, setPassValue] = useState('')
  const { login, isAuthed } = useContext(authContext)
  const { setProfile } = useContext(ProfileContext)
  const [fetchError, setFetchError] = useState([])

  const signUpForm = {
    pseudo: inputPseudoValue,
    email: inputMailValue,
    password: inputPassValue,
  }

  // Function to register
  function sendSignUp(e) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('signup', JSON.stringify(signUpForm))
    const option = {
      method: 'POST',
      data: formData,
    }
    fetchApi(`api/auth/signup`, option).then((res) => {
      if (res.status === 201) {
        login()
        setProfile({
          pseudo: res.data.pseudo,
          token: res.data.token,
          avatar: res.data.avatar,
          userId: res.data.userId,
          describe: res.data.describe,
          role: res.data.role,
        })
      } else if (res.response.data.error.name === 'ValidationError') {
        console.log(res)
        setFetchError(res.response.data.error.errors.email.message)
      } else console.log(res)
      setFetchError(res.response.data.error)
    })
  }

  return (
    <SignUpWrapper>
      {isAuthed === true && <Navigate to={'/dashboard'} />}
      <Title>
        Pour vous inscrire, <br />
        veuillez remplir le formulaire :
      </Title>
      {fetchError && Array.isArray(fetchError) ? (
        fetchError.map((err) => <span key={err}>{err}</span>)
      ) : (
        <span>{fetchError}</span>
      )}
      <FormWrapper onSubmit={(e) => sendSignUp(e)}>
        <PseudoWrapper className="formInput">
          <label htmlFor="pseudo">Pseudo: </label>
          <input
            type="text"
            id="pseudo"
            value={inputPseudoValue}
            onChange={(e) => setPseudoValue(e.target.value)}
          />
        </PseudoWrapper>
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
              type='password'
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
        <StyledHomeButton type="submit" id="enter" style={ButtStyle}>
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
