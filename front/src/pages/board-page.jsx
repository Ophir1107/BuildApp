import React from 'react'
// import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { CardList } from '../cmps/board/card-list.jsx'
import { onEditBoard, onEditBoardOptimistic, loadBoard, loadBoards } from '../store/board.actions.js'
import { Add } from '../cmps/Add.jsx'
import { BoardHeader } from '../cmps/header/board-header.jsx'
import { ReactComponent as TrelloLoader } from '../assets/loader/trello-loader.svg'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { CardDetails } from '../pages/card-details.jsx'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { utilService } from '../services/util.service.js'
import { boardService } from '../services/board.service.js'
import { cardService } from '../services/card.service.js'
// import { cloudinaryService } from '../services/cloudinary-service.js'
import { socketService } from '../services/socket.service'
import { BoardDashboard } from '../pages/board-dashboard'



class _BoardPage extends React.Component {
    state = {
        list: {
            cards: [],
            title: '',
            id: utilService.makeId(5),
            createdAt: Date.now()
        },
        isAddList: false,
        board: null
    }

    componentDidMount() {
        const { boards } = this.props
        if (!boards) this.props.loadBoards()

        const boardId = this.props.match.params.boardId
        this.props.loadBoard(boardId)

        const { board } = this.props
        this.setState(prevState => ({ ...prevState, board }))

        socketService.emit('join board', boardId)
        socketService.on('update board', this.props.loadBoard)
    }

    componentDidUpdate(prevProps, prevState) {
        const { board , isLabelOpen } = this.props

        if (prevProps.board !== board || prevProps.isLabelOpen !== isLabelOpen) {
           
            ///Why need to put the board in the local state? should take updated from store
            this.setState(prevState => ({ ...prevState, board }))
        }
    }

    componentWillUnmount() {
        socketService.off('board updated')
    }

    onAddCard = (listIdx, card) => {
        let board = { ...this.props.board }
        let cardToEdit = { ...card }
        let boardToEdit = boardService.getBoardForUpdate(cardToEdit, board)
        const listTitle = board.lists[listIdx].title
        boardToEdit.lists[listIdx].cards.unshift(card)
        cardToEdit = cardService.addActivityToCard(cardToEdit , 'add' , this.props.user , null , listTitle)
        // this.props.onEditBoard(board)
        boardToEdit = boardService.addActivityToBoard(boardToEdit, cardToEdit.activity[0])
        
        this.props.onEditBoardOptimistic(boardToEdit)
        // this.props.onEditBoard(boardToEdit)
    }

    onRemoveCard = (listIdx, cardIdx) => {
        let { board } = this.props
        board.lists[listIdx].cards.splice(cardIdx, 1)
        this.props.onEditBoard(board)
    }

    onRemoveList = (listIdx) => {
        let { board } = this.props
        board.lists.splice(listIdx, 1)
        this.props.onEditBoard(board)
        // this.forceUpdate()

    }

    onAddList = (list) => {
        let { board } = this.props
        board.lists.push(list)
        this.props.onEditBoard(board)
        this.setState({ isAddList: false })
    }

    onDragEnd = (result) => {
        const { destination, source, type } = result
        const { board } = this.props
        let boardToEdit = { ...board }
        const { lists } = boardToEdit
        // console.log('lists:', lists, 'board:', board);
        if (!destination) return
        const droppableIdStart = source.droppableId
        const droppableIdEnd = destination.droppableId
        const droppableIdxStart = source.index
        const droppableIdxEnd = destination.index

        //Dragging lists around (Must be first in list for other if statments not to happen)
        if (type === 'list') {
            const list = lists.splice(droppableIdxStart, 1)
            lists.splice(droppableIdxEnd, 0, ...list)
            boardToEdit.lists = lists
            this.props.onEditBoardOptimistic(boardToEdit)
            return
        }

        //In the same list
        if (droppableIdStart === droppableIdEnd) {
            const list = lists.find(list => droppableIdStart === list.id)
            const card = list.cards.splice(droppableIdxStart, 1)
            list.cards.splice(droppableIdxEnd, 0, ...card)
            const listIdx = lists.indexOf(list)
            lists[listIdx] = list
        }

        //Other list
        if (droppableIdStart !== droppableIdEnd) {
            //Find the list where drag happend
            const listStart = lists.find(list => droppableIdStart === list.id)
            //Pull out the card from the list
            const card = listStart.cards.splice(droppableIdxStart, 1)
            //find the list where the drag ended
            const listEnd = lists.find(list => droppableIdEnd === list.id)
            //Put the card in the new list
            listEnd.cards.splice(droppableIdxEnd, 0, ...card)
            const listStartIdx = lists.indexOf(listStart)
            const listEndIdx = lists.indexOf(listEnd)
            lists[listStartIdx] = listStart
            lists[listEndIdx] = listEnd
        }


        board.lists = lists
        this.props.onEditBoardOptimistic(board)
    }

    render() {
        const { board } = this.props
        let { list } = this.state
        if (!board) return <div className="trello-loader"> <TrelloLoader /> </div>

        return (
            <Router>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {/* <section className={`board-page flex column `} style={{ background: board.style.cover.isImage ? `${board.style.cover} center center / cover` : board.style.cover }} onClick={this.onCloseAdd}> */}
                    {/* <section className={`board-page flex column `} style={{ background: `${board.style.cover} center center / cover` }} onClick={this.onCloseAdd}> */}
                    <section className={`board-page flex column `} onClick={this.onCloseAdd}>
                        <BoardHeader board={board} />
                        <Droppable droppableId='all-lists' direction='horizontal' type='list'>
                            {provided => (
                                <div
                                    className="list-container flex"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {board.lists.map((list, idx) =>
                                        <CardList
                                            list={list}
                                            key={list.id}
                                            listIdx={idx}
                                            onAddCard={this.onAddCard}
                                            onRemoveCard={this.onRemoveCard}
                                            onAddList={this.onAddList}
                                            onRemoveList={this.onRemoveList}
                                        />)}
                                    {provided.placeholder}
                                    <div className="list-wrapper">

                                        <Add
                                            onAdd={this.onAddList}
                                            list={list}
                                        ></Add>
                                    </div>
                                </div>
                            )}
                        </Droppable>
                        <section className="nested-routes">
                            <Route path="/board/:boardId/:listId/:cardId" component={CardDetails} />
                            <Route path="/board/:boardId/dashboard" component={BoardDashboard} />
                        </section>
                    </section>
                </DragDropContext>
            </Router >
        )
    }
}


function mapStateToProps(state) {
    return {
        board: state.boardModule.board,
        isLabelOpen: state.boardModule.isLabelOpen,
        user: state.userModule.user

    }
}
const mapDispatchToProps = {
    loadBoards,
    onEditBoard,
    onEditBoardOptimistic,
    loadBoard
}


export const BoardPage = connect(mapStateToProps, mapDispatchToProps)(_BoardPage)