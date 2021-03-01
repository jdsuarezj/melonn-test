import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Card, Table, Container, Row, Col } from "react-bootstrap";

let sessionClientID = sessionStorage.tabID
  ? sessionStorage.tabID
  : (sessionStorage.tabID = Math.random());
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordersList: [],
    };
  }

  componentDidMount() {
    this.sessionOrderList();
  }

  sessionOrderList = () => {
    axios
      .get(`http://localhost:3001/sell/session-orders-list/${sessionClientID}`)
      .then((res) => {
        this.setState({ ordersList: res.data.userSession });
      });
  };

  render() {
    return (
      <>
        <Container fluid>
          <Row>
            <Col md="12">
              <Card className="shadow p-3 mb-5 mx-5">
                <Card.Header>
                  <Card.Title as="h2">Sell Order List</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive">
                  {this.state.ordersList ? (
                    <Table className="table-hover">
                      <thead>
                        <tr>
                          <th className="border-0">Detail</th>
                          <th className="border-0">Order Number</th>
                          <th className="border-0">Seller Store</th>
                          <th className="border-0">Creation Date</th>
                          <th className="border-0">Shipping Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.ordersList.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <Link
                                className="btn btn-info"
                                to={`/detail/${item.id}`}
                              >
                                View
                              </Link>
                            </td>
                            <td>
                              <p>{item.id}</p>
                            </td>
                            <td>
                              <p>{item.store}</p>
                            </td>
                            <td>
                              <p>{item.createDate}</p>
                            </td>
                            <td>
                              <p>{item.shippingMethodName}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>No data</p>
                  )}
                </Card.Body>
                <Card.Footer>
                  <hr></hr>
                  <div className="d-grid gap-2 d-flex justify-content-end">
                    <Link className="btn btn-success" to="/create">
                      + New
                    </Link>
                    <Link className="btn btn-light ml-3 mr-1" to="/">
                      Back
                    </Link>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default List;
