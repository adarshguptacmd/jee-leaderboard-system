// ============================================
// LEADERBOARD PAGE FUNCTIONALITY
// ============================================

let currentPage = 1;
const itemsPerPage = 10;
let allStudents = [];
let filteredStudents = [];

function loadLeaderboard() {
    allStudents = getAllStudents();
    filteredStudents = [...allStudents];
    
    // Load batches
    const batchFilter = document.getElementById('batchFilter');
    if (batchFilter) {
        const batches = getBatches();
        batches.forEach(batch => {
            const option = document.createElement('option');
            option.value = batch;
            option.textContent = batch;
            batchFilter.appendChild(option);
        });
    }
    
    displayLeaderboard();
}

function displayLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredStudents.slice(start, end);
    
    pageData.forEach((student, idx) => {
        const tr = document.createElement('tr');
        
        const allScores = filteredStudents.map(s => s.total);
        const percentile = calculatePercentile(student.total, allScores);
        
        tr.innerHTML = `
            <td><strong class="rank-${student.rank > 3 ? 'other' : student.rank}">#${student.rank}</strong></td>
            <td><strong>${student.name}</strong></td>
            <td>${student.physics}</td>
            <td>${student.chemistry}</td>
            <td>${student.mathematics}</td>
            <td><strong>${student.total}</strong></td>
            <td>${percentile}%</td>
            <td>${student.batch}</td>
        `;
        
        tbody.appendChild(tr);
    });
    
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

function setupLeaderboardFilters() {
    const searchInput = document.getElementById('searchInput');
    const batchFilter = document.getElementById('batchFilter');
    const sortBy = document.getElementById('sortBy');
    const exportBtn = document.getElementById('exportBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterLeaderboard);
    }
    
    if (batchFilter) {
        batchFilter.addEventListener('change', filterLeaderboard);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', filterLeaderboard);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportToCSV(filteredStudents);
            showNotification('Leaderboard exported successfully!');
        });
    }
}

function filterLeaderboard() {
    const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const batchFilter = document.getElementById('batchFilter')?.value || '';
    const sortBy = document.getElementById('sortBy')?.value || 'marks-desc';
    
    filteredStudents = allStudents.filter(student => {
        const matchSearch = student.name.toLowerCase().includes(searchInput);
        const matchBatch = !batchFilter || student.batch === batchFilter;
        return matchSearch && matchBatch;
    });
    
    // Sort
    switch(sortBy) {
        case 'marks-desc':
            filteredStudents.sort((a, b) => b.total - a.total);
            break;
        case 'marks-asc':
            filteredStudents.sort((a, b) => a.total - b.total);
            break;
        case 'name':
            filteredStudents.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    // Recalculate ranks
    filteredStudents.forEach((s, idx) => s.rank = idx + 1);
    
    currentPage = 1;
    displayLeaderboard();
}

function setupPaginationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayLeaderboard();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayLeaderboard();
            }
        });
    }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('leaderboardBody')) {
        loadLeaderboard();
        setupLeaderboardFilters();
        setupPaginationButtons();
    }
});
