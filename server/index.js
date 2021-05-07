const path = require('path');

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

app.use(express.static(path.resolve(__dirname,'../client/build')));

app.get("/api", (req, res) => {
    res.json({message: "Hello World!"});
});

app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname,'../client/build','index.html'));
});

