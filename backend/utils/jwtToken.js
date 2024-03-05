// Creating token and saving in cookies

const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    //options for cookies
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + (process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000))
    }

    return res.status(statusCode).cookie('token', token, options).json({ success: true, user, token });
}

module.exports = sendToken;