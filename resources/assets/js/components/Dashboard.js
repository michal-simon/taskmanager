import React,{Component} from 'react'
import axios from 'axios'
import {Link} from 'react-router'
import Loader from './Loader'
import Story from './Story'
import AddStory from './forms/addStory';
import Header from './common/Header'

class Dashboard extends Component{
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
            show: true,
            tasks:[],
            stories:[],
            err:'',
            err2:'',
            loading:true,
            loadingStory:true,
        };

        this.handleClick = this.handleClick.bind(this);
        this.project_id = this.props.project_id
        this.updateTasks = this.updateTasks.bind(this);
        this.addProject = this.addProject.bind(this);
    }

    componentDidMount() {
        this.getStoryDetails();
        this.getTasks();
    }

    getTasks() {

        const url = this.props.task_type == 2 ? '/api/leads' : `/api/tasks/getTasksForProject/${this.project_id}`

        axios.get(url)
            .then((r)=> {
                this.setState({
                    tasks: r.data,
                    err:''
                })
            })
            .then(()=>{
                this.setState({
                    loading:false
                })
            })
            .catch((e)=>{
                if (!e.response){
                    this.setState({
                        loading:true,
                        err: e
                    })
                }
                else {
                    this.setState({
                        loading:false,
                        err: e
                    })
                }
            })
    }

    getStoryDetails() {

        axios.get(`/api/projects`)
            .then((r)=> {
                this.setState({
                    stories: r.data,
                    err2:''
                })
            })
            .then(()=>{
                this.setState({
                    loadingStory:false
                })
            })
            .catch((e)=>{
                this.setState({
                    loadingStory:false,
                    err2: e
                })
            })
    }

    story() {
        const test = this.state.stories.length ?  this.state.stories.filter(i=>i.id===parseInt(this.project_id)) : ''

        if(test.length) {
            return <Story storyName={test} storyType={this.project_id} tasks={this.state.tasks} loading={this.state.loading}/>
        }

        return null;
    }

    updateTasks(tasks) {

        console.log('all tasks', tasks)

        this.setState({
            tasks: tasks,
        })
    }

    /**
     * Add new comment
     * @param {Object} comment
     */
    addProject(project) {
        this.setState({
            stories: [project, ...this.state.stories]
        });
    }

    handleClick(project_id) {

        const url = this.props.task_type == 1 ? `?project_id=${project_id}` : `/leads?project_id=${project_id}`;

        window.location.href = url
    }

    getStories() {

        let {stories,loadingStory} = this.state;

        let storyTable;

        if(!loadingStory) {
            storyTable = stories.map((story,index)=>{

                const activeClass = story.id === parseInt(this.project_id) ? 'active' : ''

                return(
                    <li key={index}>
                        <a onClick={() => this.handleClick(story.id)} className={activeClass}>
                            <i className="fas fa-list-alt"></i>
                            <span className="menu-text">{story.title}</span>
                        </a>
                    </li>
                )
            })

        } else {
            storyTable = <li>
                <div className="loader">
                    <Loader/>
                </div>
            </li>
        }

        return storyTable

    }

    render() {

        let storyTable

        const divStyle = this.props.task_type == 2 ? {
            left: 0,
            width: '100%',
        } : {};

        if(this.props.task_type != 2) {

            storyTable = (

                <div className="side">
                    <span className="logo">Hampton's</span>
                    <ul className="side-menu">
                        {this.getStories()}
                    </ul>
                    <div className="otherMenu">
                        <AddStory addProject={this.addProject} />
                    </div>
                </div>

            )
        }
        return (
            <div>
                {storyTable}
                <div className="con" style={divStyle}>
                    <Header/>
                    <aside>
                        <Story
                            tasks={this.state.tasks}
                            action={this.updateTasks}
                            storyName={this.state.stories.filter(i=>i.id===parseInt(this.project_id))}
                            storyType={this.project_id} tasks={this.state.tasks}
                            loading={this.state.loading}
                            task_type={this.props.task_type}
                        />
                    </aside>
                </div>
            </div>
        )
    }
}
export default Dashboard