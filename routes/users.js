const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const artists = require('./artists');
const venues = require('./venues');

router.use('/artists', artists);
router.use('/venues', venues);
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    type: 'user'
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            type: user.type,
            username: user.username,
            email: user.email,
            venues: user.venues,
            artists: user.artists

          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});


//Change username
router.post('/changeusername', (req, res, next) =>
{

    //This variable will not be used if user already exists
    const userInfo =
        {
          username: req.body.username,
          currUsername: req.body.currentUsername
        };


    //Checks if username exists
    User.getUserByUsername(userInfo.username, (err, user) =>
    {
        if (err) throw err;
        if (user)
        {
            return res.json({success: false, msg: 'Username already exists'});
        }
        else
        {
            User.changeUsername(userInfo, (err, callback) => {
                if(callback)
                {
                    console.log(callback);
                    return res.json({success: true, msg: 'Username has been changed successfully'});
                }

            });
        }



    });

});

//Change name

//Change email

//Change password


module.exports = router;
