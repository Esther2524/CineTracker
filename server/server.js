import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from 'express-oauth2-jwt-bearer';


const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const PORT = 8000;

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a middleware that will validate the access token sent by the client
const jwtCheck = auth({
  audience: 'https://api.cinetracker',
  issuerBaseURL: 'https://dev-1s3jn85gc06w6mec.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});


// ping endpoint, this is a public endpoint because it doesn't have the requireAuth middleware
app.get('/ping', (req, res) => {
  res.send('pong');
});

// enforce on all endpoints
// app.use(jwtCheck);

// 1. sync the user and the collection
app.post('/api/user/collection/sync', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub; // Extract auth0Id from the token
    const { email, name, picture } = req.body;

    // Upsert user data into the database
    const user = await prisma.user.upsert({
      where: { email: email }, // email is a unique field
      // It updates the user's name and picture fields with the new values provided in the request.
      update: { name: name, picture: picture },
      // creates a new user record with the provided email and name.
      create: { auth0Id: auth0Id, email: email, name: name, picture: picture },
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



// 2. get the user (pass user info to front-end for Profile Page)
app.get('/api/user', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub; // Extract auth0Id from the token

    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Id }
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



// 3. get all movies in the user's collection
app.get('/api/user/collection', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub; // Extract auth0Id from the token

    // Find the user and include their collection and movies
    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Id },
      include: {
        collection: {
          include: {
            movies: true
          }
        }
      }
    });

    // Check if the user and their collection exist
    if (user && user.collection) {
      // Return the movies in the user's collection
      res.json(user.collection.movies);
    } else {
      // Handle cases where the user or collection is not found
      res.status(404).send('User or collection not found');
    }
  } catch (error) {
    console.error('Error fetching user collection:', error);
    res.status(500).send('Internal Server Error');
  }
});




// 4. add or update movie rating and review 
// (store rating and review in database)
app.post('/api/movie/rate-and-review', jwtCheck, async (req, res) => {
  try {

    const { apiId, rating, review } = req.body; // Include userEmail in the request body
    const auth0Id = req.auth.payload.sub; // Extract auth0Id from the token

    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Id },
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




// 5. delete a movie from the user's collection
app.delete('/api/movie/:apiId', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { apiId } = req.params;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Id },
      include: {
        collection: true
      }
    });

    if (user && user.collection) {
      // Delete the movie from the collection
      await prisma.movie.deleteMany({
        where: {
          apiId: parseInt(apiId),
          collectionId: user.collection.id
        }
      });

      res.send('Movie deleted from collection');
    } else {
      res.status(404).send('User or collection not found');
    }
  } catch (error) {
    console.error('Error deleting movie from collection:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});





