import { Component } from "react";
import { Popover } from "./Popover";
import { openPopover, closePopover } from '../../store/actions/app.actions'
import { onSaveBoard } from '../../store/actions/board.actions';
import { connect } from 'react-redux'

class _PopoverListMenu extends Component{

    onDeleteList=()=>{
        const {currList,onSaveBoard,board,closePopover}=this.props
        currList.isArchived=true;
        board.lists=board.lists.filter((list=> list.id!==currList.id))
        onSaveBoard(board)
        closePopover()
    }

    onOpenPopover = (ev, PopoverName) => {
        const elPos = ev.target.getBoundingClientRect()
        const props = {
            userType: 'constructor',
            list : this.props.currList
        }
        this.props.openPopover(PopoverName, elPos, props)
    }

    toggleConstructor = () => {
        const { board, onSaveBoard , currList , closePopover } = this.props
        currList.constructor = {}
        onSaveBoard(board)
        closePopover()

    }

    render(){
        const {currList} = this.props
        return <Popover title="List actions" togglePopover={this.props.toggleMenu}>
            <ul className="list-menu-content clean-list">
            {!currList.constructor.fullname && <li onClick={(ev) => this.onOpenPopover(ev, 'INVITE')}>הוסף קבלן</li>}
            {currList.constructor.fullname && <li onClick={this.toggleConstructor}>הסר קבלן</li>}
                <li onClick={this.onDeleteList}>מחק רשימה</li>
            </ul>
        </Popover>
    }
}

const mapDispatchToProps = {
    openPopover,
    closePopover,
    onSaveBoard
}

export const PopoverListMenu = connect(null, mapDispatchToProps)(_PopoverListMenu)

