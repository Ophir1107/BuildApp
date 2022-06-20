import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { boardService } from '../../services/board.service';
import { closePopover } from '../../store/actions/app.actions';
import { connect } from 'react-redux';
import { onSaveBoard } from '../../store/actions/board.actions';
import React, { Component } from 'react';
import { Popover } from './Popover';
class _PopoverDate extends Component {

    state = {
        date: null
    }

    componentDidMount() {
        const date = this.props.card.dueDate ? new Date(this.props.card.dueDate).toLocaleString() : new Date()
        this.setState({ date })
    }


    handleChange = (ev) => {
        this.setState({ date: ev._d })
    }

    saveDueDate = (date) => {
        const { card, onSaveBoard, closePopover, board, loggedInUser } = this.props
        card.dueDate = date ? Date.parse(date) : 0;
        const txt = new Date(date).toLocaleString('en-GB', { month: 'short', day: 'numeric' })
        const cardToEdit = boardService.addActivityToCard(card , 'changed-date',loggedInUser , txt)
        // this.props.onEditBoard(board)
        const boardToEdit = boardService.addActivityToBoard(board, cardToEdit.activity[0])
        // const savedActivity = boardService.addActivityToCard(card , 'changed-date',loggedInUser , txt)
        const updatedBoard = boardService.updateCardInBoard(boardToEdit, cardToEdit)
        onSaveBoard(updatedBoard)
        closePopover()
    }

    onRemoveDate = () => {
        this.saveDueDate(null)
    }

    render() {
        const { date } = this.state
        if (!date) return ''//loading
        return <Popover title="תאריך">
            <div className="date-pop-over-content">

                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                        autoOk
                        variant="static"
                        openTo="date"
                        value={date}
                        onChange={this.handleChange}

                    />
                </MuiPickersUtilsProvider>
                <div className="btn-container flex column">
                    <button className="primary-btn" onClick={() => this.saveDueDate(date)} >שמור</button>
                    <button className="secondary-btn" onClick={this.onRemoveDate}>הסר תאריך</button>
                </div>
            </div>

        </Popover>
    }
}
function mapStateToProps(state) {
    return {
        board: state.boardModule.board,
        loggedInUser: state.appModule.loggedInUser
    }
}

const mapDispatchToProps = {
    onSaveBoard,
    closePopover
}


export const PopoverDate = connect(mapStateToProps, mapDispatchToProps)(_PopoverDate)
