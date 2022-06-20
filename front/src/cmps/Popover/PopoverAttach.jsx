import { Component } from "react"
import { FileUpload } from "../FileUpload"
import { Popover } from "./Popover"
import { utilsService } from '../../services/utils.service'
import { boardService } from '../../services/board.service'
import { socketService } from '../../services/socket.service'
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

    getLabel = (label) => {
                let category = ''
        if (label.includes("condi")) {
            // case ('Air conditioning'):
            category = "מיזוג אוויר"
        }
        if (label.includes("onst")) {
        // case ('Construction'):
            category = "בינוי"
        }
        if (label.includes("ectr")) {
            // case ('Electricity'):
            category = "חשמל"
        }
        if (label.includes("lumb")) {
        // case ('Plumbing'):
            category = 'אינסטלציה'
        }
        return category
    }

    get getCard (){
        const { loggedInUser } = this.props
        return {
            id: utilsService.makeId(),
            title: `ריג'קט חדש שנוסף על ידי  ${loggedInUser} `,
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
            isUrgent: true,
            isNew: true ,
            style: {
                coverMode: 'full',
                bgColor: 'red'
            }
        }
    }

    onAttachLink =(ev) => {
        const { board , onClosePopover, onSaveBoard , onOpenPopover , loggedInUser } = this.props
        console.log(board , "שלום")
        ev.preventDefault()
        console.log("taget from eve" , this.state.linkTxt)
        let predictLabel = ''
        if (!this.state.linkTxt) return
        console.log("this.state.linkTxt after if " , this.state.linkTxt)
        let card = this.getCard
        predictLabel = predictService.onPredict(this.state.linkTxt)
        .then(predictLabel => {
            if(!predictLabel) return
            console.log(predictLabel , "pred")
            predictLabel = this.getLabel(predictLabel)
            board.lists.forEach(list => console.log(list.title , "list titl;e") );

            
            board.lists[0].cards.push(card)
            onSaveBoard(board)
            // this.setState({ titleTxt: '' }, () => {
            //     this.textArea.focus()
            // })
        })
        
        //     this.props.onClosePopover()
        // }
        // this.props.openPopOver()
        const isValid = utilsService.isValidUrl(this.state.linkTxt)
        if (isValid) {
            // this.props.addFile(this.state.linkTxt)
            if (!card.attachs) card.attachs = []
            const attach = {
                id: utilsService.makeId(),
                fileName: `${utilsService.makeId(12)}.jpg`,
                url: this.state.linkTxt,
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
    }

    // async getPred ( txt )  {
    //     const pred = await 
    //     return pred
    // }


    isImage(url) {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    }

    onFileUpload = (fileUrl) => {
        this.props.addFile(fileUrl)
    }

    render() {
        let { inputTxt } = this.state
        return <Popover title="הוסף מ...">
            <div className="attach-pop-over-content">
                <FileUpload onFileUpload={this.onFileUpload} />
                <form onSubmit={this.onAttachLink}>
                    <label className="pop-over-label" htmlFor="attach-input">הוסף קישור</label>
                    <input type="text" className="pop-over-input" value={inputTxt} id="attach-input"
                        onChange={this.handleChange} placeholder="הוסף לינק כאן..." />
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
