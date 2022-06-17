import { onSaveBoard , onSaveBoards , loadBoards} from "../../store/actions/board.actions"
import { Popover } from "./Popover"
import { Component } from 'react'
import { connect } from 'react-redux'
import { PopoverMemberPreview } from './PopoverMemberPreview'
import { userService } from '../../services/user.service'
import { boardService } from '../../services/board.service'
import { socketService } from '../../services/socket.service'
import { closePopover } from "../../store/actions/app.actions"
class _PopoverInvite extends Component {

    state = {
        memberTxt: '',
        members: [],
        userType: '',
        rerender : false ,

    }

    async componentDidMount() {
        const {userType} = this.props
        const members = await userService.getUsers()
        this.setState({ members , userType})
    }
    handleChange = ({ target }) => {

        this.setState({ memberTxt: target.value })
    }
    addMember = (member) => {
        const { board, onSaveBoard } = this.props
        const idx = board.members.findIndex(boardMember => boardMember._id === member._id)
        if (idx !== -1) return
        board.members.push(member)
        onSaveBoard(board)
    }

    isMemberInBoard = (member) => {
        return this.props.board.members.some(boardMember => boardMember._id === member._id)
    }
    isMemberInList = (member) => {
        return (this.props.list.constructor._id === member._id)
    }
    get filteredMembers() {
        const { members, memberTxt ,userType} = this.state
        const regex = new RegExp(memberTxt, 'i')
        if(userType === 'all') return members.filter(member => regex.test(member.fullname)).slice(0, 10)
        if(userType === 'constructor')return members.filter(member => member.userType === 'constructor' && regex.test(member.fullname)).slice(0, 10)
    }

    addConstructorToList = (member) => {

        // console.log("im trying to add to list")
        const { list , board , onSaveBoard , closePopover} = this.props
        if (list.constructor._id === member._id) return
        list.constructor = member

        // console.log("this is list aftter add")
        onSaveBoard(board)
        closePopover()
    }

    toggleMember = (member , destObject=null) => {
        this.props.loadBoards()
        let { list, card, board, boards , onSaveBoard , loadBoards ,  loggedInUser } = this.props
        console.log(member , board , "beforrre")
        if (list === destObject){
            this.addConstructorToList(member)
            return
        }
        const memberIdx = board.members.findIndex(member1 => member1._id === member._id)
        // console.log(memberIdx , "memberIdx")
        if (!memberIdx || memberIdx === -1){
            board.members.push(member)
        }
        else if(memberIdx && memberIdx!== -1){
            board.members.splice(memberIdx , 1)
        }
        if( boards.length > 0){
            const boardIdx = boards.findIndex(board1 => board1._id === board._id)
            console.log(boardIdx , "board index")
            boards[boardIdx] = board
            onSaveBoards(boards)
        }
        // boardService.save(board._id)
        // this.setState({rerender : !this.state.rerender})
        boardService.save(board)
        console.log(member , boards , "before save")
        console.log(boards , "boards")

        onSaveBoards(boards)
        socketService.emit('board newUpdate', board)
        onSaveBoard(board)
        closePopover()
        console.log(member , board , "aftererrrr")

    }

    render() {
        const {userType} = this.state
        const {list} = this.props
        return <Popover title="הזמן לפרויקט">
            <div className="invite-details flex column">
                <input type="text" autoFocus className="pop-over-input" onChange={this.handleChange} />
                <div className="members">
                    {/* {userType === "all" && this.filteredMembers && this.filteredMembers.map(member => <PopoverMemberPreview key={member._id} member={member}
                        toggleMember={this.addMember}  isSelected={this.isMemberInBoard(member)}  userType={userType}/>)} */}
                    {userType === "constructor" && this.filteredMembers && this.filteredMembers.map(member => <PopoverMemberPreview key={member._id} member={member}
                        destObject={list} toggleMember={this.toggleMember} isSelected={this.isMemberInList(member)}  userType={userType}/>)}
                    {userType === "all" && this.filteredMembers && this.filteredMembers.map(member => <PopoverMemberPreview key={member._id} member={member}
                        toggleMember={this.toggleMember} isSelected={this.isMemberInBoard(member)} />)}
                </div>

                <button className="primary-btn">שלח הזמנה</button>
            </div>

        </Popover>
    }
}


function mapStateToProps(state) {
    return {
        board: state.boardModule.board,
        boards: state.boardModule.board,
    }
}

const mapDispatchToProps = {
    onSaveBoard,
    onSaveBoards,
    closePopover,
    loadBoards
}


export const PopoverInvite = connect(mapStateToProps, mapDispatchToProps)(_PopoverInvite)