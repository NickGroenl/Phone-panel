import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './main.css';

// Components for panel
import Subscription from './user/panel/components/subscription';

import Inventory from './user/panel/components/inventory/invetory';
import InventoryAll from './user/panel/components/inventory/inventoryAll';

import Orders from './user/panel/components/orders/order';
import OrderAll from './user/panel/components/orders/orderAll';

import Repair from './user/panel/components/tech/repair';

import Users from './user/panel/components/users/users';
import Clients from './user/panel/components/users/clients';

import Services from './user/panel/components/services/services.jsx'


import Ods from './user/panel/components/ods/ods.jsx'
import Buy from './user/panel/components/ods/buy.jsx'
import Entry from './user/panel/components/ods/entry.jsx'

import Configuration from './user/panel/components/users/configuration';
import RenderPanel from './user/panel/index';

import RenderSearch from './user/panel/search';




import RenderLogin from './user/login/index';
import RenderRegister from './user/register/register';
import VerifyAccount from './user/register/verify';

        
function App(){
    
    return(
      <Router >
        <Switch>
          
          <Route path="/panel/configuration">
            <Configuration/>
          </Route>
          <Route path="/panel/users">
            <Users/>
          </Route>
          <Route path="/panel/clients">
            <Clients/>
          </Route>
          <Route path="/panel/services">
            <Services/>
          </Route>
          <Route path="/panel/ods">
            <Ods/>
          </Route>
          <Route path="/panel/entry">
            <Entry/>
          </Route>
          <Route path="/panel/buy">
            <Buy/>
          </Route>
          <Route path="/panel/repair">
            <Repair/>
          </Route>
          <Route path="/panel/orders-all">
            <OrderAll/>
          </Route>
          <Route path="/panel/orders">
            <Orders/>
          </Route>
          <Route path="/panel/inventory-all">
            <InventoryAll/>
          </Route>
          <Route path="/panel/inventory">
            <Inventory/>
          </Route>
          <Route path="/panel/subscription">
            
            <Subscription/>
          </Route>
          <Route path='/panel/ASASAas45660vnasdjghs/:id'>
            <VerifyAccount/>
          </Route>
          <Route path="/panel">
            <RenderPanel/>
          </Route>
          <Route path="/search">
            <RenderSearch/>
          </Route>
          <Route path="/register">
              <RenderRegister/>
          </Route>

          <Route path="/login">
            <RenderLogin/>
          </Route>
          <Route path="/"> <Redirect to="/login"/></Route>

        </Switch>

      </Router>
    )
}

export default App;