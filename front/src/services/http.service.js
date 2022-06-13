import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : '//localhost:3030/api/'
const PREDICTOR_URL = process.env.NODE_ENV === 'production'
? '/api/'
: '//localhost:3031/api/'


var axios = Axios.create({
    withCredentials: true
})

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    console.log(endpoint , method, data , "endpoint , method, data")
    try {
        const res = await axios({
            url: (endpoint.includes('url'))? `${PREDICTOR_URL}${endpoint}` :
            `${BASE_URL}${endpoint}`,
            method,
            data,
            params: (method === 'GET') ? data : null
            // params: (method === 'GET') ? data : null
        })
        
        console.log(`${BASE_URL}${endpoint}` , "url")
        console.log(res.data , "res.data from http")
        return res.data
    } catch (err) {
        if(endpoint !== 'auth/signup'){
            if (err.response && err.response.status === 401) {
                // Depends on routing startegy - hash or history
                window.location.assign('/#/login')
            }
            console.log(err , "err bottom")
            throw err
        }
    }
}