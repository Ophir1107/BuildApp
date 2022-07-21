import { utilsService } from './utils.service'
import { socketService } from './socket.service'
import { httpService } from './http.service'
import { userService } from './user.service'


export const boardService = {
    query,
    remove,
    getById,
    save,
    updateCardInBoard,
    createActivity,
    setPopoverPos,
    removeCard,
    getFilteredList,
    addActivityToBoard,
    addActivityToCard,
    deleteNotifications,
    attachFileToCard,
    addCardToBoardOnPredict
}

async function query(filterBy = { ctg: '' }) {
    try {
        return await httpService.get('board', filterBy)
    } catch (err) {
        throw err
    }
}

async function remove(boardId) {
    try {
        await httpService.delete(`board/${boardId}` , boardId)
    } catch (err) {
        console.log(err, "err") 
        throw err
    }
}

async function getById(boardId) {
    try {
        return await httpService.get(`board/${boardId}`)

    } catch (err) {
        throw err
    }
}

async function save(board) {
    if (board._id) {
        try {
            return await httpService.put(`board/${board._id}`, board)
        } catch (err) {
            throw err
        }
    } else {
        try {
            return await httpService.post('board', board)
        } catch (err) {
            throw err
        }
    }
}

// sync functions 

export function updateCardInBoard(board, updatedCard) {
    board.lists.forEach(list => {
        list.cards.forEach((card, idx) => {
            if (card.id === updatedCard.id) list.cards[idx] = updatedCard
        })
    })
    return { ...board }
}

export function createActivity(actionType, txt = '', card = null , board=null) {

    const loggedInUser = userService.getLoggedinUser()

    const { _id, fullname, imgUrl } = loggedInUser

    const byMember = {
        _id,
        fullname,
        imgUrl
    }


    let savedCard
    if (card) {
        savedCard = {
            id: card.id,
            title: card.title,
            members: card.members
        }
    }

    const savedActivity = {
        id: utilsService.makeId(),
        actionType,
        txt,
        createdAt: Date.now(),
        byMember,
        card: savedCard || null,
        cardTitle : savedCard.title || null,
        members : board ? board.members : null
    }
    return savedActivity
}

function getFilteredList(listToFilter, filter) {
    const list = JSON.parse(JSON.stringify(listToFilter))

    list.cards = list.cards.filter(card => {
        let isInLabels = true;
        let isInMembers = true;
        if (filter.labels.length) {
            isInLabels = filter.labels.some(label => card.labelIds.some(labelId => labelId === label.id))

        }
        if (filter.members.length) {
            isInMembers = filter.members.some(memberFilter => card.members.some(member => memberFilter._id === member._id))
        }
        const regex = new RegExp(filter.txt, 'i')

        return !card.isArchived && isInMembers && isInLabels && regex.test(card.title)
    })
    return list
}

function setPopoverPos(pos, elRect, diff = 38) {
    let { left, top } = pos
    top += diff
    const { height, width } = elRect
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    if (left + width > viewportWidth) left = viewportWidth - width - 10
    if (top + height > viewportHeight) top = viewportHeight - height - 10
    return { left, top, width }
}

function removeCard(board, card) {
    board.lists.forEach(list => {
        if (list.cards.some(boardCard => boardCard.id === card.id))
            list.cards = list.cards.filter(boardCard => boardCard.id !== card.id)
    })
    return { ...board }
}

function addActivityToCard(card , actionType , byMember , txt=null , member=null , listTitle=null){
    !card.activity ? 
    card.activity = [
        { 
            id : utilsService.makeId(5) ,
            byMember : {...byMember} ,
            actionType ,
            member : {...member},
            createdAt : Date.now(),
            cardTitle : card.title,
            listTitle,
            txt
        }
    ]
    :
    card.activity.unshift({ 
        id : utilsService.makeId(5) ,
        byMember : {...byMember} ,
        actionType ,
        member : {...member} ,
        createdAt : Date.now(),
        cardTitle : card.title ,
        listTitle,
        txt
    }) 
    return card
}

function addActivityToBoard(board, activity=null) {
    let boardToEdit = { ...board }
    boardToEdit.activities.unshift(activity)
    board.members.forEach(member => {
        if(member._id !== activity.byMember._id){
            if(!member.notificationNum) member.notificationNum = 0
            member.notificationNum++
        }
    })
    return boardToEdit
}

function deleteNotifications(board, user) {
    let boardToEdit = { ...board }
    // boardToEdit.activities.unshift(activity)
    board.members.forEach(member => {
        if(member._id !== user._id){
            member.notificationNum = 0
        }
    })
    return boardToEdit
}

function attachFileToCard(board , card , fileUrl){
    // let updatedBoard = { ...board}


    // this.props.addFile(fileUrl)

    console.log(fileUrl , "fileUrl board service" )
    if (!card.attachs) card.attachs = []
    const attach = {
        id: utilsService.makeId(),
        fileName: `${utilsService.makeId(12)}.jpg`,
        url: fileUrl,
        createdAt: Date.now()
    }
    card.attachs.push(attach)
    card.style.bgImgUrl = fileUrl.url
    console.log(fileUrl , "img url")
    card.style.bgColor = ''
    const savedActivity = createActivity('attached', attach.fileName, card)
    socketService.emit('app newActivity', savedActivity)
    console.log(board , "board before activities")
    board.activities.unshift(savedActivity)
    board = updateCardInBoard(board, card)
    
    return board
}

function addCardToBoardOnPredict(board , card , predictLabel){
    let label = utilsService.getLabel(predictLabel)
    const listIdx =board.lists.findIndex(list => list.title===label) 
    board.lists[listIdx].cards.push(card)
    return board
}

