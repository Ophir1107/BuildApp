import { Component } from 'react';
import { utilsService } from '../../services/utils.service';
import { ColorPalette } from '../ColorPalette';
import { FileUpload } from '../FileUpload';
import { Popover } from './Popover';
import { boardService } from '../../services/board.service'
import { onSaveBoard } from '../../store/actions/board.actions'
import { connect } from 'react-redux';

class _PopoverCover extends Component {

    state = {
        bgColor: this.props.card.style?.bgColor || '',
        coverMode: this.props.card.style?.coverMode || null,
        bgImgUrl: this.props.card.style?.bgImgUrl || '',
    }
    componentDidMount() {
        this.setState({})
    }

    saveCover = () => {
        const { bgImgUrl, bgColor, coverMode } = this.state
        console.log(bgImgUrl, bgColor, coverMode , "bgImgUrl, bgColor, coverMode")
        const { card, onSaveBoard, board } = this.props
        card.style = {
            coverMode,
            bgImgUrl,
            bgColor,
        }
        // card.style.bgImgUrl = bgImgUrl
        // card.style.bgColor = bgColor
        // card.style.coverMode = coverMode
        console.log(card.style  , "cardStyle")
        const updatedBoard = boardService.updateCardInBoard(board, card)
        console.log(card, updatedBoard , "card, updatedBoard")
        onSaveBoard(updatedBoard)
    }

    handleChange = ({ target }) => {
        let { coverMode } = this.state
        if (!coverMode) coverMode = 'header';
        this.setState({ bgColor: target.value, bgImgUrl: '', coverMode: coverMode }, this.onSaveCover)
        console.log(this.state , "state in handle change")
    }

    onRemoveCover = () => {
        this.setState({ bgColor: '', coverMode: '', bgImgUrl: '' }, this.onSaveCover)
    }

    onSetMode = (mode) => {
        this.setState({ coverMode: mode }, this.onSaveCover)
        
    }

    onSaveCover = () => {
        const { bgColor, bgImgUrl, coverMode } = this.state
        console.log(this.state , "state in on save cover")

        if ((coverMode && bgImgUrl) || (coverMode && bgColor) || (!coverMode && !bgColor && !bgImgUrl)) this.saveCover()
        else return
    }

    onFileUpload = (fileUrl) => {
        if (!utilsService.isValidImg(fileUrl)) return // error message
        this.setState({ bgImgUrl: fileUrl, bgColor: '', coverMode: 'full' })
        this.onSaveCover()
    }

    render() {
        const { bgColor, coverMode, bgImgUrl } = this.state
        return <Popover title="Cover">
            <div className="cover-pop-over-content">
                <h4>גודל</h4>
                <div className="cover-options flex justify-space-between align-center">
                    <div className={`header-cover-preview ${coverMode === 'header' ? 'selected' : ''}`} onClick={() => this.onSetMode('header')} >
                        <div className="header-section" style={{ backgroundColor: bgColor ? bgColor : '#5e6c844d' }}></div>
                    </div>
                    <div className={`full-cover-preview ${coverMode === 'full' ? 'selected' : ''}`} onClick={() => this.onSetMode('full')} style={{ backgroundColor: bgColor ? bgColor : '#5e6c844d' }}> </div>
                </div>
                {(bgColor || bgImgUrl) && <div className="flex">
                    <button className="secondary-btn full" onClick={this.onRemoveCover}>הסר רקע</button>
                </div>}
                <h4>צבע</h4>
                <ColorPalette selectedColor={bgColor} handleChange={this.handleChange} />
                <h4>מסמכים</h4>
                <FileUpload onFileUpload={this.onFileUpload} />
            </div>
        </Popover>
    }
}
const mapDispatchToProps = {
    onSaveBoard,
}
function mapStateToProps(state) {
    return {
        board: state.boardModule.board
    }
}


export const PopoverCover = connect(mapStateToProps, mapDispatchToProps)(_PopoverCover)