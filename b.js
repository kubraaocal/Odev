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
            // getPixels("uploads/image.png", function (error, pixels) {
            //     if (error)
            //         console.log(error)
            //     else {
            bitmap.readFile("uploads/image.png")
                .then(function (er) {
                    if (er)
                        console.log(er)
                    else {
                        let uzunluk = data.length
                        //console.log(uzunluk)
                        let sifrelenenIndis = 0

                        for (let y = 0; y < bitmap.height; y++) {
                            for (let x = 0; x < bitmap.width; x++) {
                                if (sifrelenenIndis == uzunluk) {
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
                                let mod34G = g % 34;
                                let mod34B = b % 34;
                                let mod34A = a % 34;
                                //console.log("B pixel değeri ilk başta ", b, " idi. ", "Mod34 : ", mod34, " Benim şifrelediğim : ", kacinciSirada)
                                let farkR = mod34R - kacinciSirada
                                let farkG = mod34G - kacinciSirada
                                let farkB = mod34B - kacinciSirada
                                let farkA = mod34A - kacinciSirada

                                r -= farkR
                                g -= farkG
                                b -= farkB
                                a -= farkA

                                //console.log("fark : ", fark, " B yeni değer : ", b)
                                bitmap.setPixel(x, y, r, g, b, a);

                                //console.log("heh: ",bitmap.getPixel(x,y, color))


                                // r = pixels.get(x, y, 0);
                                // g = pixels.get(x, y, 1);
                                // b = pixels.get(x, y, 2);
                                // a = pixels.get(x, y, 3);
                                // console.log(pixels.get(x, y, b))
                                sifrelenenIndis++

                            }

                        }
                    }
                })

            // }

            // })

        }
    })
    return bitmap.writeFile("uploads/encode.jpg", { quality: 75 })
        .then(function () {
            res.status(200).json({ message: "Bitti" })
        });
})
