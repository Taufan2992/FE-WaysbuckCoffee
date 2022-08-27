import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Logo from "../../assets/img/logo-waysbook.png"
import Bc from "../../assets/img/barcode.png"
import convertRupiah from "rupiah-format";
import { API } from "../../config/API";
import Moment from "moment"
import Rp from "rupiah-format"


export default function TransactionData() {

    const [transactionsData, setTransactionsData] = useState([])

    //   GET TRANSACTION
    const getTransactions = async () => {
      const response = await API.get('/transactions')
      console.log('====================================');
      console.log(response.data.Transactions);
      console.log('====================================');
      setTransactionsData(response.data.Transactions)
    }
      
    useEffect(() => {
      getTransactions()
    },[])
    console.log(transactionsData);

  return (
    <Card className="card-transaction mb-5">
    {transactionsData?.map((item,index) => (
        <div className="left-side-card d-flex" key={index}>
            <img className="rounded py-3 ms-3 me-3" src={`http://localhost:5000/uploads/` + item?.product?.image}/>
            <div className="datas-transaction mt-4 ">
                <div className="title-names-transaction">
                    <p>{item?.product?.title}</p>
                </div>
                <div className="date-transaction">
                    <p>
                        {Moment(item?.created_at).format('dddd')}
                        <b className='times-new'></b>
                    </p>
                </div>
                <div className="toping-transaction">
                    <div className="just-toping">
                        Toping
                        &nbsp; : 
                            {item?.toping?.map((item,index) => (
                                <b className="times-new" >
                                {item?.title},{" "}
                            </b>
                        ))}
                        
                    </div>
                </div>
                <div className="price-transaction mt-2">
                    <b className='times-new mt-2'>Price : {Rp.convert(1000)}</b>
                </div>
            </div>
        </div>
    ))}
    <div className="right-side-card position-absolute">
        <div className="logo-transaction">
            <img className="position-absolute" src={Logo} />    
        </div>
        <div className="barcode-transaction">
            <img className="position-absolute" src={Bc} />
        </div> 
        <div className="button-transaction">
            <button className="position-absolute">
                .
            </button>
            <b className='fw-bold position-absolute'>On The Wayt</b>
        </div>
        <div className="sub-total-transaction">
            <p className='position-absolute'>Sub Total : {Rp.convert(1000)} </p>
        </div>
    </div>                             
</Card>
  );
}
