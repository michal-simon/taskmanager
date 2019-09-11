import React, { Component } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import axios from 'axios'

export default class Comments extends Component {

    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            loading: false
        };

        this.addComment = this.addComment.bind(this);
    }

    /**
    * Add new comment
    * @param {Object} comment
    */
    addComment(comments) {
        this.setState({
            loading: false,
            comments: comments
        });


        // this.setState({
        //     loading: false,
        //     comments: [comment, ...this.state.comments]
        // });
    }

    componentDidMount() {
        // loading
        this.setState({ loading: true });

        // get all the comments
        axios.get(`/api/comments/${this.props.task.id}`)
            .then((r)=> {
                this.setState({
                    comments: r.data,
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
           <div className="row bootstrap snippets">
               <div className="col-12">
                    <div className="comment-wrapper">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                Comment panel
                            </div>

                            <div className="panel-body">
                                {<CommentForm 
                                    addComment={this.addComment}
                                    user_id={101}
                                    task={this.props.task}
                                />}

                                <div className="clearfix"></div>
                                <hr></hr>
                                <ul className="media-list">
                                    {<CommentList
                                        loading={this.state.loading}
                                        comments={this.state.comments}
                                    />}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}