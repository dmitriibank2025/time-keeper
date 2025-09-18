# 📘 TimeKeeper API — Documentation

## 1. Introduction

**TimeKeeper API** is a time tracking service for small businesses.  
It allows you to:

- Manage employees (create, update, fire, assign roles, change password).
- Track work shifts (start/finish, breaks, corrections).
- Control access rights using basic authentication and roles.

The API is built with **Node.js + Express**, and data is stored in **MongoDB Atlas**.  
Specification format — **OpenAPI 3.0**.

---

## 2. Project Setup

### Requirements
- Node.js **v22+**
- npm
- MongoDB Atlas (or local MongoDB, if you provide your own URI)

### `.env` Configuration
The `.env` file in the project root contains the settings:

```env
PORT=3555                          # Port where the server runs
OWNER=1000000                      # ID of the supervisor
OWNER_PASS=123456789.com           # Supervisor password
HR=111111111                       # ID of the hr 
HR_PASS=12345678                   # HR password
MONGO_URI=mongodb+srv://...        # URI of the main database timekeeper-db
MONGO_ACCOUNTING_URL=mongodb+srv://... # URI of the accounting database
JWT_SECRET=super-secret-key-for-jwt-token # Secret for JWT signing
JWE_EXP=1h                         # JWT expiration (1 hour)
```

### Run the project
```bash
npm install
npm run start
```

After launch the API will be available at:  
👉 [http://localhost:3555](http://localhost:3555)

---

## 3. Security

### 3.1 Basic Authentication
Most endpoints require **Basic Auth**  
(employee `id` and password).

### 3.2 Roles
- **crew** — regular employee, can start/finish shifts, take breaks.  
- **manager / hr** — manage employees, correct shifts.  
- **supervisor** — assign roles to other users.  

---

## 4. Endpoints

### 👥 Employees

- **GET /crew/employees** — get list of employees.  
- **GET /crew/employee?id={id}** — get employee by `id`.  
- **POST /crew/hireEmployee** — hire a new employee.  
  ```json
  {
    "id": "111111115",
    "firstName": "Jon",
    "lastName": "Doe",
    "password": "12345678"
  }
  ```
- **DELETE /crew/fireEmployee?id={id}** — fire an employee by `id`.  
- **PATCH /crew/updateEmployee** — update employee data.  
  ```json
  {
    "empId": "111111114",
    "employee": {
      "firstName": "Jon",
      "lastName": "Doe"
    }
  }
  ```
- **PATCH /crew/password** — change employee password.  
  ```json
  {
    "empId": "111111113",
    "newPassword": "12345678"
  }
  ```
- **PATCH /crew/setRole** — assign a role to an employee.  
  ```json
  {
    "id": "111111111",
    "newRole": "hr"
  }
  ```

---

### 🕒 Work (shifts)

- **GET /work/** — get current staff shifts.  
- **POST /work/start** — start a shift.  
  ```json
  { "tab_n": "e0e62ecc-d0ea-4c29-a32a-3c74a6da6e20" }
  ```
- **PATCH /work/finish** — finish a shift.  
  ```json
  { "tab_n": "e0e62ecc-d0ea-4c29-a32a-3c74a6da6e20" }
  ```
- **PATCH /work/break** — take a break.  
  ```json
  { "tab_n": "e0e62ecc-d0ea-4c29-a32a-3c74a6da6e20", "minutes": 15 }
  ```
- **PATCH /work/correct** — correct a shift.  
  ```json
  {
    "table_num": "e0e62ecc-d0ea-4c29-a32a-3c74a6da6e20",
    "start": "2025-09-18T06:00:00Z",
    "finish": "2025-09-18T15:00:00Z"
  }
  ```

---

## 5. Error Codes

| Status | Meaning                               |
|--------|---------------------------------------|
| 400    | Validation error / Bad request body   |
| 401    | Unauthorized (missing or bad auth)    |
| 403    | Forbidden (not enough role rights)    |
| 404    | Resource not found                    |
| 409    | Conflict (duplicate data, open shift) |
| 500    | Internal server error                 |

---
## 6. Additional Information
- Full specification available in [OpenAPI JSON](./openapi.synced.v2.json).  
- Can be viewed in Swagger UI or Postman.
- Run tests with:
  ```bash
  npm test
  ```

- Project structure:
```textmate
  ├── README.md
  ├── TimeKeeper API.postman_collection.json
  ├── access.log
  ├── app-config
  │   └── app-config.json
  ├── build
  │   ├── app-config
  │   │   └── app-config.json
  │   ├── docs
  │   │   └── openapi.json
  │   └── src
  │       ├── Logger
  │       │   └── winston.js
  │       ├── app.js
  │       ├── config
  │       │   └── appConfig.js
  │       ├── controllers
  │       │   ├── EmployeeController.js
  │       │   └── WorkTimeController.js
  │       ├── errorHandler
  │       │   ├── HttpError.js
  │       │   └── errorHandler.js
  │       ├── middleware
  │       │   ├── authentication.js
  │       │   └── authorization.js
  │       ├── model
  │       │   ├── AccountingMongooseModel.js
  │       │   ├── Audit.js
  │       │   ├── Employee.js
  │       │   └── EmployeeMongooseModel.js
  │       ├── routes
  │       │   ├── empRouter.js
  │       │   └── workTimeRouter.js
  │       ├── server.js
  │       ├── services
  │       │   ├── AccountServiceImplMongo.js
  │       │   ├── WorkTimeImpMongo.js
  │       │   ├── accountService.js
  │       │   ├── archiveService.js
  │       │   └── workTimeService.js
  │       ├── tools.js
  │       ├── utils
  │       │   ├── appTypes.js
  │       │   └── tools.js
  │       └── validation
  │           ├── appSchemas.js
  │           └── bodyValidation.js
  ├── combine.log
  ├── coverage
  │   ├── clover.xml
  │   ├── coverage-final.json
  │   ├── lcov-report
  │   │   ├── Logger
  │   │   │   ├── index.html
  │   │   │   └── winston.ts.html
  │   │   ├── base.css
  │   │   ├── block-navigation.js
  │   │   ├── config
  │   │   │   ├── appConfig.ts.html
  │   │   │   └── index.html
  │   │   ├── errorHandler
  │   │   │   ├── HttpError.ts.html
  │   │   │   └── index.html
  │   │   ├── favicon.png
  │   │   ├── index.html
  │   │   ├── model
  │   │   │   ├── AccountingMongooseModel.ts.html
  │   │   │   ├── Audit.ts.html
  │   │   │   ├── EmployeeMongooseModel.ts.html
  │   │   │   └── index.html
  │   │   ├── prettify.css
  │   │   ├── prettify.js
  │   │   ├── services
  │   │   │   ├── AccountServiceImplMongo.ts.html
  │   │   │   ├── archiveService.ts.html
  │   │   │   └── index.html
  │   │   ├── sort-arrow-sprite.png
  │   │   ├── sorter.js
  │   │   └── utils
  │   │       ├── appTypes.ts.html
  │   │       └── index.html
  │   └── lcov.info
  ├── docs
  │   └── openapi.json
  ├── error.log
  ├── index.js
  ├── jest.config.ts
  ├── package-lock.json
  ├── package.json
  ├── src
  │   ├── Logger
  │   │   └── winston.ts
  │   ├── app.ts
  │   ├── config
  │   │   └── appConfig.ts
  │   ├── controllers
  │   │   ├── EmployeeController.ts
  │   │   └── WorkTimeController.ts
  │   ├── errorHandler
  │   │   ├── HttpError.ts
  │   │   └── errorHandler.ts
  │   ├── middleware
  │   │   ├── authentication.ts
  │   │   └── authorization.ts
  │   ├── model
  │   │   ├── AccountingMongooseModel.ts
  │   │   ├── Audit.ts
  │   │   ├── Employee.ts
  │   │   └── EmployeeMongooseModel.ts
  │   ├── routes
  │   │   ├── empRouter.ts
  │   │   └── workTimeRouter.ts
  │   ├── server.ts
  │   ├── services
  │   │   ├── AccountServiceImplMongo.ts
  │   │   ├── WorkTimeImpMongo.ts
  │   │   ├── accountService.ts
  │   │   ├── archiveService.ts
  │   │   └── workTimeService.ts
  │   ├── utils
  │   │   ├── appTypes.ts
  │   │   └── tools.ts
  │   └── validation
  │       ├── appSchemas.ts
  │       └── bodyValidation.ts
  ├── tests
  │   └── unit
  │       └── accountTests      
  │           ├── changePassword.test.ts
  │           ├── fireEmployee.test.ts
  │           ├── getAllEmployees.test.ts
  │           ├── getEmployeeById.test.ts
  │           ├── hireEmployee.test.ts
  │           ├── setRole.test.ts
  │           └── updateEmployee.test.ts
  └── tsconfig.json
```