import { useContext } from 'react'
import { useEffect, useState } from 'react'
import { ProfileContext } from '../context/Pofile'

const formData = new FormData()

export async function FetchAddPost(
  formToSend,
  selectedFile,
  isFilePicked,
  setPostValue,
  setReload,
  setIsFilePicked,
) {
  const [fetchIsCorect, setFetchIsCorect] = useState(false)
  const [fetchError, setFetchError] = useState([])
  const { profile } = useContext(ProfileContext)
  formData.append('post', JSON.stringify(formToSend))
  isFilePicked && formData.append('image', selectedFile)

        console.log(formToSend)
      if (formToSend.text === '' && !isFilePicked) return
      try {
        const response = await fetch(`http://localhost:4000/api/post`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${profile.token}`,
          },
          body: formData,
        })
        const res = await response.json()
        if (!res.error) {
          console.log(res)
          setFetchIsCorect(true)
          setPostValue('')
          setReload(true)
          setIsFilePicked(false)
        } else {
          setFetchError(res.error)
          console.log('merde')
        }
      } catch (error) {
        console.log(error)
      }
  return (fetchIsCorect, fetchError, setFetchIsCorect)
}

