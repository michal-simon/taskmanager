/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import TabList from './TabList'
import Comments from '../comments/Comments'
import FileUploads from '../attachments/FileUploads'
import EditTask from '../forms/EditTask'
import ProductSelect from '../products/ProductSelect'
import EditCustomer from '../customers/EditCustomer'
import EventTab from './EventTab'
import TaskTab from './TaskTab'
import EditInvoice from '../invoice/EditInvoice'

export default class TabContent extends Component {
    render () {
        const userId = sessionStorage.getItem('user_id')

        return (
            <div className="container mt-5">
                <TabList>
                    <div label="Task" className="tab-content">
                        <EditTask
                            users={this.props.users}
                            task_type={this.props.task_type}
                            allTasks={this.props.allTasks}
                            action={this.props.action}
                            task={this.props.task}
                            user_id={userId}
                        />
                    </div>

                    <div label="Customer" className="tab-content">
                        <EditCustomer
                            id={this.props.task.customer_id}
                            modal={false}
                            task={this.props.task}
                        />
                    </div>

                    <div label="Product" className="tab-content">
                        <ProductSelect task_id={this.props.task.id}/>
                    </div>

                    <div label="Event" className="tab-content">
                        <EventTab
                            customer_id={this.props.task.customer_id}
                            task_id={this.props.task.id}
                        />
                    </div>

                    <div label="Tasks" className="tab-content">
                        <TaskTab
                            project_id={this.props.project_id}
                            customers={this.props.customers}
                            users={this.props.users}
                            task_id={this.props.task.id}
                            task_type={this.props.task_type}
                        />
                    </div>

                    <div label="Invoice" className="tab-content">
                        <EditInvoice customer_id={this.props.task.customer_id} task_id={this.props.task.id} />
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
