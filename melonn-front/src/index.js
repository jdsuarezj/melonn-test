import React from "react";
import ReactDOM from "react-dom";
import "./Assets/css/index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Col, Row } from "react-bootstrap";

ReactDOM.render(
  <React.StrictMode>
    <div className="containerApp mx-5">
      <Row>
        <Col md="12">
          <Card>
            <App />
          </Card>
        </Col>
      </Row>
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
