const jwt = require('jsonwebtoken');

function gerarToken() {
    const payload = {
        id: 1,
        name: 'Gabriel',
        username: 'gabriel',
        email: 'gabriel@gmail.com'
    }

    const secret = 'vasco';
    const token = jwt.sign(payload, secret);
    console.log(token);
}

gerarToken();
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkdhYnJpZWwiLCJ1c2VybmFtZSI6ImdhYnJpZWwiLCJlbWFpbCI6ImdhYnJpZWxAZ21haWwuY29tIiwiaWF0IjoxNjk0MzgyNzAyfQ.uAwsm7mRtI7kdmE7I8pGlkSNlP7aa8LbbVzSkj9CSFw