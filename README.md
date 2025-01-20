# Todo App

A simple Next.js App with Express server api integration to MySQL.

### **Objective**

Build a **Todo List App** where users can:

- Add tasks.
- Edit tasks.
- Mark tasks as Completed/Not Completed.
- Delete tasks.

Backend installation

```bash
cd backend
npm install
```

Database Setup (Prisma & MySQL):

Set up MySQL connection in ```.env```
Add this line to the file
```DATABASE_URL="mysql://root@localhost:3306/todoapp"```

Create database with name ```todoapp``` and turn on Xampp or confirm MySQL is working on port 3306.

```bash
npx prisma migrate dev --name init
npm run dev
```

Your backend app should now be running on [localhost:4000](http://localhost:4000/).

Frontend installation

```bash
cd frontend
npm install
npm run dev
```

Your frontend app should now be running on [localhost:4000](http://localhost:3000/).
