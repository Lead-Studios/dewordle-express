import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000; //default port 

// Middleware to parse JSON requests
app.use(express.json());

// default route example 
app.get('/', (req, res) => {
  res.send('Hey 😎, Lets unlock the letters !');
});

//default server 
app.listen(PORT, () => {
  console.log(`🚀 Server is running `);
});
