const UserModel = require('./model/usermodel');

const express = require('express');
const cors = require('cors');
const userRoutes = require('./route/userroute');
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT ;
console.log('Environment variables:', {
    port: process.env.PORT,
    dbUser: process.env.DB_USER,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
    DB_PASSWORD: process.env.DB_PASSWORD ? "****" : "Not Set"
    
});
UserModel.createTables()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    });
// const startServer = async () => {
    //     try {
//         await UserModel.createTables();
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error('Failed to initialize database:', error);
//         process.exit(1);
//     }
// };

// startServer();