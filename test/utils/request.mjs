import http from './http.mjs'
import login from './login.mjs'

const request = async (method, url, body, auth) => {
    method = method.toLowerCase()
    try {
        let response = null
        if (!!auth) {
            const headers = {
                headers: { Authorization: 'Bearer ' + (await login()) },
            }

            response = ['get', 'delete'].includes(method)
                ? await http[method](url, headers)
                : await http[method](url, body, headers)
        }
        response = ['get', 'delete'].includes(method)
            ? await http[method](url)
            : await http[method](url, body)

        return Promise.resolve({ data: response.data, status: response.status })
    } catch (e) {
        return Promise.reject(e.response.data)
    }
}

export default request
