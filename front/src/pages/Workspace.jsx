 
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { loadBoards, onSaveBoard, saveBoards } from '../store/actions/board.actions'
import { BoardList } from '../cmps/BoardList'
import { ReactComponent as BoardIcon } from '../assets/img/icons/board.svg'
import { Loader } from '../cmps/Loader'
import { boardService } from '../services/board.service'

class _Workspace extends Component {
    state = {
        boards: [] ,
    }

    componentDidMount() {
        this.props.loadBoards()
        const {boards} = this.props
        this.setState({ boards })
    }

    get favoriteBoards() {
        const { boards } = this.props
        return boards.filter(board => board.isFavorite)
    }



    onRemoveBoard = (ev, boardId) => {
        ev.preventDefault()
        const { boards, removeBoard } = this.props
        const board = boards.find(board => board._id === boardId)
        deleteBoard(boardId)
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
        this.setState({boardId : ''})
        return userBoards
    }

    onDeleteBoard(ev, boardId , oldBoards){
        ev.preventDefault()
        let boards = oldBoards
        let newBoards = []
        console.log(boards.length)
        boardService.remove(boardId)
        newBoards = boards.filter(board => board._id !== boardId)
        boards = newBoards
        this.props.boards = boards


        // let boards = []
        // console.log(boards.length)
        // this.setState(boards)
        // let {constructors} = this.state
        // let newConstructors = []
        // newConstructors = constructors.filter(constructor => constructor._id !== constructorId)
        // console.log(constructors.length)
        // constructorService.deleteConstructors(constructorId)
        // constructors = newConstructors
        // this.setState({constructors})
    }

    render() { 
        // let boards = this.getUserBoards()
        const {loggedInUser} = this.props
        return (
            <section className="workspace-container flex align-flex-start justify-center ">
                <div className="boards-wrapper flex column">
                    <div className="boards-preview flex column">
                        <div className="preview-title flex align-center">
                            <i className="far fa-star"></i>
                            <h3>פרויקטים מסומנים</h3>
                        </div>
                        <BoardList onToggleFavorite={this.onToggleFavorite} boards={this.favoriteBoards} />
                    </div>
                    <div className="boards-preview">
                        <div className="preview-title flex align-center">
                            <BoardIcon />
                            <h3>פרויקטים</h3>
                        </div>
                        <BoardList onToggleFavorite={this.onToggleFavorite}   />
                    </div>
                </div>
            </section>
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

export const Workspace = connect(mapStateToProps, mapDispatchToProps)(_Workspace)
