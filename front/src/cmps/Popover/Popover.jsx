import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux'
import { closePopover } from '../../store/actions/app.actions'
import { onSaveBoard } from '../../store/actions/board.actions'
import { Component } from 'react'
import { boardService } from '../../services/board.service';

export class _Popover extends Component {

    state = {
        top: null,
        left: null
    }


    componentDidMount() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1000) return
            this.onSetPopoverPos()
        });
        this.onSetPopoverPos()
    }


    componentDidUpdate(prevProps) {
        if (this.props.elPos !== prevProps.elPos) {
            this.onSetPopoverPos()
        }
    }


    onSetPopoverPos = () => {
        const { elPos, displayMode } = this.props
        if (!this.selectedDiv) return
        const elRect = this.selectedDiv.getBoundingClientRect()
        let { left, top } = boardService.setPopoverPos(elPos, elRect)
        if (displayMode === 'menu-popovers') {
            top = 40;
            left = window.innerWidth - elRect.width;
        }
        this.setState({ top, left })
    }

    render() {
        const { children, title, closePopover, isOverlayOpen, overlay, displayMode , loggedInUser ,board } = this.props
        const { top, left } = this.state

        return <>
            {overlay !== 'none' && isOverlayOpen && <div className="overlay" onClick={(ev) => closePopover(title , loggedInUser ,board)} />}
            <div className={`pop-over ${displayMode} `}
                style={displayMode === 'menu' ? {} : { top: `${top}px`, left: `${left}px` }}
                ref={(div) => { this.selectedDiv = div }} >
                <div className={`pop-over-header ${displayMode} `}>
                    <h3>{title}</h3>
                    <button className="clean-btn" onClick={(ev) => closePopover(title , loggedInUser ,board)}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="pop-over-content">
                    {children}
                </div>
            </div>
        </>

    }
}


const mapDispatchToProps = {
    closePopover,
    onSaveBoard
}

function mapStateToProps(state) {
    return {
        isOverlayOpen: state.appModule.isOverlayOpen,
        elPos: state.appModule.currPopover.elPos ,
        loggedInUser: state.appModule.loggedInUser,
        board: state.boardModule.board
    }
}

export const Popover = connect(mapStateToProps, mapDispatchToProps)(_Popover)