import { useContext, useEffect } from 'react'
import { ProfileContext } from '../utils/context/Pofile'
import styled from 'styled-components'
import { useState } from 'react'
import PostForm from '../components/PostForm'
import CardPost from '../components/CardPost'
import { Navigate } from 'react-router-dom'
import { size } from '../utils/breakpoint'
import colors from '../utils/colors'
import { SizeDashboardContext } from '../utils/context/SetSizeDashboard'
import { Loader } from '../utils/styles/Loader'

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
  const {sizeDashbord} = useContext(SizeDashboardContext)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    function fetchPost() {
      fetch('http://localhost:4000/api/post/', {
        headers: {
          Authorization: `Bearer ${profile.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error && data.error.name === 'TokenExpiredError') {
            console.log('yess Papa')
            setProfile({ token: 'TokenExpiredError' })
          } else
          setData(data.reverse())
          setReload(false)
          setIsLoading(false)
          console.log(data)
        })
    }
    fetchPost()
  }, [profile.token, setProfile, reload])


  return (
    <DivStyle>
      {profile.token === 'TokenExpiredError' && <Navigate to={'/'} />}
      {isLoading && <Loader />}
      <CardWrapper style={{height: sizeDashbord}}>
        {/* {console.log(datas)} */}
        {datas.map((data) => ( 
          <CardPost
            key={data._id}
            cardId={data._id}
            text={data.text}
            author={data.author}
            date={data.date}
            avatar={data.avatarAuthor}
            picture={data.imageUrl}
            userId={data.userId}
            likes={data.likes}
            dislikes={data.dislikes}
            usersDisliked={data.usersDisliked}
            usersLiked={data.usersLiked}
            setReload={setReload}
          />
        ))}
      </CardWrapper>
      <PostForm setReload={setReload} />
    </DivStyle>
  )
}

export default Dashboard
