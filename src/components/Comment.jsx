import styled from 'styled-components'
import { useContext, useState, useEffect, useReducer } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Picker from 'emoji-picker-react'
import { ProfileContext } from '../utils/context/Profile'
import CardComments from './CardComments'
import fetchApi from '../utils/hooks/fetchApi'
import { resizeFile } from '../utils/hooks/resizeFile'
import { useRef } from 'react'

const CommentsWrapper = styled.div`
  width: 100%;
`
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: relative;
`
const TextAreaWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  & textarea {
    padding: 5px;
    width: 80%;
    border-radius: 10px;
  }
`
const SendComment = styled.div`
  border: 1px solid;
  border-radius: 25px;
  padding: 5px;
  cursor: pointer;
  &::after {
    right: 0px;
    top: 4vh !important;
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
    &::after {
    right: 0px;
    top: 4vh !important;
  }
  }
`
const PickerDiv = styled.div`
  position: absolute;
  bottom: 40px;
  right: 0px;
`
const IconWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  gap: 3px;
  width: 100%;
  margin-bottom: 5px;
  & i {
    cursor: pointer;
    border: 1px solid;
    border-radius: 25px;
    padding: 5px;
  }
  & #fileUploadComms {
    display: none;
  }
  & #fileUploadIconComms {
    cursor: pointer;
    border: 1px solid;
    border-radius: 25px;
    padding: 5px;
  }
`
const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  & .GrowShrink {
    text-align: center;
    cursor: pointer;
    padding: 5px;
    font-size: 15px;
  }
`

function Comments({ inputComments, setInputComments, postId, setIsTranlate }) {
  const [commentsData, setCommentsData] = useState([])
  const [inputCommsValue, setCommsValue] = useState('')
  const { profile } = useContext(ProfileContext)
  const [commentToggle, setCommentToggle] = useState(false)
  const [fetchError, setFetchError] = useState([])
  const [reload, setReload] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Function to GET Comms
  useEffect(() => {
    const option = {
      method: 'GET',
    }
    function fetchComments() {
      fetchApi(`api/comments/${postId}`, option, profile.token).then((res) => {
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
  const [isEmoji, setIsEmoji] = useReducer((state) => !state, false)
  const emojyRef = useRef(null)

  // Emojy functions
  const onEmojiClick = (event, emojiObject) => {
    setCommsValue(inputCommsValue + emojiObject.emoji)
  }
  const emojyStyle = {
    color: isEmoji && 'green',
  }

  // Const for Picture
  const [selectedFileComms, setSelectedFileComms] = useState('')
  const [isFilePickedComms, setIsFilePickedComms] = useState(false)
  const [pictureSrcComms, setPictureSrcComms] = useState('')
  const [pictureLoad, setPictureLoad] = useState(false)
  function closePicture() {
    setIsFilePickedComms(false)
    setPictureLoad(false)
    setSelectedFileComms('')
    setPictureSrcComms('')
    setIsTranlate && setIsTranlate(false)
  }
  // Pattern for Form
  let formToSend = {
    author: profile.pseudo,
    date: fullDate,
    text: inputCommsValue,
    avatarAuthor: profile.picture,
  }
  //Function for added Picture
  let reader = new FileReader()
  async function changePicture(event) {
    setPictureLoad(true)
    const imageFile = event.target.files[0]
    try {
      const compressedFile = await resizeFile(imageFile)
      setSelectedFileComms(compressedFile)
      setIsFilePickedComms(true)
      setPictureLoad(false)
    } catch (error) {
      console.log(error)
      setPictureLoad(false)
    }
    reader.onload = function (event) {
      let picture = reader.result
      setPictureSrcComms(picture.src)
      setPictureSrcComms(picture)
    }
    reader.readAsDataURL(imageFile)
  }
  // Function to create a comment
  function CreateComms(e) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    formData.append('postComments', JSON.stringify(formToSend))
    isFilePickedComms &&
      formData.append('image', selectedFileComms)
    const option = {
      method: 'POST',
      data: formData,
    }
    if (formToSend.text === '' && !isFilePickedComms) {
      setIsLoading(false)
      return
    }
    fetchApi(`api/comments/${postId}`, option, profile.token).then((res) => {
      if (res.status === 201) {
        setIsLoading(false)
        setReload(true)
        setIsFilePickedComms(false)
        setInputComments(false)
        setCommsValue('')
      } else {
        setFetchError(res.error)
        setIsLoading(false)
        console.log(res.error)
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      emojyRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, Picker)
  }, [isEmoji])

  useEffect(() => {
    setIsTranlate &&
    ((isEmoji || isFilePickedComms) ? setIsTranlate(true) : setIsTranlate(false))
  }, [isEmoji, isFilePickedComms, setIsTranlate])

  return (
    <CommentsWrapper>
      {isFilePickedComms && (
        <PicturePreview>
          <img src={pictureSrcComms} alt="Import de l'utilisateur" />
          <i className="fa-regular fa-circle-xmark" onClick={closePicture} data-title='Fermer' />
        </PicturePreview>
      )}
      {isLoading && (
        <div style={{ textAlign: 'center' }}> Envoi en cours...</div>
      )}
      {pictureLoad && (
        <div style={{ textAlign: 'center' }}> Chargement de l'image...</div>
      )}
      {inputComments && (
        <InputWrapper>
          <IconWrapper>
            {isEmoji && (
              <PickerDiv ref={emojyRef}>
                <Picker onEmojiClick={onEmojiClick} disableSearchBar={true} />
              </PickerDiv>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <i
                className="fa-solid fa-face-smile hoverDiv"
                style={emojyStyle}
                onClick={setIsEmoji}
                data-title='Emoji'
              />
              <label
                htmlFor="fileUploadComms"
                className="fa-solid fa-link hoverDiv"
                id="fileUploadIconComms"
                data-title='Envoyer une image'
              />
              <input
                type="file"
                accept="image/*"
                id="fileUploadComms"
                onChange={changePicture}
              />
            </div>
          </IconWrapper>
          <TextAreaWrapper>
            <TextareaAutosize
              autoFocus
              className="textAreaStyle"
              name="inputForComments"
              id={'input' + postId}
              value={inputCommsValue}
              onChange={(e) => setCommsValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !e.shiftKey && CreateComms(e)
              }
            ></TextareaAutosize>
            <SendComment
              onClick={(e) => CreateComms(e)}
              className="fa-regular fa-paper-plane hoverDiv"
              data-title='Envoyer'
            />
          </TextAreaWrapper>
        </InputWrapper>
      )}
      <CommentsContainer onClick={() => setInputComments(false)}>
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
              pictureUrl={data.pictureUrl}
              userId={data.userId}
              likes={data.likes}
              dislikes={data.dislikes}
              usersDisliked={data.usersDisliked}
              usersLiked={data.usersLiked}
              setReload={setReload}
            />
          ))
        ) : (
          <div className="oneCommentWrapper">
            <CardComments
              key={commentsData[0]._id}
              postId={postId}
              commsId={commentsData[0]._id}
              text={commentsData[0].text}
              author={commentsData[0].author}
              date={commentsData[0].date}
              avatar={commentsData[0].avatarAuthor}
              pictureUrl={commentsData[0].pictureUrl}
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
