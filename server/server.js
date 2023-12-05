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

const PORT = parseInt(process.env.PORT) || 8080;

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

// 1. create new user
app.post('/api/user/collection/sync', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub; // Extract auth0Id from the token
    const { email, name, picture } = req.body;

    // Check if the user already exists
    let user = await prisma.user.findUnique({
      where: { auth0Id: auth0Id },
    });

    let collection;

    console.log(user);

    if (!user) {
      // If the user doesn't exist, create them
      user = await prisma.user.create({
        data: {
          auth0Id: auth0Id,
          email: email,
          name: name,
          picture: picture,
        },
      });

      // Create a collection for the new user
      collection = await prisma.collection.create({
        data: { userId: user.id },
      });
    } else {
      // If the user exists, fetch their collection
      collection = await prisma.collection.findUnique({
        where: { userId: user.id },
      });
    }

    // Send the user and their collection as response
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
    } 
    
    // else {
    //   res.status(404).send('User not found');
    // }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 3. edit the user info (Profile Page)
app.put('/api/user', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub; // Extract Auth0 ID from the access token
    const { newName } = req.body; // Extract the new name from the request body

    if (!newName) {
      return res.status(400).send('New name is required');
    }

    // Find and update the user in the database
    const user = await prisma.user.update({
      where: {
        auth0Id: auth0Id
      },
      data: {
        name: newName
      }
    });

    if (user) {
      res.status(200).send('User name updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error updating user name:', error);
    res.status(500).send('Internal Server Error');
  }
});




// 4. get all movies in the user's collection
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




// 5. create a new movie rating and review (DetailsPage, submit)
// (store rating and review in database)
app.post('/api/movie/rate-and-review', jwtCheck, async (req, res) => {
  try {

    const { apiId, title, posterPath, rating, review } = req.body; 
    const auth0Id = req.auth.payload.sub; // Extract auth0Id from the token

    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Id },
      include: { collection: true } // if i want to access user.collection.id
    });

    const collectionId = user.collection ? user.collection.id : null;

    // Upsert the movie with rating and review
    const movie = await prisma.movie.upsert({
      where: {
        // different users to rate and review the same movie independently
        userId_apiId: {
          userId: user.id,
          apiId: apiId
        }
      },
      update: { rating: rating, review: review },
      create: {
        userId: user.id,
        apiId: apiId,
        title: title,
        posterPath: posterPath,
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


// 6. update an existing movie's rating and review (ProfilePage, edit)
app.put('/api/movie/rate-and-review/:apiId', jwtCheck, async (req, res) => {
  try {
    const { apiId } = req.params;
    const { rating, review } = req.body;
    const auth0Id = req.auth.payload.sub;

    const user = await prisma.user.findUnique({
      where: { auth0Id: auth0Id },
      include: { collection: true }
    });

    const collectionId = user.collection ? user.collection.id : null;

    const movie = await prisma.movie.updateMany({
      where: {
        userId: user.id,
        apiId: parseInt(apiId),
        collectionId: collectionId
      },
      data: { rating: rating, review: review }
    });

    if (movie.count === 0) {
      return res.status(404).send('Movie not found or not part of the user\'s collection');
    }

    res.json(movie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).send('Internal Server Error');
  }
});





// 7. delete a movie from the user's collection (ProfilePage, delete)
app.delete('/api/movie/:apiId', jwtCheck, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { apiId } = req.params;

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        auth0Id: auth0Id
      },
      include: {
        collection: true
      }
    });

    if (user && user.collection) {
      // Delete the movie from the collection
      await prisma.movie.deleteMany({
        where: {
          apiId: parseInt(apiId),
          userId: user.id,
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


// 8. get all movies' rating and review from all users in the database
// fetch both movie details and associated user information from your database
// different users can have the same movie in their collections with different ratings and reviews
app.get('/api/users-with-movies', async (req, res) => {
  try {
    const usersWithMovies = await prisma.user.findMany({
      include: {
        collection: {
          include: {
            movies: true // Include all movies within the collection
          }
        }
      }
    });

    // console.log(usersWithMovies);
    res.json(usersWithMovies);
  } catch (error) {
    console.error('Error fetching users and their movies:', error);
    res.status(500).send('Internal Server Error');
  }
});






// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});





