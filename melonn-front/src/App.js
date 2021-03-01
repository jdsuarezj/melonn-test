import "./Assets/css/App.css";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Button, Card, Container, Row } from "react-bootstrap";
import List from "./Views/List";
import Create from "./Views/Create";
import Detail from "./Views/Detail";
import logo from "./Assets/images/logo-melonn.png";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/list">
          <List></List>
        </Route>
        <Route path="/create">
          <Create></Create>
        </Route>
        <Route path="/detail/:id" component={Detail} />
        <Container>
          <Row>
            <div className="col-md-8 offset-md-2 col-12 offset-0">
              <Card className="shadow p-3 mb-5 text-center table-full-width table-responsive">
                <Card.Header>
                  <img src={logo} alt="Logo" />
                </Card.Header>
                <Card.Body>
                  <Route path="/">
                    <div>
                      <Link to="/create">
                        <Button className="home-button mt-3 mb-3">
                          + Create order
                        </Button>
                      </Link>
                    </div>
                    <div>
                      <Link to="/list">
                        <Button className="home-button mb-3">
                          View Order list
                        </Button>
                      </Link>
                    </div>
                  </Route>
                </Card.Body>
                <Card.Footer>
                  <hr></hr>
                  <a
                    href="https://www.linkedin.com/in/jose-daniel-su%C3%A1rez-jurado-414833195/"
                    target="_blank"
                    rel="noreferrer"
                    className="made-for mb-0"
                  >
                    {" "}
                    Made by Daniel Suárez
                  </a>
                </Card.Footer>
              </Card>
            </div>
          </Row>
        </Container>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
