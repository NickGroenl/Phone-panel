import Menu from './../menu';
import React, {Component} from 'react';
import Select from "react-select";

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import {
    NotificationContainer,
    NotificationManager
  } from "react-light-notifications";
import "react-light-notifications/lib/main.css";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import Modal from './../modal';

import './repair.css';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


import axios from 'axios';
import Cookies from 'universal-cookie';


const cookies = new Cookies();
const repair = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/repairs'});
const clients = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/clients'});
const users = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/users'});
const services = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/services'});


const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4',
      width: '100vw',
      heigth: '100vh'
    },
    section: {
      margin: 7,
      padding: 7,
      textAlign: 'center'
    },
    titleBG: {
        backgroundColor: 'black',
        color: 'white',
        width: '93vw'
    },
    dashed : {
        borderBottomColor: '1px dotted black',
        borderBottomWidth: 2,
        width: '90vw',
        margin: '3px'
    },
    alignLeft: {
        textAlign: 'left'
    },
    textTo : {
        fontSize: '15pt'
    }
  });
  
  // Create Document Component
  const MyDocument = (props) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
            
            <Text> Fecha creado: {props.array.date}</Text>
            <View style={styles.dashed}/>
            <Text style={styles.titleBG}> Ticket Orden #00-{props.array.id}</Text>
            <Text> Cliente: {props.client}</Text>
            <Text> Atendio: {props.tech}</Text>
            <View style={styles.dashed}/>

            <Text> Datos del equipo</Text>

            <View style={styles.alignLeft}>
                <Text style={styles.textTo}> Nro. serie: {props.array.imei}</Text>
                <Text style={styles.textTo}> Marca: {getMark(props.array.mark)}</Text>
                <Text style={styles.textTo}> Modelo: {props.array.model}</Text>
                <Text style={styles.textTo}> Enciende: {props.array.on === false && 'No'}{props.array.on === true && 'Si'}</Text>
                <Text style={styles.textTo}> Golpes: {props.array.punch === false && 'No'}{props.array.punch === true && 'Si'}</Text>
                <Text style={styles.textTo}> Bateria: {props.array.batery === false && 'No tiene'}{props.array.batery === true && 'Tiene'}</Text>
                <Text style={styles.textTo}> Bandeja SIM: {props.array.sim === false && 'No tiene'}{props.array.sim === true && 'Integrada'}</Text>

            </View>

            <View style={styles.dashed}/>
            
            <Text> Reporte Tecnico</Text>
            <Text style={styles.textTo}> Descripcion del problema: {props.array.bug} </Text>
            <Text style={styles.textTo}> Observación: {props.array.obs}</Text>
            <View style={styles.dashed}/>

            <Text> Precio cotizado: ${props.array.pricetotal}</Text>
            

        </View>
       
      </Page>
    </Document>
  );


function analitycData(json, input, users, clients){
    var similars = 0;
    var array = [];
    var client= '';
    var tech = '';
    for(var i=0; i<json.length; i++)
    {
        for(var z=0;z<users.length;z++){
            if(users[z].user_id === json[i].repair_username){
                 tech = users[z].user_name;
                 break;
            }
        }
        for(var s=0;s<clients.length;s++){
            if(clients[s].id === json[i].client_id) {
                client = clients[s].client_name;
                break;
            }
        }


        for(var a=0;a<json[i].date.length;a++){
         if(json[i].date[a] === input[a])similars++;}
        if(similars < 3){
            similars = 0;
            for(var b=0;b<json[i].model.length;b++){
                if(json[i].model[b] === input[b])similars++;}
            if(similars < 3){
                similars = 0;
                for(var c=0;c<json[i].model.length;c++){
                    if(json[i].model[c] === input[c])similars++;}

                if(similars < 3){
                    similars = 0;
                    let mark = getMark(json[i].mark);
                    for(var d=0; d<mark.length;d++){
                        if(mark[d] === input[d])similars++;}

                    if(similars < 3){
                        similars = 0;
                        for(var e=0; e<client.length;e++){
                            if(client[e] === input[e]) similars++;}
                        if(similars < 3){
                            similars = 0;
                            for(var f=0; f<tech.length;f++){
                                if(tech[f] === input[f]) similars++;}
                            if(similars < 3){
                                similars = 0;
                                if('00-' + json[i].id === input) similars = 4;
                            }
                        }
                    }
                    
                }
            }
        }
        
        if(similars > 3){
            array.push(json[i]);
            similars = 0;
        }else if(c > json[i].date.length -1) similars = 0;
    }
    const uniques = array.filter((item, idx) => array.indexOf(item) === idx);
    return uniques;
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
function getType(i){
    switch(i){
        default: return 'No tiene';
        case 1: return 'Dispositivo Movil';
        case 2: return 'Tablet';
        case 3: return 'PC escritorio';
        case 4: return 'Laptop';

    }   
}
function getTypeTwo(i){
    switch(i){
        default: return 'No tiene';
        case 1: return 'Programación';
        case 2: return 'Reparación';
        case 3: return 'Garantía';

    }   
}
class EditIttem extends Component{
    constructor(props){
        super(props);
        this.state = {
            clients : [],
            repair : this.props.array,
            users : [],
            options : [],
            value: -1
        }
    }
    async componentDidMount(){
        await clients.get('', {params : { client_panelid : cookies.get('user_panelid')}}).then(res => {
            
                const options = [];

                for (let i = 0; i < res.data.length; i++) {
                    options.push({
                        label: res.data[i].client_name,
                        value: res.data[i].id
                    });
                }
                this.setState({clients : res.data, options : options})
        })
    }
    onChange = option => {
        this.setState({ value: option.value });
    };
    handleSubmit = async(e) =>{
        e.preventDefault();
        let client = -1;
        if(this.sim === undefined) {
            this.sim = false;
        }
        if(this.batery === undefined) {
            this.batery = false;
        }
        if(this.water === undefined) {
            this.water = false;
        }
        if(this.punch === undefined) {
            this.punch = false;
        }
        if(this.on === undefined) {
            this.on = false;
        }
        if(this.pass === undefined) { 
            this.pass = "No tiene";
        }
        if(this.spare === undefined) {
            this.spare = "No tiene";
        }
        if(this.errorkk === undefined){
            this.errorkk = this.state.repair.bug;
        }
        if(this.mark === undefined) {
            this.mark = this.state.repair.mark;
        }
        if(this.type === undefined) {
            this.type = this.state.repair.type;
        }
        if(this.pricetotal === undefined) {
            this.pricetotal = this.state.repair.pricetotal;
        }
        if(this.pay === undefined) {
            this.pay = this.state.repair.pay;
        }
        
        if(this.model === undefined) { 
            this.model = this.state.repair.model;
        }
       
        client = this.state.value;
        if(client === -1 || client === 0){
            client = this.state.repair.client_id;
        }
        if(client > 0 && this.tech !== undefined)
        {
            let data = this.state.repair;
            data.tech = this.tech;
            data.bug = this.errorkk;
            data.model = this.model;
            data.pay = this.pay;
            data.pricetotal = this.pricetotal;
            data.type = this.type;
            data.mark = this.mark;
            data.spare = this.spare;
            data.pass = this.pass;
            data.water = this.water;
            data.on = this.on;
            data.punch = this.punch;
            data.batery = this.batery;
            data.sim = this.sim;
            data.client_id = client;
           

            var total = Number(data.payinit) + Number(data.pay);
            if(total >= Number(data.pricetotal)){
                data.state = 2;
            }
            await repair.put(`${this.props.id}`, data).then(response =>{      
                    if(response){
                        NotificationManager.success({
                        title: 'Editado',
                        message: 'Editaste la orden'
                    });
                    window.location.reload();
                }
            })
        }
        
    }
    render(){
        
        const tech = this.state.users.length > 0 && this.state.users.map(function(array, index){
            if(array.user_id !== cookies.get('user_id'))
            return(
                <option key={index} value={array.user_id}>{array.user_name}</option>
            )
        })
        return(
            <Modal namebutton="" classButon="btn btn-dark" icon="pencil">
                <div className={this.state.state_class}> {this.state.state_message}</div>

                <form onSubmit={this.handleSubmit}>


                    <Select
                    className="w-75 inline-item"
                    options={this.state.options}
                    onChange={this.onChange}
                    value={this.state.value}
                    placeholder="Clientes"
                    />  

                    <select className="w-75 inline-item" onChange={e => this.tech = e.target.value}>
                        <option value="-1">Tecnico</option>
                        {tech}
                    </select>
                    <InputText placeholder={"Modelo: " + this.state.repair.model} keyfilter={/^[^#<>*!]+$/} onChange={e => this.model = e.target.value}/>
                    <select className="w-75" name="Categoria" onChange={e => this.mark = e.target.value}>
                        <option value={-1}> Marca</option>    
                        <option value={1}> Samsung</option>
                        <option value={2}> Huawei</option> 
                        <option value={3}> Motorola</option> 
                        <option value={4}> Xiaomi</option> 
                        <option value={5}> Iphone</option> 
                    </select>
                    <select className="w-75" name="Categoria" onChange={e => this.type = e.target.value}>
                        <option value={-1}> Tipo equipo</option>
                        <option value={1}> Dispositivo Movil</option> 
                        <option value={2}> Tablet</option>
                        <option value={3}> PC escritorio</option>
                        <option value={4}> Laptop</option>
                    </select>
                    <section >
                        <input className="inline-item w-auto" type="checkbox" name="my-checkbox" onChange={e => this.on = e.target.checked}/>
                        <p className="checkbox-label inline-item" >Enciende  |</p>

                        <input className="inline-item w-auto" type="checkbox" name="my-checkbox" onChange={e => this.batery = e.target.checked}/>
                        <p className="checkbox-label inline-item">Bateria  |</p>

                        <input className="inline-item w-auto" type="checkbox" name="my-checkbox" onChange={e => this.sim = e.target.checked}/>
                        <p className="checkbox-label inline-item">Bandeja SIM  |</p>

                        <input className="inline-item w-auto" type="checkbox" name="my-checkbox" onChange={e => this.punch = e.target.checked}/>
                        <p className="checkbox-label inline-item">Golpes  |</p>

                        <input className="inline-item w-auto" type="checkbox" name="my-checkbox" onChange={e => this.water = e.target.checked}/>
                        <p className="checkbox-label inline-item">Mojado</p>
                    </section>
                    <InputText placeholder={'Tipo servicio: ' +this.state.repair.bug} keyfilter={/^[^#<>*!]+$/} onChange={e => this.errorkk = e.target.value}/>

                    <InputText placeholder={'Refaccion: ' +this.state.repair.spare} keyfilter={/^[^#<>*!]+$/} onChange={e => this.spare = e.target.value}/>
                    <InputText placeholder={'Password: ' +this.state.repair.pass} keyfilter={/^[^#<>*!]+$/} onChange={e => this.pass = e.target.value}/>
                    <InputText placeholder={'Pago total: ' +this.state.repair.pricetotal} keyfilter="int" onChange={e => this.pricetotal = e.target.value}/>
                    <InputText placeholder={'Abono: ' + this.state.repair.pay} keyfilter="int" onChange={e => this.pay = e.target.value}/>
                    <button className="btn btn-success" type="submit"> Terminar</button>
                </form>
            </Modal>
        )
    }
}
class ModifyStates extends Component{
    constructor(props){
        super(props);
        this.state = {
            repair: this.props.array
        }

    }
    onSubmit = async(e) =>{
        e.preventDefault();
        if(Number(this.statess) !== -1)
        {
            let data = this.state.repair;
            data.state = Number(this.statess);
            var total = Number(data.payinit) + Number(data.pay);

            if(this.obs !== undefined) data.obsv = this.obs;
            if(Number(this.statess) === 2){
                if(total >= Number(data.pricetotal)){
                    repair.put(`/${data.id}`, data).then(res=>{
                        if(res) window.location.reload();
                    })
                }else NotificationManager.error({
                    title: 'Error',
                    message: 'El pedido debe estar abonado completamente'
                  });
            }else {
                repair.put(`/${data.id}`, data).then(res=>{
                    if(res) window.location.reload();
                })
            }
        }
    }
    render(){
        return(
            <Modal subname="" namebutton="Modificar" classButon={"btn btn-" + this.props.classnameBTN} icon="list">
                <div>               
                    <div className="dropdown-divider"></div>
                    <form className="form-inventory" onSubmit={this.onSubmit}>

                            <InputText className="w-25 inline-item" placeholder={"#00-" + this.state.repair.id} disabled/> 
                            <select className="w-50" name="Categoria" onChange={e => this.statess = e.target.value}>
                                <option value="-1"> Estado</option>    
                                <option value="1"> Por reparar</option>
                                <option value="2"> Entregado</option> 
                                <option value="3"> Sin reparacion</option> 
                                <option value="4"> En proceso</option> 
                                <option value="5"> Reparado</option>
                                
                            </select>
                            <InputTextarea className="w-100" placeholder={"Comentarios:   " + this.state.repair.obsv} rows={2}  keyfilter={/^[^#<>*!]+$/} onChange={e => this.obs = e.target.value} />

                        <button type="submit" className="btn btn-success">Listo</button>
                    </form>
                </div>
            </Modal>
        )
    }
}


class RunTable extends Component {
    constructor(){
        super();
        this.state = {
            repair : [],
            clients: [],
            users: [],
        }
        
    }
    
    componentDidMount(){
        this.getData();
    }

    async getData(){
        await repair.get('', {params:{panelid: cookies.get('user_panelid')}}).then(res =>{
            if(res.data.length > 0){  
                this.setState({repair : res.data});
            }
        })
        await clients.get('', {params:{client_panelid: cookies.get('user_panelid')}}).then(res =>{
            if(res.data.length > 0) this.setState({clients : res.data});
        })
        await users.get('', {params:{user_panelid: cookies.get('user_panelid')}}).then(res =>{
            if(res.data.length > 0) this.setState({users : res.data});
        })
    } 
    toWhatsApp = (text) => {
        window.location.href = text;
    }
     
    filterData = async(e) =>{
        if(e.target.value.length < 3) this.getData();
        if(e.target.value.length > 2){
            const data = analitycData(this.state.repair, e.target.value, this.state.users, this.state.clients);
            if(data.length > 0)
            this.setState({repair: data});
        }
    }
    filterState = async(parameter) =>{
        
        if(parameter !== -1){
            if(Number(parameter) !== 6){
                await repair.get('', {params: {panelid: cookies.get('user_panelid'), state: '' + parameter}}).then(response => {return response; })
                .then(response =>{
                    this.setState({repair : response.data});
                })
            }
            else{
                await repair.get('', {params:{panelid: cookies.get('user_panelid')}}).then(res =>{
                    if(res.data.length > 0){  
                        this.setState({repair : res.data});
                    }
                })
            }
        }
    }
    deleteItem = async(index) =>{
        repair.delete(`/${index}`).then(res=>{
            if(res) window.location.reload();
        })
        
    }
    

    render(){
        
        let _this = this;
        let list = this.state.repair.length > 0 && this.state.repair.map(function(array, index){
            let client = '';
            let tech = '';
            let id = -1;
            let phone = 0;
            let classnameBTN = array.state === 1 && "danger" || array.state === 2 && "success" || array.state === 3 && "warning" || array.state === 4 && "primary" || array.state === 5 && "secondary"
            for(var c=0;c<_this.state.users.length;c++){
                if(_this.state.users[c].user_id === cookies.get('user_id')) id = c;
            }
            for(var i=0;i<_this.state.users.length;i++){
                if(_this.state.users[i].user_id === array.repair_username) tech = _this.state.users[i].user_name;
            }
            for(var b=0;b<_this.state.clients.length;b++){
                if(_this.state.clients[b].id === array.client_id) {
                    client = _this.state.clients[b].client_name;
                    phone = _this.state.clients[b].client_phone;
                    break;
                }
            }
            
            let toencode = 'Que tal '+ client +', el número  de tu orden es la #00-' + array.id +' - (' + getMark(array.mark) + ') (' + array.model +') para ('+ array.bug +')  con una cotización ( $'+ array.pricetotal+') se encuentra en estado: ';
            switch(array.state){
                case 1: toencode += '(Por reparar)'; break;
                case 2: toencode += '(Entregado)'; break;
                case 3: toencode += '(Sin reparacion)'; break;
                case 4: toencode += '(En proceso)'; break;
                case 5: toencode += '(Reparado)'; break;
            }
            if(id !== -1 && _this.state.users[id].user_administrator !== 1)
            return(
                <tr key={index} className="bg-white" id={"topdf" + array.id}>

                    <th scope="row">
                    <button className="button-display-data" >-</button>
                    <div className="hiddenDiv">
                        
                            <p> Bateria: {array.batery === false && 'No tiene'}{array.batery === true && 'Tiene'} </p>    
                            <p> Tarjeta SIM: {array.sim === false && 'No tiene'}{array.sim === true && 'Integrada'} </p>
                            <p> Mojado: {array.water === false && 'No'}{array.water === true && 'Si'} </p>
                            <p> Golpes: {array.punch === false && 'No'}{array.punch === true && 'Si'} </p>
                            <p> Enciende: {array.on === false && 'No'}{array.on === true && 'Si'} </p>
                            <p> Contraseña: {array.password}</p>
                            <p> Tipo : {getType(array.type)}</p>
                            <p> Abono inicial: {array.payinit}</p>
                            <p> Abono: <span className="text-success">$ {array.pay}</span></p>
                            <p> Observaciones: {array.obs}</p>
                            <Modal namebutton="" classButon="btn btn-danger" icon="trash">
                                <p>¿Seguro que quieres eliminar?</p>
                            
                                <button className="btn btn-danger inline-item" onMouseDown={() => _this.deleteItem(array.id)}><ion-icon name="trash"></ion-icon></button>
                            </Modal>

                            
                            <button className="btn btn-success" onMouseDown={() => _this.toWhatsApp(`https://api.whatsapp.com/send?phone=+52${phone}&text=${encodeURIComponent(toencode)}`)}><ion-icon name="logo-whatsapp"></ion-icon></button>
                            

                   
                    </div>
                    {index
                    +1}
                    </th>
                    <td><p>
                        #00-{array.id}
                        
                        </p></td>
                    <td>{client}</td>      
                    <td>{getMark(array.mark)}</td>
                    <td>{array.model}</td>
                    <td>{tech}</td>   

                    <td> 
                        <ModifyStates classnameBTN={classnameBTN}  array={array}/>
                    </td>
                    <td> {array.bug}</td>
                    <td> {array.spare}</td>
                    <td className="text-success"> $ {array.pricetotal}</td>
                    <td> {array.imei}</td>
                    <td>{array.date}</td>   
                         
                    <td>
                        <EditIttem id={array.id} array={array}/>
                        <PDFDownloadLink className="btn btn-warning" document={<MyDocument tech={tech} client={client} array={array}/>} fileName={'orden00-' + array.id}>
                            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : <ion-icon name="print"></ion-icon>)}
                        </PDFDownloadLink>
                    </td>
                </tr>
                    
            )
        })
        let listxml = this.state.repair.length > 0 && this.state.repair.map(function(array, index){
            let client = '';
            let tech = '';
            let id = -1;
            let phone = 0;
            for(var c=0;c<_this.state.users.length;c++){
                if(_this.state.users[c].user_id === cookies.get('user_id')) id = c;
            }
            for(var i=0;i<_this.state.users.length;i++){
                if(_this.state.users[i].user_id === array.repair_username) tech = _this.state.users[i].user_name;
            }
            for(var b=0;b<_this.state.clients.length;b++){
                if(_this.state.clients[b].id === array.client_id) {
                    client = _this.state.clients[b].client_name;
                    phone = _this.state.clients[b].client_phone;
                    break;
                }
            }
            
            return(
                <tr key={index} className="bg-white" id={"topdf" + array.id}>

                    <th scope="row">
                    {index
                    +1}
                    </th>
                    <td><p>
                        #00-{array.id} 
                        
                        </p></td>
                    <td>{client}</td>      
                    <td>{getMark(array.mark)}</td>
                    <td>{array.model}</td>
                    <td>{tech}</td>   

                
                    <td> {array.bug}</td>
                    <td> {array.spare}</td>
                    <td className="text-success"> $ {array.pricetotal}</td>
                    <td> {array.imei}</td>
                    <td>{array.date}</td>   
                         
                    
                </tr>
                    
            )
        })
        
        return(
            <div>
                

                <select className="w-75" name="Categoria" onChange={e => this.filterState(e.target.value)}>
                    <option value={-1}>Filtrar por estado</option>   
                    <option value={1}> Por reparar</option>      
                    <option value={2}> Entregado</option>  
                    <option value={3}> Sin reparación</option>  
                    <option value={4}> En proceso</option>  
                    <option value={5}> Reparado</option>  
                    <option value={6}> Todo</option>
                </select>
                <InputText className="dont-expand" placeholder="Filtrar por (Orden, Marca, Modelo, Tipo servicio, Cliente, Tecnico, Fecha)" keyfilter={/^[^#<>*!]+$/} onChange={this.filterData}/> 
                <div className="table-responsive">
                    <table className="table bg-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Orden</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Marca</th>
                                <th scope="col">Modelo</th>
                                <th scope="col"> Tecnico</th>
                                <th scope="col"> Estado</th>
                                <th scope="col"> Servicio</th>
                                <th scope="col"> Refacciones</th>
                                <th scope="col"> Precio cotizado</th>
                                <th scope="col"> Nro. serie</th>
                                <th scope="col"> Fecha</th>

                            </tr>
                        </thead>
                        <tbody>
                            {list}
                        </tbody>
                    </table>
                    <div className="w-100 align-center">
                        <table className="table d-none" id="tabletoexcel">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Orden</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Marca</th>
                                <th scope="col">Modelo</th>
                                <th scope="col"> Tecnico</th>
                                <th scope="col"> Servicio</th>
                                <th scope="col"> Refacciones</th>
                                <th scope="col"> Precio cotizado</th>
                                <th scope="col"> Nro. serie</th>
                                <th scope="col"> Fecha</th>
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
                                    filename="repairs"
                                    sheet="tablexls"
                                    buttonText="Descargar EXCEL"/>
                                    
                
                    </div>
                </div>
            </div>
        )
    }
}
class AddClient extends Component{
    
    handleSubmit = async(e) =>{
        e.preventDefault();
        if(this.name !== undefined && this.phone !== undefined && this.email !== undefined && this.type !== undefined){ 
            const toapi = {
                client_panelid : cookies.get('user_panelid'),
                client_name : this.name,
                client_phone : this.phone,
                client_type: this.type,
                client_email: this.email,
                client_date : new Date().toLocaleString()
            };
            clients.post('', toapi).then(response =>{
                if(response) NotificationManager.success({
                    title: 'Añadido',
                    message: 'Añadiste un cliente'
                  });
                window.location.reload();
            })
        }else NotificationManager.error({
            title: 'Error',
            message: 'Completa el formulario'
          });
        
    }
    render(){
        return(
            <Modal subname="sub-modal" namebutton="Añadir cliente" classButon="btn blue inline-item w-75" icon="add">
                <div>
                    
                    <form className="align-center" onSubmit={this.handleSubmit}>
                        
                        Añadir Cliente
                        <InputText className="w-100" placeholder="Nombre" keyfilter={/^[^#<>*!]+$/} onChange={e => this.name = e.target.value}/>
                        <InputText className="w-100" placeholder="Telefono" keyfilter={/^[^#<>*!]+$/} onChange={e => this.phone = e.target.value}/>
                        <InputText className="w-100" placeholder="Email" keyfilter="email" onChange={e => this.email = e.target.value}/>
                        <select className="w-100" name="Categoria" onChange={e => this.type = e.target.value}>
                            <option value={-1}> Tipo</option>
                            <option value={0}> Publico</option>
                            <option value={1}> Mayorista</option>
                            <option value={2}> Reseller</option>
                        </select>
                            
                        
                        <button type="submit" className="btn btn-success">Terminar</button>
                    </form>
                </div>
            </Modal>
          
        )
    }
}
class AddItem extends Component{
    constructor(){
        super();
        this.state = {
            clients : [],
            coderandom : 1004,
            auto_increment: 0,
            users : [],
            options : [],
            value : '',
            placeholder: 'Clientes',

            services: [],
            valueservices: -1,
            optionsservices: [],
            placeholderservices: 'Servicio(rellena)'
        }
    }
    async componentDidMount(){
        await clients.get('', {params : { client_panelid : cookies.get('user_panelid')}}).then(res => {
            
                const options = [];

                for (let i = 0; i < res.data.length; i++) {
                    options.push({
                        label: res.data[i].client_name + " / Telefono: " + res.data[i].client_phone,
                        value: res.data[i].id
                    });
                }
                this.setState({clients : res.data, options : options})
        })
        await users.get('', {params : { user_panelid : cookies.get('user_panelid')}}).then(response => {
            this.setState({users : response.data})
        })
        await repair.get('', {params : { panelid : cookies.get('user_panelid')}}).then(response => {
            if(response.data.length > 0 )this.setState({auto_increment : response.data.length + 1})
        })
        this.setState({coderandom : Math.round(Math.floor(Math.random() * (100000 - 1)) + 1)})
        this.getData();
    }
    onChange = option => {
        this.setState({ value: option.value, placeholder: option.label });
    };
    onChangeServices = option => {
        this.setState({ valueservices: option.value, placeholderservices: option.label });
    };
    async getData(){
        await services.get('', {params:{panelid: cookies.get('user_panelid')}}).then(res =>{
            if(res.data.length > 0){  
                const options = [];

                for (let i = 0; i < res.data.length; i++) {
                    options.push({
                        label: res.data[i].name ,
                        value: i
                    });
                }
                this.setState({services : res.data, optionsservices : options})
            }
        })
        
    } 
    handleSubmit = async(e) =>{
        e.preventDefault();
        if(this.sim === undefined) this.sim = false;
        if(this.batery === undefined) this.batery = false;
        if(this.water === undefined) this.water = false;
        if(this.punch === undefined) this.punch = false;
        if(this.on === undefined) this.on = false;
        if(this.pass === undefined) this.pass = "No tiene";
        if(this.spare === undefined) this.spare = "No tiene";



        if(this.state.valueservices !== -1 || (this.mark !== undefined && this.type !== undefined && this.model !== undefined && this.errorkk !== undefined && this.pricetotal !== undefined && this.payinit !== undefined)){
            if(this.imei === undefined) this.imei = "No IMEI setting"
            if(this.imei.length < 15){
                if(this.state.valueservices !== -1){
                    this.mark = this.state.services[this.state.valueservices].mark;
                    this.type = this.state.services[this.state.valueservices].device;
                    this.bug = this.state.services[this.state.valueservices].type;
                    this.pricetotal = this.state.services[this.state.valueservices].price;
                    this.model = this.state.services[this.state.valueservices].model;
                }
                const data = {
                    panelid : cookies.get('user_panelid'),
                    mark : Number(this.mark),
                    type : Number(this.type),
                    model: this.model,
                    bug: this.errorkk,
                    repair_username: this.tech,
                    spare: this.spare,
                    imei: this.imei,
                    pricetotal: this.pricetotal,
                    payinit: this.payinit,
                    pay: 0,
                    sim: this.sim, 
                    batery: this.batery,
                    water : this.water,
                    punch : this.punch,
                    code_random : this.state.coderandom,
                    client_id : this.state.value,
                    on: this.on,
                    state: 1,
                    obsv: 'Ninguno',
                    password: this.pass,
                    obs: this.obs !== undefined && this.obs,
                    date : new Date().toLocaleString()
                };
                repair.post('', data).then(response =>{
                    
                    if(response){
                        NotificationManager.success({
                            title: 'Añadido',
                            message: 'Añadiste una orden'
                          });
                        window.location.reload();
                    }
                })
            }    else NotificationManager.error({
                title: 'Error',
                message: 'El IMEI debe ser de maximo 15 caracteres'
              });
        }else NotificationManager.error({
            title: 'Error',
            message: 'Completa el formulario'
          });
    }
    render(){
        
        const tech = this.state.users.length > 0 && this.state.users.map(function(array, index){
            if(array.user_id !== cookies.get('user_id'))
            return(
                <option key={index} value={array.user_id}>{array.user_name}</option>
            )
        })
        return(
            <Modal namebutton="Añadir orden" classButon="btn btn-dark" icon="add">
                <Select
                    className="w-75 inline-item"
                    options={this.state.optionsservices}
                    onChange={this.onChangeServices}
                    value={this.state.valueservices}
                    placeholder={this.state.placeholderservices}
                />  
                <AddClient/>
                <form onSubmit={this.handleSubmit}>

                    <Select
                    className="w-75 inline-item"
                    options={this.state.options}
                    onChange={this.onChange}
                    value={this.state.value}
                    placeholder={this.state.placeholder}
                    />  
                    

                    <select className="w-50 inline-item" onChange={e => this.tech = e.target.value}>
                        <option value="-1">Tecnico</option>
                        {tech}
                    </select>
                    <InputText className="w-25 inline-item" placeholder={"#00-" + this.state.auto_increment} keyfilter={/^[^#<>*!]+$/} onChange={e => this.model = e.target.value} disabled/>
                    <InputText placeholder={this.state.valueservices !== -1 && this.state.services[this.state.valueservices].model || 'Modelo'} keyfilter={/^[^#<>*!]+$/} onChange={e => this.model = e.target.value} disabled={this.state.valueservices !== -1 && true}/>
                    <select className="w-75" name="Categoria" onChange={e => this.mark = e.target.value} disabled={this.state.valueservices !== -1 && true}>
                        <option value="-1"> {this.state.valueservices !== -1 && getMark(this.state.services[this.state.valueservices].mark)} {this.state.valueservices === -1 && 'Marca'}</option>    
                        <option value="1"> Samsung</option>
                        <option value="2"> Huawei</option> 
                        <option value="3"> Motorola</option> 
                        <option value="4"> Xiaomi</option> 
                        <option value="5"> Iphone</option> 
                    </select>
                    <select className="w-75" name="Categoria" onChange={e => this.type = e.target.value} disabled={this.state.valueservices !== -1 && true}>
                        <option value="-1"> {this.state.valueservices !== -1 && getType(this.state.services[this.state.valueservices].device)} {this.state.valueservices === -1 && 'Tipo de equipo'}</option>
                        <option value="1"> Dispositivo Movil</option> 
                        <option value="2"> Tablet</option>
                        <option value="3"> PC escritorio</option>
                        <option value="4"> Laptop</option>
                    </select>
                    <select className="w-75" name="Categoria" onChange={e => this.errorkk = e.target.value} disabled={this.state.valueservices !== -1 && true}>
                        <option value="-1"> {this.state.valueservices !== -1 && getTypeTwo(this.state.services[this.state.valueservices].type)} {this.state.valueservices === -1 && 'Tipo de servicio'}</option>    
                        <option value="1"> Programación</option>
                        <option value="2"> Reparación</option> 
                        <option value="3"> Garantía</option> 
                        
                    </select>
                    <section >
                        <input className="inline-item w-auto" type="checkbox" name="my-checkbox" onChange={e => this.on = e.target.checked}/>
                        <p className="checkbox-label inline-item" >Enciende  |</p>

                        <input className="inline-item w-auto" type="checkbox" name="my-checkbox" onChange={e => this.batery = e.target.checked}/>
                        <p className="checkbox-label inline-item">Bateria  |</p>

                        <input className="inline-item w-auto" type="checkbox" name="my-checkbox" onChange={e => this.sim = e.target.checked}/>
                        <p className="checkbox-label inline-item">Bandeja SIM  |</p>

                        <input className="inline-item w-auto" type="checkbox" name="my-checkbox" onChange={e => this.punch = e.target.checked}/>
                        <p className="checkbox-label inline-item">Golpes  |</p>

                        <input className="inline-item w-auto" type="checkbox" name="my-checkbox" onChange={e => this.water = e.target.checked}/>
                        <p className="checkbox-label inline-item">Mojado</p>
                    </section>
                    
                    <InputText placeholder="Refacciones" keyfilter={/^[^#<>*!]+$/} onChange={e => this.spare = e.target.value}/>
                    <InputText placeholder="Nro. serie" keyfilter="int" onChange={e => this.imei = e.target.value}/>
                    <InputText placeholder="Contraseña" keyfilter={/^[^#<>*!]+$/} onChange={e => this.pass = e.target.value}/>
                    <InputText placeholder={this.state.valueservices !== -1 && this.state.services[this.state.valueservices].price || 'Precio cotizado'} keyfilter="int" onChange={e => this.pricetotal = e.target.value} disabled={this.state.valueservices !== -1 && true}/>
                    <InputText placeholder="Abono inicial" keyfilter="int" onChange={e => this.payinit = e.target.value}/>
                    <InputTextarea className="w-100" placeholder="Obserbaciones" rows={5}  keyfilter={/^[^#<>*!]+$/} onChange={e => this.obs = e.target.value} />
                    <button className="btn btn-success" type="submit"> Añadir</button>
                </form>
            </Modal>
        )
    }
}

class CardsStatics extends Component{
    constructor(){
        super()
        this.state = {
            repair : [],
            finish_item : 0,
            none_finish : 0,
            none_equip : 0,
            inproccess : 0,
            finishrepair: 0
        }
    }
    componentDidMount(){
        this.getData();
    }
    async getData(){
        await repair.get('', {params : { panelid: cookies.get('user_panelid')}}).then(res =>{
            if(res) {
                let finish = 0;
                let nonefinish = 0;
                let dont = 0;
                let proccess = 0;
                let repair = 0;
                for(var i=0;i<res.data.length;i++){
                    if(res.data[i].state === 2)finish++;
                    if(res.data[i].state === 1)nonefinish++;
                    if(res.data[i].state === 3)dont++;
                    if(res.data[i].state === 4) proccess++;
                    if(res.data[i].state === 5) repair++;

                }
                this.setState({repair: res.data, finish_item : finish, none_finish : nonefinish, none_equip : dont, inproccess: proccess, finishrepair: repair});
            }
        })
    }
    render(){
        return(
            <section>
                <div className="card text-white bg-dark mb-3 inline-item">
                    <div className="card-header">Equipos totales</div>
                    <div className="card-body">
                        <h5 className="card-title"><ion-icon name="hammer"></ion-icon> {this.state.repair.length}</h5>
                    </div>
                </div>
                <div className="card text-white bg-success mb-3 inline-item">
                    <div className="card-header">Equipos terminados</div>
                    <div className="card-body">
                        <h5 className="card-title"><ion-icon name="bookmarks"></ion-icon>{this.state.finish_item}</h5>
                    </div>
                </div>
                <div className="card text-white bg-danger mb-3 inline-item">
                    <div className="card-header">Equipos por reparar</div>
                    <div className="card-body">
                        <h5 className="card-title"><ion-icon name="construct"></ion-icon> {this.state.none_finish}</h5>
                    </div>
                </div>
                <div className="card text-white bg-warning mb-3 inline-item">
                    <div className="card-header">Equipos sin reparación</div>
                    <div className="card-body">
                        <h5 className="card-title text-black"><ion-icon name="close-circle"></ion-icon> {this.state.none_equip}</h5>
                    </div>
                </div>
                <div className="card text-white bg-primary mb-3 inline-item">
                    <div className="card-header">Equipos en proceso</div>
                    <div className="card-body">
                        <h5 className="card-title"><ion-icon name="hourglass-outline"></ion-icon> {this.state.inproccess}</h5>
                    </div>
                </div>
                <div className="card text-white bg-secondary mb-3 inline-item">
                    <div className="card-header">Equipos reparados</div>
                    <div className="card-body">
                        <h5 className="card-title"><ion-icon name="rocket"></ion-icon> {this.state.finishrepair}</h5>
                    </div>
                </div>

            </section>
        )
    }
}

class Repair extends Component{
    render(){
        return(
            <div className="container-fluid">
                <Menu rute="/panel/repair"/>

                <div className="panel-body align-center">
                    <CardsStatics/>
                    <div className="panel-header nextdiv align-left">
                        <div>
                            <AddItem/>
                            
                            <RunTable/>
                        </div>
                    </div>
                </div>
                <NotificationContainer/>
            </div>
        )
    }
}

export default Repair;