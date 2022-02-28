import Menu from '../menu';
import Modal from '../modal';
import '../../main.css';
import '../../index.css';
import '../../../login/login.css';
import { InputTextarea } from 'primereact/inputtextarea';

import { InputText } from 'primereact/inputtext';
import React, {Component} from 'react';
import ImageUploader from 'react-images-upload';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import './inventory.css';

import {
    NotificationContainer,
    NotificationManager
  } from "react-light-notifications";
import "react-light-notifications/lib/main.css";
import axios from 'axios';

import Cookies from 'universal-cookie';
var cookies = new Cookies();

const api = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/inventory/'});
const categories = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/categories/'});
const providers = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/providers/'});



class EditIttem extends Component{
    constructor(props){
        super(props)
        this.state ={
            categories : [],
            providers : [],
            pictures : [],
            inventory: this.props.array
        }
        this.onDrop = this.onDrop.bind(this);
    }
    componentDidMount(){
        this.getData();
    }
    async getData(){
        await categories.get('', {params : {category_userid : cookies.get('user_panelid')}}).then(response =>{
            this.setState({categories : response.data});
        })
        await providers.get('', {params : {provider_userid : cookies.get('user_panelid')}}).then(response =>{
            this.setState({providers : response.data});
        })
    }
    onDrop(pictureFiles, pictureDataURLs) {
        this.setState({
          pictures: pictureDataURLs
        });
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        let data = this.state.inventory;
        console.log(this.state.pictures);
        if(this.name !== undefined) data.item_description = this.name;
        if(this.state.pictures.length > 0) data.item_image = this.state.pictures[0];
        if(this.stock !== undefined) data.item_stock = this.stock;
        if(this.buy !== undefined) data.item_pricebuy = this.buy;
        if(this.sell !== undefined) data.item_pricesell = this.sell;
        if(this.categories !== undefined) data.item_category = this.categories;
        if(this.providers !== undefined) data.item_provider = this.providers;
        if(this.up !== undefined) data.item_priceup = this.up;
        if(this.bar !== undefined) data.bar_code = this.bar;
        if(this.serie !== undefined) data.serie_code = this.serie;


        await api.put(`${data.id}`, data).then(response =>{      
            if(response){
                NotificationManager.success({
                title: 'Editado',
                message: 'Editaste el item'
            });
            window.location.reload();
        }
        })

        
    }
    render(){
        let categorie = this.state.categories.length > 0 && this.state.categories.map(function(array, index){
            return(
                <option key={index} value={index}>{array.category_name}</option>
            )
        })
        let provide = this.state.providers.length > 0 && this.state.providers.map(function(array, index){
            return(
                <option key={index} value={index}>{array.provider_name}</option>
            )
        })
        return(
            <Modal namebutton="" classButon="btn btn-dark" icon="pencil">                  
                <form className="form-inventory" onSubmit={this.handleSubmit}>

                    <img className="inline-item " width="100px" height="100px" src={this.state.pictures} alt="carga una imagen"></img>
                    <InputText className="inline-item" placeholder="Nombre " keyfilter="alpha" onChange={e => this.name = e.target.value}/>
                    <div className="input-group mb-3">
                        <select name="Categoria" onChange={e => this.categories = e.target.value}>
                            <option value={-1}> Categorias</option>
                            {categorie}
                        </select>
                        <select name="Categoria" onChange={e => this.providers = e.target.value}>
                            <option value={-1}> Proveedores</option>
                            {provide}
                        </select>
                    </div>
                    <div className="dropdown-divider"></div>

                    
                    <div className="input-group mb-3">
                        <InputText className="input-inline" placeholder="Precio compra" keyfilter="int" onChange={e => this.buy = e.target.value}/>
                        <InputText className="input-inline" placeholder="Precio venta" keyfilter="int" onChange={e => this.sell = e.target.value}/>
                    </div>
                    <div className="input-group mb-3">
                        <InputText className="input-inline" placeholder="Precio Mayoreo" keyfilter="int" onChange={e => this.up = e.target.value}/>
                        <InputText className="input-inline" placeholder="Stock" keyfilter="int" onChange={e => this.stock = e.target.value}/>
                    </div>
                    <div className="input-group mb-3">
                        <InputText className="input-inline" placeholder="Codigo de barra" keyfilter="int" onChange={e => this.bar = e.target.value}/>
                        <InputText className="input-inline" placeholder="Codigo de serie" keyfilter="int" onChange={e => this.serie = e.target.value}/>
                    </div>
                    <ImageUploader
                        withIcon={true}
                        buttonText='Subir'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                    />
                    <button type="submit" className="btn btn-dark"> Terminar</button>

                </form>
            </Modal>
        )
    }
}

class AddItem extends Component{
    constructor(){
        super()
        this.state ={
            state_alert : '',
            message_alert : '',
            categories : [],
            providers : [],
            pictures : [],
            pricebuy: 0,
            pricesell: 0,
            priceup: 0
        }
        this.onDrop = this.onDrop.bind(this);
    }
    componentDidMount(){
        this.getData();
    }
    async getData(){
        await categories.get('', {params : {category_userid : cookies.get('user_panelid')}}).then(response =>{
            this.setState({categories : response.data});
        })
        await providers.get('', {params : {provider_userid : cookies.get('user_panelid')}}).then(response =>{
            this.setState({providers : response.data});
        })
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        if(this.name !== undefined && this.state.pictures !== undefined && this.stock !== undefined && this.categories !== undefined
            && this.providers !== undefined && this.bar !== undefined&& this.serie !== undefined && this.instock !== undefined && this.tohouse !== undefined)
        {
            if(this.name.length >  4){
                
                const toapi = {
                    item_userid: cookies.get('user_panelid'),
                    item_image: this.state.pictures[0],
                    item_description: this.name,
                    item_stock: this.stock,
                    item_pricebuy: this.state.pricebuy, 
                    item_pricesell: this.state.pricesell ,
                    item_category : this.categories,
                    item_provider : this.providers,
                    item_priceup: this.state.priceup,
                    bar_code: this.bar,
                    serie_code: this.serie ,
                    obs: this.obs,
                    tohouse: this.tohouse,
                    instock: this.instock,
                    date_add: new Date().toLocaleString()
                };
                await api.post("", toapi)
                .then((res) => {
                    if(res) {
                        NotificationManager.success({
                            title: 'Añadido',
                            message: 'Añadiste un item'
                          });
                        window.location.reload();
                    }
                    else NotificationManager.error({
                        title: 'Error',
                        message: 'Completa el formulario'
                      });
                })
                .catch((err) => console.log(err));
                
            } else NotificationManager.error({
                title: 'Error',
                message: 'Completa el formulario'
              });
        } NotificationManager.error({
            title: 'Error',
            message: 'Completa el formulario'
          });
    }
    onDrop(pictureFiles, pictureDataURLs) {
        this.setState({
          pictures: pictureDataURLs
        });
    }

    Pricesell = (e) =>{
        e.preventDefault();
        if(e.target.value > this.state.pricebuy){
            this.setState({pricesell: e.target.value});
        }else{
            
            NotificationManager.error({
                title: 'Error',
                message: 'El precio de venta debe ser mayor que el de compra y mayoreo.'
              });
        }

    }
    Pricebuy = (e) =>{
        e.preventDefault();
        this.setState({pricebuy: e.target.value});
    }
    Priceup = (e) =>{
        e.preventDefault();
        if(e.target.value > this.state.pricebuy && e.target.value < this.state.pricesell){
            this.setState({priceup: e.target.value});
        }else{
            NotificationManager.error({
                title: 'Error',
                message: 'El precio de mayoreo debe ser mayor que el de compra y menor que el de venta.'
              });
        } 
    }
    render(){
        let categorie = this.state.categories.length > 0 && this.state.categories.map(function(array, index){
            return(
                <option key={index} value={index}>{array.category_name}</option>
            )
        })
        let provide = this.state.providers.length > 0 && this.state.providers.map(function(array, index){
            return(
                <option key={index} value={index}>{array.provider_name}</option>
            )
        })
        return(
            <div>
                
                <form className="form-inventory" onSubmit={this.handleSubmit}>

                    <img className="inline-item " width="100px" height="100px" src={this.state.pictures} alt="carga una imagen"></img>
                    <InputText className="inline-item" placeholder="Nombre " keyfilter="alpha" onChange={e => this.name = e.target.value}/>
                    <div className="input-group mb-3">
                        <select name="Categoria" onChange={e => this.categories = e.target.value}>
                            <option value={-1}> Categorias</option>
                            {categorie}
                        </select>
                        <select name="Categoria" onChange={e => this.providers = e.target.value}>
                            <option value={-1}> Proveedores</option>
                            {provide}
                        </select>
                    </div>
                    <div className="dropdown-divider"></div>

                    
                    <div className="input-group mb-3">
                        <InputText className="input-inline" placeholder="Precio compra" keyfilter="int" onChange={this.Pricebuy}/>
                        <InputText className="input-inline" placeholder="Precio venta" keyfilter="int" onKeyUpCapture={this.Pricesell}/>
                    </div>
                    <div className="input-group mb-3">
                        <InputText className="input-inline" placeholder="Precio Mayoreo" keyfilter="int" onChange={this.Priceup}/>
                        <InputText className="input-inline" placeholder="Stock" keyfilter="int" onChange={e => this.stock = e.target.value}/>
                    </div>
                    <div className="input-group mb-3">
                        <InputText className="input-inline" placeholder="Codigo de barra" keyfilter="int" onChange={e => this.bar = e.target.value}/>
                        <InputText className="input-inline" placeholder="Codigo de serie" keyfilter="int" onChange={e => this.serie = e.target.value}/>
                    </div>
                    <InputTextarea className="w-100" placeholder="Detalles" rows={2}  keyfilter={/^[^#<>*!]+$/} onChange={e => this.obs = e.target.value} />
                    <ImageUploader
                        withIcon={true}
                        buttonText='Subir'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                    />
                    <div>
                        <p className="inline-item w-25"> Pedido a domicilio</p>
                        <input className="inline-item w-25" type="checkbox" placeholder="Pedido a domicilio" onChange= {e => this.tohouse = e.target.value}/>
                    </div>
                    <div>
                        <p className="inline-item w-25"> Disponible</p>
                        <input className="inline-item w-25" type="checkbox" placeholder="Pedido a domicilio" onChange= {e => this.instock = e.target.value}/>
                    </div>
                    
                    
                    <button type="submit" className="btn btn-success">Añadir Item</button>

                </form>
            </div>
          
        )
    }
}

class AddProvider extends Component{
    constructor(){
        super()
        this.state ={
            providers : []
        }
    }
    async componentDidMount(){
         await providers.get('', {params : {provider_userid : cookies.get('user_panelid') }}).then(response => {
             this.setState({providers : response.data})
         })

    }
    deleteItem = async(index) =>{
        var id= this.state.providers[index].id;
        await providers.delete(`/${id}`).then(response =>{
            if(response) this.componentDidMount();
        })
        
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        if(this.cuit === undefined) this.cuit = "Nada";
        if(this.email === undefined) this.email = "No email";


        if(this.lastname !== undefined && this.name !== undefined && this.direction !== undefined && this.phone !== undefined)
        {
            if(this.name.length >  4){
                
                const toapi = {
                    provider_userid : cookies.get('user_panelid'),
                    provider_name : this.name,
                    provider_lastname : this.lastname,
                    provider_cuit : this.cuit,
                    provider_direction : this.direction,
                    provider_phone : this.phone,
                    provider_email : this.email,
                    category_time_add : new Date().toLocaleString()
                };
                await providers.post("", toapi)
                .then((res) => {
                    if(res) {
                        NotificationManager.success({
                            title: 'Añadido',
                            message: 'Añadiste un proveedor'
                          });
                        window.location.reload();
                    }
                    else NotificationManager.error({
                        title: 'Error',
                        message: 'Ingresa un nombre'
                      });
                })
                .catch((err) => console.log(err));
                
            } else NotificationManager.error({
                title: 'Error',
                message: 'Completa el formulario'
              });
        } else NotificationManager.error({
            title: 'Error',
            message: 'Completa el formulario'
          });
    }
    render(){
        let _this = this;
        const list = this.state.providers.length > 0 && this.state.providers.map(function(array, index){
            return (
                <Modal subname="sub-modal" namebutton={array.provider_name + "(Telefono: " + array.provider_phone+  " Telefono 2: " + array.provider_cuit + ")"} classButon="btn btn-outline-dark" icon="trash">
                    <p> ¿Seguro quieres eliminar el proveedor {array.provider_name} ( Añadido : {array.category_time_add})</p>
                    <button key={index} className="btn btn-outline-danger w-100" onClick={() => _this.deleteItem(array.id)}> Eliminar <ion-icon name="backspace"></ion-icon></button>
                </Modal>
            )
        });
        return(
            <div>
                
                <div className="panel-scrolling">
                    {list}
                </div>
                <div className="dropdown-divider"></div>
                <form className="form-inventory" onSubmit={this.handleSubmit}>
                    
                    <InputText placeholder="Nombre proveedor" keyfilter="alpha" onChange={e => this.name = e.target.value}/>
                    <InputText placeholder="Nombre de contacto" keyfilter="alpha" onChange={e => this.lastname = e.target.value}/> 
                    
                    <InputText placeholder="Dirección" keyfilter="alpha" onChange={e => this.direction = e.target.value}/> 
                    <InputText placeholder="Telefono" keyfilter="int" onChange={e => this.phone = e.target.value}/> 
                    <InputText placeholder="Telefono 2" keyfilter="int" onChange={e => this.cuit = e.target.value}/> 
                    <InputText placeholder="Correo electronico" keyfilter="email" onChange={e => this.email = e.target.value}/>
                    <button type="submit" className="btn btn-success">Añadir proveedor</button>

                </form>
            </div>
          
        )
    }
}
class AddCategory extends Component{
    constructor(){
        super()
        this.state ={
            categories : []
        }
    }
    async componentDidMount(){
         await categories.get('', {params : { category_userid : cookies.get('user_panelid')}}).then(response => {
             this.setState({categories : response.data})
         })

    }
    deleteItem = async(index) =>{
        await categories.delete(`/${index}`).then(response =>{
            if(response) this.componentDidMount();
        })
        
    }
    handleSubmit = async(e) =>{
        e.preventDefault();
        if(this.name !== undefined)
        {
            if(this.name.length >  4){
                
                const toapi = {
                    category_userid : cookies.get('user_panelid'),
                    category_name : this.name,
                    category_time_add : new Date().toLocaleString()
                };
                await categories.post("", toapi)
                .then((res) => {
                    if(res) {
                        NotificationManager.success({
                            title: 'Añadido',
                            message: 'Añadiste una categoria'
                          });
                        window.location.reload();
                    }
                    else NotificationManager.error({
                        title: 'Error',
                        message: 'Completa el formulario'
                      });
                })
                .catch((err) => console.log(err));
                
            }
        } else NotificationManager.error({
            title: 'Error',
            message: 'Completa el formulario'
          });
    }
    render(){
        let _this = this;
        const list = this.state.categories.length > 0 && this.state.categories.map(function(array, index){
            return (

                <Modal subname="sub-modal" namebutton={array.category_name} classButon="btn btn-outline-dark" icon="trash">
                    <p> ¿Seguro quieres eliminar la categoria {array.category_name} ( Añadido : {array.category_time_add})</p>
                    <button key={index} className="btn btn-outline-danger w-100" onClick={() => _this.deleteItem(array.id)}> Eliminar <ion-icon name="backspace"></ion-icon></button>
                </Modal>
            )
        });
        return(
            <div>
                
                <div className="panel-scrolling">
                    {list}
                </div>
                <div className="dropdown-divider"></div>
                <form className="form-inventory" onSubmit={this.handleSubmit}>
                    
                    <InputText placeholder="Nombre" keyfilter={/^[^#<>*!]+$/} onChange={e => this.name = e.target.value}/> 
                    <button type="submit" className="btn btn-success">Añadir categoria</button>

                </form>
            </div>
          
        )
    }
}
class RunTable extends Component {
    constructor(){
        super();
        this.state = {
            display_onstate : '',
            inventory : [],
            categories : [],
            providers : []
        }
        
    }
    
    componentDidMount(){
        this.getData();
    }

    async getData(){
        await api.get('', {params: {item_userid: cookies.get('user_panelid')}}).then(response => {return response; })
        .then(response =>{
            this.setState({inventory : response.data});
        })
        await categories.get('', {params : {category_userid : cookies.get('user_panelid')}}).then(response =>{
            this.setState({categories : response.data});
        })
        await providers.get('', {params : {provider_userid : cookies.get('user_panelid')}}).then(response =>{
            this.setState({providers : response.data});
        })
    } 
    

    deleteItem = async(index) =>{
        await api.delete(`/${index}`).then(response =>{
            if(response) this.componentDidMount();
        })
        
    }

 
    render(){
        let _this = this;
        let list = this.state.inventory.length > 0 && this.state.inventory.map(function(array, index){
            return(
                <tr key={index} className="table-body">
                    <th scope="row">
                    <button className="button-display-data" >-</button>
                    <div className="hiddenDiv">
                        
                            <p>Codigo de barra: {array.bar_code}</p>    
                            <p>Codigo de serie: {array.serie_code}</p>
                            <p>Categoria: {_this.state.categories.length > Number(array.item_category) && _this.state.categories[Number(array.item_category)].category_name}</p>
                            <p>Proveedor: {_this.state.providers.length > Number(array.item_provider) && _this.state.providers[Number(array.item_provider)].provider_name}</p>
                            <p>Se agrego: {array.date_add}</p>
                            <p>Disponible: {array.instock === "on" && "Si"} {array.instock === "off" && "No"}</p>
                            <p>Venta online: {array.tohouse === "on" && "Si"} {array.tohouse === "off" && "No"}</p>
                            <p>Detalles:{array.obs}</p>
                            


                    </div>
                    </th>
                    
                    <td>{array.item_description}</td>
                    <td><button className="btn blue">{array.item_stock}</button></td>
                    <td>{array.item_pricebuy}</td>
                    <td>{array.item_pricesell}</td>
                    <td> {array.item_priceup}</td>
                    <td><img width="50px" height="50px" src={array.item_image} alt="descriptionmage-to"></img></td>
                    
                    <td>
                        <EditIttem array={array}/>
                        <Modal  namebutton="" classButon="btn btn-danger" icon="trash">
                            <p>¿Seguro que quieres eliminar el item {array.item_description}?</p>

                            <button className="btn btn-danger" onClick={() => _this.deleteItem(array.id)}> Eliminar</button>
                        </Modal>
                    </td>
                    
                </tr>
                    
            )
        })
        let listxml = this.state.inventory.length > 0 && this.state.inventory.map(function(array, index){
            return(
                <tr key={index} className="table-body">
                    <th scope="row">
                        #00-{index+1}
                    </th>
                    
                    <td>{array.item_description}</td>
                    <td><button className="btn blue">{array.item_stock}</button></td>
                    <td>{array.item_pricebuy}</td>
                    <td>{array.item_pricesell}</td>
                    <td> {array.item_priceup}</td>
                    <td><img width="50px" height="50px" src={array.item_image} alt="descriptionmage-to"></img></td>
                    <td> {array.obs}</td>
                    
                    
                </tr>
                    
            )
        })
        return(
            <div className="table-responsive">
                <table className="table table-bordered">
                    <caption>Tu inventario</caption>
                    <thead className="bg-dark">
                        <tr>
                            <th scope="col">Data</th>
                            <th scope="col">Descripcion</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Precio compra</th>
                            <th scope="col">Precio venta</th>
                            <th scope="col">Precio mayoreo</th>
                            <th scope="col">Imagen</th>
                            <th scope="col">Acciones</th>
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
                                <th scope="col">Data</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Stock</th>
                                <th scope="col">Precio compra</th>
                                <th scope="col">Precio venta</th>
                                <th scope="col">Precio mayoreo</th>
                                <th scope="col">Imagen</th>
                                <th scope="col"> Detalles</th>
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
                                    filename="inventory"
                                    sheet="tablexls"
                                    buttonText="Descargar EXCEL"/>
                                    
                
                </div>
            </div>
        )
    }
}

export default class Inventory extends Component{
    render(){
        return (
            <div className="container-fluid">
                <Menu rute="/panel/inventory"/>
                <NotificationContainer/>
                <div className="panel-body align-center">
                        
                    <div className="panel-header nextdiv">
                        <div>

                            <div className="align-left">

                                <Modal namebutton="Añadir nuevo" classButon="btn btn-primary" icon="add">
                                    <AddItem/>
                                </Modal>
                                
                                <Modal namebutton="Categorias" classButon="btn btn-outline-secondary" icon="duplicate">
                                    <AddCategory/>
                                </Modal>
                                <Modal namebutton="Proveedores" classButon="btn btn-dark" icon="accessibility">
                                    <AddProvider/>
                                </Modal>
                            </div>
                            
                            <RunTable/>
                            
                        </div>
                    </div>


                </div>
                    
            </div>
        )
    }
}