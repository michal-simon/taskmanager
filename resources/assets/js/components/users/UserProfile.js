import * as React from 'react'
import { Button, Container, Row, Col } from 'reactstrap'
import axios from 'axios'
import { Progress } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EditUser from './EditUser'

class UserProfile extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            imagePreviewUrl: '',
            selectedFile: '',
            loaded: 0,
            user: {}
        }
        this.submit = this.submit.bind(this)
        this.fileChangedHandler = this.fileChangedHandler.bind(this)
    }

    componentDidMount () {
        axios.get(`/api/user/profile/${this.props.username}`)
            .then((r) => {
                this.setState({
                    user: r.data
                })
            })
            .catch((err) => {
                console.warn(err)
                toast.error('upload fail')
            })
    }

    fileChangedHandler (e) {
        e.preventDefault()
        let reader = new FileReader()
        let file = e.target.files[0]
        reader.onloadend = () => {
            this.setState({
                selectedFile: file,
                imagePreviewUrl: reader.result
            })
        }
        reader.readAsDataURL(file)
    }

    submit () {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        axios.post('/api/user/upload', data, {
            onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)
                })
            }
        })
            .then(response => { // then print response status
                toast.success('upload success')
            })
            .catch(err => { // then print response status
                console.warn(err)
                toast.error('upload fail')
            })
    }

    render () {

        let $imagePreview = (<img className="w-100 rounded border"
                                  src="https://cdn.bootstrapsnippet.net/assets/image/dummy-avatar.jpg"/>)
        let userData = ''
        let button = ''
        let uploadButton = ''

        if (this.state.imagePreviewUrl) {
            $imagePreview = (<img className="w-100 rounded border" src={this.state.imagePreviewUrl} alt="icon"/>)
        }
        if (this.state.user && this.state.user.id) {
            button = parseInt(sessionStorage.getItem('user_id')) === this.state.user.id
                ? <EditUser user={this.state.user} user_id={this.state.user.id}/>
                : ''
            uploadButton = parseInt(sessionStorage.getItem('user_id')) === this.state.user.id
                ? <label className="btn btn-default btn-file">
                    Browse <input onChange={this.fileChangedHandler.bind(this)} type="file"
                                  style={{ display: 'none' }}/>
                </label>
                : ''
            userData = (
                <React.Fragment>
                    <div class="d-flex align-items-center">
                        <h2 class="font-weight-bold m-0">
                            {`${this.state.user.first_name} ${this.state.user.last_name}`}
                        </h2>
                        <address class="m-0 pt-2 pl-0 pl-md-4 font-weight-light text-secondary">
                            <i class="fa fa-map-marker"></i>
                            Garden City, NY
                        </address>
                    </div>

                    <p className="h5 text-primary mt-2 d-block font-weight-light">
                        Full-Stack Programmer
                    </p>

                    <section class="d-flex mt-5">
                        {button}
                    </section>

                    <h6 className="text-uppercase font-weight-light text-secondary">
                        Contact Information
                    </h6>
                    <dl className="row mt-4 mb-4 pb-3">
                        <dt className="col-sm-3">Phone</dt>
                        <dd className="col-sm-9">+1 123 456 78900</dd>

                        <dt className="col-sm-3">Home address</dt>
                        <dd className="col-sm-9">
                            <address className="mb-0">
                                2983 Heavner Court<br/>
                                Garden City, NY 11530
                            </address>
                        </dd>

                        <dt className="col-sm-3">Email address</dt>
                        <dd className="col-sm-9">
                            <a href={this.state.user.email}>{this.state.user.email}</a>
                        </dd>
                    </dl>

                    <h6 className="text-uppercase font-weight-light text-secondary">
                        Basic Information
                    </h6>
                    <dl className="row mt-4 mb-4 pb-3">
                        <dt className="col-sm-3">Birthday</dt>
                        <dd className="col-sm-9">January 21, 1991</dd>

                        <dt className="col-sm-3">Gender</dt>
                        <dd className="col-sm-9">Male</dd>
                    </dl>
                </React.Fragment>
            )
        }
        return (
            <Container className="py-4 my-2">
                <Row>
                    <Col className="pr-md-5" md={4}>
                        {$imagePreview}
                        <div className="pt-4 mt-2">
                            <section class="mb-4 pb-1">
                                <h3 class="h6 font-weight-light text-secondary text-uppercase"> Change Profile
                                    Picture</h3>
                                <div className="pt-2">
                                    <ToastContainer/>
                                    <Progress max="100" color="success"
                                              value={this.state.loaded}>{Math.round(this.state.loaded, 2)}%</Progress>

                                    {uploadButton}
                                    <button className="btn btn-success" onClick={this.submit}>Save changes</button>
                                </div>
                            </section>
                        </div>
                    </Col>

                    <Col md={8}>
                        {userData}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default UserProfile