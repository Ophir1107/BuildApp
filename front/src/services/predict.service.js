import { httpService } from './http.service'

export const predictService = {
    onPredict,
}

async function onPredict(ImgUrl) {
    try {
        console.log('hahaha', ImgUrl);
        const label = await httpService.get('?url=/' + ImgUrl)
        // let category = ''
        // if (label.includes("condi")) {
        //     // case ('Air conditioning'):
        //     category = "מיזוג אוויר"
            
        //     if (label.includes("onst")) {
        //     // case ('Construction'):
        //         category = "בינוי"
        //     }
        //     if (label.includes("ectr")) {
        //         // case ('Electricity'):
        //         category = "חשמל"
        //     }
        //     if (label.includes("lumb")) {
        //     // case ('Plumbing'):
        //         category = 'אינסטלציה'
        //     }
        //     // default :
        //     //     category = ''
        // }

        
        // switch (label) {
        //     case ('Air conditioning'):
        //         category = "מיזוג אוויר"
        //     case ('Construction'):
        //         category = "בינוי"
        //     case ('Electricity'):
        //         category = "חשמל"
        //     case ('Plumbing'):
        //         category = 'אינסטלציה'
        //     default :
        //         category = ''
        // }
        // console.log(category , "עגכגכעגכעכדגע")
        return label
    } catch (err) {
        throw err
    }
}