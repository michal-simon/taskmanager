import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,Input,FormGroup,Label } from 'reactstrap';
import axios from 'axios'
import TabContent from '../tabs/TabContent';

class ViewTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          modal: false,
          errors: []
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
          modal: !this.state.modal
        });
    }

    render() {
        return (
        
            <div>
                <a href="#" onClick={this.toggle}>{this.props.task.title}</a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Add Story
                    </ModalHeader>
                    
                    <ModalBody>
                       <TabContent task={this.props.task}/>
                    </ModalBody>

                    <ModalFooter>
                        {/* <Button color="primary" onClick={this.handleClick.bind(this)}><i className="fas fa-plus-circle"></i> Add</Button> */}
                        <Button color="secondary" onClick={this.toggle}><i className="fas fa-times-circle"></i> Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default ViewTask;