document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 폼 제출의 기본 동작(페이지 새로고침) 방지

        const username = usernameInput.value;
        const password = passwordInput.value;

        // 실제 서비스에서는 서버와 통신하여 사용자 인증을 수행합니다.
        // 여기서는 간단한 예시를 위해 하드코딩된 값으로 인증합니다.

        // 관리자 계정 (예시)
        if (username === 'admin' && password === 'admin123') {
            alert('관리자님 환영합니다!');
            window.location.href = 'admin-dashboard.html'; // 관리자 대시보드 페이지로 이동
        }
        // 수강생 계정 (예시)
        else if (username === 'student' && password === 'student123') {
            alert('수강생님 환영합니다!');
            window.location.href = 'student-dashboard.html'; // 수강생 대시보드 페이지로 이동
        }
        // 로그인 실패
        else {
            errorMessage.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
        }
    });
});