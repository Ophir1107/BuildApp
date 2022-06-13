import { httpService } from './http.service'

export const constructorService = {
    addConstructor,
    getConstructors,
    deleteConstructors,
}


async function addConstructor(constructorInfo) {
    try {
        await httpService.post('auth/constructor', constructorInfo)
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
async function deleteConstructors(constructorId) {
    try {
        await httpService.delete(`constructor/${constructorId}` , constructorId)
    } catch (err) {
        throw err
    }
}
