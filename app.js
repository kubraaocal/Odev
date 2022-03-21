const express = require('express');
const app = express();
const api = require('./api/routers/api');
const cors = require('cors')
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const fs = require('fs');


/* Değişiklik Sonrası */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(cors({
    origin: '*',
}));

app.post('/upload', (req, res) => {
    const newpath = __dirname + "/uploads/";
    const file = req.files.file;
    const filename = "image.png";
    const text = req.body.text;

    file.mv(`${newpath}${filename}`, (err) => {
        if (err) {
            res.status(500).send({ message: "File upload failed", code: 200 });
        }
        res.status(200).send({ message: "File Uploaded", code: 200 });
    });

    fs.writeFile(`${newpath}metin.txt`, text, (err) => {
        if (err) {
            throw err;
        }
        return res.json({ message: 'dosyaya ekleme yapıldı' });
    });
})
 
module.exports = app;

