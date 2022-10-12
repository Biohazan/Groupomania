import { ProfileContext } from '../utils/context/Profile'
import { useContext, useState } from 'react'
import styled from 'styled-components'
import colors from '../utils/colors'
import { size } from '../utils/breakpoint'
import Picker from 'emoji-picker-react'
import { useEffect, useRef } from 'react'
import { SizeDashboardContext } from '../utils/context/SetSizeDashboard'
import TextareaAutosize from 'react-textarea-autosize'
import fetchApi from '../utils/hooks/fetchApi'
import {resizeFile} from '../utils/hooks/resizeFile'

const FormContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 90%;
  @media ${size.mobileM} {
    width: 80%;
    max-width: 780px;
  }
`
const FormWrapper = styled.form`
  z-index: 9000;
  background-image: linear-gradient(126deg, #4f9df9, #ffd7d7);
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 5px;
  box-shadow: 0px 0px 9px 0px ${colors.thirth};
  & *::after {
    top: unset !important;
    bottom: 4vh;
    right: 3vw;
  }
  
`
const DashInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  & #postInput {
    padding: 5px;
    border-radius: 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    @media ${size.mobileM} {
      padding: 15px;
      border-top-right-radius: 0px;
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      width: 100%;
    }
  }
`
const TextAreaInputSend = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media ${size.mobileM} {
    flex-direction: row;
  }
  & #ButtonSendPost {
    cursor: pointer;
    background-color: transparent;
    color: white;
    border: 1px solid white;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    box-shadow: 0px 0px 2px white;
    @media ${size.mobileM} {
      border-bottom-left-radius: 0px;
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;
    }
    &:hover {
      box-shadow: 0px 0px 5px white;
    }
  }
`
const TextAreaTitle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 7px;
  padding-top: 0;
`

const PickerDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 60px;
  right: 6px;
`

const IconWrapper = styled.div`
  position: relative;
  margin-left: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 1px solid white;
  border-radius: 15px;
  @media ${size.mobileM} {
    flex-direction: row;
  }
  & i {
    cursor: pointer;
  }
  & #fileUpload {
    display: none;
  }
  & #fileUploadIcon {
    cursor: pointer;
  }
`
const PicturePreview = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  & img {
    max-width: 100%;
    max-height: 470px;
    margin-bottom: 5px;
  }
  & i {
    cursor: pointer;
    margin: 5px;
    @media ${size.mobileM} {
      right: 0px;
      top: -30px;
    }
  }
`

function PostForm({ setReload, oneOnce }) {
  const { profile } = useContext(ProfileContext)
  // Date Manage
  let d = new Date()
  let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
  let hours = d.getHours() + ':' + d.getMinutes()
  let fullDate = date + ' ' + hours
  // Form Const
  const [inputPostValue, setPostValue] = useState('')
  const [fetchIsCorect, setFetchIsCorect] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Const for Emojy
  const [isEmoji, setIsEmoji] = useState(false)
  const onEmojiClick = (event, emojiObject) => {
    setPostValue(inputPostValue + emojiObject.emoji)
  }
  const toggleEmoji = () => {
    !isEmoji ? setIsEmoji(true) : setIsEmoji(false)
  }
  const emojyStyle = {
    color: isEmoji && 'green',
  }
  // Const for Picture
  const [selectedFile, setSelectedFile] = useState('')
  const [isFilePicked, setIsFilePicked] = useState(false)
  const [pictureSrc, setPictureSrc] = useState('')
  const [pictureLoad, setPictureLoad] = useState(false)

  function closePicture() {
    setIsFilePicked(false)
    setPictureLoad(false)
    setSelectedFile('')
    setPictureSrc('')
  }
  // Pattern for Form
  let formToSend = {
    author: profile.pseudo,
    date: fullDate,
    text: inputPostValue,
    avatar: profile.avatar,
  }
  //Function for compress and add Picture

  let reader = new FileReader()
  async function changePicture(event) {
    setPictureLoad(true)
    const imageFile = event.target.files[0]
    try {
      const compressedFile = await resizeFile(imageFile)
      setSelectedFile(compressedFile)
      setIsFilePicked(true)
      setPictureLoad(false)
    } catch (error) {
      console.log(error)
      setPictureLoad(false)
    }
    reader.onload = function (event) {
      let picture = reader.result
      setPictureSrc(picture.src)
      setPictureSrc(picture)
    }
    reader.readAsDataURL(imageFile)
  }

  // Function to fetch with API
  function addPost(e) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    formData.append('post', JSON.stringify(formToSend))
    isFilePicked && formData.append('image', selectedFile)
    if (formToSend.text === '' && !isFilePicked) {
      setIsLoading(false)
      return
    }
    const option = {
      method: 'POST',
      data: formData,
    }
    fetchApi(`api/post`, option, profile.token).then((data) => {
      if (data.status === 201) {
        setIsLoading(false)
        oneOnce.current = false
        console.log(data)
        setFetchIsCorect(true)
        setPostValue('')
        setReload(true)
        setIsFilePicked(false)
      } else console.log(data.response.data.error)
      setIsLoading(false)
    })
  }

  const { setFormHeight } = useContext(SizeDashboardContext)
  const elementRef = useRef(null)

  useEffect(() => {
    setFormHeight(elementRef.current.clientHeight)
  }, [setFormHeight])

  return (
    <FormContainer>
      <FormWrapper ref={elementRef} onSubmit={(e) => addPost(e)}>
        {(isLoading || pictureLoad || fetchIsCorect) && (
          <TextAreaTitle>
            {isLoading && <div> Envoi en cours...</div>}
            {pictureLoad && <div> Chargement de l'image...</div>}
            {fetchIsCorect &&
              setTimeout(() => {
                setFetchIsCorect(false)
              }, 3000) && <div> Post créer </div>}
          </TextAreaTitle>
        )}
        {isFilePicked && (
          <PicturePreview>
            <i className="fa-regular fa-circle-xmark" onClick={closePicture} />
            <img src={pictureSrc} alt="Import de l'utilisateur" />
          </PicturePreview>
        )}
        <DashInput>
          <TextAreaInputSend>
            <TextareaAutosize
            autoFocus
              className="textAreaStyle"
              name="postInput"
              id="postInput"
              placeholder="Que voulez vous racontez ?"
              aria-label="Ecrire un post"
              value={inputPostValue}
              onChange={(e) => setPostValue(e.target.value)}
            ></TextareaAutosize>
            <button
              className="fa-regular fa-paper-plane"
              id="ButtonSendPost"
              aria-label="envoyer le post"
              data-title='Envoyer'
            />
          </TextAreaInputSend>

          <IconWrapper>
            {isEmoji && (
              <PickerDiv>
                <Picker onEmojiClick={onEmojiClick} disableSearchBar={true} />
              </PickerDiv>
            )}
            <i
              className="fa-solid fa-face-smile"
              style={emojyStyle}
              onClick={() => toggleEmoji()}
              data-title='Emoji'
            />
            <label
              htmlFor="fileUpload"
              className="fa-solid fa-link"
              id="fileUploadIcon"
              data-title='Envoyer une image'
            />
            <input
              type="file"
              accept="image/*"
              id="fileUpload"
              onChange={changePicture}
            />
          </IconWrapper>
        </DashInput>
      </FormWrapper>
    </FormContainer>
  )
}

export default PostForm
