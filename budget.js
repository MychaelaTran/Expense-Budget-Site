document.addEventListener('DOMContentLoaded', () => { /*once dom has loaded for the deault one thats there*/
    document.getElementById('expenses').addEventListener('click', function(event) { /*event is an object that contains what was clicked when sth clicked in the tavle*/
        if (event.target.classList.contains('delete')) {
            const row = event.target.parentElement.parentElement;
            row.parentElement.removeChild(row); 
        }
    });

    document.getElementById('expenses').addEventListener('click', function(event) {
        if(event.target.classList.contains('amount')){
            const row = event.target.parentElement.parentElement;
            const selectBox = row.querySelector('.selectBox');
            const amount = event.target;
            if (selectBox.value === 'expense'){
                amount.style.color = 'red';
            }
            else if(selectBox.value === 'income'){
                amount.style.color = 'green';
            }
        }
    });

})

const newExpense = document.getElementById('newExpense');

newExpense.addEventListener('click', createExpense);

function createExpense() {
    const expenseTable = document.getElementById('expenses');
    const row = document.createElement('tr');

    for (let i = 0; i < 5; i++) {
        const rowElement = document.createElement('td');
        const input = document.createElement('input'); // Create a new input element each time
        
        if (i === 0) { // description
            input.type = 'text'; 
            input.classList.add('description');
            rowElement.appendChild(input);
        } else if(i==1){
            const selectionBox = document.createElement('select');
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.textContent = 'Expense';
            option2.textContent = 'Income';
            selectionBox.appendChild(option1);
            selectionBox.appendChild(option2);
            selectionBox.classList.add('selectBox');
            rowElement.appendChild(selectionBox);

            


        }else if (i === 2) { // date
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
        
        row.appendChild(rowElement); //append the td element to the tr element
    }
    
    expenseTable.appendChild(row); //append the tr element to the table
}

function colourAmount(){
     
}