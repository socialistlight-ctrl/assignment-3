// Task1: initiate app and run server at 3000

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster.mongodb.net/employeeDB?retryWrites=true&w=majority';

mongoose
    .connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true },
  },
  { timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema);

app.use(express.static(path.join(__dirname + '/dist/Frontend')));
// Task2: create mongoDB connection /\
//                                  ||

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Unable to fetch employees', error: error.message });
    }
});


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json(employee);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to fetch employee', error: error.message });
    }
});




//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;

        if (!name || !location || !position || salary === undefined) {
            return res.status(400).json({ message: 'Name, location, position and salary are required' });
        }

        const employee = new Employee({ name, location, position, salary });
        const savedEmployee = await employee.save();

        return res.status(201).json(savedEmployee);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to create employee', error: error.message });
    }
});





//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to delete employee', error: error.message });
    }
});





//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist/:id', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, location, position, salary },
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json(employee);
    } catch (error) {
        return res.status(500).json({ message: 'Unable to update employee', error: error.message });
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



