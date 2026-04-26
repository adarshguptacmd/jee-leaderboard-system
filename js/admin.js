// ============================================
// ADMIN DASHBOARD FUNCTIONALITY
// ============================================

function setupAddStudentForm() {
    const form = document.getElementById('addStudentForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const student = {
            name: document.getElementById('studentName').value,
            roll: document.getElementById('rollNumber').value,
            batch: document.getElementById('studentBatch').value,
            physics: parseFloat(document.getElementById('physics').value) || 0,
            chemistry: parseFloat(document.getElementById('chemistry').value) || 0,
            mathematics: parseFloat(document.getElementById('mathematics').value) || 0
        };
        
        if (!student.name || !student.batch) {
            showNotification('Please fill all required fields', 'error');
            return;
        }
        
        addStudent(student);
        showNotification(`${student.name} added successfully!`);
        form.reset();
        loadManageStudents();
    });
}

function loadManageStudents() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    const students = getAllStudents();
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.name}</td>
            <td>${student.roll || '-'}</td>
            <td>${student.batch}</td>
            <td><strong>${student.total}</strong></td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteStudentHandler(${student.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteStudentHandler(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        deleteStudent(id);
        showNotification('Student deleted successfully');
        loadManageStudents();
        loadUpdateMarksSelect();
    }
}

function editStudent(id) {
    const student = getStudent(id);
    if (student) {
        document.getElementById('studentName').value = student.name;
        document.getElementById('rollNumber').value = student.roll || '';
        document.getElementById('studentBatch').value = student.batch;
        document.getElementById('physics').value = student.physics;
        document.getElementById('chemistry').value = student.chemistry;
        document.getElementById('mathematics').value = student.mathematics;
        
        document.querySelector('.tab-btn[data-tab="add-student"]').click();
    }
}

function loadUpdateMarksSelect() {
    const select = document.getElementById('selectStudent');
    if (!select) return;
    
    const students = getAllStudents();
    select.innerHTML = '<option value="">Select Student</option>';
    
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.name} (${student.batch})`;
        select.appendChild(option);
    });
}

function setupUpdateMarksForm() {
    const form = document.getElementById('updateMarksForm');
    if (!form) return;
    
    document.getElementById('selectStudent').addEventListener('change', (e) => {
        const student = getStudent(e.target.value);
        if (student) {
            document.getElementById('updatePhysics').value = student.physics;
            document.getElementById('updateChemistry').value = student.chemistry;
            document.getElementById('updateMathematics').value = student.mathematics;
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const studentId = document.getElementById('selectStudent').value;
        if (!studentId) {
            showNotification('Please select a student', 'error');
            return;
        }
        
        const updates = {
            physics: parseInt(document.getElementById('updatePhysics').value) || 0,
            chemistry: parseInt(document.getElementById('updateChemistry').value) || 0,
            mathematics: parseInt(document.getElementById('updateMathematics').value) || 0
        };
        
        updateStudent(studentId, updates);
        showNotification('Marks updated successfully!');
        loadUpdateMarksSelect();
        form.reset();
    });
}

function setupBatchManagement() {
    const createBtn = document.getElementById('createBatchBtn');
    if (!createBtn) return;
    
    createBtn.addEventListener('click', () => {
        const batchName = document.getElementById('newBatchName').value.trim();
        if (!batchName) {
            showNotification('Please enter batch name', 'error');
            return;
        }
        
        addBatch(batchName);
        showNotification(`${batchName} created successfully!`);
        document.getElementById('newBatchName').value = '';
        loadBatchesList();
    });
    
    loadBatchesList();
}

function loadBatchesList() {
    const container = document.getElementById('batchesList');
    if (!container) return;
    
    const batches = getBatches();
    container.innerHTML = '';
    
    batches.forEach(batch => {
        const students = getAllStudents().filter(s => s.batch === batch);
        const div = document.createElement('div');
        div.className = 'batch-item';
        div.style.cssText = `
            padding: 1rem;
            background: var(--light);
            border-radius: 6px;
            margin-bottom: 1rem;
            border-left: 4px solid var(--primary);
        `;
        
        div.innerHTML = `
            <strong>${batch}</strong>
            <span style="color: var(--text-light);"> - ${students.length} students</span>
        `;
        
        container.appendChild(div);
    });
}

function setupImportExport() {
    const exportBtn = document.getElementById('exportDataBtn');
    const importBtn = document.getElementById('importDataBtn');
    const importFile = document.getElementById('importFile');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const students = getAllStudents();
            exportToCSV(students);
            showNotification('Data exported successfully!');
        });
    }
    
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            if (!importFile.files.length) {
                showNotification('Please select a file', 'error');
                return;
            }
            
            parseCSV(importFile.files[0]).then(data => {
                let importedCount = 0;
                data.forEach(row => {
                    if (row.Name) {
                        addStudent({
                            name: row.Name,
                            roll: row['Roll No'] || '',
                            batch: row.Batch || 'Batch-A',
                            physics: parseInt(row.Physics) || 0,
                            chemistry: parseInt(row.Chemistry) || 0,
                            mathematics: parseInt(row.Mathematics) || 0
                        });
                        importedCount++;
                    }
                });
                
                showNotification(`${importedCount} students imported successfully!`);
                loadManageStudents();
                loadUpdateMarksSelect();
                importFile.value = '';
            });
        });
    }
}

// Initialize admin page
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('addStudentForm')) {
        setupAddStudentForm();
        loadManageStudents();
        setupUpdateMarksForm();
        loadUpdateMarksSelect();
        setupBatchManagement();
        setupImportExport();
    }
});
