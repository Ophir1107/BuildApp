import { httpService } from './http.service'

export const predictService = {
    onPredict,
}

async function onPredict(ImgUrl) {
    try {
        console.log('hahaha', ImgUrl);
        const label = await httpService.get('?url=/' + ImgUrl)
        let category = ''
        switch (label) {
            case ('Air conditioning'):
                category = "מיזוג אוויר"
            case ('Construction'):
                category = "בינוי"
            case ('Electricity'):
                category = "חשמל"
            case ('Plumbing'):
                category = 'אינסטלציה'
            default :
                category = ''
        }
        console.log('label' , label)
    } catch (err) {
        throw err
    }
}