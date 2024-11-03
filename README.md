# W3Schools Database in Docker

Forked from https://github.com/AndrejPHP/w3schools-database for academic purposes.

This repository provides:

- a docker compose which sets up the DB on port 3309 (non-default, no clashes)
- initializes the database data from w3schools (provided by @AndrejPHP) 
- Visual Studio Code config

## Fork to your github account
Go to github.com, create a new account or login.
Fork my repo (https://github.com/yveseinfeldt/w3schools-database)

Now you have a repository w3schools-database in your github account.
Clone that with
```
git clone https://github.com/YOURUSERNAME/w3schools-database
cd w3schools-database
code .
```

Run the database and rest-api
```
sudo docker-compose up
```

Start the react app like this
```
cd my-app
npm start
```

## How to reset?

Execute:

```bash
docker compose down
rm -rf data
docker compose up -d
```

## Tables

When the docker container starts, it creates database named __w3schools__ with the following tables

    categories
    customers
    employees
    orders
    order_details
    products
    shippers
    suppliers
    
and inserts the respective data. 

## Features
1. Get and list all customers 
2. Get and list all categories
3. Get and list all employees
4. Create (Add) a new customers
5. Create (Add) a new categories
6. Update (Edit) an existing customers
7. Update (Edit) an existing categories
8. Delete a customers
9. Delete a categories
10. Sort Alphabetically (A-Z, Z-A) 
11. Pagination
12. Refresh list    

## Journal
### 30.10.2024
Setting up the project was initially challenging due to my limited experience with Linux and Docker. I faced several issues with the scripts not working and the project failing to start. After some trial and error and guidance from ChatGPT, I identified missing dependencies and applications, particularly around Docker and Node.js. Once I reinstalled Node.js and resolved these issues, the project setup ran smoothly and I was able to get everything working as expected.

### 02.11.2024

After conducting research on routing, I implemented routing functionality to enhance navigation within the application. Below are the newly integrated features:

1. **Get and List All Entities**
     - **Customers**
     - **Categories**
     - **Employees**
   - Utilized GET methods to retrieve and display data in organized tables for each entity.

2. **Create (Add) New Entries**
   - Enabled creation of new entries for:
     - **Customers**
     - **Categories**
     - **Employees**
   - Implemented POST methods for adding new records directly from the application.

3. **Update (Edit) Existing Entries**
   - Implemented PATCH methods to allow in-place updates for individual records in:
     - **Customers**
     - **Categories**

4. **Delete Entries**
   - Set up DELETE methods to remove records for:
     - **Customers**
     - **Categories**

5. **Sorting Functionality**
   - Added sorting functionality to all tables. Clicking on table headers allows sorting columns alphabetically (A-Z or Z-A) for easy data organization.

6. **Pagination**
   - Implemented pagination to handle large datasets, with Previous and Next buttons for smooth navigation across pages.

7. **Refresh List**
   - Added a Refresh button to reload data, ensuring that the list reflects the latest updates instantly.

8. **Filtering**
   - Integrated a filtering feature to enable users to quickly search within each entity’s list for specific entries.

## Documentation

- Wrote technical documentation detailing the API methods (GET, POST, PATCH, DELETE) for managing Customers, Categories, and Employees.
- Documented all new features and updated the project journal.

These additions greatly enhance usability, providing a seamless experience for managing data across all entities.
