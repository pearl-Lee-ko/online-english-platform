const express = require('express');
const bcrypt = require('bcryptjs');

// pool 객체를 인자로 받도록 함수 형태로 변경
module.exports = (pool) => {
    const router = express.Router();
    console.log(router);

    // @route   POST /api/auth/register
    // @desc    새로운 사용자 회원가입
    // @access  Public
    router.post('/register', async (req, res) => {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: '아이디와 비밀번호를 모두 입력해주세요.' });
        }

        try {
            // 아이디 중복 확인
            const [rows] = await pool.execute(
                'SELECT id FROM users WHERE username = ?',
                [username]
            );

            if (rows.length > 0) {
                return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
            }

            // 비밀번호 해싱
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 사용자 역할 설정 (기본값 student)
            const userRole = role === 'admin' ? 'admin' : 'student';

            // 새 사용자 데이터베이스에 저장
            const [result] = await pool.execute(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, userRole]
            );

            res.status(201).json({
                message: '회원가입이 성공적으로 완료되었습니다.',
                user: {
                    id: result.insertId,
                    username: username,
                    role: userRole
                }
            });

        } catch (error) {
            console.error('회원가입 오류:', error.message);
            res.status(500).send('서버 오류');
        }
    });


    // @route   POST /api/auth/login
    // @desc    사용자 로그인
    // @access  Public
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: '아이디와 비밀번호를 모두 입력해주세요.' });
        }

        try {
            // 아이디로 사용자 찾기
            const [rows] = await pool.execute(
                'SELECT id, username, password, role FROM users WHERE username = ?',
                [username]
            );

            if (rows.length === 0) {
                return res.status(400).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
            }

            const user = rows[0];

            // 비밀번호 비교
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
            }

            // 로그인 성공
            res.json({
                message: '로그인 성공!',
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('로그인 오류:', error.message);
            res.status(500).send('서버 오류');
        }
    });

    return router;
};