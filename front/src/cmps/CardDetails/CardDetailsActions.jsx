import { Component } from 'react'
import LabelIcon from '@material-ui/icons/LocalOfferOutlined'
import CheckboxIcon from '@material-ui/icons/CheckBoxOutlined'
import CoverIcon from '@material-ui/icons/VideoLabel';
import MinusIcon from '@material-ui/icons/RemoveOutlined';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import { openPopover, closePopover } from '../../store/actions/app.actions'
import { onSaveBoard } from '../../store/actions/board.actions';
import { connect } from 'react-redux'
import { utilsService } from '../../services/utils.service'
import { boardService } from '../../services/board.service'
import { ElementOverlay } from '../Popover/ElementOverlay'
import { ReactComponent as MemberIcon } from '../../assets/img/icons/person.svg'
import { socketService } from '../../services/socket.service'
import FmdBadIcon from '@mui/icons-material/FmdBad';


class _CardDetailsActions extends Component {
    state = {
        isUrgent: '' 
    }

    componentDidMount() {
        const {isUrgent} = this.props.card
        this.setState({isUrgent})
    }

    addFile = (fileUrl) => {
        const { card, onSaveBoard, closePopover, board } = this.props
        if (!card.attachs) card.attachs = []
        const attach = {
            id: utilsService.makeId(),
            fileName: `${utilsService.makeId(12)}.jpg`,
            url: fileUrl,
            createdAt: Date.now()
        }
        // const model = await tf.loadLayersModel('../../../public/Models/Models/model.json')
        // const func = await tf.keras.model.imageDataG
        card.attachs.push(attach)
        const savedActivity = boardService.createActivity('attached', attach.fileName, card)
        socketService.emit('app newActivity', savedActivity)
        board.activities.unshift(savedActivity)
        const updatedBoard = boardService.updateCardInBoard(board, card)
        onSaveBoard(updatedBoard)
        closePopover()
    }

    joinCard = () => {
        if (this.isUserMember()) return
        const { card, loggedInUser, onSaveCardFromActions, onSaveBoard, board } = this.props
        card.members.push(loggedInUser)
        onSaveCardFromActions(card)
        const savedActivity = boardService.createActivity('הצטרף', '', card)
        socketService.emit('app newActivity', savedActivity)
        board.activities.unshift(savedActivity)
        onSaveBoard(board)
    }

    toggleArchive = () => {
        const { card, onSaveCardFromActions } = this.props
        card.isArchived = !card.isArchived;
        onSaveCardFromActions(card)
    }

    isUserMember = () => {
        const { card, loggedInUser } = this.props
        const idx = card.members.findIndex(member => member._id === loggedInUser._id)
        if (idx !== -1) return true
        return false
    }

    removeCard = () => {
        const { board, onSaveBoard, card } = this.props
        board.lists.forEach(list => {
            list.cards.forEach((boardCard, idx) => {
                if (boardCard.id === card.id) list.cards.splice(idx, 1)
            })
        })
        onSaveBoard(board)
        this.props.goBackToBoard()
    }

    onOpenPopover = (ev, PopoverName) => {
        const elPos = ev.target.getBoundingClientRect()
        const props = {
            card: this.props.card,
            addFile: this.addFile
        }
        this.props.openPopover(PopoverName, elPos, props)
    }

    onToggleUrgentTask = (ev)=>{ 
        const {card , board , onSaveCardFromActions} = this.props
        card.isUrgent = !card.isUrgent

        console.log("card.isUrgent" , card.isUrgent)
        onSaveCardFromActions(card)
        const savedActivity = boardService.createActivity('סימן משימה זו כדחופה', '', card)
        socketService.emit('app newActivity', savedActivity)
        board.activities.unshift(savedActivity)
        const updatedBoard = boardService.updateCardInBoard(board, card)
        onSaveBoard(updatedBoard)
        this.setState({isUrgent : !card.isUrgent})
    }

    setCover(){
        const {card , board} = this.props
        card.isUrgent ? card.style.coverMode = 'full' : card.style.coverMode = ''
        card.isUrgent ? card.style.bgColor = '#EB5A46' :  card.style.bgColor = '' 
        const updatedBoard = boardService.updateCardInBoard(board, card)
        onSaveBoard(updatedBoard)
    }

    render() {
        const { card, loggedInUser } = this.props
        this.setCover()
        console.log(card.isUrgent , "card is urgentt" , card.isNew , "card new? ")
        return <div className="details-actions-wrapper flex">
            {/* {!this.isUserMember() && <div className="suggested flex column"> <h4>SUGGESTED</h4>
                <button className="secondary-btn actions-btn "
                    onClick={this.joinCard}>
                    <div className="actions-btn-content flex align-center">
                        <MemberIcon />
                        <span>Join</span>
                    </div>
                </button></div>} */}
            <div className="add-section flex column">
                <h4>הוסף למשימה</h4>
                <button className="secondary-btn actions-btn "
                    onClick={(ev) =>{
                    if (loggedInUser.userType === "constructor") return
                    this.onOpenPopover(ev, 'MEMBERS')}
                    } >
                    <div className="actions-btn-content flex align-center">
                        <MemberIcon />
                        <span>אנשי צוות</span>
                    </div>
                    <ElementOverlay />
                </button>


                <button className="secondary-btn actions-btn"
                    onClick={(ev) => { 
                        if (loggedInUser.userType==='constructor') return
                        this.onOpenPopover(ev, 'LABELS')}}>
                    <div className="actions-btn-content flex align-center">
                        <LabelIcon />
                        <span>תוויות</span>
                    </div>
                    <ElementOverlay />
                </button>


                <button className="secondary-btn actions-btn"
                    onClick={(ev) => {
                        if (loggedInUser.userType === "constructor") return
                        this.onOpenPopover(ev, 'CHECKLIST')}
                        
                    } >
                    <div className="actions-btn-content flex align-center">
                        <CheckboxIcon />
                        <span>תתי משימות</span>
                    </div>
                    <ElementOverlay />
                </button>


                <button className="secondary-btn actions-btn"
                    onClick={(ev) => {
                        if (loggedInUser.userType === "constructor") return
                        this.onOpenPopover(ev, 'DATE')}
                    }>
                    <div className="actions-btn-content flex align-center">
                        <i className="far fa-clock icon-sm "></i>
                        <span>תאריך</span>
                    </div>
                    <ElementOverlay />
                </button>

                <button className="secondary-btn actions-btn"
                    onClick={(ev) => this.onOpenPopover(ev, 'ATTACH')}>
                    <div className="actions-btn-content flex align-center">
                        <i className="fas fa-paperclip icon-sm"></i>
                        <span>מסמכים</span>
                    </div>
                    <ElementOverlay />
                </button>


                <button className="secondary-btn actions-btn"
                    onClick={(ev) => {
                        if (loggedInUser.userType === "constructor") return
                        this.onOpenPopover(ev, 'COVER')}
                    } >
                    <div className="actions-btn-content flex align-center">
                        <CoverIcon />
                        <span>רקע</span>
                    </div>
                    <ElementOverlay />
                </button>
            </div>

            
            <div className="actions-section flex column">
                <h4>פעולות</h4>
                <button className="secondary-btn actions-btn" onClick={(ev) =>
                    { if (loggedInUser.userType ==='constructor') return
                    this.onToggleUrgentTask(ev)}}>
                    <div className="actions-btn-content flex align-center">
                        <FmdBadIcon className="card-preview-urgent-btn actions-btn-content " style={{color: card.isUrgent ? '#EB5A46' : '#6b778c'}} />
                        <span>משימה דחופה</span>
                    </div>
                    <ElementOverlay />
                </button>
                

                {/* <button className="secondary-btn actions-btn"
                    onClick={(ev) => this.onOpenPopover(ev, 'COPY')}>
                    <div className="actions-btn-content flex align-center">
                        <CopyIcon />
                        <span>Copy</span>
                    </div>
                    <ElementOverlay />
                </button> */}

                {!card.isArchived ?
                    <button className="secondary-btn actions-btn"
                        onClick={(ev) => {if (loggedInUser.userType === 'constructor') return
                        this.toggleArchive(ev)}}>
                        <div className="actions-btn-content flex align-center">
                            <i className="fas fa-archive icon-sm"></i>
                            <span>מחק</span>
                        </div>
                    </button>
                    :
                    <>
                        <button className="secondary-btn actions-btn"
                            onClick={this.toggleArchive} >
                            <div className="actions-btn-content flex align-center">
                                <i className="fas fa-undo icon-sm"></i>
                                <span>שחזר</span>
                            </div>
                        </button>
                        <button className="secondary-btn actions-btn danger-btn" onClick={this.removeCard} >
                            <div className="actions-btn-content  flex align-center">
                                <MinusIcon className="remove" />
                                <span>מחק</span>
                            </div>
                        </button>
                    </>}
            </div>
        </div>
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

export const CardDetailsActions = connect(mapStateToProps, mapDispatchToProps)(_CardDetailsActions)
