import { httpService } from './http.service'

export const constructorService = {
    addConstructor,
    getConstructors,
}


async function addConstructor(constructorInfo) {
    try {
        // const cons = await httpService.post('auth/constructor', constructorInfo)
        await httpService.post('auth/constructor', constructorInfo)
        // return _saveLocalUser(user)
        // return cons
    } catch (err) {
        throw err
    }
}

async function getConstructors() {
    try {
        return await httpService.get(`constructor`)
    } catch (err) {
        throw err
    }
}