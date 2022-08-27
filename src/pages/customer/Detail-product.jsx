import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/user-context';
import { Container, Row, Col } from "react-bootstrap"
import Rp from "rupiah-format"
import "../../assets/css/DetailProduct.css"
import { useParams, useNavigate } from 'react-router-dom';
import NavbarUser from "../../components/partials/NavbarUser";
import { useQuery, useMutation } from "react-query"
import { API } from "../../config/API"
import { CartContext } from '../../context/cart-context';

const DetailProduct = () => {
    const title = ' Detail Product '
    document.title = title 
    
    const moving = useNavigate()

    // GET ID USER
    const [state, _] = useContext(UserContext)
    const user_id = state.user.id

    // STORE DATA CART
    const [payload, act] = useContext(CartContext)

    // COUNTER 
    const [cartCounter, setCartCounter] = useState(0)
    localStorage.setItem("Tambah", cartCounter)
    const addCart = localStorage.getItem("Tambah")

    // GET PRODUCT
    const [gettingProduct, setGettingProduct] = useState({})
    const { id } = useParams()
    const getDetailProduct = async () => {
        const response = await API.get(`/product/${id}`)
        setGettingProduct(response.data.product)
    }

    // CHECK TOPPING
    const [topping, setTopping] = useState([]);
    const [topping_id, setTopping_id] = useState ([]);

    const handleChange = (e) => {
    let updateTopping = [...topping];
    if (e.target.checked) {
        updateTopping = [...topping, e.target.value];
    } else {
        updateTopping.splice(topping.indexOf(e.target.name));
    }
    setTopping(updateTopping);

    let toppingId = [...topping_id];
    if (e.target.checked) {
        toppingId = [...topping_id, parseInt(e.target.name)];
    } else {
        toppingId.splice(topping_id.indexOf(e.target.name));
    }

    setTopping_id(toppingId);
    };

    // GET TOPPINGS
    const [gettingToppings, setGettingToppings] = useState([])

    const getToppings = async () => {
        const res = await API.get(`/topings`)
        setGettingToppings(res.data.users)
    }
    
    // HANDLE PRICE
    let ToppingTotal = topping.reduce((a, b) => {
        return a + parseInt(b);
    }, 0);
    
    let subamount = gettingProduct?.price + ToppingTotal;
    let qty = 1;

    // FETCH
    useEffect(() => {
        getDetailProduct()
        getToppings()
    },[])


    const handleToCart = useMutation(async (e) => {
        try {
            e.preventDefault()
            const config = {
                headers: {
                  'Content-type': 'application/json',
                },
              };

            let dataCart = {
                product_id : gettingProduct?.id,
                toping_id: topping_id,
                subamount : subamount,
                qty : qty,
                user_id : user_id,
            }
            const body = JSON.stringify(dataCart);

            const response = await API.post('/cart', body, config);
            console.log(response);
            act({
                type: 'ADD_CART_SUCCESS',
                payload: response.data
              })
              setCartCounter(cartCounter + 1)
              alert('Data added succesfully')
              if(response.data.status == "Success"){
                moving('/cart')
              }
        } catch (error) {
            console.log(error);
        }
    })

    console.log(gettingToppings);
    console.log(gettingProduct);
    return (
        <Container>
            <NavbarUser plusOne={addCart}/>
            <Row id="row-detail-product">
                <Col className="detail-drink mt-5">
                    <img id="detail-img-drink" className='mt-4 mb-5 shadow-lg' src={gettingProduct?.image}/>
                </Col>
                <Col id="right-side-addtpg" className="mt-5">
                    <div className="title-detail-product">
                        <p className="mt-4">{gettingProduct?.title}</p>
                    </div>
                    <div className="price-drink">
                        <p className="mt-2">{Rp.convert(gettingProduct?.price)}</p>
                    </div>
                    <div className="toping-add">
                        <p className='mt-5'>Toping</p>
                    </div>

                    {/* MAPPING TOPPING */}
                    <Row>
                    {gettingToppings.map((item, index) => (
                        <div key={index} className="topping-datas ms-4 col mb-5">
                            <div className="img-data-toping toppings-list-item" >
                                <div>
                                    <input 
                                        type="checkbox" 
                                        className="poppingCheck" 
                                        style={{display:"none"}}
                                        id={`custom-checkbox-${index}`}
                                        value={item?.price}
                                        name={item?.id} 
                                        onChange={handleChange}
                                    />
                                    <label htmlFor={`custom-checkbox-${index}`}>
                                        <img className="mb-5 cursor-pointer" src={item?.image}/>
                                    </label>
                                    
                                    <p id="toping-name" className="mb-5">{item?.title}</p>
                                </div>
                            </div>
                            <div className="price-data-toping ms-4 mb-5" hidden>
                                <p>{item?.price}</p>
                            </div>
                        </div>
                    ))}
                    
                    {/* END MAPPING */}

                        <div className="sub-total d-flex mb-5">
                            <div className="left-total">
                                Total
                            </div>
                            <div className="right-total">
                                {Rp.convert(gettingProduct?.price + ToppingTotal)}
                            </div>
                        </div>
                            <div className="btn-add-cart mb-5 mt-2">
                                <button className="mb-2" onClick={(e) => {handleToCart.mutate(e)}} type="submit" >Add Cart</button>
                            </div>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default DetailProduct