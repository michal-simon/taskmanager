/* eslint-disable no-unused-vars */
import React, { Component } from 'react'

class Avatar extends Component {
    constructor (props, context) {
        super(props, context)
    }

    render () {
        const initials = this.props.name.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase()

        return (
            <React.Fragment>
                <div className='avatar-circle avatar-circle-sm'>
                    <span className='initials'>{initials}</span>
                </div>
            </React.Fragment>
        )
    }
}

export default Avatar
