import { useEffect, useState, useContext, useReducer } from 'react'
import { ProfileContext } from '../utils/context/Profile'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import colors from '../utils/colors'
import { size } from '../utils/breakpoint'
import Picker from 'emoji-picker-react'
import Comments from '../components/Comment'
import Likes from '../components/Likes'
import TextareaAutosize from 'react-textarea-autosize'
import fetchApi from '../utils/hooks/fetchApi'
import { resizeFile } from '../utils/hooks/resizeFile'

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 72vh;
  transition: all 300ms ease-in-out;
`
const CardWrapper = styled.div`
  margin: 5px;
  margin-bottom: 15px;
  border: 1px solid ${colors.thirth};
  box-shadow: 0.5px 0.5px 2px ${colors.thirth};
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(126deg, #4f9df9, #ffd7d7);
  max-width: 800px;
  width: 90%;
`
const CardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  align-self: flex-start;
  padding: 10px;
  text-shadow: 1px 1px ${colors.thirth};
  & .userCard {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  & .authorDate {
    display: flex;
    flex-direction: column;
  }
`
const CardAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50px;
`
const CardPicture = styled.img`
  position: relative;
  height: 100%;
  width: 100%;
`
const CardInputWrapper = styled.div`
  width: 100%;
  border-top: 1px dotted ${colors.thirth};
  margin-top: 5px;
`
const PickerDiv = styled.div`
  position: absolute;
  bottom: 6vh;
  right: -2vw;
  opacity: 0;
  transition: all 2000ms ease-in-out;
  @media ${size.mobileM} {
    bottom: 4vh;
    right: 4vw;
  }
`
const TextAreaTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  & h2 {
    margin: 5px;
    margin-top: 5px;
    font-size: 17px;
  }
`
const PicturePreview = styled.div`
  position: absolute;
  bottom: 40px;
  right: -12px;
  display: flex;
  justify-content: center;
  border: 1px solid ${colors.thirth};
  border-radius: 15px;
  padding: 20px;
  background-color: ${colors.thirth};
  & img {
    width: 250px;
  }
  & i {
    position: absolute;
    right: 5px;
    top: 6px;
    cursor: pointer;
  }
`
const CardInput = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  margin-bottom: 5px;
  text-align: center;
  background-color: transparent;
  gap: 1px;
  @media ${size.mobileM} {
    flex-direction: row;
  }
  & #ButtonSendPost {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    margin: 0px 5px;
    padding: 5px;
    cursor: pointer;
    background-color: transparent;
    color: white;
    border: 1px solid white;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    box-shadow: 0px 0px 2px white;
    @media ${size.mobileM} {
      margin-left: 0px;
      border-bottom-left-radius: 0px;
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;
    }
  }
  & #postInput {
    margin: 0px 5px;
    padding: 10px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    @media ${size.mobileM} {
      width: 90%;
      margin-right: 0px;
      padding: 15px;
      border-bottom-right-radius: 0px;
      border-top-right-radius: 0px;
      border-bottom-left-radius: 5px;
    }
    &:hover {
      box-shadow: 0px 0px 5px white;
    }
  }
`
const IconWrapper = styled.div`
  position: relative;
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

function OnePost() {
  const { profile, setProfile } = useContext(ProfileContext)
  const [reload, setReload] = useState(false)
  const [datas, setData] = useState([])
  const { postId } = useParams()
  const [inputPostValue, setPostValue] = useState('')
  const [fetchIsCorect, setFetchIsCorect] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotSameUser, setNotSameUser] = useState(false)
  const [inputComments, setInputComments] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [author, setAuthor] = useState('')
  const [isTranslate, setIsTranlate] = useState(false)

  // Date Manage
  let d = new Date()
  let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
  let hours = d.getHours() + ':' + d.getMinutes()
  let fullDate = date + ' ' + hours

  // Function to GET one Post
  useEffect(() => {
    const option = {
      method: 'GET',
    }
    fetchApi(`api/post/${postId}`, option, profile.token).then((res) => {
      if (res.data.error && res.data.error.name === 'TokenExpiredError') {
        setProfile({ token: 'TokenExpiredError' })
      } else {
        if (res.data.userId !== profile.userId) {
          setNotSameUser(true)
        }
        if (res.status === 200) setData(res.data)
        setReload(false)
        setPostValue(datas.text)

        // Function to get Author information
        fetchApi(`api/auth/${res.data.userId}`, option, profile.token).then(
          (res) => {
            setAuthor(res.data.pseudo)
            setAvatar(res.data.avatar)
          }
        )
      }
    })
  }, [
    profile.token,
    setProfile,
    reload,
    postId,
    datas.userId,
    datas.text,
    profile.userId,
  ])

  // Const for Emojy
  const [isEmoji, setIsEmoji] = useReducer((state) => !state, false)
  const onEmojiClick = (event, emojiObject) => {
    setPostValue(inputPostValue + emojiObject.emoji)
  }
  const emojyStyle = {
    color: isEmoji && 'green',
  }

  // Const for Picture
  const [selectedFile, setSelectedFile] = useState('')
  const [isFilePicked, setIsFilePicked] = useState(false)
  const [pictureSrc, setPictureSrc] = useState('')
  const [pictureLoad, setPictureLoad] = useState(false)

  function closePreview() {
    setPictureLoad(false)
    setIsFilePicked(false)
    setSelectedFile('')
    setPictureSrc('')
  }

    //Function for added Picture
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
  // Pattern for Form
  let formToSend = {
    author: profile.pseudo,
    date: fullDate,
    text: inputPostValue,
    avatarAuthor: profile.picture,
  }

  // Function for post modification
  function modifyPost() {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('post', JSON.stringify(formToSend))
    isFilePicked && formData.append('image', selectedFile)
    if (formToSend.text === '' && !isFilePicked) {
      setIsLoading(false)
      return
    }
    const option = {
      method: 'PUT',
      data: formData,
    }
    fetchApi(`api/post/${postId}`, option, profile.token).then((res) => {
      if (res.status === 200) {
        setFetchIsCorect(true)
        setReload(true)
        setIsFilePicked(false)
        setFetchError(false)
        setIsLoading(false)
      } else {
        setFetchError(true)
        setIsLoading(false)
        console.log(res)
      }
    })
  }

  return (
    <CardContainer
      style={{
        transform:
          (isEmoji || isFilePicked || isTranslate) && !datas.pictureUrl && (window.innerWidth >= 530 ? 'translateY(10vh)' : 'translateY(10vh)'),
        height: datas.pictureUrl && '90vh',
        alignItems: (datas.pictureUrl && (window.innerWidth > 530)) && 'flex-start'
      }}
    >
      <CardWrapper>
        <CardTitle>
          <div className="userCard">
            <CardAvatar src={avatar} alt="avatar" />
            <div className="authorDate">
              {author} <br />
              {datas.date}
            </div>
          </div>
        </CardTitle>
        {datas.pictureUrl && (
          <CardPicture src={datas.pictureUrl} alt="post utilisateur" />
        )}
        {isNotSameUser ? (
          inputPostValue && (
            <div style={{ padding: '25px', textAlign: 'center' }}>
              {inputPostValue}
            </div>
          )
        ) : (
          <CardInputWrapper>
            <TextAreaTitle>
              <h2>Que voulez vous racontez ?</h2>
              {fetchIsCorect &&
                setTimeout(() => {
                  setFetchIsCorect(false)
                }, 3000) && <div> Post Modifié </div>}
              {fetchError && <div> Une erreur c'est produite </div>}
              {isLoading && <div> Envoi en cours... </div>}
              {pictureLoad && <div style={{marginRight: '10px'}}> Chargement de l'image...</div>}
              <IconWrapper>
                {isFilePicked && (
                  <PicturePreview>
                    <img src={pictureSrc} alt="Import de l'utilisateur" />
                    <i
                      className="fa-regular fa-circle-xmark"
                      onClick={closePreview}
                    />
                  </PicturePreview>
                )}
                {isEmoji && (
                  <PickerDiv style={{ opacity: '1' }}>
                    <Picker
                      onEmojiClick={onEmojiClick}
                      disableSearchBar={true}
                    />
                  </PickerDiv>
                )}
                <i
                  className="fa-solid fa-face-smile"
                  style={emojyStyle}
                  onClick={setIsEmoji}
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
            <CardInput>
              <TextareaAutosize
                className="textAreaStyle"
                name="postInput"
                id="postInput"
                value={inputPostValue}
                onChange={(e) => setPostValue(e.target.value)}
              />
              <button
                className="fa-regular fa-paper-plane"
                id="ButtonSendPost"
                onClick={modifyPost}
              >
                <span>Envoyer</span>
              </button>
            </CardInput>
          </CardInputWrapper>
        )}
        {
          <div style={{ width: '100%', padding: '5px' }}>
            <Likes
              likes={datas.likes}
              dislikes={datas.dislikes}
              cardId={datas._id}
              setReload={setReload}
              usersDisliked={datas.usersDisliked}
              usersLiked={datas.usersLiked}
              setInputComments={setInputComments}
            />
            <div style={{ margin: '5px' }}>
              <Comments
                inputComments={inputComments}
                setInputComments={setInputComments}
                postId={postId}
                setIsTranlate={setIsTranlate}
              />
            </div>
          </div>
        }
      </CardWrapper>
    </CardContainer>
  )
}

export default OnePost
