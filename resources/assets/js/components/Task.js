import React,{Component} from 'react'
import moment from 'moment'
import ModalExampleDimmer from './Modal'
import axios from 'axios'
import $ from 'jquery'
import 'jquery-ui-dist/jquery-ui';
import './dragdrop';
import Loader from './Loader';
import ViewTask from './forms/viewTask';
class Task extends Component{

    componentWillReceiveProps(){

        setTimeout(function(){ 
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
                drop: function(event, ui) {        
                    $(this).append($(ui.draggable));
                    console.log($(this).find("li").attr('id'))
                }
            });
        }, 3000); 
    }

    api(id) {

        const self = this;

        axios.delete('/api/tasks/'+id)
        .then(function (response) {
            let filteredArray = self.props.tasks.filter(item => item.id !== id)
            self.props.action(filteredArray)
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render(){
        const {tasks,loading,filter} = this.props;
        let content;
        if (loading) {
            content = <div className="loader">
            <Loader/>
            </div>;
        }
        else{
            content = 
            tasks.filter(i=>i.task_status===Number(filter))
            .map((i,index)=>{
                return(
                    <li id={i.id} className="mcell-task" key={index}>
                       
                    <span className="task-name">
                        <ViewTask task={i} />
                        <i id="delete" className="fas fa-times" onClick={() => this.api(i.id)}></i>
                    </span>
                    <span className="task-details">{i.content}</span>
                    <div>
                    <span className="task-due">{moment(i.dueDate).format("DD.MM.YYYY")}</span>
                    <span className="task-contributors">
                        {/* <img alt={i.contributors[0].name + ' '+i.contributors[0].lastName } title={i.contributors[0].name + ' '+i.contributors[0].lastName } src={'/assets/img/' + i.contributors[0].profilePhoto}/> */}
                    </span>
                    </div>
                    <div className={i.color}/>
                    {/* <ModalExampleDimmer propContent={i} classType="btnDashboard"/> */}
                    </li>
                )
            })
        }
        return(
        <div className="process">{content}</div>
        )
    }
}
export default Task;