// ============================================
// DATABASE MANAGEMENT - LocalStorage Handler
// ============================================

const DB = {
    STUDENTS_KEY: 'jee_students',
    BATCHES_KEY: 'jee_batches',
    
    // Initialize default data
    init() {
        if (!localStorage.getItem(this.BATCHES_KEY)) {
            const defaultBatches = ['Batch-A', 'Batch-B', 'Batch-C'];
            localStorage.setItem(this.BATCHES_KEY, JSON.stringify(defaultBatches));
        }
        
        if (!localStorage.getItem(this.STUDENTS_KEY)) {
            const sampleData = [
                { id: 1, name: 'Rahul Verma', roll: 'A001', batch: 'Batch-A', physics: 85, chemistry: 92, mathematics: 88 },
                { id: 2, name: 'Sneha Gupta', roll: 'A002', batch: 'Batch-A', physics: 78, chemistry: 85, mathematics: 92 },
                { id: 3, name: 'Priti Singh', roll: 'B001', batch: 'Batch-B', physics: 90, chemistry: 88, mathematics: 85 },
                { id: 4, name: 'Ankit Sharma', roll: 'B002', batch: 'Batch-B', physics: 82, chemistry: 80, mathematics: 79 },
                { id: 5, name: 'Manish Kumar', roll: 'C001', batch: 'Batch-C', physics: 88, chemistry: 86, mathematics: 90 },
            ];
            localStorage.setItem(this.STUDENTS_KEY, JSON.stringify(sampleData));
        }
    },
    
    // Get all students with calculated totals
    getAllStudents() {
        const students = JSON.parse(localStorage.getItem(this.STUDENTS_KEY) || '[]');
        return students.map((s, idx) => ({
            ...s,
            total: s.physics + s.chemistry + s.mathematics
        })).sort((a, b) => b.total - a.total).map((s, idx) => ({
            ...s,
            rank: idx + 1
        }));
    },
    
    // Get single student by ID
    getStudent(id) {
        const students = JSON.parse(localStorage.getItem(this.STUDENTS_KEY) || '[]');
        return students.find(s => s.id === parseInt(id));
    },
    
    // Add new student
    addStudent(student) {
        const students = JSON.parse(localStorage.getItem(this.STUDENTS_KEY) || '[]');
        const newStudent = {
            id: Math.max(...students.map(s => s.id), 0) + 1,
            ...student,
            physics: parseInt(student.physics) || 0,
            chemistry: parseInt(student.chemistry) || 0,
            mathematics: parseInt(student.mathematics) || 0
        };
        students.push(newStudent);
        localStorage.setItem(this.STUDENTS_KEY, JSON.stringify(students));
        return newStudent;
    },
    
    // Update student
    updateStudent(id, updates) {
        const students = JSON.parse(localStorage.getItem(this.STUDENTS_KEY) || '[]');
        const index = students.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            students[index] = {
                ...students[index],
                ...updates,
                physics: updates.physics !== undefined ? parseInt(updates.physics) : students[index].physics,
                chemistry: updates.chemistry !== undefined ? parseInt(updates.chemistry) : students[index].chemistry,
                mathematics: updates.mathematics !== undefined ? parseInt(updates.mathematics) : students[index].mathematics
            };
            localStorage.setItem(this.STUDENTS_KEY, JSON.stringify(students));
        }
    },
    
    // Delete student
    deleteStudent(id) {
        const students = JSON.parse(localStorage.getItem(this.STUDENTS_KEY) || '[]');
        const filtered = students.filter(s => s.id !== parseInt(id));
        localStorage.setItem(this.STUDENTS_KEY, JSON.stringify(filtered));
    },
    
    // Get all batches
    getBatches() {
        return JSON.parse(localStorage.getItem(this.BATCHES_KEY) || '[]');
    },
    
    // Add new batch
    addBatch(batchName) {
        const batches = this.getBatches();
        if (!batches.includes(batchName)) {
            batches.push(batchName);
            localStorage.setItem(this.BATCHES_KEY, JSON.stringify(batches));
        }
    },
    
    // Get students by batch
    getStudentsByBatch(batch) {
        const students = this.getAllStudents();
        return batch ? students.filter(s => s.batch === batch) : students;
    }
};

// Initialize on load
window.addEventListener('DOMContentLoaded', () => DB.init());

// Export for other modules
function getAllStudents() {
    return DB.getAllStudents();
}

function getStudent(id) {
    return DB.getStudent(id);
}

function addStudent(student) {
    return DB.addStudent(student);
}

function updateStudent(id, updates) {
    DB.updateStudent(id, updates);
}

function deleteStudent(id) {
    DB.deleteStudent(id);
}

function getBatches() {
    return DB.getBatches();
}

function addBatch(name) {
    DB.addBatch(name);
}

function getStudentsByBatch(batch) {
    return DB.getStudentsByBatch(batch);
}
