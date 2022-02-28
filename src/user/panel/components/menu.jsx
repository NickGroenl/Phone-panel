import {Redirect} from 'react-router-dom';

import { Component } from 'react';
import axios from 'axios';

import Cookies from 'universal-cookie';
var cookies = new Cookies();

let data = {};
class Menu extends Component{
    constructor(props){
        super(props);
        this.state = {
            menu : '',
            path : this.props.rute
        };
    }
    async componentDidMount(){
        if(!cookies.get('user_id')) this.setState({path : '/'}); 
        else {
            await axios.get('https://appisolutions.herokuapp.com/users', {params: {user_id: cookies.get('user_id')}}).then(response =>
                {
                    return response;
                }).then(response => {
                    data = response.data[0];
            })
        }      
    }
    
    onClickChangeMenu = () =>{
        if(this.state.menu === '')
        {
            this.setState({ menu : 'active'});
        } else this.setState({ menu : ''});
    }
    updateRoute = (path) => this.setState({path: path});

    
    closeSession = () =>{
        cookies.remove('user_id', {path: '/'});
        this.setState({path : '/'})
    }
    
    
    render(){
        return(
            <div>
                <Redirect to={this.state.path}></Redirect>
                <div className="general-menu">
                    <div className={'menu ' + this.state.menu}>
                            <ul>
                                
                                        
                                <img src={data.user_image} alt="profilepict"></img>
                                <span>{data.user_name}</span>
                                {data.user_subscription === 0 &&
                                        <li className="submenu-item btn btn-danger">Cuenta no verificada</li>
                                }
                                { data.user_administrator > 0 &&
                                <li>
                                    <p className="inline-item">Ordenes  </p>
                                    <div className="icon-arrow-down inline-item align-rigth">
                                        =
                                    </div>
                                    <ul>
                                        <li className="submenu-item" onClick={() => this.updateRoute('/panel/orders')}>Crear orden</li>
                                        <li className="submenu-item" onClick={() => this.updateRoute('/panel/orders-all')}>Ver todo</li>
                                    </ul>
                                </li>
                                }
                                { data.user_administrator > 1 && data.user_subscription > 1 &&
                                <li onClick={() => this.updateRoute('/panel/users')}> Usuarios</li>
                                }
                                {data.user_subscription >= 1 &&
                                <li onClick={() => this.updateRoute('/panel/clients')}>Clientes</li>
                                }
                                {data.user_subscription >= 1 && data.user_administrator !== 1 && 
                                <li onClick={() => this.updateRoute('/panel/repair')}>Reparación</li>
                                }
                                {data.user_subscription >= 0 && data.user_administrator > 0 &&
                                <li>
                                    <p className="inline-item">Inventario </p>
                                    <div className="icon-arrow-down inline-item align-rigth">
                                        =
                                    </div>
                                    <ul>
                                        <li className="submenu-item" onClick={() => this.updateRoute('/panel/inventory')}>Editar stock </li>
                                        <li className="submenu-item" onClick={() => this.updateRoute('/panel/inventory-all')}>Ver todo</li>
                                    </ul>
                                </li>
                                }
                                {data.user_subscription >= 0 && data.user_administrator > 0 &&
                                <li>
                                    <p className="inline-item">Gastos y Compras </p>
                                    <div className="icon-arrow-down inline-item align-rigth">
                                        =
                                    </div>
                                    <ul>
                                        <li className="submenu-item" onClick={() => this.updateRoute('/panel/ods')}>Gasto a ODS </li>
                                        <li className="submenu-item" onClick={() => this.updateRoute('/panel/buy')}>Compras</li>
                                        <li className="submenu-item" onClick={() => this.updateRoute('/panel/entry')}>Ingresos</li>
                                    </ul>
                                </li>
                                }
                                { data.user_administrator >= 0 &&
                                <li>
                                    <p onClick={() => this.updateRoute('/panel/services')}>Servicios</p>
                                </li>
                                }
                                { data.user_administrator > 1 &&
                                <li>
                                    <p onClick={() => this.updateRoute('/panel/subscription')}>Subscripcion</p>
                                </li>
                                }
                                <li onClick={() => this.updateRoute('/panel/configuration')}>
                                    <p className="inline-item">Configuración </p>
                                    
                                </li>
                                <li>
                                    <p className="inline-item" onClick={this.closeSession}>
                                        Cerrar sesion </p>
                                    
                                </li>
                                <li>

                                </li>
                                <li></li>
                                <li>Desarrollado por How We Do</li>
                        </ul>
                        
                    </div>
                    <button className={"button-show " + this.state.menu} onClick={this.onClickChangeMenu}>
                        <ion-icon name="chevron-back-sharp"></ion-icon>
                    </button>
                </div>
                
            </div>
            
        )
    }
}

export default Menu;