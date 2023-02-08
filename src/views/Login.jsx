import { useContext, useEffect, useState } from "react";
import CustomNavbar from "../components/CustomNavbar";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import globalContext from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/Preloader";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";

export default function Login() {
  const [squares1to6, setSquares1to6] = useState("");
  const [squares7and8, setSquares7and8] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLoading, setLoading] = useState(false);

  const { contract } = useContract(
    "0x562c8B913F937367Ba35C48B7937d1C592bE088d"
  );
  const [alertMessage, setAlert] = useState("");
  const [showAlert, setShow] = useState(false);

  const { setUserHelper } = useContext(globalContext);

  const navigate = useNavigate();

  const account = useAddress();

  const { data } = useContractRead(contract, "getIdentity", account);
  const { mutateAsync: isLoginValid } = useContractRead(
    contract,
    "isLoginValid"
  );
  const { mutateAsync: getLoginDetails } = useContractRead(contract, "getUser");

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

  async function FormSubmit(e) {
    let accountExist = data;
    console.log(email, pass, account, accountExist);
    if (accountExist == false) {
      setAlert("Account does not exist");
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    } else if (email === "" || pass === "") {
      setAlert("Complete the form");
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    } else {
      try {
        //checking if email pass if right
        var loginStatus = await isLoginValid(account, email, pass);
        if (loginStatus === "1") {
          setAlert("Email does not match with account");
          setShow(true);
          setTimeout(() => setShow(false), 3000);
        } else if (loginStatus === "2") {
          setAlert("Wrong Password");
          setShow(true);
          setTimeout(() => setShow(false), 3000);
        } else if (loginStatus === "3") {
          var userData = await getLoginDetails(
            account,
            email.toString(),
            pass.toString()
          );
          console.log(userData);
          var curUser = {
            name: userData[0],
            email: email.toString(),
            add: userData[2],
            coords: userData[3],
            type: userData[1],
          };
          console.log("Current Logged In User: ", curUser);
          setUserHelper(curUser);
          // redirect to home after registering
          if (userData[1] === "Blood Bank") navigate("/bloodbank-home");
          else navigate("/hospital-home");
        }
      } catch (err) {
        console.log("Login Error: ", err);
      }
    }
  }

  if (!isLoading) {
    return (
      <>
        <CustomNavbar />
        <div className="wrapper">
          <div className="page-header" style={{ background: "white" }}>
            <div className="page-header-image" />
            <div className="content">
              <Container>
                <Alert show={showAlert} variant="info">
                  {alertMessage}
                </Alert>
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
                          onClick={FormSubmit}
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
  } else {
    return <Preloader />;
  }
}
