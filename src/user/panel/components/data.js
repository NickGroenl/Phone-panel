import axios from 'axios';




async function Fetching (id, url){

    
    await axios.get(url, {params: {user_id: id}}).then(response =>
    {
        return response;
    }).then(response => {
        return response.data[0];
    })
    
    
}

export default Fetching;