import React, {Component} from 'react';
import Menu from './../menu';
import { InputText } from 'primereact/inputtext';
import {
    NotificationContainer,
    NotificationManager
  } from "react-light-notifications";
import "react-light-notifications/lib/main.css";
import Select from "react-select";
import Modal from './../modal';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import axios from 'axios';
import Cookies from 'universal-cookie';

function getType(i){
    switch(i){
        default: return 'No tiene';
        case 1: return 'Pantalla';
        case 2: return 'Centro de carga';
        case 3: return 'Bateria';
        case 4: return 'Tapa';
        case 5: return 'Flex';
        case 6: return 'Otro';

    }   
}

const cookies = new Cookies();
const ods = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/ods'});
const repair = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/repairs'});
const services = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/services'});
function analitycData(json, input){
    var similars = 0;
    var array = [];
    for(var i=0; i<json.length; i++)
    {
        for(var c=0;c<json[i].date.length;c++)
        {
            if(json[i].date[c] === input[c])
            {
                similars++;
            }
        }
        if(similars > 2){
            array.push(json[i]);
            similars = 0;
        }else if(c > json[i].date.length -1) similars = 0;
    }
    const uniques = array.filter((item, idx) => array.indexOf(item) === idx);
    return uniques;
}
class RunTable extends Component {
    constructor(){
        super();
        this.state = {
            ods : [],
            repair: []
            
        }
        
    }
    
    componentDidMount(){
        this.getData();
    }

    async getData(){
        await ods.get('', {params:{panelid: cookies.get('user_panelid')}}).then(res =>{
            if(res.data.length > 0){  
                this.setState({ods : res.data});
            }
        })
        await repair.get('', {params : { panelid: cookies.get('user_panelid')}}).then(res =>{
            if(res) {
                var global = 0;
                for(var i=0;i<res.data.length;i++) global += res.data[i].price;
                
                this.setState({repair: res.data, total: global});
            }
        })
        
    } 
    
    deleteItem = async(index) =>{
        ods.delete(`/${index}`).then(res=>{
            if(res) window.location.reload();
        })
        
    }
    
    filterData = async(e) =>{
        if(e.target.value.length < 3) await ods.get('', {params : {panelid: cookies.get('user_panelid')}}).then(response =>{
            this.setState({orders : response.data});
        })
        const data = analitycData(this.state.ods, e.target.value);
        if(data.length > 0)
        this.setState({ods: data});
    }
    render(){
        let _this = this;
        let list = this.state.ods.length > 0 && this.state.ods.map(function(array, index){
            var final = 'Nada';
            for(var i = 0; i<_this.state.repair.length; i++){
                if(Number(array.ods) === Number(_this.state.repair[i].id)){ 
                    final = _this.state.repair[i].model;
                    
                    break;
                }
            }
            
            return(
                <tr key={index} className="bg-white" id={"topdf" + array.id}>

                    <th scope="row">
                
                    <p className="text-dark">{array.id
                    }</p>
                    </th>
                    
                    <td>{getType(array.type)}</td>
                    <td>{array.price}</td>
                    <td>{array.note}</td>   

                    <td> 
                        {final}
                    </td>
                    
                    <td>{array.date}</td>   
                         
                    <td>
                        <button className="btn btn-danger w-50" onClick={() => _this.deleteItem(array.id)}>Eliminar</button>
                    </td>
                </tr>
                    
            )
        });
        let listxml = this.state.ods.length > 0 && this.state.ods.map(function(array, index){
            var final = 'Nada';
            for(var i = 0; i<_this.state.repair.length; i++){
                if(Number(array.ods) === Number(_this.state.repair[i].id)){ 
                    final = _this.state.repair[i].model;
                    
                    break;
                }
            }
            
            return(
                <tr key={index} className="bg-white" id={"topdf" + array.id}>

                    <th scope="row">
                
                    <p className="text-dark">{array.id
                    }</p>
                    </th>
                    
                    <td>{getType(array.type)}</td>
                    <td>{array.price}</td>
                    <td>{array.note}</td>   

                    <td> 
                        {final}
                    </td>
                    
                    <td>{array.date}</td>   
                         
                    
                </tr>
                    
            )
        })
        
        
        return(
            <div>
                

                
                <div className="table-responsive">
                    <h1>Total de dinero en Gastos a ODS es de ${this.state.total}</h1>
                    <InputText className="dont-expand" placeholder="Filtrar por fecha (DIA/MES/AÑO)" keyfilter={/^[^#<>*!]+$/} onChange={this.filterData}/> 
                    <table className="table bg-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tipo</th>
                                <th scope="col"> Precio</th>
                                <th scope="col"> Nota</th>
                                <th scope="col"> Orden</th>
                                <th scope="col"> Fecha</th>
                                <th scope="col"> Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {list}
                        </tbody>
                    </table>
                    
                </div>
                <div>
                        <table className="table d-none" id="tabletoexcel">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tipo</th>
                                <th scope="col"> Precio</th>
                                <th scope="col"> Nota</th>
                                <th scope="col"> Orden</th>
                                <th scope="col"> Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listxml}
                        </tbody>
                        </table>
                        <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="w-100 btn btn-primary"
                                    table="tabletoexcel"
                                    filename="inventory"
                                    sheet="tablexls"
                                    buttonText="Descargar EXCEL"/>
                                    
                
                </div>
            </div>
        )
    }
}




class AddItem extends Component{
    constructor(){
        super()
        this.state ={
            type : [],
            typevalue: -1,
            ods: [],
            odsvalue: -1,
            total: 0
        }
    }
    
    async componentDidMount(){
        let optionstwo = [];
        await services.get('', {params : { panelid: cookies.get('user_panelid')}}).then(res =>{
            if(res) {
                for(var i =0; i<res.data.length;i++){
                    optionstwo.push({
                        label: res.data[i].name,
                        value: res.data[i].id
                    });
                }
                
            }
        })
        let options = [];
        options.push({
            label: 'Pantalla',
            value: 1
        });
        options.push({
            label: 'Centro de carga',
            value: 2
        });
        options.push({
            label: 'Bateria',
            value: 3
        });
        options.push({
            label: 'Tapa',
            value: 4
        });
        options.push({
            label: 'Flex',
            value: 5
        });
        options.push({
            label: 'Otro',
            value: 6
        });
        this.setState({type: options, ods: optionstwo});
                
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        


        if(this.price !== undefined && this.note !== undefined && this.state.typevalue !== -1 && this.state.odsvalue !== -1)
        {
           
                
                const toapi = {
                    panelid: cookies.get('user_panelid'),
                    type : this.state.typevalue,
                    ods : this.state.odsvalue,
                    price : this.price,
                    note : this.note,
                    date: new Date().toLocaleString(),
                };
                await ods.post("", toapi)
                .then((res) => {
                    if(res) {
                        NotificationManager.success({
                            title: 'Añadido',
                            message: 'Añadiste un servicio ODS'
                          });
                        window.location.reload();
                    }
                    else NotificationManager.error({
                        title: 'Error',
                        message: 'Ocurrio un error'
                      });
                })
                .catch((err) => console.log(err));
                
            
        } else NotificationManager.error({
            title: 'Error',
            message: 'Completa el formulario'
          });
    }
    onChange = option => {
        this.setState({ typevalue: option.value });
    };
    onChange1 = option => {
        this.setState({ odsvalue: option.value });
    };
    render(){
        
        return(
            <div>
                

                <h1>Orden de servicio ({new Date().toLocaleString()})</h1>
                <div className="dropdown-divider"></div>
                <form className="form-inventory" onSubmit={this.handleSubmit}>
                    <Select
                    className="w-75 inline-item"
                    options={this.state.type}
                    onChange={this.onChange}
                    value={this.state.typevalue}
                    placeholder="Tipo"
                    />  
                    <Select
                    className="w-75 inline-item"
                    options={this.state.ods}
                    onChange={this.onChange1}
                    value={this.state.odsvalue}
                    placeholder="Orden de servicio"
                    />  

                    <InputText placeholder="Precio" keyfilter="int" onChange={e => this.price = e.target.value}/> 
                    <InputText placeholder="Nota" keyfilter="alphanumeric" onChange={e => this.note = e.target.value}/> 
                    
                    <button type="submit" className="btn btn-success">Crear gasto a ODS</button>

                </form>
            </div>
          
        )
    }
}



export default class Ods extends Component{
    render(){
        return(
            <div className="container-fluid">
                <Menu rute="/panel/ods"/>

                <div className="panel-body align-center">
                    <div className="panel-header nextdiv align-left">
                        <div>
                        <Modal namebutton="Añadir ODS" classButon="btn btn-dark" icon="Add">
                            
                            <AddItem/>
                        </Modal>
                        
                        <RunTable/>
                        </div>
                    </div>
                </div>
                <NotificationContainer/>
            </div>
        )
    }
}