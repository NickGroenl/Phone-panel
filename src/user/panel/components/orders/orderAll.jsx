import React, {Component} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';


import ReactHTMLTableToExcel from 'react-html-table-to-excel';


import Menu from './../menu';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

import Modal from '../modal';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    NotificationContainer,
    NotificationManager
  } from "react-light-notifications";
import "react-light-notifications/lib/main.css";
import Users from '../users/users';

const cookies = new Cookies();
const orders = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/orders'});
const user = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/users'});
const inventory = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/inventory'});
const clients = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/clients'});
const users = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/users/'});


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
        for(var c=0;c<json[i].order_date_add.length;c++)
        {
            if(json[i].order_date_add[c] === input[c])
            {
                similars++;
            }
        }
        if(similars > 2){
            array.push(json[i]);
            similars = 0;
        }else if(c > json[i].order_date_add.length -1) similars = 0;
    }
    const uniques = array.filter((item, idx) => array.indexOf(item) === idx);
    return uniques;
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

class RunTable extends Component {
    constructor(){
        super();
        this.state = {
            orders: [],
            inventory: [],
            clients: [],
            pricetotal: 0,
            towsp: '', 
            client: '',
            clientphone: '',
            pay: -1,
            rest: -1,
            valuepay: 1,
            user_data: {}
        }
        
    }
    
    componentDidMount(){
        this.getData();
    }

    async getData(){
        await users.get('', {params: {user_id: cookies.get("user_id")}}).then(response =>{
            if(response.data.length > 0){
                this.setState({user_data: response.data[0]});
            }
        })
        await orders.get('', {params : {order_userid: cookies.get('user_panelid')}}).then(response =>{
            this.setState({orders : response.data});
            
        })
        await inventory.get('', {params : {item_userid: cookies.get('user_panelid')}}).then(response =>{
            this.setState({inventory : response.data});
            this.render();
        })
        await clients.get('', {params : { client_panelid : cookies.get('user_panelid')}}).then(res => {
            
            this.setState({clients : res.data})
        })


        
    } 
     
    updatePay = async(index, orderid) =>{
        let data = {};
        await orders.get('', {params : {order_userid : cookies.get('user_panelid'), id: orderid}}).then(response=>{
            if(response.data.length > 0){
    
                
                data = response.data[0];
                for(var c=0; c<data.order_items.length;c++){
                    if(data.order_items[c].id === index){
                        data.order_items[c].product_pay = !data.order_items[c].product_pay;
                        break;
                    }
                }
                    
                
            }
        })
        await orders.put(`/${orderid}`, data).then(response =>{
            if(response) {
                this.getData();
            }
        })
    }
    filterData = async(e) =>{
        if(e.target.value.length < 3) await orders.get('', {params : {order_userid: cookies.get('user_panelid')}}).then(response =>{
            this.setState({orders : response.data});
        })
        const data = analitycData(this.state.orders, e.target.value);
        if(data.length > 0)
        this.setState({orders: data});
    }
    
    toWhatsApp = (text) => {
        window.location.href = text;
    }
    changePay =  e => {
        e.preventDefault();
        this.setState({ valuepay: Number(e.target.value)});
        
    }
    changePayRest = (e, pricetotal) =>{
        e.preventDefault();
        if(e.target.value > pricetotal)
        {
            let rest =  e.target.value - pricetotal;
            this.setState({pay: e.target.value, rest: rest})
        }
    }
    handleSubmit = async(e, array) =>{
        e.preventDefault();
        let data = array;
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
    render(){
        let _this = this;
        let list;
        list = this.state.orders.length > 0  && this.state.orders.map(function(array, index){
            var true_or = 0;
            for(var i=0;i<array.order_items.length; i++) {
                if(array.order_items[i].product_pay === true) true_or++;
            }

            
        
            
            let pricetotal = 0;
            let priceclient = 0;
            let items = '';
            let towsp = '';
            let client = '';
            let phone = '';
            let clienttype = 0;

            for(var c=0; c<_this.state.clients.length;c++){
                if(_this.state.clients[c].id === array.client_id){
                    client = _this.state.clients[c].client_name;
                    phone = _this.state.clients[c].client_phone
                    clienttype = _this.state.clients[c].client_type;
                    
                    break;
                }
            }
   
           for(var i=0;i<array.order_items.length; i++) {
               for(var c=0; c<_this.state.inventory.length; c++){

                    if(Number(clienttype) === 1) priceclient = Number(_this.state.inventory[c].item_priceup);
                    else priceclient = Number(_this.state.inventory[c].item_pricebuy);

                   if(_this.state.inventory[c].id === array.order_items[i].product_id){
                      
                       pricetotal += priceclient * array.order_items[i].product_cant;
                       
                       let item =  '* ' + array.order_items[i].id + '   ' + _this.state.inventory[c].item_description + ' $' + priceclient * array.order_items[i].product_cant + ' MXN                    /'
                       items += item;
                   }
               }
               
           }
                       
            towsp = _this.state.user_data.user_biss + "\n\n" + 
                       "Nuevo Pedido   * 📦 #00-"+ array.id + "  \n" +
                       items  + "\n"+
                       "Total: $"+ pricetotal +".00 MXN \n " +
               
                       "Detalles de pedido: \n\n" +
                       array.order_date_add +"\n" +
                       "Nombre cliente: " + client + "\n" +
                       "Telefono cliente: " + phone;
                       
                   
           




            if(array.order_state === 2){
            return(
                <tr key={index} className="table-body">
                    <td>#00-{index+1}
                        <button className="button-display-data" >-</button>
                        <div className="hiddenDiv">
                            
                                <p>Detalles de producto: {array.obs}</p>
                                <p>A domicilio: {array.tohouse === "on" && "Si"} {array.tohouse === "off" && "No"}</p>
                                <button className="btn btn-success" onMouseDown={() => _this.toWhatsApp(`https://api.whatsapp.com/send?phone=+52${phone}&text=${window.encodeURIComponent(towsp)}`)}>Enviar <ion-icon name="logo-whatsapp"></ion-icon></button>



                        </div>
                    </td>
                    <td>{array.order_items.length}</td>
                    <td>{client}</td>
                        
                        
                    <td> {true_or}/{array.order_items.length}</td>
                    <td> {array.order_type === 1 && 'Efectivo'} {array.order_type === 2 && 'Credito'} {array.order_type === 3 && 'Paypal(Saldo o tarjeta)'}</td>

                    <td> {pricetotal}</td>
                    <td> {array.order_date_add}</td>

                    <td> {array.order_pay}</td>
                    <td>

                    <Modal subname="" namebutton="Mostrar ticket" classButon="btn btn-dark" icon="print">
                                                {towsp}
                    </Modal>
                            <Modal subname="" namebutton="Abonar orden" classButon="btn blue" icon="yes">
                                    <div>
                                        Abonar orden
                                        <form className="align-center" onSubmit={e => _this.handleSubmit(e, array)}>
                                            
                                            <select className="w-75" name="Categoria" onChange={_this.changePay}>
                                                <option value={0}> Tipo pago</option>
                                                <option value={1}> Efectivo </option> 
                                                <option value={2}> Credito</option>
                                                <option value={3}> Paypal (Deposito, transferencia u otro)</option>
                                            </select>
                                            <p> Total:  ${pricetotal}</p>
                                            {_this.state.valuepay === 1 && 
                                                <div>
                                                    <InputText className="w-100" placeholder="Pago con:" keyfilter="int" onChange={e => _this.changePayRest(e, pricetotal)}/>
                                                    <InputText className="w-100" placeholder={"Cambio: " + _this.state.rest} keyfilter="int" disabled/>
                                            
                                                </div>
                                            }
                                            {_this.state.valuepay === 3 &&
                                                <img width='100px' height='70px' src="https://d31dn7nfpuwjnm.cloudfront.net/images/valoraciones/0033/7299/Como_retirar_dinero_de_PayPal_en_Colombia.png?1555502328" alt="nonenada"></img>
                                                }
                                            <InputTextarea className="w-100" placeholder="Detalles del pedido" rows={4}  keyfilter={/^[^#<>*!]+$/} onChange={e => this.obs = e.target.value} />
                                            <p className="inline-item"> Pedido a domicilio</p>
                                            <input type="checkbox" placeholder="Pedido a domicilio" onChange= {e => this.tohouse = e.target.value}/>

                                            
                                            <button type="submit" className="btn btn-secondary w-100"> Finalizar</button>
                                        </form>
                                    </div>
                                </Modal>
                    </td>
                    
                </tr>
                        
            )}

        })


        let listxml = this.state.orders.length > 0  && this.state.orders.map(function(array, index){
            var true_or = 0;
            for(var i=0;i<array.order_items.length; i++) {
                if(array.order_items[i].product_pay === true) true_or++;
            }

            
        
            
            let pricetotal = 0;
            let priceclient = 0;
            let client = '';
            let phone = '';
            let clienttype = 0;

            for(var c=0; c<_this.state.clients.length;c++){
                if(_this.state.clients[c].id === array.client_id){
                    client = _this.state.clients[c].client_name;
                    phone = _this.state.clients[c].client_phone
                    clienttype = _this.state.clients[c].client_type;
                    break;
                }
            }
   
           for(var i=0;i<array.order_items.length; i++) {
               for(var c=0; c<_this.state.inventory.length; c++){

                    if(Number(clienttype) === 1) priceclient = Number(_this.state.inventory[c].item_priceup);
                    else priceclient = Number(_this.state.inventory[c].item_pricebuy);

                   if(_this.state.inventory[c].id === array.order_items[i].product_id){
                      
                       pricetotal += priceclient * array.order_items[i].product_cant;
                       
                       
                   }
               }
               
           }
                       




            if(array.order_state === 2){
            return(
                <tr key={index} className="table-body">
                    <td>#00-{index+1}
                        
                    </td>
                    <td>{array.order_items.length}</td>
                    <td>{client}</td>
                        
                        
                    <td> {true_or}/{array.order_items.length}</td>
                    <td> {array.order_type === 1 && 'Efectivo'} {array.order_type === 2 && 'Credito'} {array.order_type === 3 && 'Paypal(Saldo o tarjeta)'}</td>

                    <td> {pricetotal}</td>
                    <td> {array.order_date_add}</td>

                    <td> {array.pay}</td>
                    
                    
                </tr>
                        
            )} else return <tr> One Moment</tr>

        })
        return(
            <div className="table-responsive ">
                <InputText className="dont-expand" placeholder="Filtrar por fecha (DIA/MES/AÑO)" keyfilter={/^[^#<>*!]+$/} onChange={this.filterData}/> 
                <table className="table w-100">
                    <thead className="bg-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col"> Items</th>
                            <th scope="col"> Cliente</th>
                            <th scope="col"> Estado(Pago)</th>
                            <th scope="col"> Tipo de pago</th>
                            
                            <th scope="col"> Total de pago</th>
                            <th scope="col"> Añadido</th>
                            <th scope="col"> Pago con</th>
                            <th scope="col"> Opcion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </table>


                <div>
                        <table className="table d-none" id="tabletoexcel">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col"> Items</th>
                                <th scope="col"> Cliente</th>
                                <th scope="col"> Estado(Pago)</th>
                                <th scope="col"> Tipo de pago</th>
                                
                                <th scope="col"> Total de pago</th>
                                <th scope="col"> Añadido</th>
                                <th scope="col"> Pago con</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listxml}
                        </tbody>
                        </table>
                        <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="w-75 btn btn-primary"
                                    table="tabletoexcel"
                                    filename="inventory"
                                    sheet="tablexls"
                                    buttonText="Descargar EXCEL"/>
                                    
                
                </div>
            </div>
        )
    }
}


class OrderAll extends Component{
    constructor(){
        super();
        this.state = {
            
        }
    }
    componentDidMount(){
        this.getData();
    }
    async getData(){
        
    }
    
    render(){
        return(
            <div className="container-fluid">
                <Menu rute="/panel/orders-all"/>

                <div className="panel-body align-center">
                    <CircularMenu/>
                    <div className="panel-header nextdiv align-left">
                        <RunTable/>
                    </div>
                </div>
            </div>
        )
    }
}

export default OrderAll;