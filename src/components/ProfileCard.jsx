import { Button, Col, Container, Row } from "react-bootstrap";

export default function ProfileCard(props) {
  return (
    <Container className="align-items-center">
      <Row>
        <Col></Col>
        <Col lg="6" md="6">
          <h1 className="profile-title text-left">{props.name}</h1>
          <h5 className="text-on-back">
            {props.type === "Blood Bank" ? `Blood Bank` : `Hospital`}
          </h5>
          <p className="profile-description">
            Offices parties lasting outward nothing age few resolve. Impression
            to discretion understood to we interested he excellence. Him
            remarkably use projection collecting. Going about eat forty world
            has round miles.
          </p>
          <div className="btn-wrapper profile pt-3">
            <Button
              className="btn-icon btn-round"
              color="twitter"
              href="https://twitter.com/creativetim"
              id="tooltip639225725"
              target="_blank"
            >
              <i className="fab fa-twitter" />
            </Button>
            <Button
              className="btn-icon btn-round"
              color="facebook"
              href="https://www.facebook.com/creativetim"
              id="tooltip982846143"
              target="_blank"
            >
              <i className="fab fa-facebook-square" />
            </Button>
            <Button
              className="btn-icon btn-round"
              color="dribbble"
              href="https://dribbble.com/creativetim"
              id="tooltip951161185"
              target="_blank"
            >
              <i className="fab fa-dribbble" />
            </Button>
          </div>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
