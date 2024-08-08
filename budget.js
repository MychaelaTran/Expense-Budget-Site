document.addEventListener('DOMContentLoaded', () => { /*once dom has loaded for the deault one thats there*/
    document.getElementById('expenses').addEventListener('click', function(event) { /*event is an object that contains what was clicked when sth clicked in the tavle*/
        if (event.target.classList.contains('delete')) {
            const row = event.target.parentElement.parentElement;
            row.parentElement.removeChild(row); 
        }
    });
})

const newExpense = document.getElementById('newExpense');

newExpense.addEventListener('click', createExpense);

function createExpense() {
    const expenseTable = document.getElementById('expenses');
    const row = document.createElement('tr');

    for (let i = 0; i < 4; i++) {
        const rowElement = document.createElement('td');
        const input = document.createElement('input'); // Create a new input element each time
        
        if (i === 0) { // description
            input.type = 'text'; 
            input.classList.add('description');
            rowElement.appendChild(input);
        } else if (i === 1) { // date
            input.type = 'date'; 
            input.classList.add('date');
            rowElement.appendChild(input);
        } else if (i === 2) { // amount
            input.type = 'number'; 
            input.classList.add('amount');
            rowElement.appendChild(input);
        } else if (i === 3) { // delete button
            const button = document.createElement('button');
            button.textContent = 'Delete';
            button.classList.add('delete');
            rowElement.appendChild(button);
        }
        
        row.appendChild(rowElement); // Append the td element to the tr element
    }
    
    expenseTable.appendChild(row); // Append the tr element to the table
}
