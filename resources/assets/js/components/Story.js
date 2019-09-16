import React,{Component} from 'react'
import Task from './task'
import Tooltips from './tooltip'
import axios from 'axios'

export default class Story extends Component{
    constructor(props) {
        super(props);
        this.state = {
          columns: []
        };
        
        this.buildColumn = this.buildColumn.bind(this);
        this.getColumns = this.getColumns.bind(this);
    }

    componentDidMount() {
        this.getColumns();
    }

    getColumns() {
        axios.get(`/api/status/${this.props.task_type}`)
            .then((r)=> {
                this.setState({
                    columns: r.data,
                })
            })
            .catch((e)=>{
                alert(e)
               console.error(e)
            })
    }

    buildColumn(column) {
        return (
            <div data-status={column.id} className={`col-sm mcell mcolor${column.id}`}>
                <div className="mcell-title story">
                    <b className={`fas ${column.icon}`}/>{column.title}
                     <Tooltips 
                        tasks={this.props.tasks}
                        id={column.id} 
                        content={column.description}
                        action={this.props.action}
                        placement="top" 
                        storyType={this.props.storyType}
                        task_type={this.props.task_type}
                     />
                </div>
                <Task 
                    action={this.props.action}
                    tasks={this.props.tasks}
                    loading={this.props.loading} 
                    filter={column.id}
                />
            </div>
        )
    }

    render(){
        const columns = this.state.columns.map((column,index)=>{
            return this.buildColumn(column)
        })

        return(
            <div className="container">
                <div className="space">
                    <h2 className="story">{this.props.storyName[0] ? this.props.storyName[0].name : "Loading..."}</h2>
                </div>
                
                <div className="row">
                    {columns}
                </div>
            </div>
        )
    }
}