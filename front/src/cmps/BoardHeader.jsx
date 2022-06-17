import { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ReactComponent as ElipsisIcon } from '../assets/img/icons/elipsis.svg'
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import CloseIcon from '@material-ui/icons/Close';
import AutosizeInput from 'react-input-autosize';
import { ElementOverlay } from '../cmps/Popover/ElementOverlay';
import { ProfileAvatar } from './ProfileAvatar';
import { boardService } from '../services/board.service'
import { openPopover } from '../store/actions/app.actions.js'
import { setFilter } from '../store/actions/board.actions.js'
import BarChartIcon from '@material-ui/icons/BarChart';

class _BoardHeader extends Component {

    state = {
        title: '',
        isEdit: false,
    }

    componentDidMount() {
        this.setState({ title: this.props.board.title })
    }

    handleChange = ({ target }) => {
        let { inputWidth } = this.state
        this.setState({ title: target.value, inputWidth })
    }

    toggleEdit = () => {
        const {loggedInUser} = this.props
        if (loggedInUser.userType !== 'admin') return
        const { isEdit } = this.state
        let { inputWidth } = this.state
        if (!isEdit) inputWidth = this.h1Title.getBoundingClientRect().width
        this.setState({ isEdit: !isEdit, inputWidth }, () => {
            if (this.state.isEdit) this.titleInput.select()
        })
    }

    onTitleSave = (ev) => {
        ev.preventDefault()
        const { title } = this.state
        if (!title) return
        const { board, onSaveBoard } = this.props
        board.title = title
        const savedActivity = boardService.createActivity('renamed', board.title)
        board.activities.unshift(savedActivity)
        onSaveBoard(board)
        this.toggleEdit()
    }

    onToggleFav = () => {
        const { board, onSaveBoard } = this.props
        board.isFavorite = !board.isFavorite
        onSaveBoard(board)
    }
    onOpenPopover = (ev, PopoverName, member) => {
        const elPos = ev.target.getBoundingClientRect()
        const props = { member, isInCard: false, showStatus: true , userType : 'all' }
        this.props.openPopover(PopoverName, elPos, props)
    }
    get isFilterOn() {

        const { labels, txt, members } = this.props.filterBy
        return labels.length || members.length || txt
    }

    get searchResultsCount() {
        const { board, filterBy } = this.props
        return board.lists.reduce((acc, list) => {
            const filteredList = boardService.getFilteredList(list, filterBy)
            acc += filteredList.cards.length
            return acc
        }, 0)
    }

    resetFilter = (ev) => {
        ev.stopPropagation()
        this.props.setFilter({ txt: '', labels: [], members: [] })
    }

    render() {
        const { board, loggedInUser } = this.props
        const { isEdit, title } = this.state
        return (
            <div className="board-header">
                <div className="board-title" >
                    {isEdit && loggedInUser.userType=== 'admin' ?
                        <form onSubmit={this.onTitleSave}>
                            <AutosizeInput

                                name="form-field-name"
                                value={title}
                                onChange={this.handleChange}
                                ref={(input) => { this.titleInput = input }}
                                onBlur={this.onTitleSave}
                            />
                        </form>
                        :
                        <h1 onClick={this.toggleEdit} ref={(h1) => { this.h1Title = h1 }}>{board.title} </h1>
                    }
                </div>
                <button className="board-btn" onClick={this.onToggleFav}>
                    <i className={`far fa-star icon-sm star-icon ${board.isFavorite && loggedInUser.userType!== 'constructor' ? 'favorite' : ''}`}></i>
                </button>
                <span className="divider"></span>
                <div className="flex header-section">

                    <div className="board-header-members flex align-center">
                        <AvatarGroup>
                            {board.members.map(member => <ProfileAvatar key={member._id} member={member}
                                onOpenPopover={this.onOpenPopover} size={28} showStatus={true} />)}
                        </AvatarGroup>
                        
                        <a className="clean-link" onClick={(ev) => this.onOpenPopover(ev, 'INVITE')}>
                        <span className="wide-layout">הזמן משתמשים  </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path></svg>
                        </a>
                    </div>
                    <Link to={`/board/${board._id}/dashboard`} className="clean-link">
                        <BarChartIcon />
                        <span className="wide-layout">לוח פרויקט</span>
                    </Link>
                    {this.isFilterOn && <Link className="board-filter-results flex align-center" to="#"
                        onClick={(ev) => this.onOpenPopover(ev, 'BOARD_FILTER')}>
                        <span>{this.searchResultsCount} search results</span>
                        <span className="flex align-center" onClick={this.resetFilter}>
                            <CloseIcon />
                        </span>
                    </Link>}
                    <button className="board-btn" onClick={(ev) => {
                        if (loggedInUser.userType === 'constructor') return
                        this.onOpenPopover(ev, 'MENU')}}>
                        <ElipsisIcon />
                        <span className="wide-layout">תפריט</span>
                        <ElementOverlay />
                    </button>
                    <button className="board-btn" onClick={(ev) =>
                        {if (loggedInUser.userType ==='constructor') return
                         this.onOpenPopover(ev, 'ATTACH')}}>
                        <i class="fa fa-camera" aria-hidden="true"></i>
                        {/* <span className="wide-layout">Show Menu</span> */}
                        <ElementOverlay />
                    </button>
                </div>
            </div>
        )
    }
}




function mapStateToProps(state) {
    return {
        board: state.boardModule.board,
        loggedInUser: state.appModule.loggedInUser,
        filterBy: state.boardModule.filterBy
    }
}

const mapDispatchToProps = {
    openPopover,
    setFilter
}

export const BoardHeader = connect(mapStateToProps, mapDispatchToProps)(_BoardHeader)
