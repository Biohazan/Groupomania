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
`

function Likes({
  likes,
  dislikes,
  cardId,
  usersDisliked,
  usersLiked,
  setInputComments,
  oneOnce,
  setReload
}) {
  const { profile } = useContext(ProfileContext)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

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
      data: { like: isLike }
    }
    fetchApi(
        `http://localhost:2000/api/post/${cardId}/like`, option, profile.token )
        .then((res) => {
          console.log(res)
          if (res.status === 200) 
          {setReload(true)
          oneOnce.current = false}
          else 
          console.log(res)
        })
    } 
    
  return (
    <LikeContainer>
      <LikeWrapper>
        {liked ? (
          <i className="fa-solid fa-thumbs-up hoverDiv" onClick={() => sendLikes(0)}>
            {likes}
          </i>
        ) : (
          <i className="fa-regular fa-thumbs-up hoverDiv" onClick={() => sendLikes(1)}>
            {likes}
          </i>
        )}
        {disliked ? (
          <i className="fa-solid fa-thumbs-down hoverDiv" onClick={() => sendLikes(0)}>
            {dislikes}
          </i>
        ) : (
          <i
            className="fa-regular fa-thumbs-down hoverDiv"
            onClick={() => sendLikes(-1)}
          >
            {dislikes}
          </i>
        )}
      </LikeWrapper>
      <CommsButtonWrapper className='hoverDiv' onClick={() => setInputComments(true)}>
        <i className="fa-regular fa-comments" />
        Commenter.....
      </CommsButtonWrapper>
      
    </LikeContainer>
  )
}

export default Likes
