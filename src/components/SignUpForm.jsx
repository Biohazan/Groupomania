import styled from 'styled-components'
import { StyledHomeButton } from '../utils/styles/button'
import colors from '../utils/colors'
import { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useViewPass } from '../utils/hooks/useViewPass'
import { authContext } from '../utils/context/Auth'
import fetchApi from '../utils/hooks/fetchApi'
import { ProfileContext } from '../utils/context/Profile'
import defaultPicture from '../assets/profile.png'

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
const FormWrapper = styled.form`
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
  const { colorView, passType, viewPass } = useViewPass()
  const { login, isAuthed } = useContext(authContext)
  const { setProfile } = useContext(ProfileContext)
  const [fetchError, setFetchError] = useState([])
  // const [fetchIsCorect, setFetchIsCorect] = useState(false)

  // let formToSend = {
  //   pseudo: inputPseudoValue,
  //   email: inputMailValue,
  //   password: inputPassValue,
  // }
  async function sendSignUp(e) {
    e.preventDefault()
    const option = {
      method: 'POST',
      data: {
        pseudo: inputPseudoValue,
        email: inputMailValue,
        password: inputPassValue,
      },
    }
    fetchApi(`http://localhost:2000/api/auth/signup`, option).then((res) => {
      if (res.status === 201) {
        login()
        setProfile({
          pseudo: res.data.pseudo,
          token: res.data.token,
          avatar: res.data.avatar,
          userId: res.data.userId,
          describe: res.data.describe
        })
        // setFetchIsCorect(true)
      } else if (res.response.data.error.name === 'ValidationError') {
        setFetchError(res.response.data.error.errors.email.message)
      } else setFetchError(res.response.data.error)
    })
  }

  return (
    <SignUpWrapper>
      {isAuthed === true && <Navigate to={'/dashboard'} />}
      <Title>
        Pour vous inscrire, <br />
        Merci de remplir les champs :
      </Title>
      {fetchError && Array.isArray(fetchError) ? (
        fetchError.map((err) => <span key={err}>{err}</span>)
      ) : (
        <span>{fetchError}</span>
      )}
      <FormWrapper onSubmit={(e) => sendSignUp(e)}>
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
