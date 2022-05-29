const express = require('express');
const app = express();
const api = require('./api/routers/api');
const cors = require('cors')
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const fs = require('fs');
const ImageJS = require('imagejs');
let bitmap = new ImageJS.Bitmap();


/* Değişiklik Sonrası */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(cors({
    origin: '*',
}));

const newpath = __dirname + "/uploads/";

app.post('/upload', (req, res) => {
    const file = req.files.file;
    const filename = "image.png";
    const text = req.body.text;

    file.mv(`${newpath}${filename}`, (err) => {
        if (err) {
            res.status(500).send({ message: "File upload failed", code: 200 });
        }
        //res.status(200).json({ message: "File Uploaded", code: 200 }); burası açık olunca
        //Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client hatası veriyor.
    });

    fs.writeFile(`${newpath}metin.txt`, text, (err) => {
        if (err) {
            throw err;
        }
        return res.json({ message: 'dosyaya ekleme yapıldı' });
    });
})

app.get('/encoder', (req, res) => {
    let array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'r', 's', 't', 'u', 'v', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ']
    fs.readFile(`${newpath}metin.txt`, 'utf-8', function (err, data) {
        if (err)
            console.log(err);
        else {
            bitmap.readFile(`${newpath}image.png`)
                .then(function (er) {
                    if (er)
                        console.log(er)
                    else {
                        let uzunluk = data.length
                        let kelimeUzunluguKacinciSirada = 0;
                        for (let sayac = 0; sayac < array.length; sayac++) {
                            if (uzunluk == array[sayac]) {
                                break;
                            } else {
                                kelimeUzunluguKacinciSirada++;
                            }
                        }
                        //console.log(kelimeUzunluguKacinciSirada)
                        let sifrelenenIndis = 0

                        for (let y = 0; y < bitmap.height; y++) {
                            for (let x = 0; x < bitmap.width; x++) {
                                if (sifrelenenIndis == uzunluk) {
                                    bitmap.writeFile(`${newpath}encode.png`, { quality: 75 })
                                        .then(function () {
                                            res.setHeader('Content-Type', 'image/png');
                                            res.sendFile(__dirname+"/uploads/encode.png")
                                            res.status(200).json({ message: "Bitti"})
                                            res.end();
                                        });
                                    return;
                                }

                                let kacinciSirada = 0
                                for (let i = 0; i < array.length; i++) {
                                    if (data[sifrelenenIndis] == array[i]) {
                                        break;
                                    } else {
                                        kacinciSirada++;
                                    }
                                }

                                let color = {};
                                color = bitmap.getPixel(x, y, color)

                                r = color.r
                                g = color.g
                                b = color.b
                                a = color.a

                                let mod34R = r % 34;
                                let mod34B = b % 34;

                                //console.log("r pixel değeri ilk başta ", r, " idi. ", "Mod34 : ", mod34R, " Benim şifrelediğim : ", kelimeUzunluguKacinciSirada)

                                let farkR = mod34R - kelimeUzunluguKacinciSirada
                                let farkB = mod34B - kacinciSirada

                                b -= farkB


                                if (x == 0 && y == 0) {
                                    r -= farkR
                                }

                                bitmap.setPixel(x, y, r, g, b, a);
                                //console.log("fark : ", farkB)
                                //console.log(bitmap.getPixel(x, y, color))

                                //console.log("heh: ",bitmap.getPixel(x,y, color))


                                sifrelenenIndis++

                            }

                        }
                    }
                })
        }
    })
})

app.get('/decoder', (req, res) => {
    let sifrelenenMesaj="";
    let array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'r', 's', 't', 'u', 'v', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ']
    bitmap.readFile(`${newpath}encode.png`)
        .then(function (er) {
            if (er)
                console.log(er)
            else {
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
                //console.log(sifrelenenMesaj)
            }
            return res.status(200).json({mes:sifrelenenMesaj})
        })
         
})

module.exports = app;

