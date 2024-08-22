import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { updateDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadExpenses(); // Only call loadExpenses if the user is logged in
        } else {
            // User is signed out
            window.location.href = "login.html"; // Redirect to login page
        }
    });
});
const firebaseConfig = {
    apiKey: "AIzaSyBsGkENtJukk6UjhZiXo8-muuKbq9w4vMo",
    authDomain: "budgetexpensetracker-ce508.firebaseapp.com",
    projectId: "budgetexpensetracker-ce508",
    storageBucket: "budgetexpensetracker-ce508.appspot.com",
    messagingSenderId: "80057213024",
    appId: "1:80057213024:web:656a9927ec7fe38ddd6305",
    measurementId: "G-H4R1LLNJHX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);




document.addEventListener('DOMContentLoaded', () => {
    //delete button functionalliyu 
    document.getElementById('expenses').addEventListener('click', function (event) {
        if (event.target.classList.contains('delete')) {
            const row = event.target.parentElement.parentElement;
            row.parentElement.removeChild(row);
            updateIncomeTotal();
            updateExpenseTotal();
            difference();
        }

    });

    document.getElementById('save').addEventListener('click', async function () {
        saveData();
    })

    //inital color of the first row bc not dynamically added 

    // selection box change color 
    document.getElementById('expenses').addEventListener('change', function (event) {
        if (event.target.classList.contains('selectBox')) {
            const row = event.target.parentElement.parentElement;
            updateAmountColor(row);
            updateIncomeTotal();
            updateExpenseTotal();
            difference();

        }
    });

    //input changes (needed for when seleciton box experences no chnage og is expense)
    document.getElementById('expenses').addEventListener('input', function (event) {
        if (event.target.classList.contains('amount')) {
            const row = event.target.parentElement.parentElement;
            updateAmountColor(row);
            updateIncomeTotal();
            updateExpenseTotal();
            difference();
        }
    });





});

async function loadExpenses() {
    const q = query(collection(db, "expenses"), where("uid", "==", auth.currentUser.uid), orderBy("date", "desc"));
    const queryDocument = await getDocs(q);
    queryDocument.forEach((doc) => {
        //each queryDocument is one document from expesnes collectopn
        const data = doc.data();
        const row = document.createElement('tr');
        


        // Populate the row with data from Firestore
        const description = document.createElement('td');
        const desInput = document.createElement('input');
        desInput.type = 'text'
        desInput.value = data.description;
        description.appendChild(desInput);

        const selectionBox = document.createElement('td');
        const selectElement = document.createElement('select');
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = 'expense';
        option1.textContent = 'Expense';
        option2.value = 'income';
        option2.textContent = 'Income';
        selectElement.appendChild(option1);
        selectElement.appendChild(option2);
        selectElement.classList.add('selectBox');
        selectElement.value = data.type;  // Set the value from Firestore
        selectionBox.appendChild(selectElement);

        const date = document.createElement('td');
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = data.date;
        date.appendChild(dateInput);

        const amount = document.createElement('td');
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.classList.add('amount');
        amountInput.value = data.amount;  // Set the value from Firestore
        if(selectElement.value === 'income'){
            amountInput.style.color = 'green';
        }
        if(selectElement.value === 'expense'){
            amountInput.style.color = 'red';
        }
        amount.appendChild(amountInput);

        const deleteBtn = document.createElement('td');
        deleteBtn.innerHTML = `<button class="delete">Delete</button>`;

        // Add cells to the row
        row.appendChild(description);
        row.appendChild(selectionBox);
        row.appendChild(date);
        row.appendChild(amount);
        row.appendChild(deleteBtn);

        // Append the row to the table
        document.getElementById('expenses').appendChild(row);
    });
}


// Call loadExpenses when DOM content is loaded


const newExpense = document.getElementById('newExpense');

newExpense.addEventListener('click', createExpense);

async function createExpense() {
    const expenseTable = document.getElementById('expenses');
    const row = document.createElement('tr');

    for (let i = 0; i < 5; i++) {
        const rowElement = document.createElement('td');
        const input = document.createElement('input');

        if (i === 0) { // description
            input.type = 'text';
            input.classList.add('description');
            rowElement.appendChild(input);
        } else if (i === 1) { // select box
            const selectionBox = document.createElement('select');
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = 'expense';
            option1.textContent = 'Expense';
            option2.value = 'income';
            option2.textContent = 'Income';
            selectionBox.appendChild(option1);
            selectionBox.appendChild(option2);
            selectionBox.classList.add('selectBox');
            rowElement.appendChild(selectionBox);
        } else if (i === 2) { // date
            input.type = 'date';
            input.classList.add('date');
            rowElement.appendChild(input);
        } else if (i === 3) { // amount
            input.type = 'number';
            input.classList.add('amount');
            rowElement.appendChild(input);
        } else if (i === 4) { // delete button
            const button = document.createElement('button');
            button.textContent = 'Delete';
            button.classList.add('delete');
            rowElement.appendChild(button);
        }

        row.appendChild(rowElement);
    }

    //apply colour after each row (default is expense)
    updateAmountColor(row);

    expenseTable.appendChild(row);


}


//ISSUE IS its savinga the data to firebase BEFORE its edited not adter



function updateAmountColor(row) {
    const selectBox = row.querySelector('.selectBox');
    const amountInput = row.querySelector('.amount');

    if (selectBox && amountInput) {
        if (selectBox.value === 'expense') {
            amountInput.style.color = 'red';
        } else if (selectBox.value === 'income') {
            amountInput.style.color = 'green';
        }
    }
}


function updateIncomeTotal() {
    const table = document.getElementById('expenses');
    const rows = table.querySelectorAll('tr');
    const incomeTotal = document.getElementById('H1totalIncome');
    let colAmt = rows.length;
    console.log(`number of rows ${colAmt}`);
    let totalIncome = 0;
    for (let i = 1; i < colAmt; i++) {
        const row = rows[i];
        
        const selectBox = row.querySelector('.selectBox');
            const amountNum = row.querySelector('.amount');
            if (selectBox && amountNum) { //make sure they are not null
                const amount = parseFloat(amountNum.value) || 0;
                if (selectBox.value === 'income') {
                    totalIncome += amount;
                }
            }
        }

    incomeTotal.textContent = `$${totalIncome.toFixed(2)}`;
    return totalIncome;
}

async function saveData() {
    const table = document.getElementById('expenses');
    const rows = document.getElementsByTagName('tr');
    const amtRows = rows.length;

    for (let i = 0; i < amtRows; i++) {
        const row = rows[i];
        const description = row.querySelector('.description')?.value || '';
        const type = row.querySelector('.selectBox')?.value || 'expense';
        const date = row.querySelector('.date')?.value || '';
        const amount = parseFloat(row.querySelector('.amount')?.value) || 0;
        const docID = row.dataset.id;


        //WORK ON THIS
        if (description && type && date && amount) {
            try {

                if (docID) {//if docId already exits and not null for the row
                    //update the specfic document
                    await updateDoc(collection(db, "expenses", docID), {
                        description: description,
                        type: type,
                        date: date,
                        amount: amount
                    });

                }
                else {

                    //add the rpw if its new
                    await addDoc(collection(db, "expenses"), {
                        //saves a new document to expenses collection in firestore 
                        description: description,
                        type: type,
                        date: date,
                        amount: amount,
                        uid: auth.currentUser.uid //associate with the user
                    });
                }
            } catch (e) {
                console.error("Error updating row in Firebase: ", e);
            }
        }
    }
}


function updateExpenseTotal() {
    console.log("function ran");
    const table = document.getElementById('expenses');
    const rows = table.querySelectorAll('tr');
    const expenseTotal = document.getElementById('H1totalExpense');
    let colAmt = rows.length;
    let totalExpense = 0;

    for (let i = 1; i < colAmt; i++) {
        const row = rows[i];
        const selectionBox = row.querySelector('.selectBox');
        const amountNum = row.querySelector('.amount');
        if (selectionBox && amountNum) {
            const amount = parseFloat(amountNum.value) || 0;

            if (selectionBox.value === 'expense') {
                totalExpense += amount;
            }
        }
    }

    expenseTotal.textContent = `$${totalExpense.toFixed(2)}`;
    return totalExpense;
}

function difference() {
    const totalIncome = updateIncomeTotal();
    const totalExpense = updateExpenseTotal();
    const difference = totalIncome - totalExpense;
    const differenceElement = document.getElementById('H1difference');
    differenceElement.textContent = `$${difference.toFixed(2)}`;
}






document.getElementById('logoutButton').addEventListener('click', function () {
    signOut(auth).then(() => {
        // Sign-out successful, redirect to the login page
        window.location.href = "login.html"; // Replace with your login page
    }).catch((error) => {
        // Handle errors here
        alert("Error logging out: " + error.message);
    });
});