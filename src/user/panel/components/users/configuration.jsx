import React, {Component} from 'react';
import Menu from '../menu';
import ImageUploader from 'react-images-upload';
import { InputText } from 'primereact/inputtext';
import md5 from 'md5';
import {
    NotificationContainer,
    NotificationManager
  } from "react-light-notifications";
import "react-light-notifications/lib/main.css";
import axios from 'axios';

import Cookies from 'universal-cookie';
var cookies = new Cookies();

const users = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/users/'});

export default class Configuration extends Component{
    constructor(){
        super();
        this.state = {
            pictures : 'none',
            user : {}
        }
        this.onDrop = this.onDrop.bind(this);
    }
    componentDidMount(){
        this.getData();
    }
    async getData(){
        await users.get('', {params:{user_id : cookies.get('user_id')}}).then(response=>{
            if(response.data.length > 0){
                this.setState({user: response.data[0], pictures : response.data[0].user_image})
            }
        })
    }
    handleSubmit = async(e) =>{
        e.preventDefault();

        let data;
        await users.get('', {params: { user_id: cookies.get('user_id')}}).then(response => {
            if(response.data.length > 0){
                data = response.data[0];
                if(this.name !== undefined) data.user_name = this.name;
                if(this.password !== undefined) data.user_password = md5(this.password);
                if(this.state.pictures !== 'none') data.user_image = this.state.pictures;
                if(this.namebiss !== undefined) data.user_biss = this.namebiss;
                if(this.phone !== undefined) data.user_phone = this.phone;
                if(this.date !== undefined) data.user_date = this.date;


                if(this.tohouse !== undefined) data.tohouse = this.tohouse;
                if(this.inline !== undefined) data.inline = this.inline;

                
            }
        })
        if(data !== undefined){
            await users.put(`${data.id}`, data).then(response=>{
                if(response) {
                    this.getData();
                    NotificationManager.success({
                        title: 'Guardado',
                        message: 'Editaste los datos'
                      });
                }
            })
        }else {
            NotificationManager.error({
                title: 'Error',
                message: 'Completa el formulario'
              });
        }
    }
    onDrop(pictureFiles, pictureDataURLs) {
        this.setState({
          pictures: pictureDataURLs
        });
    }
    render(){
        return(
            <div className="container-fluid">
                <Menu rute="/panel/configuration"/>
                <NotificationContainer/>
                <div className="panel-body align-center">
                    
                    <div className="panel-header nextdiv">
                        <div>
                
                            <form className="form-inventory w-100" onSubmit={this.handleSubmit}>

                                <img className="inline-item " width="100px" height="100px" src={this.state.pictures} alt="carga una imagen"></img>
                                <ImageUploader
                                    withIcon={true}
                                    buttonText='Subir'
                                    onChange={this.onDrop}
                                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                    maxFileSize={5242880}
                                />
                                <InputText className="inline-item w-50" placeholder="Nombre negocio" keyfilter={/^[^#<>*!]+$/} onChange={e => this.namebiss = e.target.value}/>
                                <InputText className="inline-item w-50" placeholder="Nombre" keyfilter={/^[^#<>*!]+$/} onChange={e => this.name = e.target.value}/>
                                <InputText className="inline-item w-50" placeholder="Contraseña" keyfilter={/^[^#<>*!]+$/} onChange={e => this.password = e.target.value}/>
                                <InputText className="inline-item w-50" placeholder="Telefono" keyfilter="int" onChange={e => this.phone = e.target.value}/>
                                <InputText className="inline-item w-50" placeholder="Direccion" keyfilter={/^[^#<>*!]+$/} onChange={e => this.date = e.target.value}/>

                                <div className="dropdown-divider"></div>

                                
                                <div>
                                    <p className="inline-item w-25"> Pedido a domicilio</p>
                                    <input className="inline-item w-25" type="checkbox" placeholder="Pedido a domicilio" onChange= {e => this.tohouse = e.target.value}/>
                                </div>
                                <div>
                                    <p className="inline-item w-25"> Venta en linea</p>
                                    <input className="inline-item w-25" type="checkbox" placeholder="Pedido a domicilio" onChange= {e => this.inline = e.target.value}/>
                                </div>
                                
                                
                                <button type="submit" className="btn btn-dark w-100">Terminar</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}