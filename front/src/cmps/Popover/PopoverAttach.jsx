import { Component } from "react"
import { FileUpload } from "../FileUpload"
import { Popover } from "./Popover"
import { utilsService } from '../../services/utils.service'
import { boardService } from '../../services/board.service'
import { socketService } from '../../services/socket.service'
import { cloudinaryService } from '../../services/cloudinary.service'
import { predictService } from "../../services/predict.service"
import { openPopover, closePopover  } from '../../store/actions/app.actions'
import { onSaveBoard } from '../../store/actions/board.actions'
import { connect } from 'react-redux'

class _PopoverAttach extends Component {

    state = {
        file: null,
        link: null,
        formData: null,
        linkTxt: '',
        predictLabel : ''

    }

    handleChange = ({ target }) => {

        console.log("image attached" , this.state.linkTxt , "hgfhgfj")
        this.setState({ linkTxt: target.value })
        console.log("image attached " , this.state.linkTxt , "hgfhgfj")
        return target.value
    }



    get getCard (){
        const { loggedInUser } = this.props
        return {
            id: utilsService.makeId(),
            title: `ריג'קט חדש שנוסף על ידי  ${loggedInUser.fullname} `,
            description: '',
            comments: [],
            checklists: [],
            members: [],
            byMember: loggedInUser, 
            labelIds: [],
            createdAt: Date.now(),
            startDate: 0,
            dueDate: 0,
            attachs: [],
            isReject: true,
            isUrgent: false,
            isNew: true ,
            style: {
                coverMode: 'full',
                bgColor: 'red'
            }
        }
    }

    onAttachLink = (ev=null , fileUrl=null) => {
        const {card , board , onClosePopover, onSaveBoard , onOpenPopover , loggedInUser } = this.props
        console.log(board , "שלום")
        if (ev) ev.preventDefault()
        console.log("taget from eve" , this.state.linkTxt)
        // let predictLabel = ''
        if (!this.state.linkTxt && !fileUrl) return
        if (!fileUrl) fileUrl = this.state.linkTxt
        console.log("this.state.linkTxt after if " , fileUrl)
        if(!card){
            let newCard = this.getCard
            let newBoard = null
            const predictLabel = predictService.onPredict(fileUrl).then(predictLabel => {
                console.log(predictLabel, predictLabel)
                if(!predictLabel) return
                console.log(predictLabel , "pred")
                newBoard =  boardService.addCardToBoardOnPredict(board , newCard , predictLabel)
                onSaveBoard(newBoard)
                console.log(newBoard , "newBoard 1")
            
            }).then( () => {cloudinaryService.uploadFile(ev).then(result => {
                console.log(result , "target value")
                console.log(newBoard , "newBoard ")
                const updatedBoard = boardService.attachFileToCard(newBoard , newCard , result)
                onSaveBoard(updatedBoard)
    
            })})
            // const predictLabel = 'Air conditioning'
            // console.log(predictLabel , "pred")
            // let newBoard =  boardService.addCardToBoardOnPredict(board , newCard , predictLabel  )
            // onSaveBoard(newBoard)
        }
        else{
            cloudinaryService.uploadFile(ev).then(result => {
                this.addFile(result)
            })
        }
        closePopover()
    }

    // attachFileToCard = (card , fileUrl) => {
    //     const isValid = utilsService.isValidUrl(fileUrl)
    //     if (isValid) {
    //     // this.props.addFile(fileUrl)
    //         if (!card.attachs) card.attachs = []
    //         const attach = {
    //             id: utilsService.makeId(),
    //             fileName: `${utilsService.makeId(12)}.jpg`,
    //             url: fileUrl,
    //             createdAt: Date.now()
    //         }
    //         card.attachs.push(attach)
    //         const savedActivity = boardService.createActivity('attached', attach.fileName, card)
    //         socketService.emit('app newActivity', savedActivity)
    //         board.activities.unshift(savedActivity)
    //         const updatedBoard = boardService.updateCardInBoard(board, card)
    //         onSaveBoard(updatedBoard)
    //         closePopover()
    //     }
    // }

    // async getPred ( txt )  {
    //     const pred = await 
    //     return pred
    // }


    isImage(url) {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    }

    onFileUpload = (fileUrl , ev) => {
        this.setState({ linkTxt : fileUrl });
        console.log(this.state.linkTxt , "url from onFileUp");
        this.onAttachLink(ev , fileUrl)
        // this.props.addFile(fileUrl)
        // this.addFile(fileUrl);
    }

    addFile = (fileUrl) => {
        const { card, onSaveBoard, closePopover, board } = this.props
        // let card = this.getCard
        if (!card.attachs) card.attachs = []
        const attach = {
            id: utilsService.makeId(),
            fileName: `${utilsService.makeId(12)}.jpg`,
            url: fileUrl,
            createdAt: Date.now()
        }
        card.attachs.push(attach)
        const savedActivity = boardService.createActivity('attached', attach.fileName, card)
        socketService.emit('app newActivity', savedActivity)
        board.activities.unshift(savedActivity)
        const updatedBoard = boardService.updateCardInBoard(board, card)
        onSaveBoard(updatedBoard)
        closePopover()
    }

    render() {
        let { inputTxt } = this.state
        return <Popover title="הוסף מ...">
            <div className="attach-pop-over-content">
                <FileUpload onFileUpload={this.onFileUpload} />
                <form onSubmit={this.onAttachLink}>
                    <label className="pop-over-label" htmlFor="attach-input">הוסף קישור</label>
                    <input type="text" className="pop-over-input" value={inputTxt} id="attach-input"
                        onChange={this.handleChange} placeholder="הוסף כל לינק כאן..." />
                    <button className="primary-btn btn-wide">הוסף</button>
                </form>
            </div>
        </Popover>
    }

}

function mapStateToProps(state) {
    return {
        board: state.boardModule.board,
        currPopoverName: state.appModule.currPopover.name,
        loggedInUser: state.appModule.loggedInUser
    }
}

const mapDispatchToProps = {
    openPopover,
    closePopover,
    onSaveBoard
}

export const PopoverAttach = connect(mapStateToProps, mapDispatchToProps)(_PopoverAttach)
