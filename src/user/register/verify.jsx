import {
    useParams
} from "react-router-dom";
import axios from 'axios';


async function  update(id){
    var data = {};
    await axios.get('https://appisolutions.herokuapp.com/users/', {params: { user_id: id}}).then(response => {
        data = response.data[0];
        data.user_subscription = 1;
        console.log(data);
        
    });
    await axios.put(`https://appisolutions.herokuapp.com/users/${data.id}`, data).then(response => console.log(response));
}

const VerifyAccount = () =>{
    const {id} = useParams();
    update(id);
    return(
        <div className="cointainer">
            <div className="btn btn-success w-100"> Verificaste tu cuenta, Inicia sesion.</div>
        </div>
    )
}

export default VerifyAccount;