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
        case 1: return 'Programación';
        case 2: return 'Reparación';
        case 3: return 'Garantía';

    }   
}
function getDevice(i){
    switch(i){
        default: return 'No tiene';
        case 1: return 'Dispositivo Movil';
        case 2: return 'Tablet';
        case 3: return 'PC escritorio';
        case 4: return 'Laptop';

    }   
}
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
const cookies = new Cookies();
const services = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/services'});

function analitycData(json, input){
    var similars = 0;
    var array = [];
    for(var i=0; i<json.length; i++)
    {
        for(var c=0;c<json[i].name.length;c++)
        {
            if(json[i].name[c] === input[c])
            {
                similars++;
            }
        }
        if(similars > 2){
            array.push(json[i]);
            similars = 0;
        }else if(c > json[i].name.length -1) similars = 0;
    }
    const uniques = array.filter((item, idx) => array.indexOf(item) === idx);
    return uniques;
}

class RunTable extends Component {
    constructor(){
        super();
        this.state = {
            services : []
            
        }
        
    }
    
    componentDidMount(){
        this.getData();
    }

    async getData(){
        await services.get('', {params:{panelid: cookies.get('user_panelid')}}).then(res =>{
            if(res.data.length > 0){  
                this.setState({services : res.data});
            }
        })
        
    } 
    
    deleteItem = async(index) =>{
        services.delete(`/${index}`).then(res=>{
            if(res) window.location.reload();
        })
        
    }
    filterState = async(parameter) =>{
        
        if(parameter !== -1){
            
            await services.get('', {params: {panelid: cookies.get('user_panelid'), type: parameter}}).then(response => {return response; })
            .then(response =>{
                this.setState({services : response.data});
            })
            
        }
    }
    filterType = async(parameter) =>{
        
        if(parameter !== -1){
            
            await services.get('', {params: {panelid: cookies.get('user_panelid'), device: parameter}}).then(response => {return response; })
            .then(response =>{
                this.setState({services : response.data});
            })
            
        }
    }
    filterData = async(e) =>{
        if(e.target.value.length < 3) await services.get('', {params : {panelid: cookies.get('user_panelid')}}).then(response =>{
            this.setState({orders : response.data});
        })
        const data = analitycData(this.state.services, e.target.value);
        if(data.length > 0)
        this.setState({services: data});
    }
    render(){
        let _this = this;
        let list = this.state.services.length > 0 && this.state.services.map(function(array, index){
            
            return(
                <tr key={index} className="bg-white" id={"topdf" + array.id}>

                    <th scope="row">
                        <button className="button-display-data" >-</button>
                        <div className="hiddenDiv">
                            
                                <p>Garantía: {array.warranty}</p>
                                <p>Venta en linea: {array.inline === 'on' && 'Si'}{array.inline === 'off' && 'No'}</p>
                                <p>Disponible: {array.disabled === 'on' && 'Si'}{array.disabled === 'off' && 'No'}</p>
                                <p>Detalles: {array.details}</p>
                                


                        </div>
                    </th>
                    <th scope="row">
                
                    <p className="text-dark">{array.id
                    }</p>
                    </th>
                    
                    <td>{getType(array.type)}</td>
                    <td>{getDevice(array.device)}</td>
                    <td>{array.name}</td>
                    <td>{getMark(array.mark)}</td>   

                    <td> 
                        {array.model}
                    </td>
                    <td> {array.carrier}</td>
                    <td> ${array.price}</td>
                    <td> ${array.price2}</td>
                         
                    <td>
                        <button className="btn btn-danger w-50" onClick={() => _this.deleteItem(array.id)}>Eliminar</button>
                    </td>
                </tr>
                    
            )
        });
        let listxml = this.state.services.length > 0 && this.state.services.map(function(array, index){
            
            return(
                <tr key={index} className="bg-white" id={"topdf" + array.id}>
                    
                    <th scope="row">
                
                    <p className="text-dark">{array.id
                    }</p>
                    </th>
                    
                    <td>{getType(array.type)}</td>
                    <td>{getDevice(array.device)}</td>
                    <td>{array.name}</td>
                    <td>{getMark(array.mark)}</td>   

                    <td> 
                        {array.model}
                    </td>
                    <td> {array.carrier}</td>
                    <td> ${array.price}</td>
                    <td> ${array.price2}</td>
                         
                   
                </tr>
                    
            )
        })
        
        
        return(
            <div>
                <select className="w-40 inline-item" name="Categoria" onChange={e => this.filterState(e.target.value)}>
                    <option value={-1}>Filtrar por servicio</option>   
                    <option value={1}> Programación</option>      
                    <option value={2}> Reparación</option>  
                    <option value={3}> Garantía</option>  
                    
                </select>
                
                <select className="w-40 inline-item" name="Categoria" onChange={e => this.filterType(e.target.value)}>
                    <option value={-1}>Filtrar por equipo</option>   
                    <option value={1}> Dispositivo Movil</option>      
                    <option value={2}> Tablet</option>  
                    <option value={3}> PC escritorio</option>  
                    <option value={4}> Laptop</option>  
                </select>
                <InputText className="dont-expand" placeholder="Filtrar por fecha nombre" keyfilter={/^[^#<>*!]+$/} onChange={this.filterData}/> 
                <div className="table-responsive">
                    <table className="table bg-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">#</th>
                                <th scope="col"> Tipo de Servicio</th>
                                <th scope="col"> Tipo de equipo</th>
                                <th scope="col"> Nombre</th>
                                <th scope="col"> Marca</th>
                                <th scope="col"> Modelo</th>
                                <th scope="col"> Carrier</th>
                                <th scope="col"> Primer precio</th>
                                <th scope="col"> Segundo precio</th>

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


class AddItemm extends Component{
    constructor(){
        super()
        this.state ={
            options : null,
            value: -1,
            device: null,
            valuedevice: -1
        }
    }
    
    componentDidMount(){
        this.setOptions();

    }
    setOptions = () =>{
        let options = [];
        options.push({
            label: 'Programación',
            value: 1
        });
        options.push({
            label: 'Reparación',
            value: 2
        });
        options.push({
            label: 'Garantía',
            value: 3
        });


        let optionsdevice = [];
        optionsdevice.push({
            label: getDevice(1),
            value: 1
        });
        optionsdevice.push({
            label: getDevice(2),
            value: 2
        });
        optionsdevice.push({
            label: getDevice(3),
            value: 3
        });
        optionsdevice.push({
            label: getDevice(4),
            value: 4
        });
        this.setState({options: options, device: optionsdevice});          
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        


        if(this.name  !== undefined && this.mark !== undefined && this.model !== undefined && this.warranty !== undefined && this.state.value !== -1 && this.state.valuedevice !== -1)
        {
           
                
                const toapi = {
                    panelid: cookies.get('user_panelid'),
                    name: this.name,
                    type : this.state.value,
                    device: this.state.valuedevice,
                    mark : Number(this.mark),
                    model : this.model,
                    carrier : this.carrier,
                    price : this.price,
                    price2: this.price2,
                    warranty : this.warranty,
                    inline : this.inline,
                    disabled : this.disabled,
                    details : this.details,
                };
                await services.post("", toapi)
                .then((res) => {
                    if(res) {
                        NotificationManager.success({
                            title: 'Añadido',
                            message: 'Añadiste un servicio'
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
        this.setState({ value: option.value });
    };
    onChangeDisabled = option => {
        this.setState({ valuedevice: option.value });
    };
    render(){
        
        return(
            <div>

                <div className="dropdown-divider"></div>
                <form className="form-inventory" onSubmit={this.handleSubmit}>
                    <Select
                    className="w-75 inline-item"
                    options={this.state.options}
                    onChange={this.onChange}
                    value={this.state.value}
                    placeholder={this.state.value === -1 && 'Tipo de servicio' || this.state.value !== -1 && this.state.options[this.state.value-1].label}
                    
                    
                    /> 
                    <Select
                    className="w-75 inline-item"
                    options={this.state.device}
                    onChange={this.onChangeDisabled}
                    value={this.state.valuedevice}
                    placeholder={this.state.valuedevice === -1 && 'Tipo de equipo' || this.state.valuedevice !== -1 && this.state.device[this.state.valuedevice-1].label}
                    /> 
                    <InputText placeholder="Nombre de servicio" keyfilter="alphanumeric" onChange={e => this.name = e.target.value}/>
                    
                    <select className="w-75" name="Categoria" onChange={e => this.mark = e.target.value}>
                        <option value="-1"> Marca</option>    
                        <option value="1"> Samsung</option>
                        <option value="2"> Huawei</option> 
                        <option value="3"> Motorola</option> 
                        <option value="4"> Xiaomi</option> 
                        <option value="5"> Iphone</option> 
                    </select>
                    <InputText placeholder="Modelo" keyfilter="alphanumeric" onChange={e => this.model = e.target.value}/> 
                    
                    <InputText placeholder="Carrier" keyfilter="alphanumeric" onChange={e => this.carrier = e.target.value}/> 
                    <InputText placeholder="Primer precio" keyfilter="alphanumeric" onChange={e => this.price = e.target.value}/>
                    <InputText placeholder="Segundo precio" keyfilter="int" onChange={e => this.price2 = e.target.value}/> 
                    <InputText placeholder="Garantia" keyfilter="alphanumeric" onChange={e => this.warranty = e.target.value}/> 
                    <div className="inline-item w-50">
                        <p className="inline-item w-25"> Venta en linea</p>
                        <input className="inline-item w-25" type="checkbox" placeholder="Pedido a domicilio" onChange= {e => this.inline = e.target.value}/>
                    </div>
                    <div className="inline-item w-50">
                        <p className="inline-item w-25"> Venta en linea</p>
                        <input className="inline-item w-25" type="checkbox" placeholder="Servicio disponible" onChange= {e => this.disabled = e.target.value}/>
                    </div>
                    <InputText className="inline-item w-50" placeholder="Detalles" keyfilter="alphanumeric" onChange={e => this.details = e.target.value}/> 
                    <button type="submit" className="btn btn-success">Añadir servicio</button>

                </form>
            </div>
          
        )
    }
}





export default class Services extends Component{
    render(){
        return(
            <div className="container-fluid">
                <Menu rute="/panel/services"/>

                <div className="panel-body align-center">
                    <div className="panel-header nextdiv align-left">
                        <div>
                        <Modal namebutton="" classButon="btn btn-dark" icon="Add">
                            
                            <AddItemm/>
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