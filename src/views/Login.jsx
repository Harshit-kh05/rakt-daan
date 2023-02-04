import { useEffect, useState } from "react";
import CustomNavbar from "../components/CustomNavbar";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import classNames from "classnames";
import CardHeader from "react-bootstrap/esm/CardHeader";

export default function Login() {
  const [squares1to6, setSquares1to6] = useState("");
  const [squares7and8, setSquares7and8] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    document.body.classList.toggle("register-page");
    document.documentElement.addEventListener("mousemove", followCursor);
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle("register-page");
      document.documentElement.removeEventListener("mousemove", followCursor);
    };
  }, []);
  const followCursor = (event) => {
    let posX = event.clientX - window.innerWidth / 2;
    let posY = event.clientY - window.innerWidth / 6;
    setSquares1to6(
      "perspective(500px) rotateY(" +
        posX * 0.05 +
        "deg) rotateX(" +
        posY * -0.05 +
        "deg)"
    );
    setSquares7and8(
      "perspective(500px) rotateY(" +
        posX * 0.02 +
        "deg) rotateX(" +
        posY * -0.02 +
        "deg)"
    );
  };

  function formSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <CustomNavbar />
      <div className="wrapper">
        <div className="page-header" style={{ background: "white" }}>
          <div className="page-header-image" />
          <div className="content">
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                  <div
                    className="square square-7"
                    id="square7"
                    style={{ transform: squares7and8 }}
                  />
                  <div
                    className="square square-8"
                    id="square8"
                    style={{ transform: squares7and8 }}
                  />
                  <Card className="card-register">
                    <Card.Header>
                      <Card.Img
                        alt="..."
                        src={require("../assets/img/square-purple-1.png")}
                      />
                      <Card.Title tag="h4">Login</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Group className="my-3">
                          <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                        </Form.Group>
                        <Form.Group className="my-3">
                          <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            value={pass}
                            onChange={(e) => {
                              setPass(e.target.value);
                            }}
                          />
                        </Form.Group>
                      </Form>
                    </Card.Body>
                    <Card.Footer>
                      <Button
                        className="btn-round"
                        color="primary"
                        size="lg"
                        onClick={formSubmit}
                      >
                        Get Started
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>
              <div className="register-bg" />
              <div
                className="square square-1"
                id="square1"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-2"
                id="square2"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-3"
                id="square3"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-4"
                id="square4"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-5"
                id="square5"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-6"
                id="square6"
                style={{ transform: squares1to6 }}
              />
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}
