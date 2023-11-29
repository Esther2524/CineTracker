import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from 'express-oauth2-jwt-bearer';
import axios from 'axios';

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




// 1. Homepage endpoint: it can be seen by every user
app.get('/', (req, res) => {
  res.send("Hello from Homepage!");

  }
);

// 2. profile endpoint: only for logged-in users
app.get('/profile', jwtCheck, async (req, res) => {
  try {
    // Step 1: Extract the access token from the Authorization header
    const accessToken = req.headers.authorization.split(' ')[1];

    // Step 2: Use the accessToken to make a request to Auth0's /userinfo endpoint
    // This returns the user's profile information based on the granted scopes
    const response = await axios.get('https://dev-1s3jn85gc06w6mec.us.auth0.com/userinfo', {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });

    // Step 3: Extract (original) user information from response
    const userInfo = response.data;
    // res.send(userInfo);

    // Insert or update user info in the database
    const user = await prisma.user.upsert({
      where: { auth0Id: userInfo.sub }, // 'sub' typically contains the Auth0 user ID
      update: {
        email: userInfo.email,
        name: userInfo.name
      },
      create: {
        auth0Id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name
      }
    });
    

    res.send(user);



  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error fetching user information:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
  



// enforce on all endpoints
// app.use(jwtCheck);
