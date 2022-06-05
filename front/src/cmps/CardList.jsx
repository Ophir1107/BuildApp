import { Component } from 'react'
import { connect } from 'react-redux'
import { boardService } from '../services/board.service'
import { CardPreview } from './CardPreview/CardPreview'
import { CardAdd } from './CardAdd'
import { ReactComponent as AddIcon } from '../assets/img/icons/add.svg'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { openPopover, closePopover } from '../store/actions/app.actions'
import { ProfileAvatar } from './ProfileAvatar'

export class _CardList extends Component {

    state = {
        isEditTitle: false,
        titleTxt: '',
        isAddCardOpen: false,
        isRejectDisplay: false,
    }

    toggleEditTitle = () => {
        const { isEditTitle } = this.state
        const { currList } = this.props
        this.setState({ isEditTitle: !isEditTitle, titleTxt: currList.title });
    }

    onSaveTitle = () => {
        this.toggleEditTitle();
        const { titleTxt } = this.state
        const { board, currList, onSaveBoard } = this.props
        const listIdx = board.lists.findIndex(list => list.id === currList.id)
        board.lists[listIdx].title = titleTxt
        onSaveBoard(board)
    }

    toggleCardAdd = () => {
        const { isAddCardOpen } = this.state
        this.setState({ isAddCardOpen: !isAddCardOpen })
    }

    toggleDisplay = () =>{
        const {currList} = this. props
        if (currList.cards.length <=0 ) return
        const { isRejectDisplay } = this.state
        console.log("is reject display" , isRejectDisplay)
        this.setState({ isRejectDisplay: !isRejectDisplay })
    }

    handleChange = (ev) => {
        if (ev.key === 'Enter') {
            this.onSaveTitle()
            return
        }
        const { value } = ev.target;
        this.setState({ titleTxt: value });
    }

    get filteredList() {
        const {isRejectDisplay} = this.state
        const { currList, filterBy } = this.props
        if (!currList) return null
        let list = {}
        list = boardService.getFilteredList(currList, filterBy)
        console.log(list.cards.length , "list" , isRejectDisplay)
        if(!isRejectDisplay && list.cards.length > 0) return list
        if(isRejectDisplay && list.cards.length > 0) {
            list.cards = list.cards.filter( (card) => card.isReject === true)
            return list
        }
        return []
    }

    onOpenPopover = (ev, PopoverName) => {
        const elPos = ev.target.getBoundingClientRect()
        const { board, currList, onSaveBoard, closePopover } = this.props
        const props = {
            currList,
            board,
            onSaveBoard,
            closePopover,
            member : currList.constructor
        }
        this.props.openPopover(PopoverName, elPos, props)
    }


    render() {
        const { board, currList, onSaveBoard, currListIdx } = this.props
        const { isEditTitle, isAddCardOpen, titleTxt , isRejectDisplay } = this.state
        console.log(this.filteredList.cards , "list to display")
        return (
            <Draggable draggableId={currList.id} index={currListIdx}>
                {provided => (
                    <div className="card-list-wrapper" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                        <Droppable droppableId={currList.id}>
                            {provided => (
                                <div className="card-list" ref={provided.innerRef} {...provided.droppableProps}>
                                    <div className="card-list-header">
                                        {isEditTitle ?
                                            <input type="text" className="card-list-header-input" value={titleTxt} autoFocus
                                                onFocus={(ev) => ev.target.select()} onBlur={this.onSaveTitle}
                                                onChange={this.handleChange} onKeyDown={this.handleChange} />
                                            :
                                            <h2 onClick={this.toggleEditTitle}>{currList.title}</h2>
                                        }
                                        <button className="board-btn" onClick={this.toggleDisplay}>
                                            <span>R</span>
                                        </button>
                                        {currList.constructor.fullname && <ProfileAvatar key={currList.constructor._id} member={currList.constructor}
                                onClick={(ev) =>this.onOpenPopover(ev, 'PROFILE')} size={32} showStatus={true} />}
                                        <div onClick={(ev) => this.onOpenPopover(ev, 'LIST_MENU')} className="card-list-btn-menu">
                                            <i className="fas fa-ellipsis-h"></i>
                                        </div>
                                    </div>
                                    <div className="card-list-cards" ref={(cards) => { this.elCardsContainer = cards }}>
                                        {!isRejectDisplay && this.filteredList.cards && this.filteredList.cards.map((card, idx) => 
                                            <CardPreview key={card.id} card={card}
                                            cardIdx={idx} currList={currList} board={board}
                                            onSaveBoard={onSaveBoard} />)}
                                        {isRejectDisplay && this.filteredList!==[] &&  this.filteredList.cards.map((card, idx) =>                      
                                            <CardPreview key={card.id} card={card}
                                            cardIdx={idx} currList={currList} board={board}
                                            onSaveBoard={onSaveBoard} />)}
                                        {isAddCardOpen &&
                                            <CardAdd board={board} currList={currList} onSaveBoard={onSaveBoard}
                                                toggleCardAdd={this.toggleCardAdd} elCardsContainer={this.elCardsContainer} />
                                        }
                                        {provided.placeholder}
                                    </div>
                                    {!isAddCardOpen &&
                                        <div className="card-list-footer" onClick={this.toggleCardAdd}>
                                            <AddIcon /> Add {currList.cards.length > 1 ? 'another' : ''} card
                                        </div>
                                    }
                                </div>
                            )}
                        </Droppable>
                    </div>
                )}
            </Draggable>
        )
    }
}

const mapDispatchToProps = {
    openPopover,
    closePopover
}

export const CardList = connect(null, mapDispatchToProps)(_CardList)





