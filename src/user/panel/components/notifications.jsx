import React, {Component} from 'react';

export default class Notifications extends Component {
    constructor(props){
        super(props);
        this.state = {
            list : this.props.list,
        }
    }
    render(){
        let list = this.state.list.length > 0 && this.state.list.map(function(array, index){
            return(
                <div className={"btn btn-"+array.background} key={index}>
                    <p className="w-100"> <ion-icon name={array.icon}></ion-icon> {array.text}</p>
                </div>
            )
        })
        return(
            <div className="menu-not">
                {list}
            </div>
        )
    }
}