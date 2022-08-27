import React, { useState, useEffect } from 'react'
import NavbarAdmin from "../../components/partials/NavbarAdmin";
import TransactionData from "../../Dummies/TransactionData"
import { Container, Row, Col, Card } from "react-bootstrap"
import "../../assets/css/Transaction.css"
import Rp from "rupiah-format"
import { API } from "../../config/API"

function Transaction() {

    const title = "Transaction"
    document.title = title

    const [transactions, setTransactions] = useState([])

    //   GET TRANSACTION
    const getTransactions = async () => {
      const response = await API.get('/transactions')
      console.log('====================================');
      console.log(response.data.Transactions);
      console.log('====================================');
      setTransactions(response.data.Transactions)
    }
      
    useEffect(() => {
      getTransactions()
    },[])
    console.log(transactions);

  return (

    <>
      <Container>
        <NavbarAdmin/>
          <Row className="ms-5 mt-4">
          <div class="container text-red mt-4">
            <h3 className="mt-4">Income Transaction</h3>
          </div>

          <div class="container">
            <table class="table table-bordered border-dark">
                <thead>
                <tr>
                    <th scope="col" class="bg-secondary bg-opacity-10">No</th>
                    <th scope="col" class="bg-secondary bg-opacity-10">Name</th>
                    <th scope="col" class="bg-secondary bg-opacity-10">Address</th>
                    <th scope="col" class="bg-secondary bg-opacity-10">Post Code</th>
                    <th scope="col" class="bg-secondary bg-opacity-10">Income</th>
                    <th scope="col" class="bg-secondary bg-opacity-10">Status</th>
                </tr>
                </thead>
                <tbody>
                {transactions?.map((data, index) => (
                <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{data?.user?.fullname}</td>
                    <td>{data?.user?.address}</td>
                    <td>{data?.user?.post_code}</td>
                    <td class="text-primary">{data?.price}</td>
                    <td className= {`status-transaction-${data.status}`} >{data?.status}</td>
                </tr>
                ))}
                </tbody>
            </table>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default Transaction;
