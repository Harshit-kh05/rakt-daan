// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

library BloodUnitLibrary {
  struct BloodStatus {
    uint256 time; //status time
    string cur_add; // address of current owner
    string owner; // current owner name
    uint256 verified; // 0 for not checked 1 for safe 2 for unsafe
  }
  struct BloodUnit {
    uint256 id; // to fetch in map
    string uniqueid;
    string aadhar;
    string blood_group;
    string expiry_date;
    uint256 statusCount; // keep track of no of status changes
    mapping(uint256 => BloodStatus) bloodStatus;
  }

  struct User {
    address payable user_address;
    string email;
    string password;
    string name;
    string addressUser;
    string coords; // coordinates from address
    string typeID;
    bool exists;
  }
}

contract BloodUnitTracker {
  mapping(uint256 => BloodUnitLibrary.BloodUnit) public BloodStore;

  // to store the no of available bloods
  // its public so that we can modify from js
  uint256 public bloodCount = 0;

  // event to store bloodUnit Creation on Chain
  event BloodUnitCreate(
    uint256 id,
    string curr_owner,
    string curr_owner_add,
    uint256 verified
  );

  // event to store blood transfer from Blood Bank to Hospital on Chain
  event BloodTransfer(
    uint256 id,
    string newOwner,
    uint256 verified,
    string status
  );

  // BloodUnit Methods

  function addBloodUnit(
    string memory _uniqueid,
    string memory _aadhar,
    string memory _blood_group,
    string memory _expiry_date,
    string memory _cur_owner,
    string memory _cur_owner_address // ccordinates
  ) public returns (uint256) {
    bloodCount++;
    BloodStore[bloodCount] = BloodUnitLibrary.BloodUnit(
      bloodCount,
      _uniqueid,
      _aadhar,
      _blood_group,
      _expiry_date,
      0
    );
    BloodStore[bloodCount].statusCount++;
    BloodStore[bloodCount].bloodStatus[
      BloodStore[bloodCount].statusCount
    ] = BloodUnitLibrary.BloodStatus(
      block.timestamp,
      _cur_owner_address,
      _cur_owner,
      0
    );
    // save transaction on Chain
    emit BloodUnitCreate(bloodCount, _cur_owner, _cur_owner_address, 0);
  }

  // give detail about the donor and sample
  function getBloodData(
    uint256 _id
  )
    public
    view
    returns (string memory, string memory, string memory, string memory)
  {
    return (
      BloodStore[_id].uniqueid,
      BloodStore[_id].aadhar,
      BloodStore[_id].blood_group,
      BloodStore[_id].expiry_date
    );
  }

  //give verification status and no of changes done on this smaple
  function getBloodStatusCount(uint256 _id) public view returns (uint256) {
    return (BloodStore[_id].statusCount);
  }

  function transferAsset(
    uint256 _id,
    string memory _oldUser,
    uint256 verified,
    string memory _status,
    string memory _newUser
  ) public returns (string memory) {
    require(
      sha256(
        abi.encodePacked(
          (BloodStore[_id].bloodStatus[BloodStore[_id].statusCount].owner)
        )
      ) == sha256(abi.encodePacked((_oldUser)))
    );
    BloodStore[_id].statusCount++;
    BloodStore[_id].bloodStatus[BloodStore[_id].statusCount] = BloodUnitLibrary
      .BloodStatus(block.timestamp, _status, _newUser, verified);

    // save tranfer transaction on Chain
    emit BloodTransfer(_id, _newUser, verified, _status);
  }

  // get total avl bloods
  function getBloodCount() public view returns (uint256) {
    return bloodCount;
  }

  // Status Methods

  function getBloodStatus(
    uint256 _id,
    uint256 _status_count
  ) public view returns (uint256, string memory, string memory, uint256) {
    // finding status of Blood of given id and status count
    BloodUnitLibrary.BloodStatus memory tempStatus = BloodStore[_id]
      .bloodStatus[_status_count];
    return (
      tempStatus.time,
      tempStatus.cur_add,
      tempStatus.owner,
      tempStatus.verified
    );
  }

  // User Methods

  mapping(address => BloodUnitLibrary.User) public UserStore;

  uint256 public userCount = 0;

  function getIdentity(
    address payable user_address
  ) public view returns (bool) {
    if (UserStore[user_address].exists) return true;
    return false;
  }

  function addIdentity(
    string memory _name,
    address payable user_address,
    string memory _email,
    string memory _password,
    string memory _address,
    string memory _coords,
    string memory _typeID
  ) public {
    userCount++;
    UserStore[user_address] = BloodUnitLibrary.User(
      user_address,
      _email,
      _password,
      _name,
      _address,
      _coords,
      _typeID,
      true
    );
  }

  function getUser(
    address payable _user_add,
    string memory _email,
    string memory _password
  )
    public
    view
    returns (string memory, string memory, string memory, string memory)
  {
    require(
      sha256(abi.encodePacked((UserStore[_user_add].email))) ==
        sha256(abi.encodePacked((_email)))
    );
    require(
      sha256(abi.encodePacked((UserStore[_user_add].password))) ==
        sha256(abi.encodePacked((_password)))
    );
    return (
      UserStore[_user_add].name,
      UserStore[_user_add].typeID,
      UserStore[_user_add].addressUser,
      UserStore[_user_add].coords
    );
  }

  function getUserCount() public view returns (uint256) {
    return userCount;
  }
}
