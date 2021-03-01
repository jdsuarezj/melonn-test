import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";

export default function Create() {
  const [shippingMethodsData, setShippingMethodsData] = useState([]);
  const [store, setStore] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [externalOrder, setExternalOrder] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerMail, setBuyerMail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingRegion, setShippingRegion] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");
  const [lineItems, setLineItems] = useState([
    {
      itemName: "",
      itemQTY: 0,
      itemWeight: 0,
    },
  ]);
  const [redirect, setRedirect] = useState(false);

  let sessionClientID = sessionStorage.tabID
    ? sessionStorage.tabID
    : (sessionStorage.tabID = Math.random());

  useEffect(() => {
    shippingMethods();
  }, []);

  function shippingMethods() {
    axios.get(`http://localhost:3001/sell/shipping-methods`).then((res) => {
      const shippingMethodsData = res.data;
      setShippingMethodsData(shippingMethodsData);
    });
  }

  function newItem() {
    setLineItems((state) => [
      ...state,
      { itemName: "", itemQTY: 0, itemWeight: 0 },
    ]);
  }

  function handleSelect(e) {
    setShippingMethod(e.target.value);
  }

  function handleLineChangeName(e, index) {
    setLineItems((state) => {
      state[index].itemName = e.target.value;
      return state;
    });
  }

  function handleLineChangeQTY(e, index) {
    setLineItems((state) => {
      state[index].itemQTY = e.target.value;
      return state;
    });
  }

  function handleLineChangeWeight(e, index) {
    setLineItems((state) => {
      state[index].itemWeight = e.target.value;
      return state;
    });
  }

  function handleSubmit(e) {
    axios
      .post(`http://localhost:3001/sell/save-order/${sessionClientID}`, {
        store,
        shippingMethod: shippingMethod ? parseInt(shippingMethod) : 1,
        externalOrder: parseInt(externalOrder),
        buyerName,
        buyerPhone,
        buyerMail,
        shippingAddress,
        shippingCity,
        shippingRegion,
        shippingCountry,
        lineItems,
      })
      .then(
        (res) => {
          if (res.data.message) {
            alert(res.data.message);
          } else {
            alert("Successfully created");
            setRedirect(true);
          }
        },
        (error) => {
          console.log(error);
          alert(error);
        }
      );
  }

  if (redirect) {
    return <Redirect to="/list" />;
  } else {
    return (
      <Container>
        <Row>
          <Col md="12">
            <Card className="shadow p-3 mb-5">
              <Card.Header>
                <Card.Title as="h2">Sell Order Creation</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit} action="javascript:void(0)">
                  <Row>
                    <Col md="4">
                      <Form.Group>
                        <label>Store</label>
                        <Form.Control
                          type="text"
                          value={store}
                          onChange={(e) => setStore(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md="5">
                      <Form.Group>
                        <label>Shipping Method</label>
                        <select
                          className="form-control-select"
                          onChange={handleSelect}
                        >
                          {shippingMethodsData.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </Form.Group>
                    </Col>
                    <Col md="3">
                      <Form.Group>
                        <label> External Order</label>
                        <Form.Control
                          type="number"
                          value={externalOrder}
                          onChange={(e) => setExternalOrder(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="4">
                      <Form.Group>
                        <label>Buyer Name</label>
                        <Form.Control
                          type="text"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <label> Buyer Phone</label>
                        <Form.Control
                          type="number"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <label> Buyer Mail</label>
                        <Form.Control
                          type="email"
                          value={buyerMail}
                          onChange={(e) => setBuyerMail(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="3">
                      <Form.Group>
                        <label>Shipping Adress</label>
                        <Form.Control
                          type="text"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md="3">
                      <Form.Group>
                        <label>Shipping City</label>
                        <Form.Control
                          type="text"
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md="3">
                      <Form.Group>
                        <label>Shipping Region</label>
                        <Form.Control
                          type="text"
                          value={shippingRegion}
                          onChange={(e) => setShippingRegion(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md="3">
                      <Form.Group>
                        <label>Shipping Country</label>
                        <Form.Control
                          type="text"
                          value={shippingCountry}
                          onChange={(e) => setShippingCountry(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Card className="shadow-sm p-3 mb-4">
                    <Card.Header>
                      <Card.Title as="h3" className="text-center">
                        Items
                      </Card.Title>
                    </Card.Header>
                    <Card.Body>
                      {lineItems.map((item, index) => (
                        <Row key={index}>
                          <Col md="4">
                            <Form.Group>
                              <label>Item Name</label>
                              <Form.Control
                                type="text"
                                value={lineItems.itemName}
                                onChange={(e) => handleLineChangeName(e, index)}
                                required
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md="4">
                            <Form.Group>
                              <label>Item QTY</label>
                              <Form.Control
                                type="number"
                                value={lineItems.itemQTY}
                                onChange={(e) => handleLineChangeQTY(e, index)}
                                required
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md="4">
                            <Form.Group>
                              <label>Item Weight</label>
                              <Form.Control
                                type="number"
                                step="0.01"
                                value={lineItems.itemWeight}
                                onChange={(e) =>
                                  handleLineChangeWeight(e, index)
                                }
                                required
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                      ))}
                      <Row>
                        <div className="d-grid gap-2 col-6 mx-auto text-center">
                          <Button
                            className="btn btn-info"
                            onClick={() => newItem()}
                          >
                            + Add
                          </Button>
                        </div>
                      </Row>
                    </Card.Body>
                  </Card>
                  <Card.Footer>
                    <div className="d-grid gap-2 d-flex justify-content-end">
                      <Button className="btn btn-success" type="submit">
                        Create order
                      </Button>
                      <Link className="btn btn-light ml-3 mr-1" to="/list">
                        Back
                      </Link>
                    </div>
                  </Card.Footer>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
