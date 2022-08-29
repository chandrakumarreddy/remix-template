import { getSession, logout } from '~/session.server'

export const reqestHandler = async (
  request: Request,
  url: string,
  fetchBody?: RequestInit,
  accessToken?: string
) => {
  const session = await getSession(request)
  const access_token = accessToken || session.get('access_token')
  const defaultHeaders = {
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: `Bearer ${access_token}`,
  }
  const fetchInit = fetchBody
    ? {
        ...fetchBody,
        priority: 'high',
        headers: {
          ...defaultHeaders,
          ...(fetchBody.headers || {}),
        },
      }
    : {
        headers: defaultHeaders,
      }
  try {
    const response = await fetch(url, fetchInit)
    let responseJson
    if (response.status === 401) {
      throw await logout(request)
    } else if (response.status >= 200 || response.status < 500) {
      responseJson = await response.json()
      responseJson.status_code = response.status
    } else {
      responseJson = {
        status_code: 500,
      }
    }
    return responseJson
  } catch (error) {
    return {
      status_code: 500,
    }
  }
}

const fetchHandler = reqestHandler

export default fetchHandler
