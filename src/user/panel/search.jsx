import React, {Component} from 'react';
import {

    
    Redirect
} from "react-router-dom";
import { InputText } from 'primereact/inputtext';


import axios from 'axios';
const repair = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/repairs'});

function getMark(i){
    switch(i){
        default: return 'No tiene';
        case 1: return 'Samsung';
        case 2: return 'Huawei';
        case 3: return 'Motorola';
        case 4: return 'Xiaomi';
        case 5: return 'Iphone';

    }   
}
export default class RenderSearch extends Component{
    constructor(){
        super();
        this.state = {
            path: "/search",
            repair: {},
        }
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        if(this.find !== undefined){
            var ss = this.find.split("-");
            if(ss[0] === '00'){
                await repair.get('', {params:{id: Number(ss[1])}}).then(response =>{
                    
                    if(response.data.length > 0) {this.setState({repair: response.data[0]})}
                    else this.setState({message_error: 'No se encontro ese ID'})
                    
                })

            }
        }
    }
    render(){
        let btn = this.state.repair.state === 1 && "danger" || this.state.repair.state === 2 && "success" || this.state.repair.state === 3 && "warning" || this.state.repair.state === 4 && "primary" || this.state.repair.state === 5 && "secondary"
        return(
            <div className="container align-center">
                <Redirect to={this.state.path}></Redirect>
                <div className="card-login">
                    <img src="https://wedoapp.net/static/media/logo.2558f779.png" alt="logo"></img>
                    
                    <form onSubmit={this.handleSubmit}>
                        <div className="p-col-12 p-md-4">

                            <h1> Busca tu Orden de Servicio</h1>
                
                            <div className="field">
                                <InputText keyfilter="int" onChange={e => this.find = e.target.value}/> 
                                <label> Ingresa el codigo(Ejemplo: 00-1)</label>
                            </div>
                            
                            <div className="align-left">
                                <span>{this.state.message_error}</span>
                            </div>
                            
                            <button type="submit" className="btn btn-rounded btn-outline-dark">Buscar
                                <ion-icon name="arrow-forward"></ion-icon>
                            </button>

                            


                            
                        </div>
                    </form>
                </div>
                <div className="align-center">
                   <button className={"btn btn-" + btn}> Estado de servicio: {this.state.repair.state === 1 && "Por reparar" || this.state.repair.state === 2 && "Entregado" || this.state.repair.state === 3 && "Sin reparacióm" || this.state.repair.state === 4 && "En proceso" || this.state.repair.state === 5 && "Reparado"}</button>
                    <p> Precio: ${this.state.repair.pricetotal}</p>
                    <p> Pago Inicial: ${this.state.repair.payinit}</p>
                    <p>Abono: ${this.state.repair.pay}</p>
                    <p> Marca: {getMark(this.state.repair.mark)}</p>
                    <p> Modelo: {this.state.repair.model}</p>
                </div>
            </div>
        )
    }
}