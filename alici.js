const express = require('express');
const http = require('http');
const app = express();
const port = 8080;
const server = http.createServer(app);
const multer = require('multer');
const getPixels = require('get-pixels');
const ImageJS = require('imagejs')
server.listen(port);

const fs = require('fs');
let bitmap = new ImageJS.Bitmap();

app.get('/', (req, res) => {
    let array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'r', 's', 't', 'u', 'v', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ']
    bitmap.readFile("uploads/encode.png")
        .then(function (er) {
            if (er)
                console.log(er)
            else {
                let sifrelenenMesaj="";
                let color = {};
                color = bitmap.getPixel(0, 0, color)
                r = color.r
                let uzunluk = array[r % 34]
                

                for (let y = 0; y < 1; y++) {
                    for (let x = 0; x < uzunluk; x++) {
                        color = bitmap.getPixel(x, y, color)
                        b = color.b
                        sifrelenenMesaj += array[b % 34]
                    }
                }
                console.log(sifrelenenMesaj)

            }
        })
        res.status(200).json({
            message:"Şifre çözüldü"
        })
})