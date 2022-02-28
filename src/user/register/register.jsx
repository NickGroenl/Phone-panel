import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import md5 from 'md5';
import { InputText } from 'primereact/inputtext';


import emailjs from 'emailjs-com';

import '../login/login.css';


import Cookies from 'universal-cookie'; 
const api = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/users/'});
const cookies = new Cookies();

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
      return v.toString(16);
    });
  }
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

class RenderRegister extends Component{
    constructor(){
        super();
        this.state = {
            message_error : '',
            path : '/register',
            class_verify : "confirm",
        }
    }
    componentDidMount(){
        if(cookies.get("user_id")) this.setState({ path: '/panel'});
              
    }
    redirectTo = (param) =>{
        this.setState({path: param});
    }
    handleSubmit = async (e) =>{
        e.preventDefault();

        const data = {
            name : this.name,
            password : this.password,
            email : this.email
        } 
        if(data.name !== undefined && data.password !== undefined && data.email !== undefined)
        {
              
            data.password = md5(data.password);
            const toapi = {
                user_id: guidGenerator(),
                user_panelid: uuidv4(),
                user_name: data.name,
                user_email: data.email,
                user_image: "https://www.quechida.com/img_productos/5a8e162dce3f7.png",
                user_subscription: 0,
                user_subaccounts : 0,
                user_administrator : 3,
                user_password: data.password
                
            };
            await api.get('', {params: {user_email: data.email, user_name: data.name}}).then(response =>{
                if(response.data.length < 1){
                    api.post("", toapi)
                    .then((res) => {
                        this.setState({class_verify : 'confirm active'})
                        var templateParams = {
                            from_name: data.name,
                            email: data.email,
                            message : 'https://tecnologiaysoluciones.mx/panel/ASASAas45660vnasdjghs/' + res.data.user_id
                        }; 
                        emailjs.send('service_e9ywehr', 'template_1qaqw4p', templateParams, 'user_uo6AUzAlNEh003UwS48AR')
                        
                    })
                    .catch((err) => console.log(err));
                } else {
                    this.setState({ message_error : '! Correo electronico ya existente'});
                }
            })
            
        } else this.setState({ message_error : '! Completa los campos de texto'});
        
    }
    
    render(){
        
        return(
            <div className="container">
                <Redirect to={this.state.path}/>

                <div className="card-login">
                    <img src="../" alt="logo"></img>
                    
                    <form onSubmit={this.handleSubmit}>
                        <div className="p-col-12 p-md-4">

                            <h1> Ingresa tus datos</h1>
                
                            <div className="field">
                                <InputText keyfilter="alpha" onChange={e => this.name = e.target.value}/> 
                                <label> Nombre de usuario</label>
                            </div>
                            <div className="field">
                                <InputText type="password"  keyfilter="alphanum" onChange={e => this.password = e.target.value}/> 
                                <label> Contraseña</label>
                            </div>
                            <div className="field">
                                <InputText keyfilter="email" onChange={e => this.email = e.target.value}/> 
                                <label> Correo electronico</label>
                            </div>
                            <div className="align-left">
                                <span>{this.state.message_error}</span>
                            </div>
                            
                            <button type="submit" className="btn btn-rounded color-blue">Registrar +
                            </button>

                            <div className={this.state.class_verify}> Usuario registrado.</div>

                            <button className="btn btn-dark" onClick={() => this.redirectTo('/login')}> o Iniciar sesion</button>
                            
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default RenderRegister;