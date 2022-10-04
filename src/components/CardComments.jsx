import { useContext, useState } from 'react'
import styled from 'styled-components'
import colors from '../utils/colors'
import { ProfileContext } from '../utils/context/Profile'
import fetchApi from '../utils/hooks/fetchApi'

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px dotted ${colors.thirth};
  border-radius: 15px;
  margin: 5px;
  padding: 5px;
`
const CardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding: 5px;
  & .commsDate {
    font-size: 10px;
  }
`
const CardUser = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`
const CardAvatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50px;
`
const CardButton = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
`
const CardPicture = styled.img`
  align-self: center;
  width: 80%;
`

const CardText = styled.div`
  align-self: center;
  text-align: center;
  padding: 5px;
  width: 100%;
`
const DeletedComment = styled.div`
  padding: 15px;
  text-align: center;
`

function CardComments({
  commsId,
  postId,
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
}) {
  const { profile } = useContext(ProfileContext)
  const [isNotDelete, setIsNotDelete] = useState(true)

  function delComment() {
    const option = {
      method: 'POST',
      data: {
        delete: "deleteComms"
      }
    }
    fetchApi(
      `http://localhost:2000/api/comments/${postId}/${commsId}`,
      option,
      profile.token
    ).then((res) => {
      if (res.status === 200) {
        setIsNotDelete(false)
      }
      else return
    })
  }
  return isNotDelete ? (
    <CardWrapper>
      <CardTitle>
        <CardUser>
          <CardAvatar src={avatar} alt="avatar" />
          <span>{author}</span>
          <span className="commsDate">{date}</span>
        </CardUser>
        <CardButton>
          {userId === profile.userId && (
            <div className="modDelButton">
              <span className='hoverDiv' onClick={delComment}> Supprimer </span>
            </div>
          )}
        </CardButton>
      </CardTitle>
      <span className="borderDotted" />
      {picture && <CardPicture src={picture} alt="comments picture" />}
      <CardText>{text}</CardText>
    </CardWrapper>
  ) : (
    setTimeout(() => {
      setReload(true)
    }, 2000) && <DeletedComment> Commentaire Supprimer </DeletedComment>
  )
}

export default CardComments
