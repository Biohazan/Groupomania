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

const FormWrapper = styled.form`
  position: fixed;
  bottom: 0;
  width: 90%;
  @media ${size.mobileM} {
    width: 50%;
  }
`
const DashInput = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.thirth};
  padding: 10px;
  border: 1px solid ${colors.thirth};
  border-radius: 15px;
  margin-bottom: 5px;
  color: white;
  box-shadow: 1px 1px 1px ${colors.thirth};
  & #postInput {
    padding: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    @media ${size.mobileM} {
      padding: 15px;
      border-top-right-radius: 0px;
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
    }
  }
  & h2 {
    margin: 5px;
    margin-top: 0;
    font-size: 17px;
    outline: none;
  }
`
const TextAreaInputSend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
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
`

const IconWrapper = styled.div`
  margin-left: 25px;
  padding: 5px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid white;
  border-radius: 15px;
  & i {
    cursor: pointer;
  }
  & #fileUpload {
    display: none;
  }
  & #fileUploadIcon {
    cursor: pointer;
  }
  @media ${size.mobileM} {
    margin-left: 0px;
    margin-right: 25px;
  }
`

const PicturePreview = styled.div`
  display: flex;
  justify-content: center;
  & img {
    position: relative;
    max-width: 100%;
    max-height: 470px;
    margin-bottom: 5px;
  }
  & i {
    position: absolute;
    right: 20px;
    top: 54px;
    cursor: pointer;
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
  // Const for Emojy
  const [isEmoji, setIsEmoji] = useState(false)
  const onEmojiClick = (event, emojiObject) => {
    setPostValue(inputPostValue + emojiObject.emoji)
  }
  const toggleEmoji = () => {
    !isEmoji ? setIsEmoji(true) : setIsEmoji(false)
  }
  // Const for Picture
  const [selectedFile, setSelectedFile] = useState()
  const [isFilePicked, setIsFilePicked] = useState(false)
  const [pictureSrc, setPictureSrc] = useState()
  // Pattern for Form
  let formToSend = {
    author: profile.pseudo,
    date: fullDate,
    text: inputPostValue,
    avatar: profile.avatar,
  }
  //Function for added Picture
  let reader = new FileReader()
  const changePicture = (event) => {
    setSelectedFile(event.target.files[0])
    setIsFilePicked(true)
    let picture = event.target.files[0]
    reader.onload = function (event) {
      let picturetest = reader.result
      setPictureSrc(picturetest.src)
      setPictureSrc(picturetest)
    }
    reader.readAsDataURL(picture)
  }

  // Function to fetch with API
  function addPost(e) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('post', JSON.stringify(formToSend))
    isFilePicked && formData.append('image', selectedFile)
    if (formToSend.text === '' && !isFilePicked) return
    const option = {
      method: 'POST',
      data: formData,
    }
    
    fetchApi(`http://localhost:2000/api/post`, option, profile.token).then(
      (data) => {
        if (data.status === 201) {
          oneOnce.current = false
          console.log(data)
          setFetchIsCorect(true)
          setPostValue('')
          setReload(true)
          setIsFilePicked(false)
        } else console.log(data.response.data.error)

      }
    )
  }

  const { setFormHeight } = useContext(SizeDashboardContext)
  const elementRef = useRef(null)

  useEffect(() => {
    setFormHeight(elementRef.current.clientHeight)
  }, [setFormHeight])

  return (
    <FormWrapper ref={elementRef} onSubmit={(e) => addPost(e)}>
      {isEmoji && (
        <PickerDiv>
          <Picker onEmojiClick={onEmojiClick} disableSearchBar={true} />
        </PickerDiv>
      )}
      <DashInput>
        <TextAreaTitle>
          <h2>Que voulez vous racontez ?</h2>
          {fetchIsCorect &&
            setTimeout(() => {
              setFetchIsCorect(false)
            }, 3000) && <div> Post créer </div>}
          <IconWrapper>
            <i
              className="fa-solid fa-face-smile"
              onClick={() => toggleEmoji()}
            />
            <label
              htmlFor="fileUpload"
              className="fa-solid fa-link"
              id="fileUploadIcon"
            />
            <input
              type="file"
              accept="image/*"
              id="fileUpload"
              onChange={changePicture}
            />
          </IconWrapper>
        </TextAreaTitle>
        {isFilePicked && (
          <PicturePreview>
            <img src={pictureSrc} alt="Import de l'utilisateur" />
            <i
              className="fa-regular fa-circle-xmark"
              onClick={() => setIsFilePicked(false)}
            />
          </PicturePreview>
        )}
        <TextAreaInputSend>
          <TextareaAutosize
            className="textAreaStyle"
            name="postInput"
            id="postInput"
            aria-label="Ecrire un post"
            cols={window.innerWidth >= 530 ? '160' : '40'}
            rows="2"
            value={inputPostValue}
            onChange={(e) => setPostValue(e.target.value)}
          ></TextareaAutosize>
          <button
            className="fa-regular fa-paper-plane"
            id="ButtonSendPost"
            aria-label="envoyer le post"
          />
        </TextAreaInputSend>
      </DashInput>
    </FormWrapper>
  )
}

export default PostForm
