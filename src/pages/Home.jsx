import styled from 'styled-components'
import colors from '../utils/colors'
import { StyledHomeButton } from '../utils/styles/button'
import { size } from '../utils/breakpoint'
import { useState, useContext } from 'react'
import LoginForm from '../components/LoginForm'
import SignUpForm from '../components/SignUpForm'
import { ProfileContext } from '../utils/context/Profile'
import { authContext } from '../utils/context/Auth'
import { Navigate } from 'react-router-dom'
import { defaultProfile } from '../utils/context/Profile'

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const HomeCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 15px;
  border-radius: 90px;
`
const HomeCardTitle = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 25px;
  padding: 50px;
  border-radius: 35%;
  box-shadow: 0 0 0 0 ${colors.secondary};
  animation: battement 7s cubic-bezier(0.66, 0, 0, 1) infinite;
  @keyframes battement {
    50% {
      box-shadow: 0 0 0 30px rgba(255, 71, 84, 0);
      transform: scale(1.1);
    }
    75% {
      box-shadow: 0 0 0 0 ${colors.secondary};
      transform: scale(1);
    }
    100% {
      box-shadow: 0 0 0 0 ${colors.secondary};
      transform: scale(1);
    }
  }
  @media ${size.mobileM} {
    margin-bottom: 40px;
    font-size: 55px;
  }
`
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 60px;
`

function App() {
  const [isSelectedLogin, setSelectedLogin] = useState(false)
  const [isSelectedSignUp, setSelectedSignUp] = useState(false)
  const [isTokenExpired, setTokenExpired] = useState(false)
  const { profile } = useContext(ProfileContext)
  const { logout, isAuthed } = useContext(authContext)

  if (!profile) {
    localStorage.setItem('profile', JSON.stringify(defaultProfile))
  }
  if (profile.token === 'TokenExpiredError') {
    logout() && setSelectedLogin(true) && setTokenExpired(true)
  }

  return (
    <HomeWrapper>
      {isAuthed && <Navigate to="/dashboard" />}
      {isSelectedSignUp === false ? (
        <HomeCard>
          <HomeCardTitle>
            Bienvenue sur <br />
            La <br />
            Platforme pour
            <br /> Vous !
          </HomeCardTitle>
          {!isSelectedLogin && (
            <ButtonWrapper>
              <StyledHomeButton onClick={() => setSelectedLogin(true)}>
                Connection
              </StyledHomeButton>
              <StyledHomeButton onClick={() => setSelectedSignUp(true)}>
                S'enregister
              </StyledHomeButton>
            </ButtonWrapper>
          )}
          {isTokenExpired && (
            <span>Votre session a expiré, veuillez vous reconnecter</span>
          )}
          {isSelectedLogin && (
            <LoginForm setSelectedSignUp={setSelectedSignUp} />
          )}
        </HomeCard>
      ) : (
        <SignUpForm
          setSelectedLogin={setSelectedLogin}
          setSelectedSignUp={setSelectedSignUp}
        />
      )}
    </HomeWrapper>
  )
}

export default App
