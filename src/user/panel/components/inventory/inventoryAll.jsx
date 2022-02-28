import React, {Component} from 'react';
import Menu from '../menu';
import './inventory.css';

import axios from 'axios';
import Cookies from 'universal-cookie';

var cookies = new Cookies();

const api = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/inventory/'});
const categories = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/categories/'});
const providers = axios.create({ baseURL : 'https://appisolutions.herokuapp.com/providers/'});

export default class InventoryAll extends Component{
    constructor(){
        super();
        this.state = {
            inventory : [],
            categories : [],
            providers : []
        }
    }
    async componentDidMount(){
        await categories.get('', {params : {category_userid : cookies.get('user_panelid')}}).then(response =>{
            this.setState({categories : response.data});
        })
        await providers.get('', {params : {provider_userid : cookies.get('user_panelid')}}).then(response =>{
            this.setState({providers : response.data});
        })
        await api.get('', {params: {item_userid: cookies.get('user_panelid')}}).then(response => {return response; })
        .then(response =>{
            this.setState({inventory : response.data});
        })
    }
    filterCategory = async(parameter) =>{
        console.log(parameter);
        if(parameter !== -1){
            
            await api.get('', {params: {item_userid: cookies.get('user_panelid'), item_category: '' + parameter}}).then(response => {return response; })
            .then(response =>{
                this.setState({inventory : response.data});
            })
        }
    }
    filterProvider = async(parameter) =>{
        console.log(parameter);
        if(parameter !== -1){
            
            await api.get('', {params: {item_userid: cookies.get('user_panelid'), item_provider: '' + parameter}}).then(response => {return response; })
            .then(response =>{
                this.setState({inventory : response.data});
            })
        }
    }
    render(){
        let list = this.state.inventory.length > 0 && this.state.inventory.map(function(array, index){
            return(
                <tr key={index} className="table-body">
                    <td><img width="50px" height="50px" src={array.item_image} alt="descriptionmage-to"></img></td>
                    <td>{array.item_description}</td>
                    <td>{array.item_stock}</td>
                    <td>{array.item_pricebuy}</td>
                    <td>{array.item_pricesell}</td>
                    <td> {array.item_priceup}</td>
                    <td> {array.date_add}</td>
                </tr>
                    
            )
        })
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
                <Menu rute="/panel/inventory-all"/>
                <div className="panel-body align-center">
                        
                    <div className="panel-header nextdiv">
                        <div>
                            <div className="align-left">
                                <p> Filtrar</p>
                                <select name="Categoria" onChange={e => this.filterCategory(e.target.value)}>
                                    <option value={-1}> Categorias</option>
                                    {categorie}
                                </select>
                                <select name="Categoria" onChange={e => this.filterProvider(e.target.value)}>
                                <option value={-1}> Proveedores</option>
                                    {provide}
                                </select>
                                <div className="table-responsive">
                                    <table className="table">
                                        <caption>Inventario completo</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col">Imagen</th>
                                                <th scope="col">Descripcion</th>
                                                <th scope="col">Stock</th>
                                                <th scope="col">Precio compra</th>
                                                <th scope="col">Precio venta</th>
                                                <th scope="col">Precio mayoreo</th>
                                                <th scope="col"> Añadido</th>
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
            </div>
        )
    }
}