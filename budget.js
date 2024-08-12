document.addEventListener('DOMContentLoaded', () => { 
    //delete button functionalliyu 
    document.getElementById('expenses').addEventListener('click', function(event) { 
        if (event.target.classList.contains('delete')) {
            const row = event.target.parentElement.parentElement;
            row.parentElement.removeChild(row); 
            updateIncomeTotal();
            updateExpenseTotal();
            difference();
        }
        
    });

    //inital color of the first row bc not dynamically added 

    // selection box change color 
    document.getElementById('expenses').addEventListener('change', function(event) {
        if (event.target.classList.contains('selectBox')) {
            const row = event.target.parentElement.parentElement;
            updateAmountColor(row);
            updateIncomeTotal();
            updateExpenseTotal();
            difference();
            
        }
    });
    
    //input changes (needed for when seleciton box experences no chnage og is expense)
    document.getElementById('expenses').addEventListener('input', function(event) {
        if (event.target.classList.contains('amount')) {
            const row = event.target.parentElement.parentElement;
            updateAmountColor(row);
            updateIncomeTotal();
            updateExpenseTotal();
            difference();
        }
    });
    

    
});

const newExpense = document.getElementById('newExpense');

newExpense.addEventListener('click', createExpense);

function createExpense() {
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


function updateIncomeTotal(){
    const table = document.getElementById('expenses');
    const rows = table.querySelectorAll('tr');
    const incomeTotal = document.getElementById('totalIncome');
    let colAmt = rows.length;
    console.log(`number of rows ${colAmt}`);
    let totalIncome = 0;
    for(i=1; i<colAmt; i++){
        const row = rows[i];
        const selectBox = row.querySelector('.selectBox');
        const amountNum = row.querySelector('.amount');

        if(selectBox && amountNum){ //make sure they are not null
            const amount = parseFloat(amountNum.value) || 0;
            if(selectBox.value === 'income'){
                totalIncome += amount;
            }
        }
    }

    
    incomeTotal.textContent = `$${totalIncome.toFixed(2)}`;
    return totalIncome;
}

function updateExpenseTotal(){
    console.log("function ran");
    const table = document.getElementById('expenses');
    const rows  = table.querySelectorAll('tr');
    const expenseTotal = document.getElementById('totalExpense');
    let colAmt = rows.length;
    let totalExpense = 0;

    for(let i=1; i < colAmt; i++){
        const row = rows[i];
        const selectionBox = row.querySelector('.selectBox');
        const amountNum = row.querySelector('.amount');
        if(selectionBox && amountNum){
            const amount = parseFloat(amountNum.value) || 0;

            if(selectionBox.value === 'expense'){
                totalExpense += amount;
            }
        }
    }

    expenseTotal.textContent = `$${totalExpense.toFixed(2)}`;
    return totalExpense;
}

function difference(){
    const totalIncome = updateIncomeTotal();
    const totalExpense = updateExpenseTotal();
    const difference = totalIncome - totalExpense;
    const differenceElement = document.getElementById('difference');
    differenceElement.textContent = `$${difference.toFixed(2)}`;
}


