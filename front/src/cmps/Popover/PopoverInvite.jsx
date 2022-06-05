import { onSaveBoard } from "../../store/actions/board.actions"
import { Popover } from "./Popover"
import { Component } from 'react'
import { connect } from 'react-redux'
import { PopoverMemberPreview } from './PopoverMemberPreview'
import { userService } from '../../services/user.service'
class _PopoverInvite extends Component {

    state = {
        memberTxt: '',
        members: [],
        userType: ''

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
    get filteredMembers() {
        const { members, memberTxt ,userType} = this.state
        const regex = new RegExp(memberTxt, 'i')
        if(userType === 'all') return members.filter(member => regex.test(member.fullname)).slice(0, 10)
        if(userType === 'constructor')return members.filter(member => member.userType === 'constructor' && regex.test(member.fullname)).slice(0, 10)
    }

    addConstructorToList = (member) => {
        console.log("im trying to add to list")
        const { list , board , onSaveBoard} = this.props
        list.constructor = member
        console.log("this is list aftter add")
        onSaveBoard(board)
        // closePopover()
    }

    render() {
        const {userType} = this.state
        return <Popover title="Invite to board">
            <div className="invite-details flex column">
                <input type="text" autoFocus className="pop-over-input" onChange={this.handleChange} />
                <div className="members">
                    {/* {userType === "all" && this.filteredMembers && this.filteredMembers.map(member => <PopoverMemberPreview key={member._id} member={member}
                        toggleMember={this.addMember}  isSelected={this.isMemberInBoard(member)}  userType={userType}/>)} */}
                    {userType === "constructor" && this.filteredMembers && this.filteredMembers.map(member => <PopoverMemberPreview key={member._id} member={member}
                        addConstructorToList={this.addConstructorToList(member)} isSelected={this.isMemberInBoard(member)}  userType={userType}/>)}
                    {!userType === "constructor" && this.filteredMembers && this.filteredMembers.map(member => <PopoverMemberPreview key={member._id} member={member}
                        isSelected={this.isMemberInBoard(member)} />)}
                </div>

                <button className="primary-btn">Send invitation</button>
            </div>

        </Popover>
    }




}
function mapStateToProps(state) {
    return {
        board: state.boardModule.board,
    }
}

const mapDispatchToProps = {
    onSaveBoard
}


export const PopoverInvite = connect(mapStateToProps, mapDispatchToProps)(_PopoverInvite)