import { Component } from 'react'
import { cloudinaryService } from '../services/cloudinary.service'
import { predictService } from '../services/predict.service'
export class FileUpload extends Component {
  state = {
    fileUrl: null,
    isUploading: false,
  }
  uploadFile = async (ev) => {
    console.log('file from file upload' , ev.target.files[0])
    // console.log('file from file upload' , ev.target.files[0].path)
    try{
      const file = document.getElementById('file-upload')
      console.log(file.value , "file value")
      const fileUrl=file.value
      let urlArray = fileUrl.split('\\')
      urlArray[1] = 'Users/\/\דסה\/\/Downloads'
      // let urlArray = ev.target.files[0].path.split('/')
      console.log('urlArray' , urlArray)
      const urlPath = urlArray.join('/\/')
      console.log(urlPath , "urlPath")
      // const {secure_url} = await cloudinaryService.uploadFile(ev)
    //   const predictLabel = predictService.onPredict(secure_url)
    //   .then(predictLabel => {
    //     if(!predictLabel) return
    //     console.log(predictLabel , "pred")
    //     let newBoard =  boardService.addCardToBoardOnPredict(board , card)
    //     onSaveBoard(newBoard)
    // })
      // console.log('predictLabel' , predictLabel)
      this.props.onFileUpload(urlPath , ev)
    }catch (err){
      console.log(err , "err from upload error") 
      throw err
    }
    this.setState({ isUploading: false})
  }
  get uploadMsg() {
    const { fileUrl, isUploading } = this.state
    if (fileUrl) return 'File Uploaded'
    return isUploading ? 'Uploading...' : 'Upload Image'
  }
  render() {
    return (
      <div className="upload-preview" >
        <label htmlFor="file-upload">מחשב</label>
        <input type="file" onChange={ this.uploadFile } accept="img/*" id="file-upload" />
      </div>
    )
  }
}