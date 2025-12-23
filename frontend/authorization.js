import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBsQRyGq_jMVsw_Uyr_PNt3IYllj-fsEYQ",
    authDomain: "charityfund-af2de.firebaseapp.com",
    databaseURL: "https://charityfund-af2de-default-rtdb.firebaseio.com",
    projectId: "charityfund-af2de",
    storageBucket: "charityfund-af2de.firebasestorage.app",
    messagingSenderId: "804405065306",
    appId: "1:804405065306:web:5993a3890c520823f2ca63",
    measurementId: "G-7HWBMTP27X"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function loginUser(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        Swal.fire("Ошибка", "Введите email и пароль", "error");
        return;
    }

    try {
        const snapshot = await get(ref(db, 'Authorization'));
        const users = snapshot.val();

        if (!users) {
            Swal.fire("Ошибка", "Пользователи не найдены", "error");
            return;
        }

        const user = Object.values(users).find(u => 
            u.Login.toLowerCase() === email.toLowerCase() && u.Password === password
        );

        if (user) {
            const userData = {
                id: user.ID_PersonalAccount,
                email: email,
                name: user.Name || email,
                role: user.ID_Post || "2"
            };
            
            sessionStorage.setItem('user', JSON.stringify(userData));

            Swal.fire({
                icon: "success",
                title: "Успешный вход!",
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    window.location.href = user.ID_Post == 1 ? 'admin.html' : 'index.html';
                }
            });

        } else {
            Swal.fire("Ошибка", "Неверный email или пароль", "error");
        }
    } catch (error) {
        console.error('Ошибка:', error);
        Swal.fire("Ошибка", "Ошибка подключения", "error");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', loginUser);
});