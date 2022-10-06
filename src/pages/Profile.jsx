// import fetchApi from "../utils/hooks/fetchApi"
import { ProfileContext } from '../utils/context/Profile'
import { useContext, useEffect } from 'react'
import styled from 'styled-components'
import colors from '../utils/colors'
import TextareaAutosize from 'react-textarea-autosize'
import { size } from '../utils/breakpoint'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import fetchApi from '../utils/hooks/fetchApi'
import { useRef } from 'react'

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
`
const ProfileWrapper = styled.div`
  border: 1px solid ${colors.thirth};
  box-shadow: 0.5px 0.5px 2px ${colors.thirth};
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(126deg, #4f9df9, #ffd7d7);
  max-width: 800px;
  width: 90%;
  & h2 {
    margin: 5px;
  }
`
const TopWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  width: 100%;
`
const PseudoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 25px 0px;
  width: 100%;
  & img {
    width: 50%;
    border-radius: 50%;
  }
  & h1 {
    margin: 7px;
  }
  & i,
  #avatarUploadIcon {
    position: absolute;
    cursor: pointer;
    border: 1px solid white;
    border-radius: 25px;
    padding: 3px;
  }
  & #avatarUpload {
    display: none;
  }
  & input {
    background-color: transparent;
    color: white;
    border-radius: 15px;
    margin: 5px;
    font-size: 32px;
    font-family: inherit;
    text-align: center;
    border: 1px solid;
    font-weight: bold;
    width: 90%;
  }
  & .pseudoPen {
    position: unset;
    border: none;
    font-size: 13px;
    bottom: 5px;
    right: -20px;
    @media ${size.mobileM} {
      position: absolute;
    }
  }
  & .pseudoCross {
    position: unset;
    @media ${size.mobileM} {
      position: absolute;
    }
  }
`

const DescriptionWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px dotted white;
  border-radius: 15px;
  padding: 10px;
  margin: 10px;
  width: 90%;
  & p {
    padding: 16px;
    margin: 20px 0px;
  }
  & .describePen {
    position: absolute;
    cursor: pointer;
    top: 5px;
    right: 5px;
  }
  & textarea {
    width: 90%;
    border-radius: 15px;
    padding: 10px;
    margin: 20px 0px;
  }
`

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  padding: 15px 0px;
  border-top: 2px dotted ${colors.thirth};
  @media ${size.mobileM} {
    flex-direction: row;
  }
`

const PasswordWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

function Profile() {
  const { profile, setProfile } = useContext(ProfileContext)
  const [avatarInput, setavatarInput] = useState()
  const [pseudoModify, setPseudoModify] = useState(false)
  const [describeModify, setDescribeModify] = useState(true)
  const [pseudoInput, setPseudoInput] = useState('')
  const [describeInput, setDescribeInput] = useState('')
  const { userId } = useParams()
  const [sameUser, setSameUser] = useState(false)
  const [reload, setReload] = useState(false)
  const isFilePicked = useRef(false)
  const [selectedFile, setSelectedFile] = useState()
  let formToSend = {
    pseudo: pseudoInput,
    describe: describeInput,
  }

  // Const for set picture
  let reader = new FileReader()
  const changePicture = (event) => {
    setSelectedFile(event.target.files[0])
    isFilePicked.current = true
    modifyProfile(event)
    // read picture
    let picture = event.target.files[0]
    reader.onload = function (event) {
      let picturetest = reader.result
      setavatarInput(picturetest.src)
      setavatarInput(picturetest)
    }
    reader.readAsDataURL(picture)
  }

  // Function GET profile
  useEffect(() => {
    userId === profile.userId && setSameUser(true)
    const option = {
      method: 'GET',
    }
    fetchApi(
      `http://localhost:2000/api/auth/${userId}`,
      option,
      profile.token
    ).then((res) => {
      console.log(res)
      setPseudoInput(res.data.pseudo)
      setDescribeInput(res.data.describe)
      setavatarInput(res.data.avatar)
    })
  }, [userId, profile, reload])

  // Fonction PUT profile
  function modifyProfile(e) {
    e.preventDefault()
    const formProfile = new FormData()
    formProfile.append('profile', JSON.stringify(formToSend))
    if (isFilePicked.current) {
      formProfile.append('image', e.target.files[0])
    }
    console.log(isFilePicked)
    const option = {
      method: 'PUT',
      data: formProfile,
    }
    fetchApi(
      `http://localhost:2000/api/auth/${userId}`,
      option,
      profile.token
    ).then((res) => {
      setPseudoModify(false)
      setDescribeModify(true)
      setProfile({
        pseudo: pseudoInput,
        token: profile.token,
        avatar: res.data.avatar,
        userId: profile.userId,
        describe: describeInput,
      })
      isFilePicked.current = false
      console.log(res)
    })
  }

  return (
    <ProfileContainer>
      {}
      <ProfileWrapper>
        <TopWrapper>
          <PseudoWrapper>
            <div className="cardTop-Img">
              <input
                type="file"
                accept="image/*"
                id="avatarUpload"
                onChange={changePicture}
              />
              <img src={avatarInput} alt="profil" />
              {sameUser && (
                <label
                  htmlFor="avatarUpload"
                  className="fa-solid fa-plus"
                  id="avatarUploadIcon"
                />
              )}
              {pseudoModify ? (
                <div>
                  <input
                    autoFocus
                    className="textAreaStyle"
                    type="text"
                    maxLength={20}
                    value={pseudoInput}
                    onChange={(e) => setPseudoInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && !e.shiftKey && modifyProfile(e)
                    }
                    // onBlur={modifyProfile}
                  ></input>
                  <i
                    className="fa-regular fa-circle-xmark pseudoCross"
                    style={{ border: 'none' }}
                    onClick={modifyProfile}
                  ></i>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <h1> {pseudoInput} </h1>
                  {sameUser && (
                    <i
                      className="fa-solid fa-pen pseudoPen"
                      onClick={() => setPseudoModify(true)}
                    />
                  )}
                </div>
              )}
            </div>
          </PseudoWrapper>
          <DescriptionWrapper>
            <h2>Description :</h2>
            {describeModify ? (
              <div>
                <p>{describeInput}</p>
                {sameUser && (
                  <i
                    className="fa-solid fa-pen describePen"
                    onClick={() => setDescribeModify(false)}
                  />
                )}
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <TextareaAutosize
                  className="textAreaStyle"
                  value={describeInput}
                  minRows={2}
                  onChange={(e) => setDescribeInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && !e.shiftKey && modifyProfile(e)
                  }
                  onBlur={modifyProfile}
                />
                <i
                  className="fa-regular fa-circle-xmark describePen"
                  style={{ border: 'none' }}
                  onClick={modifyProfile}
                ></i>
              </div>
            )}
          </DescriptionWrapper>
        </TopWrapper>
        {sameUser && (
          <BottomWrapper>
            <PasswordWrapper>
              <h2>Changer de mot de passe :</h2>
              <label htmlFor="oldPass">Ancien mot de passe :</label>
              <input type="password" id="oldPass" />
              <label htmlFor="newPass">Nouveau mot de passe :</label>
              <input type="password" id="newPass" />
              <label htmlFor="newPass2">Nouveau mot de passe :</label>
              <input type="password" id="newPass2" />
            </PasswordWrapper>
            <h2>Supprimer le compte</h2>
          </BottomWrapper>
        )}
      </ProfileWrapper>
    </ProfileContainer>
  )
}

export default Profile
