import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { ProfileContext } from '../utils/context/Pofile'
import colors from '../utils/colors'
import { useContext } from 'react'

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
  setReload,
  usersDisliked,
  usersLiked,
}) {
  const { profile } = useContext(ProfileContext)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  useEffect(() => {
    if (usersDisliked.find((user) => user === profile.userId)) {
      setDisliked(true)
    } else if (usersLiked.find((user) => user === profile.userId)) {
      setLiked(true)
    } else {
      setDisliked(false)
      setLiked(false)
    }
  }, [profile.userId, usersDisliked, usersLiked, liked, disliked, setReload])

  async function sendLikes(isLike) {
    let postLike = { like: isLike }
    try {
      const fetchLike = await fetch(
        `http://localhost:4000/api/post/${cardId}/like`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${profile.token}`,
          },
          body: JSON.stringify(postLike),
        }
      )
      const res = await fetchLike.json()
      if (res.error) console.log(res)
      else setReload(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <LikeContainer>
      <LikeWrapper>
        {liked ? (
          <i className="fa-solid fa-thumbs-up" onClick={() => sendLikes(0)}>
            {likes}
          </i>
        ) : (
          <i className="fa-regular fa-thumbs-up" onClick={() => sendLikes(1)}>
            {likes}
          </i>
        )}
        {disliked ? (
          <i className="fa-solid fa-thumbs-down" onClick={() => sendLikes(0)}>
            {dislikes}
          </i>
        ) : (
          <i
            className="fa-regular fa-thumbs-down"
            onClick={() => sendLikes(-1)}
          >
            {dislikes}
          </i>
        )}
      </LikeWrapper>
      <CommsButtonWrapper>
        <i className="fa-regular fa-comments" />
        Commenter.....
      </CommsButtonWrapper>
    </LikeContainer>
  )
}

export default Likes
