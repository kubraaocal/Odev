var ImageJS = require("imagejs");

var bitmap = new ImageJS.Bitmap();
bitmap.readFile("uploads/image.png")
    .then(function () {
        return bitmap.writeFile("degisik.jpg", { quality: 75 })
            .then(function () {
                // bitmap has been saved
            });
    });