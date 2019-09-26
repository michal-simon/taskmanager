import React, { Component } from 'react'
import {
    Card, CardImg, CardText, CardBody,
    CardHeader,
    CardTitle, CardSubtitle, Button
} from 'reactstrap'

export class CardModule extends Component {
    render () {
        const cardHeader = this.props.header
            ? <CardHeader style={{ 'backgroundColor': '#FFF', 'borderBottom': 'none' }} className="mb-2">
                {this.props.header}
            </CardHeader>
            : ''
        const cardBody = this.props.body === true
            ? <CardBody className={(this.props.hCenter ? ' text-center' : '')}>
                {cardHeader}

                <div className="card-content">
                    {this.props.content}
                </div>

            </CardBody>
            : this.props.content

        const height = this.props.cardHeight ? this.props.cardHeight : ''
        return (
            <Card style={{height: height}}>
                <div className="card-content">
                    {cardBody}
                </div>

            </Card>
        )
    }
}

export default CardModule