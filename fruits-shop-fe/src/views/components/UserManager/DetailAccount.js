import useAuth from "@api/useAuth";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "../../../assets/assets/libs/bootstrap/js/dist/toast";


function DetailAccount() {
    const params = useParams();
    const {getUserDetail} = useAuth()
    const [data,setData] = useState({});    
    const fetchData = async () => {
        try {
            const {success,data} = await getUserDetail({UserId: params.userId})
            if (success) {
                setData(data.data)
                toast.success(data);
            } else {
                toast.error("Server error");
            }
        } catch (err) {
            toast.error(err)
        }
        
    }
    useEffect(() => {
        fetchData()    
    }, [])
    
    
    return (<div class="container py-5">
    <div class="row g-4 mb-5">
        <div class="col-lg-8 col-xl-9">
            <div class="row g-4">
                <div class="col-lg-6">

                <span style={{display: 'flex'}}>
                        <p style={{marginRight: '10px'}}>
                            Email:  
                        </p>
                        <p>
                            {data.email}
                        </p>
                    </span>


                    <span style={{display: 'flex'}}>
                        <p style={{marginRight: '10px'}}>
                        UserName:  
                        </p>
                        <p>
                            {data.userName}
                        </p>
                    </span>

                    <span style={{display: 'flex'}}>
                        <p style={{marginRight: '10px'}}>
                        PhoneNumber:  
                        </p>
                        <p>
                            {data.phoneNumber}
                        </p>
                    </span>
                    <span style={{display: 'flex'}}>
                        <p style={{marginRight: '10px'}}>
                            UserId:  
                        </p>
                        <p>
                            {data.id}
                        </p>
                    </span>
                    

                </div>
               
            </div>
        </div>
      
    </div>
</div> );
}

export default DetailAccount;