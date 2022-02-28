import React, {Component} from 'react';
import Menu from '../menu';
import Modal from './../modal';

import md5 from 'md5';

import axios from 'axios';
import Cookies from 'universal-cookie';

import {
    NotificationContainer,
    NotificationManager
  } from "react-light-notifications";

import { InputText } from 'primereact/inputtext';

var cookies = new Cookies();

const users = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/users/'});

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
class EditUser extends Component{
    constructor(props){
        super(props)
        this.state = {
            user : this.props.array
        }
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        let data = this.state.user;
        if(this.name !== undefined) data.user_name = this.name;
        if(this.password !== undefined) data.user_password = md5(this.password);
        if(this.email !== undefined) data.user_email = this.email;
        if(this.rank !== undefined) data.user_administrator = Number(this.rank);

        let none = false;
        for(var i=0; i<this.props.allusers.length;i++){
            if(this.props.allusers[i].user_name === this.name){
                none = true;
                break;
            }
        }
        if(none !== true){
        await users.put(`${data.id}`, data).then(response =>{      
            if(response){
                NotificationManager.success({
                title: 'Editado',
                message: 'Editaste el usuario'
            });
            window.location.reload();
            
        }})
        }else NotificationManager.error({
            title: 'Error',
            message: 'Ya existe un usuario con ese nombre'
        });
        
    }
    render(){
        let rank = '';
        switch(this.props.array.user_administrator){
            case 0: rank = "Tecnico"; break;
            case 1: rank = "Supervisor"; break;
            case 2: rank = "Administrador"; break;
            case 3: rank = "Propietario";
        }
        return(
            <Modal namebutton="" classButon="btn btn-dark" icon="pencil">
                <form className="align-center" onSubmit={this.handleSubmit}>
                        
                    Añadir usuario
                    <InputText placeholder={"Nombre de usuario: " + this.props.array.user_name} keyfilter={/^[^#<>*!]+$/} onChange={e => this.name = e.target.value}/>
                    <InputText placeholder={"Contraseña"} keyfilter={/^[^#<>*!]+$/} onChange={e => this.password = e.target.value}/>
                    <InputText placeholder={"Correo electronico: " + this.props.array.user_email} keyfilter="email" onChange={e => this.email = e.target.value}/>
                    <select className="w-75" name="Categoria" onChange={e => this.rank = e.target.value}>
                        <option value={-1}> Rango(Actual: {rank})</option>
                        <option value={0}> Tecnico</option>
                        <option value={1}> Supervisor</option>
                        <option value={2}> Administrador</option>
                    </select>
                                        
                                    
                    <button type="submit" className="btn btn-dark">Terminar</button>
                </form>
            </Modal>
        )
    }
}
export default class Users extends Component{
    constructor(){
        super();
        this.state = {
            users : [],
            allusers: [],
            subscription : -1
        }
    }
    componentDidMount(){
        this.getData();
    }
    async getData(){
        await users.get('', {params: {user_panelid : cookies.get('user_panelid')}}).then(response => {
            if(response.data.length > 0){
                this.setState({users : response.data, allusers: response.data});
                for(var i=0; i<response.data.length;i++) if(response.data[i].user_id === cookies.get('user_id')){ 
                    this.setState({subscription: response.data[i].user_subscription});
                    break;
                }
            }
        })
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        if(this.state.subscription !== -1)
        {
            let none = false;
            
            if(this.name !== undefined && this.password !== undefined && this.email !== undefined && this.rank !== undefined){ 
                for(var i=0; i<this.state.allusers.length;i++){
                    if(this.state.allusers[i].user_name === this.name){
                        none = true;
                        break;
                    }
                }
                const toapi = {
                    user_id: guidGenerator(),
                    user_panelid: cookies.get('user_panelid'),
                    user_name: this.name,
                    user_email: this.email,
                    user_image: "https://www.quechida.com/img_productos/5a8e162dce3f7.png",
                    user_subscription: this.state.subscription,
                    user_subaccounts : 0,
                    user_administrator : Number(this.rank),
                    user_password: md5(this.password),
                    user_phone: " ",
                    user_biss: " ",
                    user_date: " ",

                    tohouse: "off",
                    inline: "off",
                };
                if(none === false){
                    users.post('', toapi).then(response =>{
                        if(response) NotificationManager.success({
                            title: 'Añadido',
                            message: 'Añadiste un usuario'
                        });
                        window.location.reload();
                    })
                }else NotificationManager.error({
                    title: 'Error',
                    message: 'Ya existe un usuario con ese nombre'
                });
            }else NotificationManager.error({
                title: 'Error',
                message: 'Completa el formulario'
            });
        }
        
    }
    deleteItem = async(index) =>{
        await users.delete(`/${index}`).then(response =>{
            if(response) window.location.reload();
        })
    }
    updateRank = async(index, rank) =>{
        let data;
        let administrador;
        await users.get('', {params: { id: index}}).then(response => {
            if(response.data.length > 0){
                administrador = response.data[0].user_administrator;
                data = response.data[0];
                data.user_administrator = Number(rank);
            }
        })
        if(data !== undefined && administrador !== 3)
        await users.put(`${index}`, data).then(response=>{
            if(response) this.getData();
        })
    
    }
    render(){
        const _this = this;
        const list = this.state.users.length > 0 && this.state.users.map(function(array, index){
            let rank = '';
            switch(array.user_administrator){
                case 0: rank = "Tecnico"; break;
                case 1: rank = "Supervisor"; break;
                case 2: rank = "Administrador"; break;
                case 3: rank = "Propietario";
            }
            if(array.user_id !== cookies.get('user_id'))
            return (
                <tr key={index} className="table-body">
                    <td>{index+1}</td>
                    <td><img src={array.user_image} alt="logo-profile" width="100px" height="100px"/></td>
                    <td>{array.user_name}</td>
                    
                    <td>{rank}
                    {array.user_administrator === 3 && <ion-icon name="bag-check"></ion-icon>}
                        <select className="w-25" name="Categoria" onChange={(e) => _this.updateRank(array.id, e.target.value)}>
                            <option value={-1}> Rango</option>
                            <option value={0}> Tecnico</option>
                            <option value={1}> Supervisor</option>
                            <option value={2}> Administrador</option>
                        </select>
                    </td>
                    
                    <td>{array.user_id}</td>
                    
                    
                    <td>
                    <EditUser array={array} allusers={_this.state.allusers}/>
                    <Modal namebutton="" classButon="btn btn-danger" icon="trash">
                        <p>¿Seguro que quieres eliminar el usuario {array.user_name}?</p>
                       
                        <button className="btn btn-danger" onClick={() => _this.deleteItem(array.id)}> Eliminar</button>
                    </Modal>
                    </td>
                </tr>
            )
        })
        return (
            <div className="container-fluid">
                <Menu rute="/panel/users"/>
                <NotificationContainer/>

                <div className="panel-body align-center">
                        
                    <div className="panel-header nextdiv">
                        <div>
                            <form className="form-order inline-item align-center" onSubmit={this.handleSubmit}>
                    
                                Añadir usuario
                                <InputText placeholder="Nombre de usuario" keyfilter={/^[^#<>*!]+$/} onChange={e => this.name = e.target.value}/>
                                <InputText placeholder="Contraseña" keyfilter={/^[^#<>*!]+$/} onChange={e => this.password = e.target.value}/>
                                <InputText placeholder="Correo electronico" keyfilter="email" onChange={e => this.email = e.target.value}/>
                                <select className="w-75" name="Categoria" onChange={e => this.rank = e.target.value}>
                                    <option value={-1}> Rango</option>
                                    <option value={0}> Tecnico</option>
                                    <option value={1}> Supervisor</option>
                                    <option value={2}> Administrador</option>
                                </select>
                                    
                                
                                <button type="submit" className="btn btn-dark">Terminar</button>
                            </form>
                            <div className="table-responsive inline-item table-order">
                                <table className="table">
                                    <thead>
                                        <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Imagen</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Rango</th>
                                        <th scope="col">User ID</th>
                                        <th scope="col">Opcion</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list}
                                    </tbody>
                                </table>
                            </div>
                        
                            
                        </div>
                    </div>


                </div>
                    
            </div>
        )
    }
}