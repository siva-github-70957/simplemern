const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieParser = require("cookie-parser");
router.use(cookieParser())

const authenticate = require('../middleware/authenticate');


require('../db/conn');
const User = require('../db/model/userSchema');

router.get('/', (req, res) => {
    res.send('hello from home page using router');
})

////////////////////////////////////////////////////////////////////////   RESGISTRATION PROCESS 

/////////////////////////////   USING PROMISES
// router.post('/register', (req, res) => {
//     const { name, email, phone, work, password, cpassword } = req.body;
//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         res.status(422).json({ error: 'fill all reqired detials' });
//     }
//     User.findOne({ email: email })
//         .then((userExist) => {
//             console.log(userExist, typeof userExist);
//             if (userExist) { return res.status(422).json({ error: 'email already exist' }); }
//             // userdoesn't exist so create a new document
//             const user = new User({ name, email, phone, work, password, cpassword })
//             user.save().then(() => {
//                 res.status(201).json({ msg: 'new user data created ' });
//             }).catch((e) => res.status(500).json({ error: 'failed to register' }));
//         }).catch((e) => console.log('unable to search due to error : ', e));


// })
//////////////////////    USING ASYNC AND AWAIT REGISTER
router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
        res.status(422).json({ error: 'fill all reqired detials' });
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) { return res.status(422).json({ error: 'email already exist' }); }
        else if (password !== cpassword) { return res.status(422).json({ error: 'enter both passwords correctly' }) }
        else {

            const user = new User({ name, email, phone, work, password, cpassword });
            await user.save();
            res.status(201).json({ msg: 'new user data created ' });
        }


    } catch (e) {
        console.log(" in catch portion ", e);
    }
})
/////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////// LOGIN PROCESS

router.post('/signin', async (req, res) => {
    let token;
    // console.log(req.body);
    // res.status(200).json({ msg: 'cool bro' });
    try {
        const { email, password } = req.body;
        if (!email || !password) { res.status(400).json({ error: 'pls fill the details' }); }

        const userLogin = await User.findOne({ email: email })
        console.log("in auth page userLogin: ", userLogin);

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken();
            console.log("in auth page isMatch", isMatch);
            res.cookie('jwtoken', token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if (!isMatch)
                res.status(400).json({ msg: 'incorrect password' });
            else
                res.status(200).json({ msg: 'login success' });
        }
        else {
            res.status(400).json({ error: 'incorrect login credentials  ' });
        }



    } catch (e) {
        console.log('error in post signin : ', e);
    }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////// ABOUT PAGE

router.get('/about', authenticate, (req, res) => {
    // res.send('This is about page');
    console.log(req.rootUser);
    res.send(req.rootUser);
})
////////////////////////////////////////////
//////////////
router.get('/home', authenticate, (req, res) => {
    res.send(req.rootUser);
})
///////////////////////// LOGOUT PAGE

router.get('/logout', authenticate, (req, res) => {
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send("this is logout page");
})

module.exports = router