import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

//firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsGkENtJukk6UjhZiXo8-muuKbq9w4vMo",
    authDomain: "budgetexpensetracker-ce508.firebaseapp.com",
    projectId: "budgetexpensetracker-ce508",
    storageBucket: "budgetexpensetracker-ce508.appspot.com",
    messagingSenderId: "80057213024",
    appId: "1:80057213024:web:656a9927ec7fe38ddd6305",
    measurementId: "G-H4R1LLNJHX"
};

//initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const submit = document.getElementById('submit');
submit.addEventListener("click", function(event){
    event.preventDefault(); // Prevent the form from refreshing

    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            alert("Signing In");
            window.location.href = "budget.html"
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
});
