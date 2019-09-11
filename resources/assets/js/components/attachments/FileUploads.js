import React, { Component } from 'react';
import FileUploadForm from './FileUploadForm';
import FileUploadList from './FileUploadList';
import axios from 'axios'

export default class FileUploads extends Component {

    constructor(props) {
        super(props);

        this.state = {
            files: [],
            loading: false
        };
    }

    componentDidMount() {
        // loading
        this.setState({ loading: true });

        // get all the comments
        axios.get(`/api/uploads/${this.props.task.id}`)
            .then((r)=> {
                this.setState({
                    files: r.data,
                    loading:false
                })
            })
            .catch((e)=>{
                this.setState({
                loading:false
            })
        })
    }

    render() {
        return (
           
               <div className="col-12">
                    <h1 className="font-weight-light text-center text-lg-left mt-4 mb-0">Attachments</h1>

                     {<FileUploadForm 
                        user_id={101}
                        task={this.props.task} 
                    />}

                     {<FileUploadList
                            loading={this.state.loading}
                            files={this.state.files}
                        />}
                </div>
            
        );
    }
}