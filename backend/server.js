// .env 파일에서 환경 변수를 로드합니다. (파일의 맨 위에 있어야 합니다)
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise'); // promise 버전 사용
const cors = require('cors'); // CORS 미들웨어 추가

const app = express();
const port = process.env.PORT || 5000; // .env에 PORT가 없으면 5000번 포트 사용

// 미들웨어 설정
app.use(cors()); // 모든 도메인에서의 요청을 허용 (개발 단계에서 편리)
app.use(express.json()); // JSON 형식의 요청 본문을 파싱할 수 있도록 설정

// MySQL 데이터베이스 연결 풀 생성
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 데이터베이스 연결 테스트
pool.getConnection()
    .then(connection => {
        console.log('MySQL에 성공적으로 연결되었습니다!');
        connection.release(); // 연결 해제
    })
    .catch(err => {
        console.error('MySQL 연결 오류:', err.stack);
        process.exit(1); // 연결 실패 시 서버 종료
    });

// 라우트 설정 (User 모델 및 라우트 파일 변경 후 추가 예정)
app.use('/api/auth', require('./routes/auth')(pool)); // pool 객체를 라우트로 전달

// 기본 라우트
app.get('/', (req, res) => {
    res.send('화상 영어 백엔드 서버가 MySQL과 함께 실행 중입니다!');
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});