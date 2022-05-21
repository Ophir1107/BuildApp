import { httpService } from './http.service'

export const constructorService = {
    addConstructor,
}


async function addConstructor(constructorInfo) {
    try {
        console.log('cons cons cons', constructorInfo)
        const user = await httpService.post('auth/addconstructor', constructorInfo)
        // return _saveLocalUser(user)
    } catch (err) {
        throw err
    }
}