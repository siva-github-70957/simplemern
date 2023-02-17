const jwt = require('jsonwebtoken');
const User = require('../db/model/userSchema');

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) { throw new Error('user not found') };

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    } catch (e) {
        console.log('these are cookies', req.cookies);
        console.log('error in authenticate', e);
        res.status(401).send('error: unauthorized token ');
    }

}

module.exports = authenticate;