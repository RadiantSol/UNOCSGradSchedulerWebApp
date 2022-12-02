const express = require('express');

const PORT = process.env.PORT || 8080;
const app = express();
// default page for user
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.get('/test', async (req, res) => {
    res.send('Youre not supposed to see this!');
})

const server = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);
});