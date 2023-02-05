import CustomNavbar from "../components/CustomNavbar";
import BlockChainContext from "../context/BlockChainContext";
import globalContext from "../context/GlobalContext";
import { useContext, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FetchFromAadhar from "../dummyAPI/fetchAadhar";

export default function BloodCollection() {
  const { web3, accounts, contract } = useContext(BlockChainContext);
  const { user } = useContext(globalContext);
  const [data, setData] = useState({
    bloodId: "",
    aadharNo: "",
    bloodGroup: "",

    verified: false,
    collectionDate: new Date().toLocaleString().split(",")[0],
    location: "",
  });

  const navigate = useNavigate();

  function inputChangeHandler(e) {
    const { name, value } = e.target;
    setData((prevVal) => {
      return {
        ...prevVal,
        [name]: value,
      };
    });
  }

  async function formSubmit(e) {
    e.preventDefault();
    console.log(data, user);
    var bloodExist = await contract.methods.bloodExist(data.bloodId);

    if (data.bloodId === "" || data.aadharNo === "" || data.bloodGroup === "") {
      alert("complete the form");
    } else if (FetchFromAadhar(data.aadharNo) === undefined) {
      alert("Aadhar not present in database");
    } else if (bloodExist === true) {
      alert("Blood ID exists");
    } else {
      try {
        await contract.methods
          .addBloodUnit(
            data.bloodId,
            data.aadharNo,
            // expiry
            data.bloodGroup,
            new Date(Date.now() + 42 * 86400000)
              .toLocaleString("en-GB")
              .split(" ")[0],
            // to save blood bank name
            user.name,
            user.coords
          )
          .send({ from: accounts[0] });
        navigate("/bloodbank-home");
      } catch (err) {
        console.log("Error in creation");
      }
    }
  }

  return (
    <>
      <CustomNavbar url="bloodBankHome" />
      <Container style={{ marginTop: "100px" }}>
        <Row>
          <Col></Col>
          <Col>
            <Card className="card-register">
              <Card.Header>
                <Card.Img
                  alt="..."
                  src={require("../assets/img/square-purple-1.png")}
                />
                <Card.Title tag="h4">Details</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group controlId="bloodIDInput">
                    <Form.Label>Blood ID</Form.Label>
                    <Form.Control
                      name="bloodId"
                      type="text"
                      placeholder="Blood ID"
                      value={data.bloodId}
                      onChange={inputChangeHandler}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="aadharNoInput">
                    <Form.Label>Aadhar No</Form.Label>
                    <Form.Control
                      name="aadharNo"
                      type="text"
                      placeholder="Aadhar No"
                      value={data.aadharNo}
                      onChange={inputChangeHandler}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="bloodGroupInput">
                    <Form.Label>Blood Group</Form.Label>
                    <Form.Select
                      className="form-control"
                      name="bloodGroup"
                      value={data.bloodGroup}
                      onChange={inputChangeHandler}
                    >
                      <option value="select">Select</option>
                      <option value="A +ve">A +ve</option>
                      <option value="A -ve">A -ve</option>
                      <option value="B +ve">B +ve</option>
                      <option value="B -ve">B -ve</option>
                      <option value="O +ve">O +ve</option>
                      <option value="O -ve">O -ve</option>
                      <option value="AB +ve">AB +ve</option>
                      <option value="AB -ve">AB -ve</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Card.Body>
              <Card.Footer>
                <Button className="mt-2" type="submit" onClick={formSubmit}>
                  Submit
                </Button>
              </Card.Footer>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}
