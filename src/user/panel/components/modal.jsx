import React, {Component} from 'react';
import '../../../main.css';
export default class Modal extends Component {
    constructor(props){
        super(props);
        this.state = {
            modal : ''
        }
    }
    modalShow = () =>{
        if(this.state.modal === ''){
            this.setState({modal : 'active'});
        }
        else this.setState({modal : ''});
    }
    render(){
        return(
            
                <div className={this.props.subname + " "+"modal-all " + this.state.modal}>
                    {this.props.type === undefined &&
                    <button type="button" onClick={this.modalShow} className={this.props.classButon + " "+ this.state.modal + " inline-item "}>{this.props.namebutton} <ion-icon name={this.props.icon}></ion-icon></button>}
                    {this.props.type === true &&
                    <button type="button" onMouseDown={this.modalShow} className={this.props.classButon + " "+ this.state.modal + " inline-item "}>{this.props.namebutton} <ion-icon name={this.props.icon}></ion-icon></button>}
                    <div className={this.props.subname + " "+"modal-to-show " + this.state.modal}>
                        <button className="button-display-data button-hide" type="button" onClick={this.modalShow}>X</button>
                        <div className="modal-body">{this.props.children}</div>
                    </div>
                </div>
        )
    }
}