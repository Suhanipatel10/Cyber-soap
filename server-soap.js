// server-soap.js (Updated)
import express from "express";
import soap from "soap";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

const wsdlPath = path.join(__dirname, "service.wsdl");
const wsdl = fs.readFileSync(wsdlPath, "utf8");

const users = {
  admin: "password123",
  user: "userpass"
};

const service = {
  WSService: {
    WSServicePortType: {
      GetData: (args, callback) => {
        const securityHeader = args.Security;
        if (!securityHeader) {
          return callback({ result: "Missing WS-Security Header" });
        }
        const { Username, Password } = securityHeader;
        if (!users[Username] || users[Username] !== Password) {
          return callback({ result: "Authentication Failed" });
        }
        const input = args.input;
        const result = input.split("").reverse().join("");
        callback(null, { result }); // correct key!
      }
    }
  }
};

soap.listen(app, "/ws-security", service, wsdl, () => {
  console.log(`🧼 SOAP service running on http://localhost:${PORT}/ws-security`);
});

app.listen(PORT);
