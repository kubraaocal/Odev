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
    fs.readFile("uploads/metin.txt", 'utf-8', function (err, data) {
        if (err)
            console.log(err);
        else {
            bitmap.readFile("uploads/image.png")
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
                                    bitmap.writeFile("uploads/encode.png", { quality: 75 })
                                        .then(function () {
                                            res.status(200).json({ message: "Bitti" })
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

                                //console.log("B pixel değeri ilk başta ", b, " idi. ", "Mod34 : ", mod34B, " Benim şifrelediğim : ", kacinciSirada)

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


