import * as React from 'react'
import MessageDialog from './MessageDialog'
import MessageBoard from './MessageBoard'
import axios from 'axios'

class MessageContainer extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            isDialogOpen: false,
            mode: '',
            activeMessage: undefined,
            messages: []
        }

        this.setMode = this.setMode.bind(this)
        this.toggleOpenState = this.toggleOpenState.bind(this)
        this.setActiveMessage = this.setActiveMessage.bind(this)
        this.createMessage = this.createMessage.bind(this)
        this.newMessage = this.newMessage.bind(this)
        this.submitMessage = this.submitMessage.bind(this)
        this.commentOnMessage = this.commentOnMessage.bind(this)
        this.deleteMessage = this.deleteMessage.bind(this)
        this.changeMessage = this.changeMessage.bind(this)
        this.getUsers = this.getUsers.bind(this)
    }

    componentDidMount () {
        this.fetchMessages()
        this.getUsers()
    }

    setMode (mode) {
        this.setState({
            mode
        })

        this.toggleOpenState()
    }

    toggleOpenState () {
        this.setState({
            isDialogOpen: !this.state.isDialogOpen
        })
    }

    setActiveMessage (message) {
        this.setState({
            activeMessage: message
        })
    }

    getUsers () {
        axios.get('/api/users')
            .then((r) => {
                this.setState({
                    users: r.data
                })
            })
            .catch((e) => {
                alert(e)
            })
    }

    fetchMessages() {
        axios.get('/api/activity')
            .then((r) => {
                this.setState({
                    messages: r.data
                })
            })
            .catch((e) => {
                alert(e)
            })
    }

    createMessage (messageText) {
        const { activeUser } = this.props
        const messageId = this.state.messages.length
            ? this.state.messages[this.state.messages.length - 1].id + 1
            : 1

        const newMessage = {
            comment: messageText,
            parent_id: null,
            user_id: sessionStorage.getItem("user_id")
        }

        this.newMessage(newMessage)
    }

    newMessage (newMessage) {
        axios.post('/api/comments', newMessage).then(response => {

            alert('Mike')

            this.setState(prevState => ({
                messages: [...prevState.messages,newMessage]
            }))
        })
            .catch((error) => {
                console.warn(error)
            })
    }

    submitMessage (messageText, mode) {

        if (!messageText) {
            return
        }

        if (mode === 'Create') {
            this.createMessage(messageText)
        } else if (mode === 'Edit') {
            this.changeMessage(messageText)
        } else {
            this.commentOnMessage(messageText)
        }

        this.toggleOpenState()
    }

    deleteMessage (id) {

        axios.delete(`/api/comments/${id}`).then(response => {
            const arrMessages = [...this.state.messages]
            const index = arrMessages.findIndex(message => message.id === id)
            arrMessages.splice(index, 1)
            this.setState({messages: arrMessages})
        })
            .catch((error) => {
                console.warn(error)
            })
    }

    changeMessage (messageText) {
        const { activeMessage } = this.state
        activeMessage.comment = messageText

        axios.put(`/api/comments/${activeMessage.id}`).then(response => {
             const arrMessages = [...this.state.messages]
             const index = arrMessages.findIndex(message => message.id === activeMessage.id)
            arrMessages[index].comment = messageText
            console.log(arrMessages)
            this.setState({messages: arrMessages})
        })
            .catch((error) => {
                console.warn(error)
            })
    }

    commentOnMessage (messageText) {
        const { activeUser } = this.props
        const { activeMessage } = this.state
        const messageId = this.state.messages.length
            ? this.state.messages[this.state.messages.length - 1].id + 1
            : 1
        const newMessage = {
            id: messageId,
            comment: messageText,
            parent_id: activeMessage.id,
            user_id: sessionStorage.getItem("user_id")
        }

        this.newMessage(newMessage)
    }

    render () {
        const { messages, mode, isDialogOpen, users, activeMessage } = this.state

        if(this.state.users && this.state.users.length) {

            console.log('message', this.state.activeMessage)

            return (
                <React.Fragment>
                    <MessageDialog
                        mode={mode}
                        message={activeMessage}
                        submitMessage={this.submitMessage}
                        isDialogOpen={isDialogOpen}
                        toggleOpenState={this.toggleOpenState}
                    />

                    <MessageBoard
                        setMode={this.setMode}
                        submitMessage={this.submitMessage}
                        messages={messages}
                        activeUser={true}
                        users={users}
                        deleteMessage={this.deleteMessage}
                        setActiveMessage={this.setActiveMessage}
                    />

                </React.Fragment>
            )
        }

        return (<div>Loading</div>)

    }
}

export default MessageContainer