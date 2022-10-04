import { useState } from 'react'
import { useContext, useRef } from 'react'
import styled from 'styled-components'
import colors from '../utils/colors'
import { ProfileContext } from '../utils/context/Profile'
import { Navigate } from 'react-router-dom'
import Likes from './Likes'
import Comments from './Comment'
import fetchApi from '../utils/hooks/fetchApi'

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
  height: 30px;
  border-radius: 50px;
`
const CardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  align-self: flex-start;
  padding: 10px;
  width: 97%;
  text-shadow: 1px 1px ${colors.thirth};
  border-bottom: 1px dotted ${colors.thirth};
  & .userCard {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  & .authorDate {
    display: flex;
    flex-direction: column;
  }
  & .modDelButton {
    display: flex;
    gap: 10px;
    & span {
      padding: 7px;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
        transition: all 0.3s ease-in-out;
      }
    }
  }
`
const CardPicture = styled.img`
  height: 100%;
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
  author,
  date,
  avatar,
  picture,
  userId,
  likes,
  dislikes,
  usersDisliked,
  usersLiked,
  setReload,
  oneOnce
}) {
  const { profile } = useContext(ProfileContext)
  const elementRef = useRef(null)
  const [isModify, setIsModify] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [inputComments, setInputComments] = useState(false)
  
  const pictureStyle = {
    paddingBottom: !text && '5px',
  }

  function delCard() {
    const option = {
      method: 'DELETE'
    }
    fetchApi(`http://localhost:2000/api/post/${cardId}`, option, profile.token)
      .then((res) => {
        setIsDelete(true)
      })
  }

  return !isDelete ? (
    <CardWrapper ref={elementRef}>
      <CardTitle>
        <div className="userCard">
          <CardAvatar src={avatar} alt="avatar" />
          <div className="authorDate">
            {author} <br />
            {date}
          </div>
        </div>
        {userId === profile.userId && (
          <div className="modDelButton">
            <span onClick={() => setIsModify(true)}> Modifier</span>{' '}
            <span onClick={delCard}> Supprimer </span>
            {isModify && <Navigate to={`/${cardId} `} />}
          </div>
        )}
      </CardTitle>
      {picture && (
        <CardPicture
          src={picture}
          style={pictureStyle}
          alt="post utilisateur"
        />
      )}
      {text && <CardText>{text}</CardText>}
      <div style={{width: "100%"}}>
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
      <CommsWrapper >
        <Comments inputComments={inputComments} setInputComments={setInputComments} postId={cardId}/>
      </CommsWrapper>
    </CardWrapper>
  ) : (
    setTimeout(() => {
      setReload(true)
    }, 2000) && <DeletedPost> Post Supprimer </DeletedPost>
  )
}

export default CardPost
