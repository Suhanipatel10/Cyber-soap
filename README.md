# Cyber-soap

Sure! Here's a simple, clean, and explainable version of the README for your project without emojis:

---

# Secure Web Service with REST and SOAP

This project demonstrates the development and security implementation of two types of web services:

1. A RESTful web service using Node.js and Express
2. A SOAP-based web service using the `soap` module

The aim is to show how common security practices are applied differently in REST and SOAP web services.

---

# Features

# RESTful HTTP Service (Part 1)

- Built using Node.js and Express
- Secured using:
  - HTTPS (via self-signed certificates)
  - CORS to allow specific cross-origin requests
  - Input validation to sanitize and verify user inputs
  - Security headers using the Helmet middleware (e.g., Content-Security-Policy, X-Frame-Options)
  - OAuth 2.0 authentication using JWTs
  - Role-based access control (RBAC) to manage permissions for different users

# SOAP Web Service (Part 2)

- Built using the `soap` npm package and Express
- WSDL-based service with a `GetData` operation
- WS-Security implemented via custom SOAP headers (username and password)
- Returns reversed input string only for authenticated users

---

Technologies Used

- Node.js
- Express
- `soap` module for SOAP services
- HTTPS with OpenSSL-generated certificates
- JSON Web Tokens (JWT) for authentication
- Helmet for security headers
- Custom WSDL for SOAP operations

---


1. Install dependencies: npm install

2. Generate HTTPS certificates: openssl req -nodes -new -x509 -keyout key.pem -out cert.pem

3. Start the REST server: node server.js

4. Start the SOAP server: node server-soap.js

5. Test the SOAP client: node client-soap.js



# Concepts 

- Identification and mitigation of common HTTP threats
- HTTPS setup for encrypted communication
- Use of CORS for safe cross-origin requests
- Input validation to prevent malicious data entry
- Implementation of security headers
- Use of OAuth 2.0 for authentication and RBAC for authorization
- WS-Security in SOAP for secure message handling
- Comparison between REST and SOAP security approaches


This project serves as a demonstration of how to design and secure web services with proper authentication, authorization, encryption, and validation techniques.
