import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { ProfileContext } from '../utils/context/Profile'
import colors from '../utils/colors'
import { useContext } from 'react'
import fetchApi from '../utils/hooks/fetchApi'

const LikeContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px dotted ${colors.thirth};
  color: white;
`
const CommsButtonWrapper = styled.div`
  display: flex;
  cursor: pointer;
  text-decoration: underline;
  margin: 0;
  & i {
    margin-right: 5px;
  }
`
const LikeWrapper = styled.div`
  padding: 10px;
  display: flex;
  gap: 15px;
  & i {
    cursor: pointer;
    display: flex;
    gap: 5px;
  }
  & .shakeStyle {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
    100% { color: white;}
  }
`

function Likes({
  likes,
  dislikes,
  cardId,
  usersDisliked,
  usersLiked,
  setInputComments,
  oneOnce,
  setReload,
}) {
  const { profile } = useContext(ProfileContext)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (!usersDisliked || !usersLiked) return
    if (usersDisliked.find((user) => user === profile.userId)) {
      setDisliked(true)
    } else if (usersLiked.find((user) => user === profile.userId)) {
      setLiked(true)
    } else {
      setDisliked(false)
      setLiked(false)
    }
  }, [profile.userId, usersDisliked, usersLiked, liked, disliked])

  function sendLikes(isLike) {
    const option = {
      method: 'POST',
      data: { like: isLike },
    }
    fetchApi(`api/post/${cardId}/like`, option, profile.token).then((res) => {
      console.log(res)
      if (res.status === 200) {
        setReload(true)
        oneOnce.current = false
      } else if (res.response.status === 400) setShake(true)
      else
      console.log(res)
    })
    setShake(false)
  }

  return (
    <LikeContainer>
      <LikeWrapper>
        {liked ? (
          <i
            className={`fa-solid fa-thumbs-up hoverDiv ${
              shake && 'shakeStyle'
            }`}
            onClick={() => sendLikes(0)}
            data-title="J'aime"
            style={{color: shake && 'red'}}
          >
            {likes}
          </i>
        ) : (
          <i
            className={`fa-regular fa-thumbs-up hoverDiv ${
              shake && 'shakeStyle'
            }`}
            onClick={() => sendLikes(1)}
            data-title="J'aime"
          >
            {likes}
          </i>
        )}
        {disliked ? (
          <i
            className={`fa-solid fa-thumbs-down hoverDiv ${
              shake && 'shakeStyle'
            }`}
            onClick={() => sendLikes(0)}
            data-title="J'aime pas"
            style={{color: shake && 'red'}}
          >
            {dislikes}
          </i>
        ) : (
          <i
            className={`fa-regular fa-thumbs-down hoverDiv ${
              shake && 'shakeStyle'
            }`}
            onClick={() => sendLikes(-1)}
            data-title="J'aime pas"
          >
            {dislikes}
          </i>
        )}
      </LikeWrapper>
      <CommsButtonWrapper
        className="hoverDiv"
        onClick={() => setInputComments(true)}
      >
        <i className="fa-regular fa-comments" />
        Commenter.....
      </CommsButtonWrapper>
    </LikeContainer>
  )
}

export default Likes
