document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 가져오기
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const showLoginBtn = document.getElementById('showLogin');
    const showRegisterBtn = document.getElementById('showRegister');

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginErrorMessage = document.getElementById('loginErrorMessage');

    const registerForm = document.getElementById('registerForm');
    const regUsernameInput = document.getElementById('regUsername');
    const regPasswordInput = document.getElementById('regPassword');
    const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
    const regRoleSelect = document.getElementById('regRole');
    const registerErrorMessage = document.getElementById('registerErrorMessage');

    // 백엔드 API의 기본 URL
    const BASE_URL = 'http://localhost:5000/api/auth'; // 백엔드 서버 주소 (MySQL 사용 시도 동일)

    // --- 폼 전환 기능 ---
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.classList.remove('active');
        registerSection.classList.add('active');
        // 에러 메시지 초기화
        loginErrorMessage.textContent = '';
        registerErrorMessage.textContent = '';
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.classList.remove('active');
        loginSection.classList.add('active');
        // 에러 메시지 초기화
        loginErrorMessage.textContent = '';
        registerErrorMessage.textContent = '';
    });

    // --- 로그인 처리 ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // 폼 제출의 기본 동작(페이지 새로고침) 방지

        const username = usernameInput.value;
        const password = passwordInput.value;

        loginErrorMessage.textContent = ''; // 이전 에러 메시지 초기화

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json(); // 서버 응답을 JSON으로 파싱
            console.log(data);
            if (response.ok) { // HTTP 상태 코드가 200번대인 경우
                alert(`로그인 성공! ${data.user.role}님 환영합니다!`);
                // 역할에 따라 다른 페이지로 리다이렉션
                if (data.user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'student-dashboard.html';
                }
            } else { // HTTP 상태 코드가 200번대가 아닌 경우 (예: 400 Bad Request)
                loginErrorMessage.textContent = data.message || '로그인에 실패했습니다.';
            }
        } catch (error) {
            console.error('로그인 요청 중 오류 발생:', error);
            loginErrorMessage.textContent = '서버와 통신 중 문제가 발생했습니다.';
        }
    });

    // --- 회원가입 처리 ---
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = regUsernameInput.value;
        const password = regPasswordInput.value;
        const confirmPassword = regConfirmPasswordInput.value;
        const role = regRoleSelect.value;

        registerErrorMessage.textContent = ''; // 이전 에러 메시지 초기화

        if (password !== confirmPassword) {
            registerErrorMessage.textContent = '비밀번호가 일치하지 않습니다.';
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('회원가입이 성공적으로 완료되었습니다! 로그인해 주세요.');
                // 회원가입 성공 후 로그인 폼으로 전환
                registerSection.classList.remove('active');
                loginSection.classList.add('active');
                // 입력 필드 초기화
                regUsernameInput.value = '';
                regPasswordInput.value = '';
                regConfirmPasswordInput.value = '';
            } else {
                registerErrorMessage.textContent = data.message || '회원가입에 실패했습니다.';
            }
        } catch (error) {
            console.error('회원가입 요청 중 오류 발생:', error);
            registerErrorMessage.textContent = '서버와 통신 중 문제가 발생했습니다.';
        }
    });
});