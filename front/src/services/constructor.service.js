import { httpService } from './http.service'

export const userService = {
    addConstructor,
}


async function addConstructor(constructorInfo) {
    try {
        const user = await httpService.post('auth/signup', constructorInfo)
        // return _saveLocalUser(user)
    } catch (err) {
        throw err
    }
}