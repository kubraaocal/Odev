const express = require('express');
const multer = require('multer');
const getPixels = require('get-pixels');
const router = express.Router();

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, "image.png");
    }
});
const uploadImg = multer({ storage: storage }).single('image');

const fs = require('fs');

fs.writeFile('./uploads/metin.txt', "req.body.message", (err) => {
    if (err)
        throw err;
});

router.use(
    express.urlencoded({
        extended: true
    })
)

router.use(express.json())
//bunlar ne bilmiyorum
//single neden gerekli
//şu aşağıdaki kod nasıl daha iyi yazılır.

router.post('/loadImage', uploadImg, (req, res, next) => {//Biz burada neden image oraya yazıyoruz
    if (res.status(200)) {
        fs.writeFile('./uploads/metin.txt', req.body.message, (err) => {
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

let sayac = 0
let r, g, b
router.get('/encoder', (req, res, next) => {
    let array=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','r','s','t','u','v','y','z','0','1','2','3','4','5','6','7','8','9',' ']
    if (res.status(200)) {
        fs.readFile("uploads/metin.txt", 'utf-8', function (err, data) {
            if (err)
                return err;
            else {
                let uzunluk = data.length
                getPixels("uploads/image.png", function (err, pixels) {
                    if (err)
                        return;
                    for (let y = 0; y < pixels.shape[1]; y++) {
                        for (let x = 0; x < pixels.shape[0]; x++) {
                            r = pixels.get(x, y, 0)
                            g = pixels.get(x, y, 1)
                            b = pixels.get(x, y, 2)

                            console.log(b % 34)

                        }
                    }
                })
            }
        })


    }
    else {
        console.log("hata")
    }
})


module.exports = router;