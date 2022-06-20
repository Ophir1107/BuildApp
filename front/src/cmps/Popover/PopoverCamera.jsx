import { Popover } from './Popover'
import { connect } from 'react-redux'
import { onSaveBoard } from '../../store/actions/board.actions'
import { ColorPalette } from '../ColorPalette'
import { ImagePalette } from '../ImagePalette'
import { BackToPrevPopover } from "./BackToPrevPopover"

function _PopoverCamera({ board , closePopover }) {

    // function handleChange({ target }) {
        // const { name, value } = target
        // if (name === 'imgUrl') {
        //     board.style.background = `url(${value})`
        // } else board.style.background = value;
        // onSaveBoard(board)
    // }
    // componentDidMount() {
    //     this.interval = setInterval(() => this.setState({ time: Date.now() }), 1500);
    //   }

    //   componentWillUnmount() {
    //     clearInterval(this.interval);
    //   }
    return <Popover title="תמונה עלתה בהצלחה" style={{background: 'green'}}>
        {/* <BackToPrevPopover popoverName="MENU" />
        <div className="pop-over-backround-details">
            <div>
                <h4>צבעים</h4>
                <ColorPalette handleChange={handleChange} selectedColor={board.background} />
            </div>
            <div>
                <h4>צבעים הדרגתיים</h4>
                <ColorPalette handleChange={handleChange} selectedColor={board.background} isGradient={true} />
            </div>
            <div>
                <h4>תמונות</h4>
                <ImagePalette handleChange={handleChange} />
            </div>
        </div> */}
    </Popover>

}
function mapStateToProps(state) {
    return {
        board: state.boardModule.board,
    }
}

const mapDispatchToProps = {
    onSaveBoard,

}


export const PopoverCamera = connect(mapStateToProps, mapDispatchToProps)(_PopoverCamera)