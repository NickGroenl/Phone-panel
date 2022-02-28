import Menu from './menu';
import '../main.css';
import '../index.css';


export default function Subscription(){
    return (
        <div className="container-fluid">
                <Menu rute="/panel/subscription"/>
                
                <div className="panel-body align-center">
                    
                    <div className="panel-header">
                        <div className="cards white">
                            <h1> Plan basico</h1>
                            <div>
                                <p> Crear orden</p>
                                <p> Ver ordenes</p>
                                <p> 50 ordenes</p>
                                <p> 1 usuarios</p>

                                <button className="btn btn-outline-warning w-100"> $ 0.0 USD</button>
                            </div>
                        </div>
                        <div className="cards white">
                            <h1> Plan bussines</h1>
                            <div>
                            <p> Crear orden</p>
                                <p> Eliminar orden</p>
                                <p> Ver ordenes</p>
                                <p> Ordenes ilimitadas</p>
                                <p> 10 usuarios</p>
                                <p> Modificar usuarios</p>
                                <p> Catalogo(Eliminar/Añadir)</p>
                                <p> Catalogo (productos) ilimitado</p>
                                <button className="btn btn-outline-warning w-100"> $ 60.0 USD</button>
                            </div>
                        </div>
                        <div className="cards white">
                            <h1> Plan emprendimiento</h1>
                            <div>
                                <p> Crear orden</p>
                                <p> Eliminar orden</p>
                                <p> Ver ordenes</p>
                                <p> 300 ordenes</p>
                                <p> 3 usuarios</p>
                                <p> Modificar usuarios</p>
                                <p> Catalogo(Eliminar/Añadir)</p>
                                
                                <button className="btn btn-outline-warning w-100"> $ 50.0 USD</button>
                            </div>
                        </div>
                
                    </div>
                    
                </div>
                <div className="align-center">
                        <img width='100px' height='70px' src="https://d31dn7nfpuwjnm.cloudfront.net/images/valoraciones/0033/7299/Como_retirar_dinero_de_PayPal_en_Colombia.png?1555502328" alt="nonenada"></img>
                </div>
                
            </div>
    )
}