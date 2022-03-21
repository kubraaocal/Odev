const express = require('express');
const multer = require('multer');
const router = express.Router();
const ImageJS = require('imagejs')
const fs = require('fs');
let bitmap = new ImageJS.Bitmap();


const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, "image.png");
    }
});
const uploadImg = multer({ storage: storage }).single('image');
router.use(
    express.urlencoded({
        extended: true
    })
)

router.use(express.json())
//bunlar ne bilmiyorum
//single neden gerekli
//şu aşağıdaki kod nasıl daha iyi yazılır.

router.post('/loadImage', async(req, res) => {//Biz burada neden image oraya yazıyoruz
    if (res.status(200)) {
        fs.appendFileSync('./uploads/metin.txt', req.body.message, (err) => {
            if (err)
                throw err;
        });
        return res.json({ message: 'dosyaya ekleme yapıldı' });
    }
    else {
        return res.json({
            message: "hataa"
        })
    }
})


let r, g, b
router.get('/encoder', (req, res, next) => {
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

                                console.log("r pixel değeri ilk başta ", r, " idi. ", "Mod34 : ", mod34R, " Benim şifrelediğim : ", kelimeUzunluguKacinciSirada)

                                let farkR = mod34R - kelimeUzunluguKacinciSirada
                                let farkB = mod34B - kacinciSirada

                                b -= farkB


                                if (x == 0 && y == 0) {
                                    r -= farkR
                                }

                                bitmap.setPixel(x, y, r, g, b, a);
                                //console.log("fark : ", farkB)
                                console.log(bitmap.getPixel(x, y, color))

                                //console.log("heh: ",bitmap.getPixel(x,y, color))


                                sifrelenenIndis++

                            }

                        }
                    }
                })
        }
    })

})

router.get('/decoder', (req, res, next) => {
    let array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'r', 's', 't', 'u', 'v', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ']
    bitmap.readFile("uploads/encode.png")
        .then(function (er) {
            if (er)
                console.log(er)
            else {
                let sifrelenenMesaj = "";
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
        message: "Şifre çözüldü"
    })
})

module.exports = router;