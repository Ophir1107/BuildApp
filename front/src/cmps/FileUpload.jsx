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

    // try{
    //   const predictLabel = await predictService.onPredict(ev.target.files[0].name)
    //   console.log('predictLabel' , predictLabel)

    // }
    // catch(err) {
    //   console.log('error', err)
    // }


    
    try{
      const {secure_url} = await cloudinaryService.uploadFile(ev)
      const predictLabel = predictService.onPredict(secure_url)
      console.log('predictLabel' , predictLabel)
      this.props.onFileUpload(secure_url)
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
        <label htmlFor="file-upload">Computer</label>
        <input type="file" onChange={ this.uploadFile } accept="img/*" id="file-upload" />
      </div>
    )
  }
}