import { httpService } from './http.service'

export const constructorService = {
    addConstructor,
}


async function addConstructor(constructorInfo) {
    try {
        console.log("fdgdf " , constructorInfo)
        // const cons = await httpService.post('auth/constructor', constructorInfo)
        await httpService.post('auth/constructor', constructorInfo)
        // return _saveLocalUser(user)
        // return cons
    } catch (err) {
        throw err
    }
}