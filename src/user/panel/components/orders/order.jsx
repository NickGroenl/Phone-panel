import React, {Component} from 'react';
import Menu from '../menu';
import './orders.css';
import Select from "react-select";
import Modal from './../modal';

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import axios from 'axios';
import Cookies from 'universal-cookie';

import {
    NotificationContainer,
    NotificationManager
  } from "react-light-notifications";
import "react-light-notifications/lib/main.css";
const cookies = new Cookies();
const user = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/users'});
const inventory = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/inventory'});
const orders = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/orders'});
const clients = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/clients'});








function calculateAccount(index){
    switch(index){
        default: return [0, 0];
        case 1: return [50, 1];
        case 2: return [300, 3]; 
        case 3: return [1000, 10];
    }
}

function analitycData(json, input){
    var similars = 0;
    var array = [];
    for(var i=0; i<json.length; i++)
    {
        for(var c=0;c<json[i].item_description.length;c++)
        {
            if(json[i].item_description[c] === input[c])
            {
                similars++;
            }
        }
        if(similars > 2){
            array.push(json[i]);
            similars = 0;
        }else if(c > json[i].item_description.length -1) similars = 0;
    }
    const uniques = array.filter((item, idx) => array.indexOf(item) === idx);
    return uniques;
}

class RunTable extends Component {
    constructor(){
        super();
        this.state = {
            display_onstate : '',
            inventory : [],
            orders: [],
            index : -1,
            inventoryindex : -1,
            clients: []
        }
        
    }
    
    componentDidMount(){
        this.getData();
    }

    async getData(){
        await inventory.get('', {params: {item_userid: cookies.get('user_panelid')}}).then(response => {return response; })
        .then(response =>{
            this.setState({inventory : response.data});
        })
        
        await orders.get('', {params : {order_userid: cookies.get('user_panelid')}}).then(response =>{
            this.setState({orders : response.data});
            for(var i=0; i< response.data.length; i++) if(response.data[i].order_state === 1) this.setState({index: i});
        })
        await clients.get('', {params : { client_panelid : cookies.get('user_panelid')}}).then(res => {
            
            this.setState({clients : res.data})
        })
    } 
    
    filterData = async(e) =>{
        if(e.target.value.length < 4) await orders.get('', {params : {order_userid: cookies.get('user_panelid')}}).then(response =>{
            this.setState({orders : response.data});
            for(var i=0; i< response.data.length; i++) if(response.data[i].order_state === 1) this.setState({index: i});
        })
        const data = analitycData(this.state.inventory, e.target.value);
        var tostate = this.state.orders;
        for(var i=0;i<this.state.orders[this.state.index].order_items.length; i++){
            for(var c=0; c<data.length; c++){
                if(tostate[this.state.index].order_items[i].product_id !== data[c].id){
                    tostate[this.state.index].order_items.splice(i, 1)  
                }
            }
        }
        this.setState({orders: tostate});
    }
    deleteItem = async(index) =>{
        let data = {};
        let id;
        await orders.get('', {params : {order_userid : cookies.get('user_panelid')}}).then(response=>{
            if(response.data.length > 0){
                for(var i = 0; i<response.data.length; i++)
                {
                    if(response.data[i].order_state === 1)
                    {
                        data = response.data[i];
                        
                        for(var c=0; c<data.order_items.length;c++){
                            if(data.order_items[c].id === index){
                                data.order_items.splice(c, 1);
                                id = response.data[i].id;
                                break;
                            }
                        }
                    }
                }
            }
        })
        await orders.put(`/${id}`, data).then(response =>{
            if(response) {
                this.getData();
            }
        })
        
    }
    updatePay = async(index) =>{
        let data = {};
        let id;
        await orders.get('', {params : {order_userid : cookies.get('user_panelid')}}).then(response=>{
            if(response.data.length > 0){
                for(var i = 0; i<response.data.length; i++)
                {
                    if(response.data[i].order_state === 1)
                    {
                        data = response.data[i];
                        for(var c=0; c<data.order_items.length;c++){
                            if(data.order_items[c].id === index){
                                data.order_items[c].product_pay = !data.order_items[c].product_pay;
                                id = response.data[i].id;
                                break;
                            }
                        }
                    }
                }
            }
        })
        await orders.put(`/${id}`, data).then(response =>{
            if(response) {
                this.getData();
            }
        })
        
    }
    changeCant = (index, indexOBJ, array, type) =>{
        if(index !== undefined && this.state.index !== -1){
            let to_inventory = this.state.inventory[index];
            let to_order = this.state.orders[this.state.index];

            if(type === 0){  
                to_inventory.item_stock++;
                to_order.order_items[indexOBJ].product_cant--;
            }else{
                to_inventory.item_stock--;
                to_order.order_items[indexOBJ].product_cant++;
            }
            inventory.put(`/${to_inventory.id}`, to_inventory);
            orders.put(`/${to_order.id}`, to_order);
            this.getData();
        }
    }
    render(){
        let _this = this;
        let list;
        if(this.state.index !== -1){
        list = this.state.orders.length >= this.state.index  && this.state.orders[this.state.index].order_items.map(function(array, index){
            var inventoryindex = -1;
            for(var i=0;i<_this.state.inventory.length;i++){
                 if(_this.state.inventory[i].id === array.product_id){ 
                     inventoryindex = i
                     break;
                 }
            }
            
            if(inventoryindex !== -1){
                return(
                    <tr key={index} className="table-body">
                        <td>{index+1}</td>
                        
                        <td><button className="btn blue inline-item">{array.product_cant}</button>
                            <div className="inline-item">
                                <button className="btn btn-outline-dark" onClick={() => _this.changeCant(inventoryindex, index, array, 0)}> {"<"} </button>
                                <button className="btn btn-outline-dark" onClick={() => _this.changeCant(inventoryindex, index, array, 1)}> {">"} </button>
                            </div>
                        </td>
                        
                        <td>{_this.state.inventory[inventoryindex].item_description}</td>
                        
                        <td>{_this.state.inventory[inventoryindex].item_priceup * array.product_cant}</td>
                        <td>{array.product_phone}</td>
                        <td>
                    
                        <button className="btn btn-danger" onClick={() => _this.deleteItem(array.id)}><ion-icon name="trash"></ion-icon></button>
                        </td>
                    </tr>
                        
                )
            } else return(
            <tr key={index}> 
                <td>Onemoment</td>
            </tr>)
        })}
        return(
            <div className="table-responsive inline-item table-order">
                <InputText className="dont-expand" placeholder="Filtrar por" keyfilter="alpha" onChange={this.filterData}/> 
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Item</th>
                        <th scope="col">Precio total</th>
                        <th scope="col">Detalle de producto</th>               
                        <th scope="col"> Opcion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </table>
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
            <Modal subname="" namebutton="Añadir cliente" classButon="btn btn-outline-primary w-25" icon="add">
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
class AddItem extends Component {
    constructor(){
        super();
        this.state = {
            inventory : [],
            price: 0.0,
            index : -1,
            cant: 0,
            placeholder: "Inventario"

        }
    }
    componentDidMount()
    {
        this.getData();
    }
    async getData(){
        await inventory.get('', {params: {item_userid: cookies.get('user_panelid')}}).then(response => {return response; })
        .then(res =>{
            const options = [];

            for (let i = 0; i < res.data.length; i++) {
                options.push({
                label: res.data[i].item_description + " / Precio: " + res.data[i].item_pricebuy,
                value: res.data[i].id
                });
            }
            this.setState({inventory : res.data, options: options});
        })
    }

    handleSubmit = async(e) =>{
        e.preventDefault();
        let data = {};
        let id = -1;
        await orders.get('', {params : {order_userid : cookies.get('user_panelid')}}).then(response=>{
            if(response.data.length > 0){
                for(var i = 0; i<response.data.length; i++)
                {
                    if(response.data[i].order_state === 1)
                    {
                        data = response.data[i];
                        if(this.state.index !== -1 && this.phone !== undefined && this.state.cant > 0)
                        {
                            let reallyindex = 1;
                            
                            if(data.order_items.length > 0) reallyindex = data.order_items[data.order_items.length -1].id +1; 
                            const toapi = {
                                id : reallyindex,
                                product_id: this.state.inventory[this.state.index].id,
                                product_phone: this.phone,
                                product_cant: this.state.cant,
                                product_pay: false,
                            }
                            data.order_items.push(toapi);
                            id = response.data[i].id;
                            let to_inventory = this.state.inventory[this.state.index];
                            to_inventory.item_stock -=  Number(this.state.cant);
                            inventory.put(`/${to_inventory.id}`, to_inventory)
                            break;
                        }else{
                            NotificationManager.error({
                                title: 'Error',
                                message: 'Completa el formulario'
                              });
                            break;
                        }
                    }
                }
            }
        })
        if(id !== -1){
            await orders.put(`/${id}`, data).then(response =>{
                if(response) {
                    
                    NotificationManager.success({
                        title: 'Añadido',
                        message: 'Añadiste un pedido a la orden'
                      });
                    window.location.reload();
                }
            })
        }
    }
    onChange = option => {
        this.setState({ value: option.value, placeholder: option.label });
        for(var i=0; i<this.state.inventory.length ; i++){
            if(this.state.inventory[i].id === Number(option.value)){
                this.setState({price: Number(this.state.inventory[i].item_pricebuy)})
                this.setState({index: i});
                break;
            }
        }
    };
    
    setAmount = (e) =>{
        this.setState({cant: e.target.value})
    }
    render(){
        
        return(
            <form className="form-order inline-item align-center" onSubmit={this.handleSubmit}>
                
                <Select
                    className="w-100 inline-item"
                    options={this.state.options}
                    onChange={this.onChange}
                    value={this.state.value}
                    placeholder={this.state.placeholder}
                />
                <InputText placeholder="Cantidad" keyfilter="int" onChange={this.setAmount}/>
                <InputText placeholder="Detalle producto" keyfilter={/^[^#<>*!]+$/} onChange={e => this.phone = e.target.value}/> 
                
                <p>Total: ${this.state.price * this.state.cant}</p>
                
                <button type="submit" className="btn btn-dark">Añadir</button>
                
            </form>
        )
    }
}

class CircularMenu extends Component {
    constructor(){
        super()
        this.state  = {
            subscription : 0,
            dataArray : [],
            inventory: 0,
            subaccounts: 0
        }
    }
    componentDidMount(){
        this.getData();
    }
    async getData(){
        await user.get('', {params: {user_id: cookies.get('user_id')}}).then(response => {
            this.setState({subscription : response.data[0].user_subscription})
            this.setState({dataArray : calculateAccount(response.data[0].user_subscription)})
            this.setState({subaccounts : response.data[0].user_subaccounts})
        })
        await inventory.get('', {params: {item_userid: cookies.get('user_panelid')}}).then(response =>{
            this.setState({inventory : response.data.length});
        })
        
    }
    render(){
        return(
            <div>
                <div className="inline-item">
                    <p>Ordenes</p>
                    <CircularProgressbar text="Ilimitado" strokeWidth="3" value={100} styles={{path: {stroke: `rgb(146, 60, 75)`}, text : { fill: `rgb(146, 60, 75)`}}}/>
                </div>
                <div className="inline-item">
                    <p>Inventario</p>
                    <CircularProgressbar text={this.state.inventory + ' / ' + this.state.dataArray[0]} strokeWidth="3" value={this.state.inventory} maxValue={this.state.dataArray[0]} styles={{path: {stroke: `rgb(60, 61, 146)`}, text : { fill: `rgb(60, 61, 146)`}}}/>
                </div>
                <div className="inline-item">
                    <p>Cuentas</p>
                    <CircularProgressbar text={this.state.subaccounts + ' / ' + this.state.dataArray[1]} strokeWidth="3" value={this.state.subaccounts} maxValue={this.state.dataArray[1]} styles={{path: {stroke: `rgb(177, 107, 28)`}, text : { fill: `rgb(177, 107, 28)`}}}/>
                </div>
                <div className="inline-item">
                    <p>Subscripcion</p>
                    <CircularProgressbar text={this.state.subscription + ' / 3'} strokeWidth="3" value={this.state.subscription} maxValue={3} styles={{path: {stroke: `rgb(177, 28, 28)`}, text : { fill: `rgb(177, 28, 28)`}}}/>
                </div>

            </div>
        )
    }
}

class Orders extends Component{
    constructor(){
        super();
        this.state = {
            create_or : false,
            order_id : -1,
            array : {},
            clients: [],
            inventory: [],
            option: [],
            value: undefined,
            valuepay: 1,
            pricetotal: 0,
            placeholder: "Selecciona un cliente",
            pay: -1,
            rest: -1
        }
    }
    componentDidMount(){
        this.getData();
        
    }
    changePayRest = (e) =>{
        e.preventDefault();
        if(e.target.value > this.state.pricetotal)
        {
            let rest =  e.target.value - this.state.pricetotal;
            this.setState({pay: e.target.value, rest: rest})
        }
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        let data = this.state.array;
        if(data.order_items.length > 0){
            if(this.state.valuepay !== 0){
                
                data.order_type = this.state.valuepay;
                if(this.state.valuepay === 1){
                    if(this.state.pay !== -1 && this.state.rest !== -1){
                        data.order_pay = this.state.pay;
                        data.order_rest = this.state.rest;
                        data.order_state = 2;
                        data.tohouse = this.tohouse;
                        if(this.obs !== undefined) data.obs = this.obs;
                        await orders.put(`/${data.id}`, data).then(res=>{
                            if(res) window.location.reload();
                        })
                    }else NotificationManager.error({
                        title: 'Error',
                        message: 'Completa el formulario'
                    });
                }
                if(this.state.valuepay === 2){
                    if(this.obs !== undefined) data.obs = this.obs;
                    data.order_state = 2;
                    await orders.put(`/${data.id}`, data).then(res=>{
                        if(res) window.location.reload();
                    })
                }

                
                
            }else NotificationManager.error({
                title: 'Error',
                message: 'Completa el formulario'
            });
        }else NotificationManager.error({
            title: 'Error',
            message: 'Debes tener al menos dos items para terminar la orden'
        });
    }
    async getData(){
        await clients.get('', {params : { client_panelid : cookies.get('user_panelid')}}).then(res => {
            
            const options = [];

            for (let i = 0; i < res.data.length; i++) {
                options.push({
                    label: res.data[i].client_name + "/ Telefono: " + res.data[i].client_phone,
                    value: res.data[i].id
                });
            }
            this.setState({clients : res.data, options : options})
        })
        await orders.get('', {params:{order_userid: cookies.get('user_panelid'), order_state: 1}}).then(response =>{
            if(response.data.length > 0){
                this.setState({create_or : true, order_id: response.data[0].id, array: response.data[0]});
                let pricetotal = 0;
                let priceclient = 0;
                let items = '';
                let towsp = '';
                let clientname = '';
                let clientphone = '' ;
                inventory.get('', {params: {item_userid: cookies.get('user_panelid')}}).then(res =>{
                    
                    if(response.data[0].order_items.length > 0){
                
                        for(var i=0;i<response.data[0].order_items.length; i++) {
                            for(var c=0; c<res.data.length; c++){
                                if(res.data[c].id === response.data[0].order_items[i].product_id){
                                    for(var e=0; e<this.state.clients.length;e++){
                                        if(this.state.clients[e].id === response.data[0].client_id){
                                            clientname = this.state.clients[e].client_name;
                                            clientphone = this.state.clients[e].client_phone
                                            if(Number(this.state.clients[e].client_type) === 1) priceclient = Number(res.data[c].item_priceup);
                                            else priceclient = Number(res.data[c].item_pricebuy);

                                            break;
                                        }
                                    }
                                    pricetotal += priceclient * response.data[0].order_items[i].product_cant;
                                    
                                    let item =  '* ' + response.data[0].order_items[i].id + '   ' + res.data[c].item_description + ' $' + priceclient * response.data[0].order_items[i].product_cant + ' MXN                    /'
                                    items += item;
                                }
                            }
                            
                        }
                    }
                    
                    towsp = "NOMBRE DE NEGOCIO \n\n" + 
                    "Nuevo Pedido   * 📦 #00-"+ this.state.array.id + "  \n" +
                    items  + "\n"+
                    "Total: $"+ pricetotal +".00 MXN \n " +
            
                    "Detalles de pedido: \n\n" +
                    this.state.array.order_date_add +"\n" +
                    "Nombre cliente: " + clientname + "\n" +
                    "Telefono cliente: " + clientphone;
                    
                    this.setState({pricetotal: pricetotal, towsp : towsp});
                })
                
                
            }
        })
        
    }
    onChange = async option => {
        this.setState({ value: option.value, placeholder: option.label });

        if(this.state.order_id !== -1){
            let data = this.state.array;
            data.client_id = option.value;
            await orders.put(`${this.state.order_id}`, data).then(response =>{      
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
    toWhatsApp = (text) => {
        window.location.href = text;
    }
    changePay =  e => {
        e.preventDefault();
        this.setState({ valuepay: Number(e.target.value)});
        
    }
    deleteOrder = async() => {
        if(this.state.order_id !== -1){
        await orders.delete(`/${this.state.order_id}`).then(response=>{
            if(response) window.location.reload();
        })}
    }
    createOrder = async() =>{
        const toapi = {
            
            order_date_add: new Date().toLocaleString(),
            order_userid: cookies.get('user_panelid'),
            order_state: 1,
            order_items: [],
            tohouse: "on"
          }
        await orders.post('', toapi).then(response=>{
            if(response) this.getData();
        })
    }
    render(){
        let client = '';
        let phone = '';
        for(var b=0;b<this.state.clients.length;b++){
            if(this.state.clients[b].id === this.state.array.client_id) {
                client = this.state.clients[b].client_name;
                phone = this.state.clients[b].client_phone;
                break;
            }
        }

        return(
            <div className="container-fluid">
                <Menu rute="/panel/orders"/>
                <NotificationContainer/>
                <div className="panel-body align-center">
                    <CircularMenu/>
                    <div className="panel-header nextdiv align-left">
                        { this.state.create_or === true && 
                        <div>
                            <div className="mt-3"> 
                                <AddClient/>
                                <Select
                                className="w-25 inline-item"
                                options={this.state.options}
                                onChange={this.onChange}
                                value={this.state.value}
                                placeholder={this.state.placeholder}
                                />
                            </div>
                            <AddItem/>
                            <RunTable/>
                            <p> Cliente: {client} {this.state.pricetotal === 0 && 'Selecciona un cliente'} / Total:<span className="text-success">${this.state.pricetotal}</span></p>
                             
                            <div className="dropdown-divider"></div>
                            <div className="align-right">
                                <button className="btn btn-outline-danger" onClick={this.deleteOrder}> Eliminar orden</button>
                                
                                <Modal subname="" namebutton="Terminar orden" classButon="btn btn-success" icon="yes">
                                    <div>
                                        Terminar orden
                                        <form className="align-center" onSubmit={this.handleSubmit}>
                                            
                                            <select className="w-75" name="Categoria" onChange={this.changePay}>
                                                <option value={0}> Tipo pago</option>
                                                <option value={1}> Efectivo </option> 
                                                <option value={2}> Credito</option>
                                                <option value={3}> Paypal (Deposito, transferencia u otro)</option>
                                            </select>
                                            <p> Total:  ${this.state.pricetotal}</p>
                                            {this.state.valuepay === 1 && 
                                                <div>
                                                    <InputText className="w-100" placeholder="Pago con:" keyfilter="int" onChange={this.changePayRest}/>
                                                    <InputText className="w-100" placeholder={"Cambio: " + this.state.rest} keyfilter="int" disabled/>
                                            
                                                </div>
                                            }
                                            {this.state.valuepay === 3 &&
                                                <img width='100px' height='70px' src="https://d31dn7nfpuwjnm.cloudfront.net/images/valoraciones/0033/7299/Como_retirar_dinero_de_PayPal_en_Colombia.png?1555502328" alt="nonenada"></img>
                                                }
                                            <InputTextarea className="w-100" placeholder="Detalles del pedido" rows={4}  keyfilter={/^[^#<>*!]+$/} onChange={e => this.obs = e.target.value} />
                                            <p className="inline-item"> Pedido a domicilio</p>
                                            <input type="checkbox" placeholder="Pedido a domicilio" onChange= {e => this.tohouse = e.target.value}/>

                                            <Modal subname="sub-modal" namebutton="Mostrar ticket" classButon="btn btn-dark" icon="print">
                                                {this.state.towsp}
                                            </Modal>
                                            <button className="btn btn-success" onClick={() => this.toWhatsApp(`https://api.whatsapp.com/send?phone=+52${phone}&text=${window.encodeURIComponent(this.state.towsp)}`)}>Enviar <ion-icon name="logo-whatsapp"></ion-icon></button>
                                            <button type="submit" className="btn btn-secondary w-100"> Finalizar</button>
                                        </form>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                        }
                        {
                            this.state.create_or === false &&
                            <div className="align-center">
                                <h1> No tienes una orden, ¿Quieres crear una?</h1>
                                <button className="btn btn-warning w-75" onClick={this.createOrder}> Crear orden</button>
                            </div>
                        }
                        
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Orders;