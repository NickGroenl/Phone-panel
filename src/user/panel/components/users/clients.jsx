import React, {Component} from 'react';
import Menu from '../menu';
import Modal from './../modal';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import {
    NotificationContainer,
    NotificationManager
  } from "react-light-notifications";
import "react-light-notifications/lib/main.css";

import axios from 'axios';
import Cookies from 'universal-cookie';

import { InputText } from 'primereact/inputtext';

var cookies = new Cookies();

const clients = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/clients/'});
const repair = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/repairs'});
const orders = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/orders'});


function analitycData(json, input){
    var similars = 0;
    var array = [];
    
    for(var i=0; i<json.length; i++)
    {
        


        for(var a=0;a<json[i].client_date.length;a++){
         if(json[i].client_date[a] === input[a])similars++;}
        if(similars < 3){
            similars = 0;
            for(var b=0;b<json[i].client_name.length;b++){
                if(json[i].client_name[b] === input[b])similars++;}
        }
        
        if(similars > 3){
            array.push(json[i]);
        }
    }
    const uniques = array.filter((item, idx) => array.indexOf(item) === idx);
    return uniques;
}


class EditClient extends Component{
    constructor(props){
        super(props);
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        
            let data = this.props.array;




            if(this.name !== undefined) {data.client_name = this.name;}
            if(this.phone !== undefined) {data.client_phone = this.phone;}
            if(this.type !== undefined) {data.client_type = this.type;}
            if(this.email !== undefined) {data.client_email = this.email;}
            
            let none = false;
            for(var i=0; i<this.props.allclients.length;i++){
                if(this.props.allclients[i].client_name === this.name){
                    none = true;
                    break;
                }
            }
            if(none !== true){
            await clients.put(`${data.id}`, data).then(response =>{      
                    if(response){
                        NotificationManager.success({
                        title: 'Editado',
                        message: 'Editaste el cliente'
                    });
                    window.location.reload();
                }
            })
            }else NotificationManager.error({
                title: 'Error',
                message: 'Ya existe un cliente con ese nombre'
            });
        
    }
    render(){
        
        return(
            <Modal namebutton="" classButon="btn btn-dark" icon="pencil">

                <form className="align-center" onSubmit={this.handleSubmit}>
                    
                        <InputText className="w-100" placeholder={"Nombre: " + this.props.array.client_name} keyfilter={/^[^#<>*!]+$/} onChange={e => this.name = e.target.value}/>
                        <InputText className="w-100" placeholder={"Telefono: " + this.props.array.client_phone} keyfilter={/^[^#<>*!]+$/} onChange={e => this.phone = e.target.value}/>
                        <InputText className="w-100" placeholder={"Email: " + this.props.array.client_email} keyfilter="email" onChange={e => this.email = e.target.value}/>
                        <select className="w-100" name="Categoria" onChange={e => this.type = e.target.value}>
                            <option value={-1}> Tipo: {Number(this.props.array.client_type) === 0 && 'Publico' || Number(this.props.array.client_type) === 1 && 'Mayorista' || Number(this.props.array.client_type) === 2 && 'Reseller'}</option>
                            <option value={0}> Publico</option>
                            <option value={1}> Mayorista</option>
                            <option value={2}> Reseller</option>
                        </select>
                                    
                                
                    <button type="submit" className="btn btn-dark">Terminar</button>
                </form>
            </Modal>
        )
    }
}

export default class Clients extends Component{
    constructor(){
        super();
        this.state = {
            clients : [],
            allclients : []
        }
    }
    componentDidMount(){
        this.getData();
    }
    async getData(){
        await repair.get('', {params: {panelid : cookies.get('user_panelid')}}).then(response => {
            if(response.data.length > 0){
                this.setState({repairs: response.data})
            }
        })
        await orders.get('', {params: {order_userid : cookies.get('user_panelid')}}).then(response => {
            if(response.data.length > 0){
                this.setState({orders: response.data})
            }
        })
        await clients.get('', {params: {client_panelid : cookies.get('user_panelid')}}).then(response => {
            if(response.data.length > 0){
                this.setState({clients: response.data, allclients: response.data})
            }
        })
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        var none = false;
        if(this.name !== undefined && this.phone !== undefined && this.email !== undefined && this.type !== undefined){ 
            for(var i=0; i<this.state.allclients.length;i++){
                if(this.state.allclients[i].client_name === this.name){
                    none = true;
                    break;
                }
            }
            if(none === false){
            const toapi = {
                client_panelid : cookies.get('user_panelid'),
                client_name : this.name,
                client_phone : this.phone,
                client_type: this.type,
                client_email: this.email,
                client_date : new Date().toLocaleString()
            };
            clients.post('', toapi).then(response =>{
                if(response){ NotificationManager.success({
                    title: 'Añadido',
                    message: 'Añadiste un cliente'
                  });
                window.location.reload();}
            })
        }else NotificationManager.error({
                title: 'Error',
                message: 'El nombre del cliente ya existe'
              });
        }else NotificationManager.error({
            title: 'Error',
            message: 'Completa el formulario'
          });
        
    }
    deleteItem = async(index) =>{
        await clients.delete(`/${index}`).then(response =>{
            if(response) window.location.reload();
        })
    }
    filterData = async(e) =>{
        if(e.target.value.length > 2){
            const data = analitycData(this.state.allclients, e.target.value);
            if(data.length > 0)
            this.setState({clients: data});
        } else this.setState({clients: this.state.allclients})
    }
    render(){
        const _this = this;
        const list = this.state.clients.length > 0 && this.state.clients.map(function(array, index){
            var repairs = 0;
            var orders = 0;
            if(_this.state.orders !== undefined && _this.state.repairs !== undefined){
                for(var i = 0;i<_this.state.orders.length;i++){
                    for(var c=0; c<_this.state.orders[i].order_items.length; c++){
                        if(_this.state.orders[i].order_items[c].product_client === array.id) orders++;
                    }
                }
                for(var i = 0;i<_this.state.repairs.length;i++){
                    console.log(_this.state.repairs[i].client_id, array.id);
                    if(_this.state.repairs[i].client_id === array.id) repairs++;
                }
                
            }
            return (
                <tr key={index} className="table-body">
                    <td>{index+1}</td>
                    <td>{array.client_name}</td>
                    
                    
                    <td>{array.client_phone}</td>
                    <td>{array.client_email}</td>
                    <td>{Number(array.client_type) === 0 && 'Publico' || Number(array.client_type) === 1 && 'Mayorista' || Number(array.client_type) === 2 && 'Reseller'}</td>
                    
                    
                    <td>
                    <EditClient array={array} allclients={_this.state.allclients}/>
                    <Modal namebutton="" classButon="btn btn-danger" icon="trash">
                        <p>¿Seguro que quieres eliminar al cliente?</p>
                        <p> Tiene un total de ({orders}) ordenes y ({repairs}) reparaciones ligadas</p>
                        <button className="btn btn-danger" onClick={() => _this.deleteItem(array.id)}> Eliminar</button>
                    </Modal>
                    
                    </td>
                </tr>
            )
        })
        const listxml = this.state.clients.length > 0 && this.state.clients.map(function(array, index){
            
            return (
                <tr key={index} className="table-body">
                    <td>{index+1}</td>
                    <td>{array.client_name}</td>
                    
                    
                    <td>{array.client_phone}</td>
                    <td>{array.client_email}</td>
                    <td>{Number(array.client_type) === 0 && 'Publico' || Number(array.client_type) === 1 && 'Mayorista' || Number(array.client_type) === 2 && 'Reseller'}</td>
                    
                </tr>
            )
        })
        return (
            <div className="container-fluid">
                <Menu rute="/panel/clients"/>
                <NotificationContainer/>

                <div className="panel-body align-center">
                        
                    <div className="panel-header nextdiv">
                        <div>   

                            <form className="form-order inline-item align-center" onSubmit={this.handleSubmit}>
                    
                                Añadir Cliente
                                <InputText placeholder="Nombre" keyfilter={/^[^#<>*!]+$/} onChange={e => this.name = e.target.value}/>
                                <InputText placeholder="Telefono" keyfilter={/^[^#<>*!]+$/} onChange={e => this.phone = e.target.value}/>
                                <InputText placeholder="Email" keyfilter="email" onChange={e => this.email = e.target.value}/>
                                <select className="w-75" name="Categoria" onChange={e => this.type = e.target.value}>
                                    <option value={-1}> Tipo</option>
                                    <option value={0}> Publico</option>
                                    <option value={1}> Mayorista</option>
                                    <option value={2}> Reseller</option>
                                </select>
                                    
                                
                                <button type="submit" className="btn btn-dark">Terminar</button>
                            </form>
                            <div className="table-responsive inline-item table-order">
                                <InputText className="dont-expand" placeholder="Filtrar por Fecha, Nombre)" keyfilter={/^[^#<>*!]+$/} onChange={this.filterData}/> 

                                <table className="table">
                                    <thead>
                                        <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Telefono</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Tipo</th>
                                        <th scope="col">Opcion</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list}
                                    </tbody>
                                </table>



                            </div>
                            <div className="w-100 align-center">
                                <table className="table d-none" id="tabletoexcel">
                                    <thead>
                                        <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Telefono</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Tipo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listxml}
                                    </tbody>
                                </table>
                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="w-25 btn btn-primary"
                                    table="tabletoexcel"
                                    filename="clients"
                                    sheet="tablexls"
                                    buttonText="Descargar EXCEL"/>
                                    
                
                            </div>
                        
                            
                        </div>
                    </div>


                </div>
                    
            </div>
        )
    }
}