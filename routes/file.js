const express = require('express');
const multer = require('multer');
const path = require('path')
const router = express.Router();

// multer 설정 부분 const upload = multer({ 설정 });
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, path.join(__dirname, '../public/upload'));
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const filename = path.basename(file.originalname, ext) + "_" + Date.now() + ext;
            done(null, filename);
        },
    }),
    limits: { fileSize: 10*1024*1024 }, 
});

router.get("/", (req, res) => {
    return res.render("file");
});

// 파일 하나 업로드 -upload.single('file')
// /file/upload
router.post("/upload", upload.single('file'), (req, res) => {
    console.log(req.file);
    return res.send("");
});

// 파일 여러개 업로드
router.post("/upload2", upload.array('file'), (req, res) => {
    console.log(req.files);
    return res.send("");
});

// 파일 항목별 업로드
router.post("/upload3", upload.fields([{ name: 'file1'}, {name: 'file2'}]), (req, res) => {
    console.log(req.files);
    return res.send("");
});

module.exports = router;