import React, { Component } from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            loaded:0
        }
    }

    checkFileSize(event) {
        const files = event.target.files
        const size = 2000000 
        const err = []; 

        for(var x = 0; x<files.length; x++) {
            if (files[x].size > size) {
                err[x] = files[x].type+'is too large, please pick a smaller file\n';
            }
        };

        for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
            // discard selected file
            toast.error(err[z])
            event.target.value = null
        }

        return true;
    }

    checkMimeType(event) {
        //getting file object
        let files = event.target.files 

        //define message container
        let err = []

        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'image/gif']

        // loop access array
        for(var x = 0; x<files.length; x++) {
            // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err[x] = files[x].type+' is not a supported format\n';
            }
        };

        for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
            // discard selected file
            toast.error(err[z])
            event.target.value = null
        }
    
        return true;
    }

    maxSelectFile(event) {
        let files = event.target.files
        
        if (files.length > 3) { 
            const msg = 'Only 3 images can be uploaded at a time'
            event.target.value = null
            toast.warn(msg)
            return false;
        }

        return true;
    }

    onChangeHandler() {
        const files = event.target.files

        if(this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)){ 
            // if return true allow to setState
            this.setState({
                selectedFile: files,
                loaded:0
            })
        }
    }

    onClickHandler() {
        const data = new FormData() 

        data.append('user_id', this.props.user_id)
        data.append('task_id', this.props.task.id)

        for(var x = 0; x<this.state.selectedFile.length; x++) {
            data.append('file[]', this.state.selectedFile[x])
        }

        axios.post("/api/uploads", data, {
            onUploadProgress: ProgressEvent => {
                this.setState({
                loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
                })
            },
        })
        .then(res => { // then print response status
            toast.success('upload success')
        })
        .catch(err => { // then print response status
            toast.error('upload fail')
        })
    }

    render() {
        return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="form-group files">
                        <span className="btn btn-default btn-file img-select-btn">
                            <span>Browse</span>
                            <input type="file" multiple name="img-file-input" onChange={this.onChangeHandler.bind(this)}></input>
                        </span>

                        <button type="button" className="btn btn-success btn-block col-4 pull-right" onClick={this.onClickHandler.bind(this)}>Upload</button>
                    </div>
                       
                    <div className="form-group">
                        <ToastContainer />
                        <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
                    </div> 
                    
                     <hr className="mt-2 mb-5"></hr>
                </div>
            </div>
        </div>
        );
    }
}

export default FileUpload;