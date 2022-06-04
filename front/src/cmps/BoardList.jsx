import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { loadBoards, onSaveBoard, saveBoards } from '../store/actions/board.actions'
import { ReactComponent as BoardIcon } from '../assets/img/icons/board.svg'
import { Loader } from '../cmps/Loader'
import { boardService } from '../services/board.service'
import { connect } from 'react-redux'

class  _BoardList extends Component {
    state= {
        boards : []
    }

    componentDidMount(){
        const {boards} = this.props
        this.setState({boards})
    }
    getUserBoards(){
        const {loggedInUser , boards} = this.props
        if (loggedInUser && loggedInUser.userType === 'admin') return boards
        let userBoards = []
        for(let i=0 ; i<boards.length ; i++){
            let boardMembers = boards[i].members
            for(let j=0 ; j<boardMembers.length ; j++){
                if (loggedInUser && boardMembers[j]._id === loggedInUser._id){
                    userBoards.push(boards[i])
                }
            }
        }
        return userBoards
    }
    
    onDeleteBoard(ev, boardId){ 
        ev.preventDefault()
        let {boards} = this.props
        console.log('boards from delete' , boards)
        console.log(boards.length)
        boards = boards.filter(board => board._id !== boardId)
        this.setState({boards})
        // this.setState({boardId : ''})
        console.log(this.state.boards , "this state")
        boardService.remove(boardId)
        // this.componentDidMount()
    }
    onToggleFavorite = (ev, boardId) => {
        ev.preventDefault()
        const { boards, onSaveBoard } = this.props
        // const {boards} =this.state
        const board = boards.find(board => board._id === boardId)
        board.isFavorite = !board.isFavorite
        onSaveBoard(board)
    }

    render (){
        let boards = this.getUserBoards()
        const {loggedInUser} = this.props
        return(

        <div className="board-list">
            {boards && boards.map(board => {
                return <Link key={board._id} className="clean-link" to={`/board/${board._id}`}>
                    <div className="board-preview"
                        style={{ background: `${board.style.background} center center / cover` }}>
                        <div className="board-preview-details">
                            <h3>{board.title.length > 20 ? board.title.substring(0, 20) + '...' : board.title}</h3>
                            <span className={`far fa-star ${board.isFavorite ? 'favorite' : ''}`}
                                onClick={(ev) => this.onToggleFavorite(ev, board._id)}>
                            </span>
                            {loggedInUser && loggedInUser.userType === 'admin' && 
                            <icon
                            class={`fas fa-archive icon-sm fa-star2`}
                                onClick={(ev) => this.onDeleteBoard(ev, board._id , boards)}>
                            </icon>}
                        </div>
                    </div>
                </Link >
            })}
        </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        boards: state.boardModule.boards,
        loggedInUser: state.appModule.loggedInUser
    }
}

const mapDispatchToProps = {
    loadBoards,
    onSaveBoard,
    saveBoards

}

export const BoardList = connect(mapStateToProps, mapDispatchToProps)(_BoardList)
