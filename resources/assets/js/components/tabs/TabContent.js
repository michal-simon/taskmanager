import React, { Component } from 'react';
import TabList from './TabList';
import Comments from '../comments/Comments';
import FileUploads from '../attachments/FileUploads';

export default class TabContent extends Component {
    render() {
        return (
            <div className="container mt-5">
                <TabList>
                    <div label="Task" className="tab-content">
                        Consequat occaecat ullamco amet non eiusmod nostrud dolore irure incididunt est duis anim sunt officia. Fugiat velit proident aliquip nisi incididunt nostrud exercitation proident est nisi. Irure magna elit commodo anim ex veniam culpa eiusmod id nostrud sit cupidatat in veniam ad. Eiusmod consequat eu adipisicing minim anim aliquip cupidatat culpa excepteur quis. Occaecat sit eu exercitation irure Lorem incididunt nostrud.
                    </div>
                    <div label="Attachment" className="tab-content">
                        <FileUploads task={this.props.task} user_id={101} />
                    </div>
                    <div label="Comment" className="tab-content">
                       <Comments task={this.props.task} user_id={101} />
                    </div>
                </TabList>
            </div>
        );
    }
}