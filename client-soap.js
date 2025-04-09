// client-soap.js
import soap from "soap";

const url = "http://localhost:8000/ws-security?wsdl";
const args = {
  Security: { Username: "admin", Password: "password123" },
  input: "HelloWorld"
};

soap.createClient(url, (err, client) => {
  if (err) {
    console.error("SOAP Client Error:", err);
    return;
  }
  client.GetData(args, (err, result) => {
    if (err) {
      console.error("SOAP Request Error:", err);
      return;
    }
    console.log("✅ SOAP Response:", result);
  });
});
