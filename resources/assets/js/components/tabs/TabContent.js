/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import TabList from './TabList'
import Comments from '../comments/Comments'
import FileUploads from '../attachments/FileUploads'
import EditTask from '../forms/EditTask'
import ProductSelect from '../products/ProductSelect'
import ViewCustomer from '../customers/ViewCustomer'

export default class TabContent extends Component {

    render () {

        const userId = sessionStorage.getItem("user_id")

        return (
            <div className="container mt-5">
                <TabList>
                    <div label="Task" className="tab-content">
                        <EditTask
                            task_type={this.props.task_type}
                            allTasks={this.props.allTasks}
                            action={this.props.action}
                            task={this.props.task}
                            user_id={userId}
                        />
                    </div>

                    <div label="Customer" className="tab-content">
                        <ViewCustomer task={this.props.task}/>
                    </div>

                    <div label="Product" className="tab-content">
                        <ProductSelect task_id={this.props.task.id}/>
                    </div>

                    <div label="Attachment" className="tab-content">
                        <FileUploads task={this.props.task} user_id={userId}/>
                    </div>
                    <div label="Comment" className="tab-content">
                        <Comments task={this.props.task} user_id={userId}/>
                    </div>
                </TabList>
            </div>
        )
    }
}
