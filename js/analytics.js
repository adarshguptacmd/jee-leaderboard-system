// ============================================
// ANALYTICS PAGE FUNCTIONALITY
// ============================================

let analyticsCharts = {};

function loadAnalytics() {
    const students = getAllStudents();
    const batchFilter = document.getElementById('batchFilterAnalytics');
    
    if (batchFilter) {
        const batches = getBatches();
        batches.forEach(batch => {
            const option = document.createElement('option');
            option.value = batch;
            option.textContent = batch;
            batchFilter.appendChild(option);
        });
        
        batchFilter.addEventListener('change', updateAnalytics);
    }
    
    updateAnalytics();
}

function updateAnalytics() {
    const batchFilter = document.getElementById('batchFilterAnalytics')?.value || '';
    const students = batchFilter ? getStudentsByBatch(batchFilter) : getAllStudents();
    
    if (students.length === 0) {
        showNotification('No data to display', 'error');
        return;
    }
    
    // Update statistics
    const stats = calculateStats(students);
    document.getElementById('avgScoreStats').textContent = stats.avg;
    document.getElementById('highestScore').textContent = stats.max;
    document.getElementById('lowestScore').textContent = stats.min;
    document.getElementById('totalStudentsStats').textContent = stats.count;
    
    // Subject-wise average
    const physicsAvg = Math.round(students.reduce((sum, s) => sum + s.physics, 0) / students.length);
    const chemistryAvg = Math.round(students.reduce((sum, s) => sum + s.chemistry, 0) / students.length);
    const mathsAvg = Math.round(students.reduce((sum, s) => sum + s.mathematics, 0) / students.length);
    
    document.getElementById('physicsAvg').textContent = physicsAvg;
    document.getElementById('chemistryAvg').textContent = chemistryAvg;
    document.getElementById('mathematicsAvg').textContent = mathsAvg;
    
    // Update bars
    document.getElementById('physicsBar').style.width = (physicsAvg) + '%';
    document.getElementById('chemistryBar').style.width = (chemistryAvg) + '%';
    document.getElementById('mathematicsBar').style.width = (mathsAvg) + '%';
    
    // Performance breakdown
    const excellent = students.filter(s => s.total >= 270).length;
    const veryGood = students.filter(s => s.total >= 240 && s.total < 270).length;
    const good = students.filter(s => s.total >= 210 && s.total < 240).length;
    const average = students.filter(s => s.total >= 180 && s.total < 210).length;
    const belowAverage = students.filter(s => s.total < 180).length;
    
    document.getElementById('excellent').textContent = excellent;
    document.getElementById('veryGood').textContent = veryGood;
    document.getElementById('good').textContent = good;
    document.getElementById('average').textContent = average;
    document.getElementById('belowAverage').textContent = belowAverage;
    
    // Update charts
    updateCharts(students);
}

function updateCharts(students) {
    // Score Distribution Chart
    const totals = students.map(s => s.total);
    const ctx1 = document.getElementById('scoreDistributionChart')?.getContext('2d');
    if (ctx1) {
        if (analyticsCharts.scoreDistribution) {
            analyticsCharts.scoreDistribution.destroy();
        }
        analyticsCharts.scoreDistribution = new Chart(ctx1, {
            type: 'histogram',
            data: {
                labels: ['0-50', '51-100', '101-150', '151-200', '201-250', '251-300'],
                datasets: [{
                    label: 'Number of Students',
                    data: [
                        students.filter(s => s.total >= 0 && s.total <= 50).length,
                        students.filter(s => s.total > 50 && s.total <= 100).length,
                        students.filter(s => s.total > 100 && s.total <= 150).length,
                        students.filter(s => s.total > 150 && s.total <= 200).length,
                        students.filter(s => s.total > 200 && s.total <= 250).length,
                        students.filter(s => s.total > 250 && s.total <= 300).length
                    ],
                    backgroundColor: 'rgba(48, 86, 211, 0.6)',
                    borderColor: 'rgb(48, 86, 211)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }
    
    // Subject Performance
    const ctx2 = document.getElementById('subjectPerformanceChart')?.getContext('2d');
    if (ctx2) {
        if (analyticsCharts.subjectPerformance) {
            analyticsCharts.subjectPerformance.destroy();
        }
        const physicsAvg = (students.reduce((sum, s) => sum + s.physics, 0) / students.length).toFixed(1);
        const chemistryAvg = (students.reduce((sum, s) => sum + s.chemistry, 0) / students.length).toFixed(1);
        const mathsAvg = (students.reduce((sum, s) => sum + s.mathematics, 0) / students.length).toFixed(1);
        
        analyticsCharts.subjectPerformance = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Physics', 'Chemistry', 'Mathematics'],
                datasets: [{
                    label: 'Average Score',
                    data: [physicsAvg, chemistryAvg, mathsAvg],
                    backgroundColor: [
                        'rgba(14, 165, 233, 0.6)',
                        'rgba(16, 185, 129, 0.6)',
                        'rgba(248, 113, 113, 0.6)'
                    ],
                    borderColor: [
                        'rgb(14, 165, 233)',
                        'rgb(16, 185, 129)',
                        'rgb(248, 113, 113)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, max: 100 }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Top 10 Students
    const ctx3 = document.getElementById('topStudentsChart')?.getContext('2d');
    if (ctx3) {
        if (analyticsCharts.topStudents) {
            analyticsCharts.topStudents.destroy();
        }
        const top10 = students.slice(0, 10);
        analyticsCharts.topStudents = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: top10.map(s => s.name.substring(0, 10)),
                datasets: [{
                    label: 'Total Score',
                    data: top10.map(s => s.total),
                    backgroundColor: 'rgba(48, 86, 211, 0.6)',
                    borderColor: 'rgb(48, 86, 211)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'x',
                responsive: true,
                scales: { y: { beginAtZero: true, max: 300 } },
                plugins: { legend: { display: false } }
            }
        });
    }
    
    // Score Range Distribution (Pie chart)
    const ctx4 = document.getElementById('rangeDistributionChart')?.getContext('2d');
    if (ctx4) {
        if (analyticsCharts.rangeDistribution) {
            analyticsCharts.rangeDistribution.destroy();
        }
        const excellent = students.filter(s => s.total >= 270).length;
        const veryGood = students.filter(s => s.total >= 240 && s.total < 270).length;
        const good = students.filter(s => s.total >= 210 && s.total < 240).length;
        const average = students.filter(s => s.total >= 180 && s.total < 210).length;
        const belowAverage = students.filter(s => s.total < 180).length;
        
        analyticsCharts.rangeDistribution = new Chart(ctx4, {
            type: 'doughnut',
            data: {
                labels: ['Excellent (270-300)', 'Very Good (240-269)', 'Good (210-239)', 'Average (180-209)', 'Below Average'],
                datasets: [{
                    data: [excellent, veryGood, good, average, belowAverage],
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.7)',
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(249, 115, 22, 0.7)',
                        'rgba(168, 85, 247, 0.7)',
                        'rgba(239, 68, 68, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('scoreDistributionChart')) {
        loadAnalytics();
    }
});
