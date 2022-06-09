import { Component } from 'react'
import { connect } from 'react-redux'
import { ScreenOverlay } from "../ScreenOverlay";
import { ColorPalette } from "../ColorPalette";
import { closePopover } from "../../store/actions/app.actions";
import { onSaveBoard } from "../../store/actions/board.actions";
import { withRouter } from 'react-router-dom';
import { utilsService } from '../../services/utils.service'
class _PopoverCreateBoard extends Component {

    state = {
        title: '',
        color: ''
    }
    componentDidMount() {

        this.setState({ color: '#718C9C' }) //new board color
    }

    handleChange = ({ target }) => {
        const { name, value } = target
        this.setState({ [name]: value })
    }

    onCreateBoard = async () => {
        console.log("im creating new board ")
        const { title, color } = this.state
        const { loggedInUser, onSaveBoard, closePopover } = this.props
        const boardToSave = {
            title,
            background: color,
            createdBy: loggedInUser,
            lists : [{
                id: utilsService.makeId(),
                title: 'מיזוג אוויר',
                cards: []
            },{
                id: utilsService.makeId(),
                title: 'בינוי',
                cards: []
            },{
                id: utilsService.makeId(),
                title: 'חשמל',
                cards: []
            },{
                id: utilsService.makeId(),
                title: 'אינסטלציה',
                cards: []
            },{
                id: utilsService.makeId(),
                title: 'משימות כלליות',
                cards: []
            }]
        }
        console.log(boardToSave , "boardToSave")
        try {
            await onSaveBoard(boardToSave)
            if (this.props.board) this.props.history.push(`/board/${this.props.board._id}`)
            closePopover()
        } catch (err) {
            console.log('could Not Load Board')
        }
    }

    render() {
        const { title, color } = this.state
        const { closePopover } = this.props
        return <ScreenOverlay goBack={closePopover} styleMode="darken">
            <div className="create-board-popover">
                <div className="flex">
                    <div className="board-preview" style={{ background: color }}>
                        <input type="text" name="title" value={title}
                            onChange={this.handleChange} placeholder="הוסף שם לפרויקט" />
                    </div>
                    <div className="create-preview-colors">
                        <ColorPalette count={6} isGradient={true} handleChange={this.handleChange} selectedColor={color} />
                        <ColorPalette count={3} isGradient={false} handleChange={this.handleChange} selectedColor={color} />
                    </div>
                </div>
                <button className={`primary-btn ${title ? '' : 'disabled'}`} onClick={this.onCreateBoard}>צור פרויקט</button>
            </div>
        </ScreenOverlay>
    }
}

function mapStateToProps(state) {
    return {
        loggedInUser: state.appModule.loggedInUser,
        board: state.boardModule.board
    }
}

const mapDispatchToProps = {
    closePopover,
    onSaveBoard
}

export const PopoverCreateBoard = connect(mapStateToProps, mapDispatchToProps)(withRouter(_PopoverCreateBoard))