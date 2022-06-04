import { Component } from "react"
import { FileUpload } from "../FileUpload"
import { Popover } from "./Popover"
import { utilsService } from '../../services/utils.service'
import { predictService } from "../../services/predict.service"

export class PopoverAttach extends Component {

    state = {
        file: null,
        link: null,
        formData: null,
        linkTxt: '',

    }

    handleChange = ({ target }) => {

        console.log("image attached" , this.state.linkTxt , "hgfhgfj")
        this.setState({ linkTxt: target.value })
        console.log("image attached " , this.state.linkTxt , "hgfhgfj")
        return target.value
    }

    onAttachLink = (ev) => {
        ev.preventDefault()
        // const imageurl = this.handleChange()
        console.log("taget from eve" , this.state.linkTxt)
        let predictLabel = ''
        if (!this.state.linkTxt) return
        console.log("this.state.linkTxt after if " , this.state.linkTxt)

        predictLabel = predictService.onPredict(this.state.linkTxt)

        const isValid = utilsService.isValidUrl(this.state.linkTxt)
        if (isValid) this.props.addFile(this.state.linkTxt)
    }

    isImage(url) {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    }

    onFileUpload = (fileUrl) => {
        this.props.addFile(fileUrl)
    }

    render() {
        let { inputTxt } = this.state
        return <Popover title="Attach from...">
            <div className="attach-pop-over-content">
                <FileUpload onFileUpload={this.onFileUpload} />
                <form onSubmit={this.onAttachLink}>
                    <label className="pop-over-label" htmlFor="attach-input">Attach a link</label>
                    <input type="text" className="pop-over-input" value={inputTxt} id="attach-input"
                        onChange={this.handleChange} placeholder="Attach any link here..." />
                    <button className="primary-btn btn-wide">Attach</button>
                </form>
            </div>
        </Popover>
    }

}