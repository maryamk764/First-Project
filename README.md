# Expense Tracker

<!-- Write 1-2 sentences: what does your app do? -->

Expense Tracker : is a web application that helps users manage their daily expenses. Users can add, edit, delete, and filter expenses, while the data is stored in a database.

## How to run

<!-- Write the exact steps someone needs to run your project from scratch.
     Assume they have Node.js, PostgreSQL, and VS Code, and nothing else.
     Include: creating the database, running schema.sql, writing the .env file,
     starting the backend, and opening the frontend. -->

**Backend**

1. Open the project folder in VS Code.
2. Open a terminal
3. Change directory to backend folder(cd backend ).
4. Install the required packages: npm install express cors pg dotenv
5. Create a PostgreSQL database named: expense_tracker
6. Open the schema.sql file and run it in the expense_tracker database to create the expenses table and insert the sample data.
7. Create a .env file inside the backend folder and add the database information:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=expense_tracker

8. Start the backend server: node server.js

The backend will run on: http://localhost:3000

**Frontend**

1. Choose the frontend folder.
2. Open index.html using Live Server.


## Features

<!-- List what your app can do. Tick what you finished. -->

- [✓ ] Add an expense (with validation)
- [✓ ] Delete an expense
- [✓ ] Edit an expense
- [✓ ] Filter by category
- [✓ ] Summary cards (total, count, highest)
- [✓ ] Data is saved in a PostgreSQL database

## Screenshots

<!-- Add 2-3 screenshots of your app (desktop and mobile). -->

![Desktop image](screenshots/Desktop.png)
![DarkMode image](screenshots/DarkMode.png)
![DarkMode image](screenshots/Mobile.png)


## What was the hardest part?

<!-- A short paragraph: what got you stuck, and how did you solve it? -->

The part that was a little difficult for me was understanding how fetch and APIs work together. What helped me was the resources shared by the engineers, searching for some concepts that I did not understand, and applying them practically while working on the project.


<!-- Video Link -->
https://drive.google.com/file/d/1kFHlxAbackq2fbUYM1E5H33Z6uj_Nfb4/view?usp=sharing



