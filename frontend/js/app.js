// Expense Tracker - frontend logic
// PHASE 2
// Your backend from Phase 1 is already running, with real expenses in the
// database (from schema.sql). Build this page directly against it with
// fetch and async/await - there is no in-memory or localStorage stage
// this time, and no sample data file.
//
// A possible structure (change it if you have a better idea):
//   - async function getExpenses()          fetch(API_URL), return the JSON
//   - async function addExpense(data)       fetch(API_URL, { method: "POST", ... })
//   - async function updateExpense(id,data) fetch(API_URL + "/" + id, { method: "PUT", ... })
//   - async function deleteExpense(id)      fetch(API_URL + "/" + id, { method: "DELETE" })
//   - async function refresh()              get the list, then call renderTable and renderSummary
//   - renderTable(list)                     build the table rows from the array the API returned
//   - renderSummary(list)                   update the summary cards
//   - applyFilter()                         re-render with the list filtered by category
//
// Don't forget:
//   - Show a Bootstrap spinner while a request is in flight.
//   - Wrap every fetch call in try/catch, and show a Bootstrap alert on failure.
//   - After add, edit, or delete, call refresh() so the page always shows
//     what the server actually saved - never update the table by hand.
//   - The API is at http://localhost:3000/api/expenses (see the Roadmap).

const darkMode = document.getElementById("darkMode");

let expensesList = [];
const API_URL = "http://localhost:3000/api/expenses";
const tbody = document.getElementById("tbody");
const totalAmount = document.getElementById("totalAmount");
const expensesCount = document.getElementById("expensesCount");
const highestExpense = document.getElementById("highestExpense");
const highestTitle = document.getElementById("highestTitle");
const categoryFilter = document.getElementById("categoryFilter");


const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");
const AddExpenseBtn = document.getElementById("AddExpenseBtn");


const editForm = document.getElementById("editForm");
const editTitle = document.getElementById("editTitle");
const editAmount = document.getElementById("editAmount");
const editCategory = document.getElementById("editCategory");
const editDate = document.getElementById("editDate");
const saveExpenseBtn = document.getElementById("saveExpenseBtn");
const cancelExpenseBtn = document.getElementById("cancelExpenseBtn");


const editModal = new bootstrap.Modal(editForm);

const alertBox = document.getElementById("alertBox");
const spinner = document.getElementById("spinner");

// dark Mode

darkMode.addEventListener("change", function () {

    if (darkMode.checked) {
        document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-bs-theme", "light");
    }

});

function showAlert(message) {

    alertBox.textContent = message;
    alertBox.classList.remove("d-none");

}




async function getExpenses() {

    spinner.classList.remove("d-none");
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error("Request Faild")
        }

        const expenses = await response.json()
        spinner.classList.add("d-none");
        return expenses;





    }
    catch (error) {
        spinner.classList.add("d-none");
        console.log(error);
        showAlert("Failed to load expenses");
        return [];
    }


}

AddExpenseBtn.addEventListener("click", function () {

    const data = {
        title: title.value,
        amount: Number(amount.value),
        category: category.value,
        date: date.value
    };
    addExpense(data);

});

async function addExpense(data) {

    spinner.classList.remove("d-none");
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to add expense");
        }
        await refresh();
        spinner.classList.add("d-none");

    } catch (error) {
        spinner.classList.add("d-none");
        console.log(error);
        showAlert("Failed to Add expense");

    }
}







async function updateExpense(id, data) {

    spinner.classList.remove("d-none");
    try {
        const response = await fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to update expense");
        }

        editModal.hide();
        await refresh();
        spinner.classList.add("d-none");

    } catch (error) {
        spinner.classList.add("d-none");
        console.log(error);
        showAlert("Failed to update expense");

    }


}

async function deleteExpense(id) {

    spinner.classList.remove("d-none");
    try {
        const response = await fetch(API_URL + "/" + id, {

            method: "DELETE",

        });
        if (!response.ok) {

            throw new Error("Failed to delete expense");
        }
        await refresh();
        spinner.classList.add("d-none");
    }


    catch (error) {
        spinner.classList.add("d-none");
        console.log(error);
        showAlert("Failed to delete expense");

    }



};


function renderTable(list) {

    tbody.innerHTML = "";

    for (let i = 0; i < list.length; i++) {


        const tr = document.createElement("tr");

        const tdTitle = document.createElement("td");
        tdTitle.textContent = list[i].title;

        const tdAmount = document.createElement("td");
        tdAmount.textContent = list[i].amount.toFixed(2);

        const tdCategory = document.createElement("td");
        const categoryColor = document.createElement("span");
        categoryColor.textContent = list[i].category;

        switch (categoryColor.textContent) {

            case "Food":
                categoryColor.style.backgroundColor = "#41a047";
                categoryColor.style.color = "#ffff";

                break;

            case "Transport":
                categoryColor.style.backgroundColor = "#7728ec";
                categoryColor.style.color = "#ffff";


                break;

            case "Bills":

                categoryColor.style.backgroundColor = "#df4c4c";
                categoryColor.style.color = "#ffff";


                break;
            case "Entertainment":
                categoryColor.style.backgroundColor = "#d9d930";
                categoryColor.style.color = "#ffff";

                break;

            case "Other":
                categoryColor.style.backgroundColor = "#8a8888";
                categoryColor.style.color = "#ffff";
                break;
        }

        categoryColor.style.padding = "6px";
        categoryColor.style.borderRadius = "8px";
        tdCategory.appendChild(categoryColor);



        const tdDate = document.createElement("td");
        tdDate.textContent = list[i].date;
        tdDate.className = "text-center";

        const tdAction = document.createElement("td");
        

        const actionDiv = document.createElement("div");
        actionDiv.className = "d-flex justify-content-end";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function () {

            const expense = list[i];
            editTitle.value = expense.title;
            editAmount.value = expense.amount;
            editCategory.value = expense.category;
            editDate.value = expense.date;

            editModal.show();

            saveExpenseBtn.addEventListener("click", function () {

                expense.title = editTitle.value;
                expense.amount = Number(editAmount.value);
                expense.category = editCategory.value;
                expense.date = editDate.value;
                updateExpense(expense.id, expense);


            })


        });




        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.color = "#dc3545";


        deleteBtn.addEventListener("click", function () {


            deleteExpense(list[i].id);

        });


        actionDiv.appendChild(editBtn);
        actionDiv.appendChild(deleteBtn);
        tdAction.appendChild(actionDiv);

        tr.appendChild(tdTitle);
        tr.appendChild(tdAmount);
        tr.appendChild(tdCategory);
        tr.appendChild(tdDate);
        tr.appendChild(tdAction);
        tbody.appendChild(tr);







    }
}

function renderSummary(list) {

    let total = 0;
    let max = 0;
    let highestIndex = -1;

    for (let i = 0; i < list.length; i++) {

        total += list[i].amount;
        if (list[i].amount > max) {

            max = list[i].amount;
            highestIndex = i;

        }
    }


    totalAmount.textContent = total.toFixed(2);
    expensesCount.textContent = list.length;
    highestExpense.textContent = max.toFixed(2);

    if (highestIndex == -1)
        highestTitle.textContent = "--";
    else
        highestTitle.textContent = list[highestIndex].title;



}

function applyFilter() {



    const selectCategory = categoryFilter.value;

    if (selectCategory == "All") {

        renderTable(expensesList);


    }


    else {
        const newExpenses = expensesList.filter(function (expense) {


            return expense.category == selectCategory;


        });

        renderTable(newExpenses);


    }



}
categoryFilter.addEventListener("change", applyFilter);

async function refresh() {

    expensesList = await getExpenses();
    renderTable(expensesList);

    renderSummary(expensesList);

}

refresh();


