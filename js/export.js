// ============================================
// EXPORT FUNCTIONALITY
// ============================================

function exportToCSV(students, filename = 'jee_leaderboard.csv') {
    const headers = ['Rank', 'Name', 'Roll No', 'Batch', 'Physics', 'Chemistry', 'Mathematics', 'Total', 'Percentile'];
    const allScores = students.map(s => s.total);
    
    let csv = headers.join(',') + '\n';
    
    students.forEach((student, idx) => {
        const percentile = calculatePercentile(student.total, allScores);
        csv += [
            student.rank || idx + 1,
            `"${student.name}"`,
            student.roll || '',
            student.batch || '',
            student.physics,
            student.chemistry,
            student.mathematics,
            student.total,
            percentile
        ].join(',') + '\n';
    });
    
    downloadFile(csv, filename, 'text/csv');
}

function exportToPDF(students, filename = 'jee_leaderboard.pdf') {
    // Using a simple approach with basic HTML conversion
    let html = `
        <html>
        <head>
            <title>JEE Leaderboard</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #3056d3; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #3056d3; color: white; }
                tr:nth-child(even) { background-color: #f9fafb; }
            </style>
        </head>
        <body>
            <h1>JEE Student Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Physics</th>
                        <th>Chemistry</th>
                        <th>Mathematics</th>
                        <th>Total</th>
                        <th>Batch</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    students.forEach((student, idx) => {
        html += `
            <tr>
                <td>${student.rank || idx + 1}</td>
                <td>${student.name}</td>
                <td>${student.physics}</td>
                <td>${student.chemistry}</td>
                <td>${student.mathematics}</td>
                <td><strong>${student.total}</strong></td>
                <td>${student.batch}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    downloadFile(html, filename, 'text/html');
}
