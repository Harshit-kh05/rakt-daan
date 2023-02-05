export default function FetchFromAadhar(no) {
  const Aadhar = {
    "8174 4585 3880": {
      Name: "Bharat Malik",
      Email: "bharat.malik@ipu.ac.in",
      Age: 22,
    },
    "8174 4585 3881": {
      Name: "Harshit",
      Email: "harshit@ipu.ac.in",
      Age: 21,
    },
    "8174 4585 3882": {
      Name: "Keshav Goyal",
      Email: "keshav.goyal@nsut.ac.in",
      Age: 21,
    },
  };

  return Aadhar[no];
}
