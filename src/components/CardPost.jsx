import { useEffect, useState } from 'react'
import { useContext, useRef } from 'react'
import styled from 'styled-components'
import colors from '../utils/colors'
import { ProfileContext } from '../utils/context/Profile'
import { Link, Navigate } from 'react-router-dom'
import Likes from './Likes'
import Comments from './Comment'
import fetchApi from '../utils/hooks/fetchApi'
import { Loader } from '../utils/styles/Loader'
const bcrypt = require('bcryptjs')

const CardWrapper = styled.div`
  border: 1px solid ${colors.thirth};
  box-shadow: 0.5px 0.5px 2px ${colors.thirth};
  border-radius: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(126deg, #4f9df9, #ffd7d7);
`
const CardAvatar = styled.img`
  width: 30px;
  border-radius: 50px;
  cursor: pointer;
`
const CardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: flex-start;
  width: 100%;
  padding: 5px 0px;
  text-shadow: 1px 1px ${colors.thirth};
  border-bottom: 1px dotted ${colors.thirth};
  & .userCard {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px;
  }
  & .authorDate {
    display: flex;
    flex-direction: column;
    font-size: 13px;
  }
  & .modDelButton {
    display: flex;
    font-size: 13px;
    margin-right: 5px;
    & span {
      padding: 5px;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
        transition: all 0.3s ease-in-out;
      }
    }
  }
`
const CardPicture = styled.img`
  width: 100%;
  border-bottom: 1px dotted ${colors.thirth};
`
const CardText = styled.div`
  text-align: center;
  width: 100%;
  padding: 15px 0px;
  border-bottom: dotted 1px ${colors.thirth};
`
const DeletedPost = styled.div`
  padding: 15px;
  text-align: center;
`
const CommsWrapper = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
`

function CardPost({
  cardId,
  text,
  date,
  pictureUrl,
  userId,
  likes,
  dislikes,
  usersDisliked,
  usersLiked,
  setReload,
  oneOnce,
  isLoading
}) {
  const { profile } = useContext(ProfileContext)
  const elementRef = useRef(null)
  const [isModify, setIsModify] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [inputComments, setInputComments] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [author, setAuthor] = useState('')
  const [fetchError, setFetchError] = useState(false)

  const pictureStyle = {
    paddingBottom: !text && '5px',
  }
  // Function to DELETE a card
  function delCard() {
    const option = {
      method: 'DELETE',
      data: { role: profile.role },
    }
    fetchApi(
      `api/post/${cardId}`,
      option,
      profile.token
    ).then((res) => {
      if (res.status === 200) setIsDelete(true)
      else setFetchError(true)
    })
  }

  // Function to get Author information
  useEffect(() => {
    function getAuthor() {
      const option = {
        method: 'GET',
      }
      fetchApi(
        `api/auth/${userId}`,
        option,
        profile.token
      ).then((res) => {
        setAuthor(res.data.pseudo)
        setAvatar(res.data.avatar)
      })
    }
    getAuthor()
  }, [profile.token, userId])

  return !isDelete ? (
    <CardWrapper ref={elementRef}>
      <CardTitle>
        <div className="userCard">
          <Link to={`/profile/${userId}`}>
            <CardAvatar src={avatar} alt="avatar" />
          </Link>
          <div className="authorDate">
            <Link to={`/profile/${userId}`}>
              {author}
            </Link>
            <span style={{ fontSize: '10px' }}>{date}</span>
          </div>
        </div>
        {fetchError && (
          <div style={{ position: 'absolute', bottom: '135px' }}>
            Une erreur c'est produite
          </div>
        )}
        {(userId === profile.userId ||
          bcrypt.compareSync('adminSuperUser', profile.role)) && (
          <div className="modDelButton">
            <span onClick={() => setIsModify(true)}> Modifier</span>{' '}
            <span onClick={delCard}> Supprimer </span>
            {isModify && <Navigate to={`/${cardId} `} />}
          </div>
        )}
      </CardTitle>
      {pictureUrl && (
        <Link to={`/${cardId} `} style={{width: '100%'}}>
          {isLoading ? <Loader /> : 
          <CardPicture
          src={pictureUrl}
          style={pictureStyle}
          alt="post utilisateur"
        />
          }
          
        </Link>
      )}
      {text && <Link to={`/${cardId} `} style={{ width: '100%' }}><CardText>{text}</CardText></Link>}
      <div style={{ width: '100%' }}>
        <Likes
          likes={likes}
          dislikes={dislikes}
          cardId={cardId}
          setReload={setReload}
          oneOnce={oneOnce}
          usersDisliked={usersDisliked}
          usersLiked={usersLiked}
          setInputComments={setInputComments}
        />
      </div>
      <CommsWrapper>
        <Comments
          inputComments={inputComments}
          setInputComments={setInputComments}
          postId={cardId}
        />
      </CommsWrapper>
    </CardWrapper>
  ) : (
    setTimeout(() => {
      oneOnce.current = false
      setReload(true)
    }, 2000) && <DeletedPost> Post Supprimer </DeletedPost>
  )
}

export default CardPost
