import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { updateDoc, doc, setDoc, getDoc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


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
        const monthSelector = document.getElementById('monthPicker');
        const monthHeader = document.getElementById('month')
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); //if isngle digit month it pads it with a zero at front
        const currentMonth = `${year}-${month}`;
       
        //bc month picker is 0000-00 format for month
       
        monthSelector.value = currentMonth;

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthNum = months[Number(month) -1];
        monthHeader.textContent = `${monthNum} ${year}`
        console.log('loaded the current month ')

        onAuthStateChanged(auth, (user) => {
            if (user) {
                loadExpenses(); //call when user logs in
                loadBudgets();
                console.log('loaded user data')
            } else {
                // User is signed out
                window.location.href = "login.html"; // Redirect to login page
            }
        });

    //delete button functionalliyu 
    document.getElementById('expenses').addEventListener('click', async function (event) {
        if (event.target.classList.contains('delete')) {
            const row = event.target.parentElement.parentElement;
            if(row.hasAttribute('id')){
                const docID = row.id;
                try{
                    await deleteDoc(doc(db, "expenses", docID));
                    console.log('deleted Doc')
                } catch(e){
                    console.log(e)
                }
            }


            row.parentElement.removeChild(row);

            
            updateIncomeTotal();
            updateExpenseTotal();
            difference();
        }

    });

   

    //inital color of the first row bc not dynamically added 

    // selection box change color 
    document.getElementById('expenses').addEventListener('change', function (event) {
        if (event.target.classList.contains('selectBox')) {
            const row = event.target.parentElement.parentElement;
            updateAmountColor(row);
            updateIncomeTotal();
            updateExpenseTotal();
            difference();
            saveData();
    

        }
    });

    document.getElementById('monthPicker').addEventListener('change', function(){
        saveData();

        const monthSelector = document.getElementById('monthPicker');
        const [year, month] = monthSelector.value.split('-');
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthHeader = document.getElementById('month');
        monthHeader.textContent = `${months[month -1]} ${year}`

        //load expesnes of selected month
        loadExpenses();
        loadBudgets();
    })
    document.getElementById('monthPicker').addEventListener('click', function(){
        saveData();
        saveBudgetData();
        console.log('saved data')
        const monthSelector = document.getElementById('monthPicker');
        const [year, month] = monthSelector.value.split('-');
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthHeader = document.getElementById('month');
        monthHeader.textContent = `${months[month -1]} ${year}`

        //load expesnes of selected month
       
    })
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
    const monthSelector = document.getElementById('monthPicker');
    const monthYearValue = monthSelector.value;
    const [year, month] = monthSelector.value.split('-');
    console.log(`loadExpenses ran and current month is ${year}-${month}`);

    //clearexpense table so when switching months it reloads based on month
    const expensesTable = document.getElementById('expenses');
    while (expensesTable.firstChild) {
        expensesTable.removeChild(expensesTable.firstChild);
    }

    try {
        //expense field
        const expenseQuery = query(
            collection(db, "expenses"),
            where("uid", "==", auth.currentUser.uid),
            where("monthYear", "==", `${year}-${month}`),
            orderBy("date", "asc")
        );
        const expenseDocs = await getDocs(expenseQuery);

        expenseDocs.forEach(doc => {
            const data = doc.data();
            const docMonthYear = data.monthYear;

            if (docMonthYear === `${year}-${month}` && !document.getElementById(doc.id)) { //load it if its right minth and year
                const row = document.createElement('tr');
                row.id = doc.id;

                const description = document.createElement('td');
                const desInput = document.createElement('input');
                desInput.type = 'text';
                desInput.value = data.description;
                desInput.classList.add("description");
                description.appendChild(desInput);

                const categoryBox = document.createElement('td');
                const categoryElement = document.createElement('select');
                const categories = ['Groceries', 'Entertainment', 'House', 'Social', 'Bills', 'Pay', 'Other'];
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categoryElement.appendChild(option);
                });
                categoryElement.classList.add('categorySelect');
                categoryElement.value = data.category;
                categoryBox.appendChild(categoryElement);

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
                selectElement.value = data.type;
                selectionBox.appendChild(selectElement);

                const date = document.createElement('td');
                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.value = data.date;
                dateInput.classList.add('date');
                date.appendChild(dateInput);

                const amount = document.createElement('td');
                const amountInput = document.createElement('input');
                amountInput.type = 'number';
                amountInput.classList.add('amount');
                amountInput.value = data.amount;
                amountInput.style.color = selectElement.value === 'income' ? 'green' : 'red';
                amount.appendChild(amountInput);

                const deleteBtn = document.createElement('td');
                deleteBtn.innerHTML = `<button class="delete">Delete</button>`;

                row.appendChild(description);
                row.appendChild(categoryBox);
                row.appendChild(selectionBox);
                row.appendChild(date);
                row.appendChild(amount);
                row.appendChild(deleteBtn);
                expensesTable.appendChild(row);
            }
        });
      

        // Update totals and difference
        updateIncomeTotal();
        updateExpenseTotal();
        difference();

    } catch (e) {
        console.error("Error loading data: ", e);
    }
}
//issue is things keep reseting to zero idk why 
async function loadBudgets(){
    try{
        const monthYearValue = document.getElementById('monthPicker').value;
        const uid = auth.currentUser.uid;

        const q = query(collection(db, "budgets"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            const data = doc.data();
            if(data.monthYearB === monthYearValue){
                const groceries = document.getElementById('grocery');
                groceries.value = data.groceries;

                const entertainment = document.getElementById('entertainment');
                entertainment.value = data.entertainment;

                const house = document.getElementById('house');
                house.value = data.house;
                
                const social = document.getElementById('social');
                social.value = data.social;
                
                const bills = document.getElementById('bills');
                bills.value = data.bills;

                const other = document.getElementById('other');
                other.value = data.other;
                
            }
        });

    }
    catch (error) {
        console.error("Error loading budgets: ", error);
    }
}

async function saveBudgetData() {
    try {
        const monthYearValue = document.getElementById('monthPicker').value;
        const uid = auth.currentUser.uid;

        //firestore querty of budgets
        const q = query(collection(db, "budgets"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        let docExists = false;

        //iterate through all until find mathicn month 
        querySnapshot.forEach(async (doc) => {
            const budgetData = doc.data();

            if (budgetData.monthYearB === monthYearValue) {
                docExists = true;
                const docRef = doc.ref;

                await updateDoc(docRef, {
                    groceries: parseFloat(document.getElementById('grocery').value) || 0,
                    entertainment: parseFloat(document.getElementById('entertainment').value) || 0,
                    house: parseFloat(document.getElementById('house').value) || 0,
                    social: parseFloat(document.getElementById('social').value) || 0,
                    bills: parseFloat(document.getElementById('bills').value) || 0,
                    other: parseFloat(document.getElementById('other').value) || 0,
                });

                console.log(`Updated budget document for ${monthYearValue}`);
            }
        });

        //crate new if none exits 
        if (!docExists) {
            const newDocRef = doc(collection(db, "budgets"));
            await setDoc(newDocRef, {
                uid: uid,
                monthYearB: monthYearValue,
                groceries: parseFloat(document.getElementById('grocery').value) || 0,
                entertainment: parseFloat(document.getElementById('entertainment').value) || 0,
                house: parseFloat(document.getElementById('house').value) || 0,
                social: parseFloat(document.getElementById('social').value) || 0,
                bills: parseFloat(document.getElementById('bills').value) || 0,
                other: parseFloat(document.getElementById('other').value) || 0,
            });

        }
    } catch (e) {
        console.error("Error updating or creating budget document: ", e);
    }
}



//Call loadExpenses when DOM content is loaded


const newExpense = document.getElementById('newExpense');

newExpense.addEventListener('click', createExpense);

async function createExpense() {
    const expenseTable = document.getElementById('expenses');
    const row = document.createElement('tr');

    for (let i = 0; i < 6; i++) {
        const rowElement = document.createElement('td');
        const input = document.createElement('input');

        if (i === 0) { //description
            input.type = 'text';
            input.classList.add('description');
            rowElement.appendChild(input);
        } else if (i === 1) { //category
            const categorySelect = document.createElement('select');
            const categories = ['Groceries', 'Entertainment', 'House', 'Social','Bills','Pay', 'Other'];
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
            categorySelect.classList.add('categorySelect');

            /*other custom inpit
            const customCat = document.createElement('input');
            customCat.type = 'text';
            customCat.classList.add('customCat')
            customCat.placeholder = 'Enter a category';
            customCat.classList.add('customCat');
            customCat.style.display = 'none';  

            categorySelect.addEventListener('change', function(){
                if (categorySelect.value === 'Other') {
                    customCat.style.display = 'block'; 
                } else {
                    customCat.style.display = 'none';  
                }
            });

            rowElement.appendChild(customCat);  
            */
            rowElement.appendChild(categorySelect);
            
        } else if (i === 2) { //income/expesne
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
        } else if (i === 3) { //date
            input.type = 'date';
            input.classList.add('date');
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); 
            const day = String(now.getDate()).padStart(2, '0'); 
            input.value = `${year}-${month}-${day}`; 
            rowElement.appendChild(input);
        } else if (i === 4) { //amount
            input.type = 'number';
            input.classList.add('amount');
            rowElement.appendChild(input);
        } else if (i === 5) { //delete button
            const button = document.createElement('button');
            button.textContent = 'Delete';
            button.classList.add('delete');
            rowElement.appendChild(button);
        }

        row.appendChild(rowElement);
    }

    updateAmountColor(row);
    expenseTable.appendChild(row);
}







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
    for (let i = 0; i < colAmt; i++) {
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
    const rows = table.getElementsByTagName('tr');
    const amtRows = rows.length;
    console.log(amtRows)
    const userEmail = auth.currentUser.email;
    

    for (let i = 0; i < amtRows; i++) {
        const row = rows[i];
        
        const description = row.querySelector('.description')?.value || '';
        console.log(`Description of row is: ${description}`);
        const type = row.querySelector('.selectBox')?.value || 'expense';


        const date = row.querySelector('.date')?.value || '';
        const monthYearOfRowSplit = date.split('-');
        const monthYearRow = monthYearOfRowSplit[0] + '-' + monthYearOfRowSplit[1];
        console.log(monthYearRow)

        const amount = parseFloat(row.querySelector('.amount')?.value) || 0;
        const monthSelector = document.getElementById('monthPicker')
        const [year, month] = monthSelector.value.split('-');

        const category = row.querySelector('.categorySelect')?.value || 'Groceries'

        
            try {
                if (row.hasAttribute('id') && !row.id.startsWith('temp')) { // If docId already exists and is not null for the row
                    const docID = row.id;
                    const docRef = doc(db, "expenses", docID);
                    const dataUpdate = {
                        description: description,
                        category: category,
                        type: type,
                        date: date,
                        amount: amount,
                        email: userEmail, 
                        monthYear: monthYearRow
                    };

                    console.log(`Updating document with id ${docID}`);
                    await updateDoc(docRef, dataUpdate);
                } else {
                    console.log(`Adding new document`);

                    await addDoc(collection(db, "expenses"), {
                        description: description,
                        type: type,
                        date: date,
                        amount: amount,
                        monthYear: monthYearRow,
                        uid: auth.currentUser.uid //matching with user that is currentl ylogged in
                    });
                }
            } catch (e) {
                console.error("Error updating or adding document in Firebase: ", e);
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

    for (let i = 0; i < colAmt; i++) {
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
    if(difference >= 0){
        differenceElement.style.backgroundColor = 'rgba(68, 207, 68, 0.384)';
    }
    else{
        differenceElement.style.backgroundColor = 'rgba(209, 75, 75, 0.384)';
    }
    differenceElement.textContent = `$${difference.toFixed(2)}`;
}






document.getElementById('logoutButton').addEventListener('click', async function () {
    try {
        await saveData();  //saveData before sign out 
        await saveBudgetData();
        await signOut(auth);
        window.location.href = "login.html"; //go to login poage
    } catch (error) {
        alert("Error logging out: " + error.message);
    }
});


    // Sample data for the pie chart
    const data = {
        labels: ['Food', 'Entertainment', 'Bills', 'Other'],
        datasets: [{
            data: [300, 150, 100, 50], // Replace with your data
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Colors for each slice
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
    };

    // Options for the pie chart
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Position of the legend (e.g., top, bottom, left, right)
            }
        }
    };

    // Creating the pie chart
    const ctx = document.getElementById('myPieChart').getContext('2d');
    const myPieChart = new Chart(ctx, {
        type: 'pie', // Chart type: pie
        data: data,
        options: options
    });

