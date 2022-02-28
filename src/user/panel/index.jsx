import React, {Component} from 'react';
import Menu from './components/menu';

import './main.css';
import './index.css';


class RenderPanel extends Component {   
    render(){
        return(
            <div className="container-fluid">
                <Menu rute="/panel" />
                
                <div className="panel-body">
                    <div className="panel-header">
                        <div className="cards white">
                            <h1> This title</h1>
                            <div>
                                <p> This info</p>
                            </div>
                        </div>
                        <div className="cards red">
                            <h1> This title</h1>
                            <div>
                                <p> This info</p>
                            </div>
                        </div>
                        <div className="cards blue">
                            <h1> This title</h1>
                            <div>
                                <p> This info</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        )
    }
}
export default RenderPanel;