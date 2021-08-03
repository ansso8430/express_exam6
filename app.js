const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const nunjucks = require('nunjucks');
const logger = require('./lib/logger');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bootStrap = require('./boot');

// multer
const upload = multer({
    // 저장소
    storage: multer.diskStorage({
        // 현재 서버 로컬 폴더에 저장 설정
        destination: function(req, file, done) {
                                            // 업로드될 디렉토리 경로
            done(null, path.join(__dirname, 'public/upload'));
        },
        filename: function(req, file, done) {
            // 동일 명칭 파일 중복 방지 처리
            // 파일명 + timestamp(Date.now()) + 확장자
            // file - 임시로 업로드 된 파일 정보  
                // .orginalname - 원래 업로드 된 파일 명칭
            // path - .basename : 파일이름
                    // 2번째 인수로 파일의 확장자를 명시 > 확장자 없는 파일 이름
                    // path.basename("파일명", "확장자");
                // - .estname : 파일의 확장자
            const ext = path.extname(file.originalname);
            const filename = path.basename(file.originalname, ext); // 확장자 제거된 파일명
            const newFileName = filename + Date.now() + ext; // 중복이 안되는 파일명
            done(null, newFileName);
        }
    }),
    // 업로드 할 파일 용량
    limits: { fileSize : 5*1024*1024 }, // 최대 업로드 용량 5mb
});

// 라우터
const indexRouter = require('./routes');
const fileRouter = require('./routes/file');
const cookieRouter = require('./routes/cookie');
const sessionRouter = require('./routes/session');
const memberRouter = require('./routes/member');

const app = express();

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true,
});

dotenv.config();
app.set('PORT', process.env.PORT || 5000);

app.use(morgan('dev'));

// cookieParser (인수 : cookie 검증 비밀번호)
app.use(cookieParser("process.env.COOKIE_SECRET")); 

// session
app.use(session({
    // 같은 값을 저장할때 다시 저장할것인가? false - 저장 안하고 기존 것 유지
    resave: false,
    // 세션 값 지정 여부 상관 없이 처음부터 session 아이디를 쿠키에 생성 : true
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    name: "sessid",
}));

// 사이트 초기화 미들웨어
app.use(bootStrap);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 라우터 등록
// app.use(indexRouter);
app.use("/file", fileRouter); 
app.use("/cookie", cookieRouter);
app.use("/session", sessionRouter);
app.use("/member", memberRouter);

app.get("/", (req, res) => {
    return res.render("main/index");
});

/*
	upload - multer 인스턴스(객체)
	upload.single("file태그의 name 속성값"); - 파일1개, req.file - 업로드된 파일 데이터
	upload.array("file태그의 name 속성값"); - 파일 여러개, req.files - 업로드된 파일 데이터
	upload.fields([
		{ name : 'name 속성값' },
		{ name : 'name 속성값' },
		... 
		{ name : 'name 속성값' }
	]) - req.files - 업로드된 파일 데이터
*/

app.post("/upload", upload.single("image"), (req, res) => {
    console.log(req.file);
    return res.send("");
});

app.post("/upload2", upload.array("images"), (req, res) => {
    console.log(req.files); // 여러개인 경우 files
    return res.send("");
});

app.post("/upload3", upload.fields([{ name: 'main'}, { name: 'list' }]), (req, res) => {
    console.log(req.files); // 여러개인 경우 files
    return res.send("");
});


// 없는
app.use((req, res, next) => {
    const err = new Error(`${req.url}은 없는 페이지 입니다.`);
    err.status = 404;
    next(err);
});

// 오류
app.use((err, req, res, next) => {
    const data = {
        message: err.message,
        status: err.status || 500,
        stack: err.stack,
    };

    // 로그 기록
    logger(`[${data.status}]${data.message}`, 'error');
    logger(data.stack, 'error');

    if (process.env.NODE_ENV === 'production') {
        delete data.stack;
    }

    return res.status(err.status || 500).render('error', data);
});

app.listen(app.get('PORT'), () => {
    console.log(app.get('PORT'), "번 포트에서 서버 대기중...");
});