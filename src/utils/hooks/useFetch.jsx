import { useState, useContext } from 'react'
import { ProfileContext } from '../context/Pofile'
import { authContext } from '../context/Auth'
import { useEffect } from 'react'
import defaultPicture from '../../assets/profile.png'

export function useFetch(url, userToSend) {
  const [fetchIsCorect, setFetchIsCorect] = useState(false)
  const { profile, setProfile } = useContext(ProfileContext)
  const [fetchError, setFetchError] = useState([])
  const { login } = useContext(authContext)

  useEffect(() => {
    async function fetchFunction() {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${profile.token}`
          },
          body: JSON.stringify(userToSend),
        })
        const res = await response.json()
        if (!res.error && !res.post) {
          console.log(res)
          let userProfile = {
            pseudo: res.pseudo,
            token: res.token,
            picture: res.pictureUrl || defaultPicture,
            userId: res.userId
          }
          setProfile(userProfile)
          setFetchIsCorect(true)
          login()
        } else if(!res.error && res.post === true) {
          setFetchIsCorect(true)
          console.log(res)
        }
        else {
          setFetchError(res.error)
          console.log('merde')
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchFunction()
    }, [userToSend, login, profile.token, setProfile, url])
    
      return { fetchIsCorect, fetchError }
}
