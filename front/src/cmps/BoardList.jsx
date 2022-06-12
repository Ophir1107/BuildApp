import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { loadBoards, onSaveBoard, onSaveBoards } from '../store/actions/board.actions'
import { ReactComponent as BoardIcon } from '../assets/img/icons/board.svg'
import { Loader } from '../cmps/Loader'
import { boardService } from '../services/board.service'
import { connect } from 'react-redux'

class  _BoardList extends Component {
    state= {
        boards : [] ,
        // isFavorite : false
    }

    componentDidMount(){
        const {boards} = this.props
        this.setState({boards})
    }
    // getUserBoards(){
    //     const {loggedInUser } = this.props
    //     let { boards} =this.state
    //     if (!boards) boards = this.props.boards
    //     if (loggedInUser && loggedInUser.userType === 'admin') return boards
    //     let userBoards = []
    //     for(let i=0 ; i<boards.length ; i++){
    //         let boardMembers = boards[i].members
    //         for(let j=0 ; j<boardMembers.length ; j++){
    //             if (loggedInUser && boardMembers[j]._id === loggedInUser._id){
    //                 userBoards.push(boards[i])
    //             }
    //         }
    //     }
    //     return userBoards
    // }

    // get favoriteBoards() {
    //     const boards = this.getUserBoards
    //     console.log(boards.filter(board => board.isFavorite === true) , "favaorite")
    //     return boards.filter(board => board.isFavorite === true)
    // }

    get getUserBoards(){
        const {loggedInUser } = this.props
        let { boards} =this.props
        if (!boards) boards = this.props.boards
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
        this.setState({boards : userBoards})
        return userBoards
    }
    
    onDeleteBoard =(ev, boardId) =>{ 
        ev.preventDefault()
        let {boards , onSaveBoards} = this.props
        console.log('boards from delete' , boards)
        console.log(boards.length)
        boards = boards.filter(board => board._id !== boardId)
        this.setState({boards})
        // this.setState({boardId : ''})
        console.log(boards , "this state")
        boardService.remove(boardId)
        onSaveBoards(boards)
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

        const {loggedInUser} = this.props
        let {boards , isFavorite} = this.state
        // if ( isFavorite){ boards = this.getFavoriteBoards
        // console.log(boards, "get board list from state")
        // }
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
    onSaveBoards

}

export const BoardList = connect(mapStateToProps, mapDispatchToProps)(_BoardList)
