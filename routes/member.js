const express = require('express');
const { joinVaildator } = require('../middleware/member');
const router = express.Router();

// member/join > get > 회원 가입 양식, post > 회원 가입 처리
router.route("/join")
    .get((req, res) => {
        return res.render("member/join")
    })
    .post(joinVaildator, (req, res) => {
        return res.send("");
    });

// member/login > get > 로그인 양식, post > 로그인 처리
router.route("/login")
    .get((req, res) => {
        return res.render("member/login")

    })
    .post((req, res) => {

    });

module.exports = router;