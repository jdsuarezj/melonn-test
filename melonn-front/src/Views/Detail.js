import axios from "axios";
import React, { Component } from "react";
import { Card, Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

let sessionClientID = sessionStorage.tabID
  ? sessionStorage.tabID
  : (sessionStorage.tabID = Math.random());

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: [],
    };
  }

  componentDidMount() {
    this.sellOrderDetails();
  }

  sellOrderDetails = () => {
    axios
      .get(`http://localhost:3001/sell/order/${sessionClientID}`, {
        params: {
          id: this.props.match.params.id,
        },
      })
      .then((res) => {
        this.setState({ order: res.data[0] });
      });
  };

  render() {
    return (
      <>
        <Container fluid>
          {this.state.order ? (
            <Col md="12">
              <Card className="shadow-lg p-3 mb-5">
                <Card.Header>
                  <Card.Title as="h2">Sell Order Details</Card.Title>
                  <p className="card-category">
                    Internal code: {this.state.order.id}
                  </p>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col xl="4">
                      <Card className="shadow p-3 mb-4">
                        <Card.Header>
                          <Card.Title as="h4">Order info</Card.Title>
                        </Card.Header>
                        <Card.Body className="detail">
                          <p>
                            External order number:{" "}
                            <span>{this.state.order.externalOrder}</span>
                          </p>
                          <p>
                            Buyer name:{" "}
                            <span>{this.state.order.buyerName}</span>
                          </p>
                          <p>
                            Buyer phone number:{" "}
                            <span>{this.state.order.buyerPhone}</span>
                          </p>
                          <p>
                            Buyer email:{" "}
                            <span>{this.state.order.buyerMail}</span>
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col xl="4">
                      <Card className="shadow p-3 mb-4">
                        <Card.Header>
                          <Card.Title as="h4">Shipping info</Card.Title>
                        </Card.Header>
                        <Card.Body className="detail">
                          <p>
                            Shipping address:{" "}
                            <span>{this.state.order.shippingAddress}</span>
                          </p>
                          <p>
                            Shipping city:{" "}
                            <span>{this.state.order.shippingCity}</span>
                          </p>
                          <p>
                            Shipping region:{" "}
                            <span>{this.state.order.shippingRegion}</span>
                          </p>
                          <p>
                            Shipping country:{" "}
                            <span>{this.state.order.shippingCountry}</span>
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col xl="4">
                      <Card className="shadow p-3 mb-4">
                        <Card.Header>
                          <Card.Title as="h4">Order info</Card.Title>
                        </Card.Header>
                        <Card.Body className="detail">
                          {this.state.order.packMin ? (
                            <p>
                              Pack min: <span>{this.state.order.packMin}</span>
                            </p>
                          ) : null}
                          {this.state.order.packMax ? (
                            <p>
                              Pack max: <span>{this.state.order.packMax}</span>{" "}
                            </p>
                          ) : null}
                          {this.state.order.shipMin ? (
                            <p>
                              Ship min: <span>{this.state.order.shipMin}</span>
                            </p>
                          ) : null}
                          {this.state.order.shipMax ? (
                            <p>
                              Ship max: <span>{this.state.order.shipMax}</span>
                            </p>
                          ) : null}
                          {this.state.order.deliveryMin ? (
                            <p>
                              Delivery min:{" "}
                              <span>{this.state.order.deliveryMin}</span>
                            </p>
                          ) : null}
                          {this.state.order.deliveryMax ? (
                            <p>
                              Delivery max:{" "}
                              <span>{this.state.order.deliveryMax}</span>
                            </p>
                          ) : null}
                          {this.state.order.pickupMin ? (
                            <p>
                              Ready pickup min:{" "}
                              <span>{this.state.order.pickupMin}</span>
                            </p>
                          ) : null}
                          {this.state.order.pickupMax ? (
                            <p>
                              Ready pickup max:{" "}
                              <span>{this.state.order.pickupMax}</span>
                            </p>
                          ) : null}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <Card className="shadow p-3 mb-4">
                        <Card.Header>
                          <Card.Title as="h4">Items</Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            {this.state.order.lineItems &&
                              this.state.order.lineItems.map((item, index) => (
                                <Col key={index} md="3">
                                  <Card className="shadow-sm p-3 mb-2">
                                    <Card.Header>
                                      <Card.Title as="h5">
                                        {item.itemName}
                                      </Card.Title>
                                    </Card.Header>
                                    <Card.Body className="detail">
                                      <p>
                                        Product QTY: <span>{item.itemQTY}</span>
                                      </p>
                                      <p>
                                        Product Weight:{" "}
                                        <span>{item.itemWeight}</span>
                                      </p>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              ))}
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer>
                  <hr></hr>
                  <div className="d-grid gap-2 d-flex justify-content-end">
                    <Link className="btn btn-success" to="/create">
                      + New
                    </Link>
                    <Link className="btn btn-light ml-3 mr-1" to="/list">
                      Back
                    </Link>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ) : (
            <Card>
              <h3>This should never happen</h3>
            </Card>
          )}
        </Container>
      </>
    );
  }
}

export default Detail;
