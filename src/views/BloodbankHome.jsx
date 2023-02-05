import {
  Button,
  Card,
  Col,
  Container,
  Nav,
  Row,
  Spinner,
} from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import classNames from "classnames";
import { useContext, useEffect, useState } from "react";

import PerfectScrollbar from "perfect-scrollbar";
import ProfileCard from "../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import globalContext from "../context/GlobalContext";
import BlockChainContext from "../context/BlockChainContext";
import DonarCard from "../components/DonarCard";

import FetchFromAadhar from "../dummyAPI/fetchAadhar";

let ps = null;

export default function BloodbankHome(props) {
  // will svae blockchain data in it
  const [data, setData] = useState();
  const [bloodCount, setCount] = useState();
  var curBloodCount = 0;

  const { web3, accounts, contract } = useContext(BlockChainContext);
  const { user } = useContext(globalContext);

  const navigate = useNavigate();

  // fetch data from chain

  async function fetchChainData() {
    console.log("fetch data called ", data, user);
    try {
      // if coming from blood status update page
      if (props && props.location !== undefined) {
        console.log(props.location.state);
        // console.log(props.location.state.entireData);
        props.location.state.entireData[
          props.location.state.card_id_to_be_changed
        ]["verified"] = props.location.state.value.toString();

        // setting chain data
        setData(props.location.state.entireData);
        setCount(props.location.state.countdict);
      }
      // work if coming from Login
      else {
        try {
          // to save all available blood Donor at current Blood Bank
          const bloodData = [];
          // getting no og blood
          curBloodCount = await contract.methods.getBloodCount().call();
          // initialising all blood count to zero
          var bloodGroupCount = {
            "A +ve": 0,
            "A -ve": 0,
            "B +ve": 0,
            "B -ve": 0,
            "O +ve": 0,
            "O -ve": 0,
            "AB +ve": 0,
            "AB -ve": 0,
          };
          for (let blood = 1; blood <= curBloodCount; blood++) {
            // getting no of status updates
            const statusCount = await contract.methods
              .getBloodStatusCount(blood)
              .call();
            // getting status of a specific blood at its latest stauts
            const [time, cur_add, owner, verified] = await contract.methods
              .getBloodStatus(blood, statusCount)
              .call();

            // if current blood bank and owner of current blood sample if smae get its furthur details
            if (user.name.toLowerCase().trim() === owner.toLowerCase().trim()) {
              // getting blood details as its of current blood bank
              const [bloodID, aadhar, bloodGroup, expiryDate] =
                await contract.methods.getBloodData(blood).call();

              // incrementing blood count
              bloodGroupCount[bloodGroup] = bloodGroupCount[bloodGroup] + 1;

              // creating object to get Donor Details
              var tempDonor = {
                id: blood,
                bloodId: bloodID,
                adharNo: aadhar,
                bloodGroup: bloodGroup,
                verified: verified,
                owner: owner,
                collectionDate: new Date(1000 * time)
                  .toLocaleString("en-GB")
                  .split(" ")[0]
                  .replaceAll("/", " / "),
                expiryDate: expiryDate.replaceAll("/", " / "),
              };
              bloodData.push(tempDonor);
            }
          }
          console.log(bloodData);
          setCount(bloodGroupCount);
          setData(bloodData);
          console.log(data);
        } catch (error) {
          console.log("Error in getting data after Login", error);
        }
      }
    } catch (error) {
      console.log("Neither Login nor Staus Update Worked", error);
    }
  }

  function updateStatus(e, d, idx) {
    e.preventDefault();
    navigate("/update-status", {
      state: {
        id: d.id,
        bloodId: d.bloodId,
        batchNo: d.batchNo,
        email: FetchFromAadhar(d.adharNo).Email,
        name: FetchFromAadhar(d.adharNo).Name,
        adharNo: d.adharNo,
        bloodGroup: d.bloodGroup,
        age: FetchFromAadhar(d.adharNo)["Age"] + " Years",
        verified: d.verified,
        collectionDate: d.collectionDate,
        expiryDate: d.expiryDate,
        owner: d.owner,
        currentBloodBank: user.name,
        cardId: idx,
        entireData: d,
        countdict: bloodCount,
      },
    });
  }

  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.body.classList.toggle("profile-page");
    fetchChainData();
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.documentElement.className += " perfect-scrollbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
      document.body.classList.toggle("profile-page");
    };
  }, []);

  if (data && bloodCount) {
    return (
      <>
        <CustomNavbar url="bloodBankHome" />
        <div className="wrapper p-10">
          <div className="page-header">
            <img
              alt="..."
              className="dots"
              src={require("../assets/img/dots.png")}
            />
            <img
              alt="..."
              className="path"
              src={require("../assets/img/path4.png")}
            />
            <ProfileCard name={user.name} type={user.type} />
            <Container className="text-center">
              <h3>Donor Data</h3>
              <Row>
                {data.map((d, idx) => {
                  return (
                    <Col>
                      <DonarCard
                        no={d.adharNo}
                        collectionDate={d.collectionDate}
                        bloodID={d.bloodId}
                        batchNo={d.batchNo}
                        bloodGroup={d.bloodGroup}
                        verified={d.verified}
                        onClick={(e) => updateStatus(e, d, idx)}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Container>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <Container className="preLoaderContainer">
        <Container className="text-center">
          <Spinner animation="grow" variant="danger"></Spinner>
          <Spinner animation="grow" variant="danger"></Spinner>
          <Spinner animation="grow" variant="danger"></Spinner>
          <Spinner animation="grow" variant="danger"></Spinner>
          <Spinner animation="grow" variant="danger"></Spinner>
          <p>Loading</p>
        </Container>
      </Container>
    );
  }
}
