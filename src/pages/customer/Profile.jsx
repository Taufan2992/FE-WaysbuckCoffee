import React, { useState, useContext, useEffect } from 'react';
import "../../assets/css/Profile.css"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import Logo from "../../assets/img/logo-waysbook.png"
import Bc from "../../assets/img/barcode.png"
import Rp from "rupiah-format"
import NavbarUser from '../../components/partials/NavbarUser';
import Moment from "moment"
import { UserContext } from '../../context/user-context';
import Blank from "../../assets/img/blank-profile.png"
import { useNavigate, useParams } from 'react-router-dom';
import { API } from "../../config/API"

const Profile = () => {

    const title = "Profile"
    document.title = title
    
    const [state,_] = useContext(UserContext)
    const ID = state.user.id
    console.log(state);
    const moving = useNavigate()
    const { email, fullname, image } = state.user
    const [carts, setCarts] = useState([])
    const [data, setData] = useState({})

    // GET PROFILE DATA
    const getProfile = async () => {
        const response = await API.get('/user/' + ID)
        setData(response?.data?.users)
    }

    //   GET CART
    console.log(ID);
    const getCarts = async () => {
        const response = await API.get(`/usercart/${ID}`)
        console.log(response.data.users);
        setCarts(response?.data?.users)
    }

      // subtotal
  let resultTotal = carts?.reduce((a, b) => {
    return a + b.subamount;
  }, 0);
    
    console.log('====================================');
    console.log(carts);
    console.log(resultTotal);
    console.log('====================================');

    useEffect(() => {
        getCarts()
        getProfile()
    },[])

    console.log(setCarts);

    let total = 0;

    const movingToEditProfile = () => {
        moving('/edit-profile/' + ID)
    }
    const addCart = localStorage.getItem("Tambah")
    return (
        <Container>
            <NavbarUser plusOne={addCart}/>
            <Row>
                <div className="header-title-profile mt-5">
                    <p className="py-3 fw-bolder">My Profile</p>
                </div>
                <Col>
                    <div className="img-profile mt-4 me-3">
                        <img className="rounded" src={ data?.image || Blank } />
                    </div>
                </Col>
                <Col>
                    <div className="profile-data mt-5">
                        <div className="parents-profile-data">
                            <p>Full Name</p>
                        </div>
                        <div className="childs-profile-data mb-4">
                            <p>{data?.fullname}</p>
                        </div>
                        <div className="parents-profile-data mt-5">
                            <p>Email</p>
                        </div>
                        <div className="childs-profile-data">
                            <p>{data?.email}</p>
                        </div>
                    </div>
                    <div className="btn-edit-profile mt-4">
                        <Button className="mt-4" variant="danger" type="submit"
                            onClick={movingToEditProfile}>
                            Edit Profile
                        </Button>
                    </div>
                </Col>
                <Col>
                    <div className="title-transaction">
                        <p>My Transaction</p>
                    </div>
                        <Card className="card-transaction mb-5">
                            {carts?.map((item,index) => (
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
                                            <b className='times-new mt-2'>Price : {Rp.convert(item?.subamount)}</b>
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
                                    <p className='position-absolute'>Sub Total : {Rp.convert(resultTotal)} </p>
                                </div>
                            </div>                             
                        </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Profile

