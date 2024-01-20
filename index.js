
const dotenv = require ('dotenv')
const expressSession = require('express-session');
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const cookieSession = require("cookie-session");
const databaseConfig = require('./config/database_config');
const authRoutes = require ('./routes/createUser');
const allUserRoutes = require ('./routes/allUsers');
const deleteUserRoutes = require ('./routes/deleteUser');
const updateUserRoutes = require ('./routes/updateDetails');
const app = express();
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(databaseConfig.url, databaseConfig.options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// app.use(
// 	expressSession({
// 	  secret: 'your-secret-key', // Replace with a secret key for session encryption
// 	  resave: false,
// 	  saveUninitialized: false,
// 	  cookie: {
// 		maxAge: 24 * 60 * 60 * 1000, // 24 hours
// 	  },
// 	})
//   );
app.use(express.json());
// Routes
app.use('/',authRoutes);
app.use('/',allUserRoutes);
app.use('/',deleteUserRoutes);
app.use('/',updateUserRoutes);


app.get('/', (req,res)=> {
  res.send('Root Page');
})

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
