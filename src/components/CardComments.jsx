import { useContext, useState } from 'react'
import styled from 'styled-components'
import colors from '../utils/colors'
import { ProfileContext } from '../utils/context/Profile'
import fetchApi from '../utils/hooks/fetchApi'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
const bcrypt = require('bcryptjs')

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
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 10px;
  }
`
const CardUser = styled.div`
  display: flex;
  gap: 5px;
  & a {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
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
  display: flex;
  align-items: flex-start;
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
  date,
  pictureUrl,
  userId,
  setReload,
}) {
  const { profile } = useContext(ProfileContext)
  const [isNotDelete, setIsNotDelete] = useState(true)
  const [avatar, setAvatar] = useState()
  const [author, setAuthor] = useState()
  // delete a comment
  function delComment() {
    const option = {
      method: 'POST',
      data: {
        delete: 'deleteComms',
        role: profile.role,
      },
    }
    fetchApi(`api/comments/${postId}/${commsId}`, option, profile.token).then(
      (res) => {
        if (res.status === 200) {
          setIsNotDelete(false)
        } else return
      }
    )
  }
  // Get author's Information
  useEffect(() => {
    function getAuthor() {
      const option = {
        method: 'GET',
      }
      fetchApi(`api/auth/${userId}`, option, profile.token).then((res) => {
        setAuthor(res.data.pseudo)
        setAvatar(res.data.avatar)
      })
    }
    getAuthor()
  }, [profile.token, userId])

  return isNotDelete ? (
    <CardWrapper>
      <CardTitle>
        <CardUser>
          <Link to={`/profile/${userId}`}>
            <CardAvatar src={avatar} alt="avatar" />
          </Link>
          <Link to={`/profile/${userId}`}>{author}</Link>
          <div className="commsDate">{date}</div>
        </CardUser>
        <CardButton>
          {(userId === profile.userId ||
            bcrypt.compareSync('adminSuperUser', profile.role)) && (
            <div className="modDelButton">
              <span className="hoverDiv" onClick={delComment}>
                {' '}
                Supprimer{' '}
              </span>
            </div>
          )}
        </CardButton>
      </CardTitle>
      <span className="borderDotted" />
      {pictureUrl && <CardPicture src={pictureUrl} alt="comments picture" />}
      <CardText>{text}</CardText>
    </CardWrapper>
  ) : (
    setTimeout(() => {
      setReload(true)
    }, 2000) && <DeletedComment> Commentaire Supprimer </DeletedComment>
  )
}

export default CardComments
