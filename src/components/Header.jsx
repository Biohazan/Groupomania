import logoWhite from '../assets/logo-white.svg'
import styled from 'styled-components'
import { ProfileContext } from '../utils/context/Profile'
import { useContext, useRef, useEffect } from 'react'
import { authContext } from '../utils/context/Auth'
import { Link } from 'react-router-dom'
import { size } from '../utils/breakpoint'
import { SizeDashboardContext } from '../utils/context/SetSizeDashboard'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`
const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
`
const LogoStyled = styled.div`
  & a::after{
    right: 35%;
    top: 3vh !important;
  }
  & img {
    width: 50%;
    min-width: 150px;
    max-width: 300px;
  }
`
const ProfileWrapper = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 25px;
  align-items: center;
  gap: 25px;
  margin-right: 20px;
  & *::after {
      top: 5vh !important;
    }
  @media ${size.mobileM} {
    justify-content: space-between;
  }
`
const ProfileAuthor = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-decoration: none;
  & a {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    width: min-content;
    white-space: nowrap;
    
  }
  & img {
    width: 20%;
    border-radius: 50px;
    min-height: 24px;
    min-width: 24px;
  }
`
const LogOutButton = styled.button`
	background: none;
	color: inherit;
	border: 1px solid;
  border-radius: 50px;
  padding: 5px;
	outline: inherit;
  cursor: pointer;
  text-decoration: none;
  font-size: 20px;
  &::after {
    right: 0vh;
  }
`

function Header() {
  const { profile } = useContext(ProfileContext)
  const { isAuthed, logout } = useContext(authContext)
  const { setHeaderHeight } = useContext(SizeDashboardContext)
  const elementRef = useRef(null)

  useEffect(() => {
    HeaderWrapper && setHeaderHeight(elementRef.current.clientHeight)
  }, [setHeaderHeight])

  return (
    <HeaderWrapper ref={elementRef}>
      <LogoWrapper>
        <LogoStyled>
          <Link to="/dashboard"  data-title="Accueil">
            <img src={logoWhite} alt="Logo Groupomania blanc"/>
          </Link>
        </LogoStyled>
      </LogoWrapper>
      {isAuthed === true && (
        <ProfileWrapper>
          <ProfileAuthor>
            <Link to={`/profile/${profile.userId}`} data-title="Profile">
              <img src={profile.avatar} className="hoverDiv" alt="avatar" />
              {window.innerWidth >= 530 ? (
                <div className="hoverDiv">{profile.pseudo}</div>
              ) : null}
            </Link>
          </ProfileAuthor>
          <LogOutButton
            onClick={() => logout()}
            className="fa-solid fa-power-off hoverDiv"
            aria-label='Se déconnecter'
            data-title="Se déconnecter"
          />
        </ProfileWrapper>
      )}
    </HeaderWrapper>
  )
}

export default Header
