/* eslint-disable no-unused-vars */
import React, { Component } from 'react'

class Avatar extends Component {
    constructor (props, context) {
        super(props, context)
    }

    render () {
        const initials = this.props.name.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase()
        const classNames = this.props.inline && this.props.inline === true ? 'avatar-circle avatar-circle-xs d-inline-block m-2' : 'avatar-circle avatar-circle-sm'


        return (
            <React.Fragment>
                <div title={this.props.name} className={classNames}>
                    <span className='initials'>{initials}</span>
                </div>
            </React.Fragment>
        )
    }
}

export default Avatar
