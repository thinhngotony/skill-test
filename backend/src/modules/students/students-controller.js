const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const { name, className, section, roll } = req.query;
    
    const filters = {
        ...(name && { name }),
        ...(className && { className }),
        ...(section && { section }),
        ...(roll && { roll })
    };

    const students = await getAllStudents(filters);
    
    res.status(200).json({
        success: true,
        data: students,
        message: "Students retrieved successfully"
    });
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const studentData = req.body;
    
    const result = await addNewStudent(studentData);
    
    res.status(201).json({
        success: true,
        data: result,
        message: "Student created successfully"
    });
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body, id };
    
    const result = await updateStudent(updateData);
    
    res.status(200).json({
        success: true,
        data: result,
        message: "Student updated successfully"
    });
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: "Invalid student ID provided"
        });
    }
    
    const student = await getStudentDetail(parseInt(id));
    
    res.status(200).json({
        success: true,
        data: student,
        message: "Student details retrieved successfully"
    });
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const reviewerId = req.user.id; // From authenticateToken middleware
    
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: "Invalid student ID provided"
        });
    }
    
    if (typeof status !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: "Status must be a boolean value"
        });
    }
    
    const result = await setStudentStatus({
        userId: parseInt(id),
        reviewerId,
        status
    });
    
    res.status(200).json({
        success: true,
        data: result,
        message: "Student status updated successfully"
    });
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
