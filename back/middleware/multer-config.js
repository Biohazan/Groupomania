const multer = require('multer')

const MYME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
            callback(null, './images');
        
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" " && "." + MYME_TYPES[file.mimetype]).join('_')
        const extension = MYME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})

module.exports = multer({ storage: storage }).single('image')