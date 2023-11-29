import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from 'express-oauth2-jwt-bearer';

// import { jwt } from 'express-jwt';
// import { jwks} from 'jwks-rsa';
// import { axios } from 'axios';

// type: commonjs 才能用import
// const { auth } = require('express-oauth2-bearer');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const PORT = 8000;



const { PrismaClient } = pkg;
const prisma = new PrismaClient();


const jwtCheck = auth({
  audience: 'https://api.cinetracker',
  issuerBaseURL: 'https://dev-1s3jn85gc06w6mec.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

// const jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//       cache: true,
//       rateLimit: true,
//       jwksRequestsPerMinute: 5,
//       jwksUri: 'https://dev-1s3jn85gc06w6mec.us.auth0.com/.well-known/jwks.json'
// }),
// audience: 'https://api.cinetracker',
// issuer: 'https://dev-1s3jn85gc06w6mec.us.auth0.com/',
// algorithms: ['RS256']
// });



// // enforce on all endpoints 这个不要用
// app.use(jwtCheck);


// 和react package.json file 最后一行代码对应  "proxy": "http://localhost:8000"
// Enable CORS for requests from your React application
// app.use(cors({
//     origin: 'http://localhost:3000' // Your React app's URL
//   }));

// const verifyJwt = jwt(
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     ratelimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri:'https://dev-1s3jn85gc06w6mec.us.auth0.com/'

//   }),
//   audience: 'https://api.cinetracker',
//   issuer: '',
//   algorithms: ['RS256']

// );




// 1. Homepage
app.get('/', (req, res) => {
  res.send("Hello from Homepage!");

  }
);

// 2. protected
app.get('/protected', jwtCheck, (req, res) => {
  console.log(req.user+" in server");
  res.send("Hello from protected page!");

  }
);



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
  