import axios from 'axios'
const baseUrlProd = 'http://zyzvfxh.cluster030.hosting.ovh.net/'
const baseUrlDev = 'http://localhost:2000/'

export default async function fetchApi(url, option, token) {
  try {
    const res = await axios(baseUrlDev+url, {
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
