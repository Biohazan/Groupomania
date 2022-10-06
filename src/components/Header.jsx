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
  padding: 10px;
`
const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;

  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  & span {
    justify-content: center;
    align-self: flex-start;
    padding: 5px;
    color: white;
    font-size: 12px;
  }
`
const LogoStyled = styled(Link)`
  & img {
    width: 50%;
    min-width: 150px;
    max-width: 300px;
  }
`
const ProfileWrapper = styled.div`
  display: flex;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  align-items: center;
  gap: 15px;
  margin-right: 20px;

  @media ${size.mobileM} {
    justify-content: space-between;
  }
`
const ProfileLink = styled(Link)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  & img {
    width: 10%;
    border-radius: 50px;
    min-height: 24px;
    min-width: 24px;
  }
`

const LogOutButton = styled.span`
  cursor: pointer;
  text-decoration: none;
  font-size: 20px;
`

function Header() {
  const { profile } = useContext(ProfileContext)
  const { isAuthed, logout } = useContext(authContext)
  const {setHeaderHeight} = useContext(SizeDashboardContext);
  const elementRef = useRef(null);

  useEffect(() => {
    setHeaderHeight(elementRef.current.clientHeight);
  }, [setHeaderHeight]);

  return (
    <HeaderWrapper ref={elementRef}>
      <LogoWrapper>
        <LogoStyled to="/dashboard">
          <img src={logoWhite} alt="Logo Groupomania blanc" />
        </LogoStyled>
      </LogoWrapper>
      {isAuthed === true && (
        <ProfileWrapper>
          <ProfileLink to={`/profile/${profile.userId}`}>
          <img src={profile.avatar } alt="test"/>
          {window.innerWidth >= 530 ? <div className='hoverDiv'>{profile.pseudo}</div> : null}
          </ProfileLink>
          <LogOutButton onClick={() => logout()} className="fa-solid fa-power-off hoverDiv" />
        </ProfileWrapper>
       )}
    </HeaderWrapper>
  )
}


export default Header
