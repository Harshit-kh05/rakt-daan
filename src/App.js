import { Route, Routes } from "react-router-dom";
import "./assets/css/nucleo-icons.css";
import "./assets/css/scss/blk-design-system-react.scss";
import "./assets/css/demo.css";
import Landing from "./views/Landing";
import Login from "./views/Login";
import GlobalState from "./context/GlobalState";
import Register from "./views/Register";

import { useEffect, useState } from "react";
import Web3 from "web3";
import freelance from "../src/build/contracts/BloodUnitTracker.json";
import BlockchainContext from "./context/BlockChainContext";
import BloodbankHome from "./views/BloodbankHome";
import BloodCollection from "./views/BloodCollection";
import UpdateStatus from "./views/UpdateStatus";
import HospitalHome from "./views/HospitalHome";

import "./App.scss";

const getWeb3 = async () => {
  let web3Object = undefined;
  if (window.ethereum) {
    web3Object = new Web3(window.ethereum);
    console.log(web3Object);
    try {
      // Request account access if needed
      const accs = await web3Object.eth.getAccounts();
      // Acccounts now exposed
    } catch (error) {
      console.log(error);
    }
  }
  // Legacy dapp browsers.
  else if (web3Object) {
    web3Object = new Web3(web3Object.currentProvider);
  }
  // Non-dapp browsers...
  else {
    console.log("Non-Ethereum browser detected");
  }

  // return the initialised web3 Object
  return web3Object;
};

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState();

  useEffect(() => {
    const init = async () => {
      // loading web3 Object
      const web3Object = await getWeb3();
      console.log(web3Object);
      // loading data from metamask
      const accs = await web3Object.eth.getAccounts();
      const networkId = await web3Object.eth.net.getId();
      let tempContract;

      window.ethereum.on("accountsChanged", (accs) => {
        console.log("account changed");
        setAccounts(accs);
      });

      const networkdata = freelance.networks[networkId];
      console.log(networkdata);
      if (networkdata) {
        const abi = freelance.abi;
        tempContract = new web3Object.eth.Contract(abi, networkdata.address);
      }

      setWeb3(web3Object);
      setAccounts(accs);
      setContract(tempContract);

      // printing stats
      console.log("accounts", accounts);
      console.log("contract", contract);
      console.log("web3", web3);
    };

    init();
  }, []);

  return (
    <GlobalState>
      <BlockchainContext.Provider value={{ web3, accounts, contract }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bloodbank-home" element={<BloodbankHome />} />
          <Route path="/hospital-home" element={<HospitalHome />} />
          <Route path="/blood-collection" element={<BloodCollection />} />
          <Route path="/update-status" element={<UpdateStatus />} />
        </Routes>
      </BlockchainContext.Provider>
    </GlobalState>
  );
}

export default App;
