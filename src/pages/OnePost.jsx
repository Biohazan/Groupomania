import { useEffect, useState, useContext } from 'react'
import { ProfileContext } from '../utils/context/Profile'
import { useParams, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import colors from '../utils/colors'
import { size } from '../utils/breakpoint'
import Picker from 'emoji-picker-react'
import Comments from '../components/Comment'
import Likes from '../components/Likes'
import TextareaAutosize from 'react-textarea-autosize'

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
`
const CardWrapper = styled.div`
  margin: 5px;
  border: 1px solid ${colors.thirth};
  box-shadow: 0.5px 0.5px 2px ${colors.thirth};
  border-radius: 15px;
  margin-bottom: 15px;
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
  width: 97%;
  color: white;
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
  bottom: 48vh;
  right: 2vw;
  @media ${size.mobileM} {
    bottom: 20vh;
    right: 4vw;
  }
`
const TextAreaTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  color: white;
  & h2 {
    margin: 5px;
    margin-top: 5px;
    font-size: 17px;
  }
`
const PicturePreview = styled.div`
  position: absolute;
  bottom: 40px;
  right: 0;
  display: flex;
  justify-content: center;
  border: 1px solid ${colors.thirth};
  border-radius: 15px;
  padding: 20px;
  background-color: ${colors.thirth};
  & img {
    max-height: 200px;
  }
  & i {
    position: absolute;
    right: 5px;
    top: 6px;
    cursor: pointer;
  }
`
const CardInput = styled.div`
  padding: 5px;
  margin-bottom: 5px;
  text-align: center;
  background-color: transparent;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  @media ${size.mobileM} {
    flex-direction: row;
  }
  & #ButtonSendPost {
    margin: 0px 5px;
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
    padding: 5px;
    border: none;
    resize: none;
    overflow: auto;
    outline: none;
    width: 90%;
    @media ${size.mobileM} {
      margin-right: 0px;
      padding: 15px;
      border-bottom-left-radius: 15px;
      border-top-left-radius: 15px;
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
  const [fetchError, setFetchError] = useState([])
  const [isNotSameUser, setNotSameUser] = useState(false)
  const [inputComments, setInputComments] = useState(false)

  // Date Manage
  let d = new Date()
  let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
  let hours = d.getHours() + ':' + d.getMinutes()
  let fullDate = date + ' ' + hours

  useEffect(() => {
    function fetchPost() {
      fetch(`http://localhost:2000/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${profile.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error && data.error.name === 'TokenExpiredError') {
            setProfile({ token: 'TokenExpiredError' })
          } else {
            if (data.userId !== profile.userId) {
              setNotSameUser(true)
            }
            setData(data)
            setReload(false)
            setPostValue(datas.text)
          }
        })
    }
    fetchPost()
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
  // Pattern for Form
  let formToSend = {
    author: profile.pseudo,
    date: fullDate,
    text: inputPostValue,
    avatarAuthor: profile.picture,
  }

  // Function for post modification
  async function modifyPost() {
    console.log(inputPostValue)
    const formData = new FormData()
    formData.append('post', JSON.stringify(formToSend))
    isFilePicked && formData.append('image', selectedFile)
    if (formToSend.text === '' && !isFilePicked) return
    try {
      const response = await fetch(`http://localhost:4000/api/post/${postId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${profile.token}`,
        },
        body: formData,
      })
      const res = await response.json()
      if (!res.error) {
        console.log(res)
        setFetchIsCorect(true)
        setReload(true)
        setIsFilePicked(false)
      } else {
        setFetchError(res.error)
        console.log(res.error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <CardContainer>
      <CardWrapper>
        {isNotSameUser && <Navigate to="/dashboard" replace />}
        <CardTitle>
          <div className="userCard">
            <CardAvatar src={datas.avatarAuthor} alt="avatar" />
            <div className="authorDate">
              {datas.author} <br />
              {datas.date}
            </div>
          </div>
        </CardTitle>
        {datas.imageUrl && (
          <CardPicture
            src={datas.imageUrl}
            style={{
              borderTopRightRadius: '15px',
              borderTopLeftRadius: '15px',
            }}
            alt="post utilisateur"
          />
        )}
        <CardInputWrapper>
          {isEmoji && (
            <PickerDiv>
              <Picker onEmojiClick={onEmojiClick} disableSearchBar={true} />
            </PickerDiv>
          )}
          <TextAreaTitle>
            <h2>Que voulez vous racontez ?</h2>
            {fetchIsCorect &&
              setTimeout(() => {
                setFetchIsCorect(false)
              }, 3000) && <div> Post Modifié </div>}
            <IconWrapper>
              {isFilePicked && (
                <PicturePreview>
                  <img src={pictureSrc} alt="Import de l'utilisateur" />
                  <i
                    className="fa-regular fa-circle-xmark"
                    onClick={() => setIsFilePicked(false)}
                  />
                </PicturePreview>
              )}
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
          <CardInput>
            <TextareaAutosize
              name="postInput"
              id="postInput"
              value={inputPostValue}
              onChange={(e) => setPostValue(e.target.value)}
            />
            <button
              className="fa-regular fa-paper-plane"
              id="ButtonSendPost"
              onClick={modifyPost}
            />
          </CardInput>
        </CardInputWrapper>
        {
          <div style={{ width: '100%', padding:'5px' }}>
            <Likes
              likes={datas.likes}
              dislikes={datas.dislikes}
              cardId={datas._id}
              setReload={setReload}
              usersDisliked={datas.usersDisliked}
              usersLiked={datas.usersLiked}
              setInputComments={setInputComments}
            />
         <div style={{ margin:'5px' }}>
        <Comments inputComments={inputComments} setInputComments={setInputComments} postId={postId} />
        </div>
        </div>
        }
      </CardWrapper>
    </CardContainer>
  )
}

export default OnePost
