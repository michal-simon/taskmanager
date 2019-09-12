import React, {Component} from 'react';
import TabList from './TabList';
import Comments from '../comments/Comments';
import FileUploads from '../attachments/FileUploads';
import EditTask from '../forms/EditTask';
import ViewTask from "../forms/ViewTask";

export default class TabContent extends Component {
    render() {
        return (
            <div className="container mt-5">
                <TabList>
                    <div label="Task" className="tab-content">
                        <EditTask
                            allTasks={this.props.allTasks}
                            action={this.props.action}
                            task={this.props.task} user_id={101}
                        />
                    </div>
                    <div label="Attachment" className="tab-content">
                        <FileUploads task={this.props.task} user_id={101}/>
                    </div>
                    <div label="Comment" className="tab-content">
                        <Comments task={this.props.task} user_id={101}/>
                    </div>
                </TabList>
            </div>
        );
    }
}