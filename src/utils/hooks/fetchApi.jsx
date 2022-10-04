import axios from 'axios'

export default async function fetchApi(url, option, token) {
  try {
    const res = await axios(url, {
      data: option.data,
      method: option.method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res
  } catch (error) {
    return error
  }
}
