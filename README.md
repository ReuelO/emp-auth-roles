# EMP Auth

Role authentication system built using Express, MySQL and PassportJS


## How to

### Installation
1. Clone this repo
```
git clone https://github.com/ReuelO/emp-auth-roles.git
```

2. Access the repo
```
cd emp-auth-roles
```

3. Install node modules
```
npm install
```

### Usage
1. Import database file (to store data)
- You will need MySQL [PHPMyAdmin] (or any other alternative) to run a database
- On PHPMyAdmin, select "import" on the main dashboard
- Click "choose file" (/emp-auth-roles/config/db.php), then "go"

> You now have a database "emp_auth_roles" with a "users" table where all users' data will be saved

2. Run the project on the command console
```
npm start
```

3. To view the project, open your browser and type in **http://localhost:8000**

### Features
- [x] Simple, clean UI
- [x] Secure sign up and sign in (password is encrypted)
- [x] Multiple user roles
      - admin
      - user
- [x] User can edit profile (add other user details)
- [x] User can change password
- [x] Admin can add, edit and delete users

#### 💪 Enjoy!
