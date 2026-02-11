Kindly find the required outputs in the outputs.txt file.

fixes : 

1. added next(); in auth.js and logger.js middleware files
2. added cookiesParser(); in server.js
3. fixed req.headers.authorization; --> req.cookies.session_token; to correct flow
4. fixed otp printing from console.log(`[OTP] Session ${loginSessionId} generated`); --> console.log(`[OTP] Session ${loginSessionId} generated: ${otp}`);

