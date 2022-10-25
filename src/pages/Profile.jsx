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
import { authContext } from '../utils/context/Auth'
import {resizeFile} from '../utils/hooks/resizeFile'
import viewPass from '../utils/hooks/viewPass'
const bcrypt = require('bcryptjs')

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
    padding: 0px 10px;
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
  align-items: center;
  text-align: center;
  padding: 25px 0px;
  width: 100%;
  & img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
  & h1 {
    margin: 12px;
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
    @media ${size.mobileM} {
      position: absolute;
      bottom: 5px;
      right: -15px;
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
    padding: 1px;
    margin: 20px 0px;
    text-align: center;
  }
  & .describePen {
    position: absolute;
    cursor: pointer;
    top: 5px;
    right: 5px;
    &::after {
      right: 2vw;
    }
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
  padding: 10px 0px;
  border-top: 2px dotted ${colors.thirth};
  @media ${size.mobileM} {
    flex-direction: row;
  }
  & input {
    margin: 10px;
    width: 100%;
    text-align: center;
  }
  & .inputContain {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    width: 100%;
    margin-top: 15px;
    & .inputStyle {
      display: flex;
      align-items: center;
      width: 90%;
    }
  }
  & .fa-check {
    border: 1px solid;
    border-radius: 50%;
    padding: 15px;
    cursor: pointer;
  }
`

const PasswordWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  margin: 5px;
  & *::after {
    left: 53px !important;
  }
`
const DeleteWrapper = styled.div`
  border-top: 2px dotted ${colors.thirth};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 15px;
  padding: 20px 0;
  width: 100%;
  & *::after {
    right: 0vh;
  }
  @media ${size.mobileM} {
    margin: 5px;
    padding: 0;
    width: unset;
    border-top: none;
  }
  & button {
    cursor: pointer;
    border: 1px solid white;
    background: none;
  }
  & #validButton {
    color: inherit;
    margin-top: 15%;
    &::after {
      right: 53px;
    }
  }
  & #trashButton {
    color: red;
    margin-top: 25px;
    margin-bottom: 30px;
    font-size: 25px;
    padding: 10px;
    border-radius: 50%;
    @media ${size.mobileM} {
      margin-top: 0;
    }
  }
`

function Profile() {
  // User Const
  const { userId } = useParams()
  const [sameUser, setSameUser] = useState(false)
  const { profile, setProfile } = useContext(ProfileContext)
  const { logout } = useContext(authContext)

  // Top const
  const [avatarInput, setavatarInput] = useState()
  const [pseudoModify, setPseudoModify] = useState(false)
  const [describeModify, setDescribeModify] = useState(true)
  const [pseudoInput, setPseudoInput] = useState('')
  const [describeInput, setDescribeInput] = useState('')

  // Picture const
  const isFilePicked = useRef(false)

  // Bottom const
  const [isDelete, setIsDelete] = useState(false)
  // Password const
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [newPasswordInput, setNewPasswordInput] = useState('')
  const passwordChange = useRef()
  const [passwordIsModify, setPasswordIsModify] = useState(false)

  // Pattern's Form
  let formToSend = {
    pseudo: pseudoInput,
    describe: describeInput,
  }
  let passToSend = {
    old: passwordInput,
    new: newPasswordInput,
  }

  // Function for set picture
  let compressedFile
  async function changePicture(event) {
    let reader = new FileReader()
    const imageFile = event.target.files[0]
    try {
      compressedFile = await resizeFile(imageFile, true)
      isFilePicked.current = true
    } catch (error) {
      console.log(error)
    }
    isFilePicked.current = true
    modifyProfile(event)
    // read picture
    reader.onload = function (event) {
      let picturetest = reader.result
      setavatarInput(picturetest.src)
      setavatarInput(picturetest)
    }
    reader.readAsDataURL(imageFile)
  }

  // Function GET profile
  useEffect(() => {
    ;(userId === profile.userId ||
      bcrypt.compareSync('adminSuperUser', profile.role)) &&
      setSameUser(true)
    const option = {
      method: 'GET',
    }
    fetchApi(`api/user/${userId}`, option, profile.token).then((res) => {
      setPseudoInput(res.data.pseudo)
      setDescribeInput(res.data.describe)
      setavatarInput(res.data.avatar)
    })
  }, [userId, profile])

  // Function to change password
  function passwordModify(e) {
    passwordChange.current = true
    modifyProfile(e)
  }

  // Fonction PUT profile
  function modifyProfile(e) {
    e.preventDefault()
    const formProfile = new FormData()
    if (passwordChange && !pseudoModify && describeModify && !isFilePicked) {
      formProfile.append('password', JSON.stringify(passToSend))
    } else {
      formProfile.append('profile', JSON.stringify(formToSend))
      if (isFilePicked.current) {
        formProfile.append('image', compressedFile)
      }
    }
    const option = {
      method: 'PUT',
      data: formProfile,
    }
    fetchApi(`api/user/${userId}`, option, profile.token).then((res) => {
      if (res.status === 200) {
        if (res.data.passModify === 'ok') {
          setPasswordIsModify(true)
          passwordChange.current = false
          setPasswordInput('')
          setNewPasswordInput('')
        } else if (res.data.avatar) {
          setPseudoModify(false)
          setDescribeModify(true)
          setProfile({
            pseudo: pseudoInput,
            token: profile.token,
            avatar: res.data.avatar,
            userId: profile.userId,
            describe: describeInput,
            role: profile.role,
          })
          isFilePicked.current = false
        }
      }
    })
  }

  function DelProfile(e) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('password', passwordInput)
    const option = {
      method: 'DELETE',
      data: formData,
    }
    fetchApi(`api/user/${userId}`, option, profile.token).then((res) => {
      if (res.status === 200) logout()
    })
  }

  return (
    <ProfileContainer>
      <ProfileWrapper>
        <TopWrapper onClick={() => setIsDelete(false)}>
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
                  className="fa-solid fa-plus hoverDiv"
                  id="avatarUploadIcon"
                  data-title="Ajouter un avatar"
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
                  ></input>
                  <i
                    className="fa-regular fa-circle-xmark pseudoCross hoverDiv "
                    style={{ border: 'none' }}
                    onClick={modifyProfile}
                    data-title="Fermer et enregister"
                  ></i>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <h1> {pseudoInput} </h1>
                  {sameUser && (
                    <i
                      className="fa-solid fa-pen pseudoPen hoverDiv"
                      onClick={() => setPseudoModify(true)}
                      data-title="Changer de pseudo"
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
                    className="fa-solid fa-pen describePen hoverDiv"
                    onClick={() => setDescribeModify(false)}
                    data-title="Modifier la description"
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
                  className="fa-regular fa-circle-xmark describePen hoverDiv"
                  style={{ border: 'none' }}
                  onClick={modifyProfile}
                  data-title="Fermer et enregistrer"
                ></i>
              </div>
            )}
          </DescriptionWrapper>
        </TopWrapper>
        {sameUser && (
          <BottomWrapper>
            <PasswordWrapper onClick={() => setIsDelete(false)}>
              <h2>Changer de mot de passe</h2>
              {passwordIsModify ? (
                <div
                  style={{
                    padding: '15px',
                    height: '-webkit-fill-available',
                    color: 'green',
                  }}
                >
                  Mot de passe modifié
                </div>
              ) : (
                <div className="inputContain">
                  <label htmlFor="oldPass">Ancien mot de passe :</label>
                  <div className="inputStyle">
                    <input
                      type="password"
                      id="oldPass"
                      className="textAreaStyle"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    <label
                      htmlFor="oldPass"
                      type="checkbox"
                      onClick={(e) => viewPass(e)}
                      className="fa-solid fa-eye checkProfile"
                      data-title="Voir le mot de passe"
                    />
                  </div>
                  <label htmlFor="newPass">Nouveau mot de passe :</label>
                  <div className="inputStyle">
                    <input
                      type="password"
                      id="newPass"
                      className="textAreaStyle"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                    />
                    <span
                      type="checkbox"
                      onClick={(e) => viewPass(e)}
                      className="fa-solid fa-eye checkProfile"
                      data-title="Voir le mot de passe"
                    />
                  </div>
                </div>
              )}
              {!passwordIsModify && (
                <i
                  className="fa-solid fa-check hoverDiv"
                  onClick={(e) => passwordModify(e)}
                  data-title="Valider"
                ></i>
              )}
            </PasswordWrapper>
            <DeleteWrapper>
              <h2>Supprimer le compte</h2>
              <div className="inputContain" style={{justifyContent: 'flex-start'}}>
                {isDelete ? (
                  <form
                    onSubmit={(e) => DelProfile(e)}
                    className="inputContain"
                  >
                    <label htmlFor="confirmPass">
                      Confirmer votre mot de passe:
                    </label>
                    <div className="inputStyle">
                      <input
                        type="password"
                        className="textAreaStyle"
                        id="confirmPass"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        type="checkbox"
                        onClick={(e) => viewPass(e)}
                        className="fa-solid fa-eye checkProfile"
                        data-title="Voir le mot de passe"
                      />
                    </div>
                    <button
                      id="validButton"
                      className="fa-solid fa-check hoverDiv"
                      data-title="Valider"
                    ></button>
                  </form>
                ) : (
                  <button
                    id="trashButton"
                    className="hoverDiv fa-solid fa-trash-can"
                    onClick={() => setIsDelete(true)}
                  ></button>
                )}
              </div>
            </DeleteWrapper>
          </BottomWrapper>
        )}
      </ProfileWrapper>
    </ProfileContainer>
  )
}

export default Profile
