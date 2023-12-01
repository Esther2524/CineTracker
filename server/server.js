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

// middleware
const jwtCheck = auth({
  audience: 'https://api.cinetracker',
  issuerBaseURL: 'https://dev-1s3jn85gc06w6mec.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});


// enforce on all endpoints
app.use(jwtCheck);

// 1. sync the user and the collection
app.post('/api/user/collection/sync', async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    // Upsert user data into the database
    const user = await prisma.user.upsert({
      where: { email: email }, // email is a unique field
      // It updates the user's name and picture fields with the new values provided in the request.
      update: { name: name, picture: picture },
      // creates a new user record with the provided email and name.
      create: { email: email, name: name, picture: picture },
    });

    // Create a collection for the user if it doesn't exist
    let collection = await prisma.collection.findUnique({
      where: { userId: user.id },
    });

    if (!collection) {
      collection = await prisma.collection.create({
        data: { userId: user.id },
      });
    }

    res.json({ user, collection });
  } catch (error) {
    console.error('Error syncing user and collection data:', error);
    res.status(500).send('Internal Server Error');
  }
});



// 2. get the user by email (pass user info to front-end)
app.get('/api/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (user) {
      res.json(user);
      // console.log("user exists")
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
});


// 3. post movie rating and review (store rating and review in database)
app.post('/api/movie/rate-and-review', async (req, res) => {
  try {

    const { apiId, rating, review, userEmail } = req.body; // Include userEmail in the request body

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { collection: true } // if i want to access user.collection.id
    });

    const collectionId = user.collection ? user.collection.id : null;

    // Upsert the movie with rating and review
    const movie = await prisma.movie.upsert({
      where: { apiId: apiId },
      update: { rating: rating, review: review },
      create: {
        apiId: apiId,
        rating: rating,
        review: review,
        collectionId: collectionId
      },
    });

    res.json(movie);
  } catch (error) {
    console.error('Error saving rating and review:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 4. get all movies in the user's collection
app.get('/api/user/:email/collection', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { 
        collection: {
          include: {
            movies: true
          }
        }
      }
    });
    

    const movies = user.collection.movies;

    if (user) {
      res.json(movies);
      // console.log("user exists")
    } else {
      res.status(404).send('User or collection not found');
    }
  } catch (error) {
    console.error('Error fetching user collection:', error);
    res.status(500).send('Internal Server Error');
  }
});








// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});





