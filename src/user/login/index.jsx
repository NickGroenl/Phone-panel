import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import md5 from 'md5';
import { InputText } from 'primereact/inputtext';


import './login.css';


import Cookies from 'universal-cookie';
const api = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/users'});
const cookies = new Cookies();


class RenderLogin extends Component{
    constructor(){
        super();
        this.state = {
            message_error : '',
            path : '/login'
        }
    }
    componentDidMount(){
        if(cookies.get("user_id")) this.setState({ path: '/panel'});
    }
    handleSubmit = async (e) =>{
        e.preventDefault();

        const data = {
            name : this.name,
            password : this.password
        }
        if(data.name !== undefined && data.password !== undefined)
        {
            
            data.password = md5(data.password);
            await api.get('/', {params: {user_name: data.name, user_password: data.password } } )
            .then(response =>{
                return response.data;
            })
            .then(response =>{
                if(response.length !== 0){
                    cookies.set('user_id', response[0].user_id, {path: "/"});
                    cookies.set('user_panelid', response[0].user_panelid, {path: "/"});
                    this.setState({ path : '/panel'});
                }
                else this.setState({ message_error : '! Contraseña o nombre de usuario incorrecto'});
            })
            .catch(error=>{
                this.setState({ message_error : '! Contraseña o nombre de usuario incorrecto'});
            })
        } else this.setState({ message_error : '! Completa los campos de texto'});
        
    }
    redirectTo = (param) =>{
        this.setState({path: param});
    }
    render(){
        
        return(
            <div className="container">
                <Redirect to={this.state.path}></Redirect>
                <div className="card-login">
                    <img src="https://wedoapp.net/static/media/logo.2558f779.png" alt="logo"></img>
                    
                    <form onSubmit={this.handleSubmit}>
                        <div className="p-col-12 p-md-4">

                            <h1> Ingresa tus datos</h1>
                
                            <div className="field">
                                <InputText keyfilter="alpha" onChange={e => this.name = e.target.value}/> 
                                <label> Nombre de usuario</label>
                            </div>
                            <div className="field">
                                <InputText type="password" keyfilter="alphanum" onChange={e => this.password = e.target.value}/> 
                                <label> Contraseña</label>
                            </div>
                            <div className="align-left">
                                <span>{this.state.message_error}</span>
                            </div>
                            
                            <button type="submit" className="btn btn-rounded color-blue">Iniciar sesion 
                                <ion-icon name="arrow-forward"></ion-icon>
                            </button>

                            <button className="btn btn-dark" onClick={() => this.redirectTo('/register')}> o Registrarse</button>


                            
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default RenderLogin;