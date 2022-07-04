/* eslint-disable @typescript-eslint/no-explicit-any */
import http from './http'
import login from './login'

type Method = 'get' | 'post' | 'delete' | 'put' | 'patch'

const callApi = (
    method: Method,
    url: string,
    body: unknown | null,
    headers: Record<string, unknown> | undefined = undefined,
) => {
    switch (method) {
        case 'get':
            return http.get(url, headers)
        case 'delete':
            return http.delete(url, headers)
        case 'post':
            return http.post(url, body, headers)
        case 'put':
            return http.put(url, body, headers)
        case 'patch':
            return http.patch(url, body, headers)
    }
}

const request = async (method: Method, url: string, body: unknown | null = null, auth = false) => {
    try {
        let response = null
        if (!!auth) {
            response = await callApi(method, url, body, {
                headers: { Authorization: 'Bearer ' + (await login()) },
            })
        }

        response = await callApi(method, url, body)

        return {
            data: response.data as unknown,
            status: response.status as number,
        }
    } catch (e: any) {
        return { data: e.response.data, status: e.response.status }
    }
}

export default request
