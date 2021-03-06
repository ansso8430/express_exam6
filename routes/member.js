const express = require('express');
const { joinVaildator, loginValidator } = require('../middleware/member');
const { alert } = require('../lib/common');
const member = require('../models/member');
const router = express.Router();

// member/join > get > 회원 가입 양식, post > 회원 가입 처리
router.route("/join")
    .get((req, res) => {
        return res.render("member/join");
    })
    .post(joinVaildator, async (req, res) => {
        // 데이터 - req.body
        // res.redirect > 페이지 이동
        const result = await member.join(req.body);
        if(result) {
            // 가입 성공 > 로그인 페이지로 이동
            return res.redirect("/member/login");
        }

        // 회원 가입 실패시 > 다시 회원 가입 양식으로 back
        return alert("회원가입 실패하였습니다.", res, true);
    });

// member/login > get > 로그인 양식, post > 로그인 처리
router.route("/login")
    .get((req, res) => {
        return res.render("member/login");
    })
    .post(loginValidator, async (req, res) => {
        // 로그인 처리
        const result = await member.login(req.body.memId, req.body.memPw, req);

        // 로그인 성공시 > 메인 페이지로 이동
        if (result) {
            return res.redirect("/");
        }

        // 로그인 실패시 > 로그인 실패 메세지 출력
        return alert("로그인 실패하였습니다.", res, true);

    });

router.get("/logout", (req, res) => {
    // 세션만 비우게 되면 req.session.memId이 삭제되고 회원정보가 유지x (로그아웃)
    req.session.destroy();

    // 로그아웃 > 로그인 페이지로 이동
    return res.redirect("/member/login");
});

module.exports = router;