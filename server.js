const express = require('express');
const connectDB = require('./config/db');

const app= express();



//connect Database
connectDB();

//Init middleware
app.use(express.json({extended:false}));


app.get('/', (req,res)=> res.send('API RUNNING'));


//Define routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/doc', require('./routes/api/doc'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/authdoc', require('./routes/api/authdoc'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/cardiodept', require('./routes/api/cardiodept'));




const PORT =process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
