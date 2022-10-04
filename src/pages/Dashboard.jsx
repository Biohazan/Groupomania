import { useContext, useEffect } from 'react'
import { ProfileContext } from '../utils/context/Profile'
import styled from 'styled-components'
import { useState } from 'react'
import PostForm from '../components/PostForm'
import CardPost from '../components/CardPost'
import { Navigate } from 'react-router-dom'
import { size } from '../utils/breakpoint'
import colors from '../utils/colors'
import { SizeDashboardContext } from '../utils/context/SetSizeDashboard'
import { Loader } from '../utils/styles/Loader'
import { authContext } from '../utils/context/Auth'
import fetchApi from '../utils/hooks/fetchApi'
import { useRef } from 'react'

const DivStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 90%;
  padding: 0px 4vw;
  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    background: ${colors.thirth};
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 20px;
    border: 3px solid ${colors.secondary};
  }
  @media ${size.mobileM} {
    width: 50%;
    max-width: 780px;
    padding: 0px 2vw;
  }
`

function Dashboard() {
  const { profile, setProfile } = useContext(ProfileContext)
  const [reload, setReload] = useState(false)
  const [datas, setData] = useState([])
  const { sizeDashbord } = useContext(SizeDashboardContext)
  const [isLoading, setIsLoading] = useState(false)
  const { logout } = useContext(authContext)
  const oneOnce = useRef(false)

  useEffect(() => {
    if (oneOnce.current) return
    else oneOnce.current = true
    setIsLoading(true)
    const option = {
      method: 'GET',
    }
    fetchApi('http://localhost:2000/api/post/', option, profile.token).then(
      (res) => {
        if (res.error && res.error.name === 'TokenExpiredError') {
          console.log('yess Papa')
          setProfile({ token: 'TokenExpiredError' })
        } else setReload(false)
        setIsLoading(false)
        setData(res.data.reverse())
      }
    )
  }, [reload, setProfile, profile.token])

  return (
    <DivStyle>
      {(profile.token === 'TokenExpiredError' || profile.token === '') &&
        logout() && <Navigate to={'/'} />}
      {isLoading && <Loader />}
      <CardWrapper style={{ height: sizeDashbord }}>
        {datas &&
          datas.map((post) => (
            <CardPost
              key={post._id}
              cardId={post._id}
              text={post.text}
              author={post.author}
              date={post.date}
              avatar={post.avatarAuthor}
              picture={post.imageUrl}
              userId={post.userId}
              likes={post.likes}
              dislikes={post.dislikes}
              usersDisliked={post.usersDisliked}
              usersLiked={post.usersLiked}
              setReload={setReload}
              oneOnce={oneOnce}
            />
          ))}
      </CardWrapper>
      <PostForm setReload={setReload} oneOnce={oneOnce} />
    </DivStyle>
  )
}

export default Dashboard
