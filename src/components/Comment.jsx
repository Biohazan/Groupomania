import styled from 'styled-components'
import { useContext, useState, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Picker from 'emoji-picker-react'
import { ProfileContext } from '../utils/context/Profile'
import CardComments from './CardComments'
import fetchApi from '../utils/hooks/fetchApi'

const CommentsWrapper = styled.div`
  width: 100%;
`

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  & textarea {
    padding: 5px;
    width: 80%;
    height: 100%;
    height: auto;
    border: none;
    resize: none;
    overflow: auto;
    outline: none;
    border-radius: 10px;
  }
`
const PicturePreview = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 15px;
  padding: 5px;
  & img {
    width: 50%;
  }
  & i {
    position: absolute;
    right: 5px;
    top: 6px;
    cursor: pointer;
  }
`
const PickerDiv = styled.div`
  position: absolute;
  bottom: 40px;
  right: 0px;
`
const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 3px;
  & i {
    cursor: pointer;
  }
  & #fileUploadComms {
    display: none;
  }
  & #fileUploadIconComms {
    cursor: pointer;
  }
`
const CommentsContainer = styled.div`
  & .GrowShrink {
    cursor: pointer;
    padding: 0px 10px;
    font-size: 15px;
  }
`

function Comments({ inputComments, setInputComments, postId }) {
  const [commentsData, setCommentsData] = useState([])
  const [inputCommsValue, setCommsValue] = useState('')
  const { profile } = useContext(ProfileContext)
  const [commentToggle, setCommentToggle] = useState(false)
  const [fetchError, setFetchError] = useState([])
  const [reload, setReload] = useState(false)

  // Function to get Comms
  useEffect(() => {
    const option = {
      method: 'GET',
    }
    function fetchComments() {
      fetchApi(
        `http://localhost:2000/api/comments/${postId}`,
        option,
        profile.token
      ).then((res) => {
        if (res.data.error) {
          console.log(res.data.error)
        } else
          res.data.postComments &&
            setCommentsData(res.data.postComments.reverse())
        setReload(false)
      })
    }
    fetchComments()
  }, [reload, postId, profile.token])

  // Date Manage
  let d = new Date()
  let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
  let hours = d.getHours() + ':' + d.getMinutes()
  let fullDate = date + ' ' + hours

  // Const for Emojy
  const [isEmoji, setIsEmoji] = useState(false)
  const onEmojiClick = (event, emojiObject) => {
    setCommsValue(inputCommsValue + emojiObject.emoji)
  }
  const toggleEmoji = () => {
    !isEmoji ? setIsEmoji(true) : setIsEmoji(false)
  }
  // Const for Picture
  const [selectedFileComms, setSelectedFileComms] = useState()
  const [isFilePickedComms, setIsFilePickedComms] = useState(false)
  const [pictureSrcComms, setPictureSrcComms] = useState()
  // Pattern for Form
  let formToSend = {
    author: profile.pseudo,
    date: fullDate,
    text: inputCommsValue,
    avatarAuthor: profile.picture,
  }
  //Function for added Picture
  let reader = new FileReader()
  const changePicture = (event) => {
    setSelectedFileComms(event.target.files[0])
    setIsFilePickedComms(true)
    let picture = event.target.files[0]
    reader.onload = function (event) {
      let picturetest = reader.result
      setPictureSrcComms(picturetest.src)
      setPictureSrcComms(picturetest)
    }
    reader.readAsDataURL(picture)
  }
  // Function to post modification with API
  function CreateComms(e) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('postComments', JSON.stringify(formToSend))
    isFilePickedComms && formData.append('image', selectedFileComms)
    const option = {
      method: 'POST',
      data: formData,
    }
    if (formToSend.text === '' && !isFilePickedComms) return
    fetchApi(
      `http://localhost:2000/api/comments/${postId}`,
      option,
      profile.token
    ).then((res) => {
      console.log(res)
      if (res.status === 200) {
        setReload(true)
        setIsFilePickedComms(false)
        setInputComments(false)
        setCommsValue('')
      } else {
        setFetchError(res.error)
        console.log(res.error)
      }
    })
  }

  return (
    <CommentsWrapper>
      {isFilePickedComms && (
        <PicturePreview>
          <img src={pictureSrcComms} alt="Import de l'utilisateur" />
          <i
            className="fa-regular fa-circle-xmark"
            onClick={() => setIsFilePickedComms(false)}
          />
        </PicturePreview>
      )}
      {inputComments && (
        <InputWrapper>
          <TextareaAutosize
            autoFocus
            name="inputForComments"
            id={'input' + postId}
            value={inputCommsValue}
            onChange={(e) => setCommsValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && !e.shiftKey && CreateComms(e)
            }
            // onBlur={() => setInputComments(false)}
          ></TextareaAutosize>
          <IconWrapper>
            {isEmoji && (
              <PickerDiv>
                <Picker onEmojiClick={onEmojiClick} disableSearchBar={true} />
              </PickerDiv>
            )}
            <i
              className="fa-solid fa-face-smile"
              onClick={() => toggleEmoji()}
            />
            <label
              htmlFor="fileUploadComms"
              className="fa-solid fa-link"
              id="fileUploadIconComms"
            />
            <input
              type="file"
              accept="image/*"
              id="fileUploadComms"
              onChange={changePicture}
            />
          </IconWrapper>
        </InputWrapper>
      )}
      <CommentsContainer>
        {fetchError && <div>{fetchError}</div>}
        {commentsData.length <= 1 || commentToggle ? (
          commentsData.map((data) => (
            <CardComments
              key={data._id}
              postId={postId}
              commsId={data._id}
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
          ))
        ) : (
          <div>
            <CardComments
              key={commentsData[0]._id}
              postId={postId}
              commsId={commentsData[0]._id}
              text={commentsData[0].text}
              author={commentsData[0].author}
              date={commentsData[0].date}
              avatar={commentsData[0].avatarAuthor}
              picture={commentsData[0].imageUrl}
              userId={commentsData[0].userId}
              likes={commentsData[0].likes}
              dislikes={commentsData[0].dislikes}
              usersDisliked={commentsData[0].usersDisliked}
              usersLiked={commentsData[0].usersLiked}
              setReload={setReload}
            />
            <div
              className="GrowShrink hoverDiv"
              onClick={() => setCommentToggle(true)}
            >
              Voir{' '}
              {commentsData.length === 2
                ? 'le commentaire....'
                : 'les ' + (commentsData.length - 1) + ' commentaires...'}
            </div>
          </div>
        )}
        {commentToggle && (
          <div
            className="GrowShrink hoverDiv"
            onClick={() => setCommentToggle(false)}
          >
            {' '}
            Réduire...{' '}
          </div>
        )}
      </CommentsContainer>
    </CommentsWrapper>
  )
}

export default Comments
