import React, {Component} from 'react'
import moment from 'moment'
import axios from 'axios'
import $ from 'jquery'
import 'jquery-ui-dist/jquery-ui';
import './dragdrop';
import Loader from './Loader';
import ViewTask from './forms/viewTask';
import Tooltips from "./Tooltip";

class Task extends Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps() {

        const self = this;

        setTimeout(function () {
            $(".mcell-task").draggable({
                appendTo: "body",
                cursor: "move",
                helper: 'clone',
                revert: "invalid"
            });

            $(".mcell").droppable({
                tolerance: "intersect",
                accept: ".mcell-task",
                activeClass: "ui-state-default",
                hoverClass: "ui-state-hover",
                drop: function (event, ui) {

                    event.preventDefault()

                    $(this).append($(ui.draggable));
                    const id = $(ui.draggable).attr('id')
                    const status = $(this).data('status')

                    axios.put(`/api/tasks/status/${id}`, {
                        task_status: status
                    })
                        .then((response) => {
                        })
                        .catch((error) => {
                            alert(error)
                        });
                }
            });
        }, 3000);
    }

    api(id) {
        const self = this;

        axios.delete('/api/tasks/' + id)
            .then(function (response) {
                let filteredArray = self.props.tasks.filter(item => item.id !== id)
                self.props.action(filteredArray)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const {tasks, loading, filter} = this.props;
        let content;
        if (loading) {
            content = <div className="loader">
                <Loader/>
            </div>;
        } else {
            content =
                tasks.filter(i => i.task_status === Number(filter))
                    .map((i, index) => {

                        const color = i.task_color.replace("color", "").toLowerCase();

                        const divStyle = {
                            borderLeft: `2px solid ${color}`
                        }

                        return (
                            <div style={divStyle} data-task={i.id} id={i.id} className="mcell-task card" key={index}>
                       
                    <span className="task-name">
                        <ViewTask
                            task_type={this.props.task_type}
                            allTasks={this.props.tasks}
                            action={this.props.action}
                            task={i}
                        />
                        <i id="delete" className="fas fa-times" onClick={() => this.api(i.id)}></i>
                    </span>
                                <span className="task-details">{i.content}</span>
                                <div>
                                    <span className="task-due">{moment(i.dueDate).format("DD.MM.YYYY")}</span>
                                    <span className="task-contributors">
                    </span>
                                </div>
                                <div className={i.color}/>
                            </div>
                        )
                    })
        }
        return (
            <div className="process">{content}</div>
        )
    }
}

export default Task;