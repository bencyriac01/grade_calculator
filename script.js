/* =====================================================
   STUDENT GRADE CALCULATOR - JAVASCRIPT LOGIC
   ===================================================== */

// ========== Global State & Constants ==========
const GRADE_POINTS = {
    '10': 4.0,
    '9': 3.7,
    '8': 3.3,
    '7': 3.0,
    '6': 2.7,
    '5': 2.3,
    '4': 2.0,
    '0': 0.0
};

const GRADE_LABELS = {
    '10': 'A+ (10)',
    '9': 'A (9)',
    '8': 'B+ (8)',
    '7': 'B (7)',
    '6': 'C+ (6)',
    '5': 'C (5)',
    '4': 'D (4)',
    '0': 'F (0)'
};

let appState = {
    studentName: '',
    studentRoll: '',
    currentSemester: null,
    semesters: {},
    currentSubjects: [],
    targetCGPA: 8.5,
    charts: {}
};

const LOCAL_STORAGE_KEY = 'gradeCalculatorData';

// ========== Initialize Application ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadFromLocalStorage();
    setupEventListeners();
    initializeTheme();
    updateAllDisplays();
    renderSemesterSelect();
    displayPremiumWeather();
}

// ========== Premium Animated Weather Widget ==========
function displayPremiumWeather() {
    const weatherContent = document.getElementById('weatherContent');

    // Premium weather data (mock)
    const weatherData = {
        temp: 24,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        feelsLike: 23,
        pressure: 1013,
        location: 'Study Room',
        icon: '⛅'
    };

    weatherContent.innerHTML = `
        <div class="weather-premium-container">
            <div class="weather-primary">
                <div class="weather-icon-premium">${weatherData.icon}</div>
                <div class="weather-main-info">
                    <div class="weather-temp-premium">${weatherData.temp}°</div>
                    <div class="weather-condition">${weatherData.condition}</div>
                    <div class="weather-location-premium">📍 ${weatherData.location}</div>
                </div>
            </div>
            <div class="weather-secondary">
                <div class="weather-stat-item">
                    <div class="stat-label">Humidity</div>
                    <div class="stat-value">${weatherData.humidity}%</div>
                    <div class="stat-bar">
                        <div class="stat-bar-fill" style="width: ${weatherData.humidity}%"></div>
                    </div>
                </div>
                <div class="weather-stat-item">
                    <div class="stat-label">Wind Speed</div>
                    <div class="stat-value">${weatherData.windSpeed} km/h</div>
                    <div class="stat-bar">
                        <div class="stat-bar-fill" style="width: ${(weatherData.windSpeed / 40) * 100}%"></div>
                    </div>
                </div>
                <div class="weather-stat-item">
                    <div class="stat-label">Feels Like</div>
                    <div class="stat-value">${weatherData.feelsLike}°C</div>
                </div>
            </div>
        </div>
    `;

    // Trigger animations
    setTimeout(() => {
        weatherContent.querySelectorAll('.weather-stat-item').forEach((item, index) => {
            item.style.animation = `slideUp 0.6s ease-out ${index * 0.1}s both`;
        });
    }, 100);
}

// ========== Theme Management ==========
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-theme');
    document.getElementById('themeToggle').innerHTML = isDark ? '☀️' : '🌙';
}

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
});

// ========== Navigation Setup ==========
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => handleNavigation(e.target.closest('.nav-item')));
    });

    // Profile Inputs
    document.getElementById('studentName').addEventListener('change', (e) => {
        appState.studentName = e.target.value;
        saveToLocalStorage();
    });

    document.getElementById('studentRoll').addEventListener('change', (e) => {
        appState.studentRoll = e.target.value;
        saveToLocalStorage();
    });

    // SGPA Calculator
    document.getElementById('addSubjectBtn').addEventListener('click', addSubject);
    document.getElementById('saveSemesterBtn').addEventListener('click', saveSemester);
    document.getElementById('newSemesterBtn').addEventListener('click', createNewSemester);

    // CGPA Calculator
    document.getElementById('predictCGPABtn').addEventListener('click', predictCGPA);

    // Goal Tracking
    document.getElementById('updateGoal').addEventListener('click', updateGoal);

    // Export/Import
    document.getElementById('exportPDFBtn').addEventListener('click', exportToPDF);
    document.getElementById('exportJSONBtn').addEventListener('click', exportJSON);
    document.getElementById('importJSONBtn').addEventListener('click', () => {
        document.getElementById('importFileInput').click();
    });

    document.getElementById('importFileInput').addEventListener('change', importJSON);

    // Reset
    document.getElementById('resetData').addEventListener('click', resetAllData);

    // Subject input enter key
    document.getElementById('subjectGrade').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addSubject();
    });
}

function handleNavigation(element) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');

    // Show section
    const sectionId = element.dataset.section;
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    // Initialize charts if analytics section
    if (sectionId === 'analytics') {
        setTimeout(initializeCharts, 100);
    }
}

// ========== Profile Management ==========
function loadProfileData() {
    document.getElementById('studentName').value = appState.studentName;
    document.getElementById('studentRoll').value = appState.studentRoll;
}

// ========== SGPA Calculator Functions ==========
function addSubject() {
    const name = document.getElementById('subjectName').value.trim();
    const credit = parseInt(document.getElementById('subjectCredit').value);
    const grade = document.getElementById('subjectGrade').value;

    if (!name || !credit || !grade) {
        showToast('Please fill all fields', 'error');
        return;
    }

    if (credit < 1 || credit > 6) {
        showToast('Credits must be between 1 and 6', 'error');
        return;
    }

    const subject = {
        id: Date.now(),
        name,
        credit,
        grade: parseInt(grade),
        gradePoint: GRADE_POINTS[grade]
    };

    appState.currentSubjects.push(subject);
    clearSubjectForm();
    renderSubjectsTable();
    calculateSGPA();
    saveToLocalStorage();
}

function removeSubject(id) {
    appState.currentSubjects = appState.currentSubjects.filter(s => s.id !== id);
    renderSubjectsTable();
    calculateSGPA();
    saveToLocalStorage();
}

function editSubject(id) {
    const subject = appState.currentSubjects.find(s => s.id === id);
    if (subject) {
        document.getElementById('subjectName').value = subject.name;
        document.getElementById('subjectCredit').value = subject.credit;
        document.getElementById('subjectGrade').value = subject.grade;
        removeSubject(id);
        document.getElementById('subjectName').focus();
    }
}

function clearSubjectForm() {
    document.getElementById('subjectName').value = '';
    document.getElementById('subjectCredit').value = '';
    document.getElementById('subjectGrade').value = '';
    document.getElementById('subjectName').focus();
}

function renderSubjectsTable() {
    const tbody = document.getElementById('subjectsTableBody');

    if (appState.currentSubjects.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No subjects added yet</td></tr>';
        return;
    }

    tbody.innerHTML = appState.currentSubjects.map(subject => `
        <tr>
            <td>${subject.name}</td>
            <td>${subject.credit}</td>
            <td>${GRADE_LABELS[subject.grade]}</td>
            <td>${subject.gradePoint.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-edit" onclick="editSubject(${subject.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="removeSubject(${subject.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function calculateSGPA() {
    if (appState.currentSubjects.length === 0) {
        document.getElementById('sgpaValue').textContent = '0.00';
        document.getElementById('sgpaDetails').textContent = 'Add subjects to calculate';
        return;
    }

    let totalCredits = 0;
    let totalGradePoints = 0;

    appState.currentSubjects.forEach(subject => {
        totalCredits += subject.credit;
        totalGradePoints += subject.gradePoint * subject.credit;
    });

    const sgpa = totalGradePoints / totalCredits;
    document.getElementById('sgpaValue').textContent = sgpa.toFixed(2);
    document.getElementById('sgpaDetails').textContent =
        `${appState.currentSubjects.length} subjects | ${totalCredits} credits`;
}

// ========== Semester Management ==========
function createNewSemester() {
    const semesterNumber = Object.keys(appState.semesters).length + 1;
    const semesterId = `semester_${Date.now()}`;

    appState.semesters[semesterId] = {
        id: semesterId,
        name: `Semester ${semesterNumber}`,
        sgpa: 0,
        credits: 0,
        subjects: [],
        date: new Date().toLocaleDateString()
    };

    appState.currentSemester = semesterId;
    appState.currentSubjects = [];

    clearSubjectForm();
    renderSubjectsTable();
    renderSemesterSelect();
    calculateSGPA();
    saveToLocalStorage();
    showToast(`${appState.semesters[semesterId].name} created`, 'success');
}

function saveSemester() {
    if (!appState.currentSemester) {
        showToast('Please create a semester first', 'error');
        return;
    }

    if (appState.currentSubjects.length === 0) {
        showToast('Please add subjects before saving', 'error');
        return;
    }

    let totalCredits = 0;
    let totalGradePoints = 0;

    appState.currentSubjects.forEach(subject => {
        totalCredits += subject.credit;
        totalGradePoints += subject.gradePoint * subject.credit;
    });

    const sgpa = totalGradePoints / totalCredits;

    appState.semesters[appState.currentSemester].subjects = [...appState.currentSubjects];
    appState.semesters[appState.currentSemester].sgpa = sgpa;
    appState.semesters[appState.currentSemester].credits = totalCredits;

    appState.currentSubjects = [];
    appState.currentSemester = null;

    clearSubjectForm();
    renderSubjectsTable();
    renderSemesterSelect();
    updateAllDisplays();
    saveToLocalStorage();
    showToast('Semester saved successfully', 'success');
}

function renderSemesterSelect() {
    const select = document.getElementById('semesterSelect');
    const currentValue = select.value;

    select.innerHTML = '<option value="">Create New Semester</option>';

    Object.values(appState.semesters).forEach((semester, index) => {
        const option = document.createElement('option');
        option.value = semester.id;
        option.textContent = semester.name;
        select.appendChild(option);
    });

    select.value = currentValue;
    select.addEventListener('change', (e) => {
        if (e.target.value) {
            loadSemester(e.target.value);
        } else {
            createNewSemester();
        }
    });
}

function loadSemester(semesterId) {
    const semester = appState.semesters[semesterId];
    appState.currentSemester = semesterId;
    appState.currentSubjects = [...semester.subjects];
    renderSubjectsTable();
    calculateSGPA();
}

function deleteSemester(semesterId) {
    if (confirm('Are you sure you want to delete this semester?')) {
        delete appState.semesters[semesterId];
        if (appState.currentSemester === semesterId) {
            appState.currentSemester = null;
            appState.currentSubjects = [];
            clearSubjectForm();
            renderSubjectsTable();
            calculateSGPA();
        }
        renderSemesterSelect();
        updateAllDisplays();
        saveToLocalStorage();
        showToast('Semester deleted', 'success');
    }
}

// ========== CGPA Calculation ==========
function calculateCGPA() {
    const semesters = Object.values(appState.semesters);

    if (semesters.length === 0) {
        return { cgpa: 0, totalCredits: 0, semesters: 0 };
    }

    let totalGradePoints = 0;
    let totalCredits = 0;

    semesters.forEach(semester => {
        totalGradePoints += semester.sgpa * semester.credits;
        totalCredits += semester.credits;
    });

    const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    return {
        cgpa: cgpa,
        totalCredits: totalCredits,
        semesters: semesters.length
    };
}

function updateCGPADisplay() {
    const cgpaData = calculateCGPA();

    document.getElementById('dashboardCGPA').textContent = cgpaData.cgpa.toFixed(2);
    document.getElementById('totalCredits').textContent = cgpaData.totalCredits;
    document.getElementById('totalSemesters').textContent = cgpaData.semesters;
    document.getElementById('cgpaValue').textContent = cgpaData.cgpa.toFixed(2);

    // Calculate percentage
    const percentage = (cgpaData.cgpa / 4.0) * 100;
    document.getElementById('cgpaPercentage').textContent = percentage.toFixed(2) + '%';
    document.getElementById('totalCreditsDisplay').textContent = cgpaData.totalCredits;

    // Update progress bar
    const cgpaProgress = (cgpaData.cgpa / 4.0) * 100;
    const progressBar = document.getElementById('cgpaProgress');
    if (progressBar) {
        progressBar.style.setProperty('--progress-width', cgpaProgress + '%');
        progressBar.style.width = cgpaProgress + '%';
    }

    // Update semester CGPA inputs
    renderSemestersCGPAList();
}

function renderSemestersCGPAList() {
    const container = document.getElementById('semestersCGPAList');
    const semesters = Object.values(appState.semesters);

    if (semesters.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No semesters added yet</p>';
        return;
    }

    container.innerHTML = semesters.map(semester => `
        <div class="semester-cgpa-item">
            <div>
                <strong>${semester.name}</strong>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">${semester.date}</div>
            </div>
            <div>
                <span style="color: var(--text-secondary);">SGPA: </span>
                <strong style="color: var(--primary-color);">${semester.sgpa.toFixed(2)}</strong>
                <span style="margin-left: 1rem; color: var(--text-secondary);">Credits: </span>
                <strong>${semester.credits}</strong>
            </div>
            <button class="btn-small btn-delete" onclick="deleteSemester('${semester.id}')">Delete</button>
        </div>
    `).join('');
}

// ========== CGPA Predictor ==========
function predictCGPA() {
    const currentCGPA = calculateCGPA().cgpa;
    const currentCredits = calculateCGPA().totalCredits;
    const predictedSGPA = parseFloat(document.getElementById('predictedSGPA').value);
    const predictedCredits = parseInt(document.getElementById('predictedCredits').value);

    if (!predictedSGPA || !predictedCredits) {
        showToast('Please enter SGPA and credits', 'error');
        return;
    }

    const futureGradePoints = currentCGPA * currentCredits + predictedSGPA * predictedCredits;
    const totalCredits = currentCredits + predictedCredits;
    const futureCGPA = futureGradePoints / totalCredits;

    const resultDiv = document.querySelector('.predictor-result');
    const difference = futureCGPA - currentCGPA;
    const change = difference >= 0 ? '📈 Increase' : '📉 Decrease';

    resultDiv.innerHTML = `
        <div style="text-align: center; width: 100%;">
            <p style="margin-bottom: 0.5rem;">Your predicted CGPA after next semester:</p>
            <div style="font-size: 2rem; color: var(--primary-color); font-weight: 700; margin: 0.5rem 0;">
                ${futureCGPA.toFixed(2)}
            </div>
            <p style="color: var(--success-color); margin: 0.5rem 0;">
                ${change}: ${Math.abs(difference).toFixed(2)} points
            </p>
        </div>
    `;
}

// ========== Goal Tracking ==========
function updateGoal() {
    const targetCGPA = parseFloat(document.getElementById('targetCGPA').value);

    if (isNaN(targetCGPA) || targetCGPA < 0 || targetCGPA > 10) {
        showToast('Please enter a valid target CGPA (0-10)', 'error');
        return;
    }

    appState.targetCGPA = targetCGPA;
    updateGoalProgress();
    saveToLocalStorage();
    showToast('Goal updated', 'success');
}

function updateGoalProgress() {
    const currentCGPA = calculateCGPA().cgpa;
    const targetCGPA = appState.targetCGPA;
    const progress = (currentCGPA / targetCGPA) * 100;

    const goalProgressBar = document.getElementById('goalProgressBar');
    if (goalProgressBar) {
        goalProgressBar.style.width = Math.min(progress, 100) + '%';
    }

    const goalText = document.getElementById('goalText');
    if (goalText) {
        const remaining = Math.max(0, targetCGPA - currentCGPA);
        const status = progress >= 100 ? '✅ Goal Achieved!' :
            `${remaining.toFixed(2)} CGPA points to reach ${targetCGPA}`;
        goalText.textContent = status;
    }
}

// ========== Dashboard Updates ==========
function updateDashboard() {
    const semesters = Object.values(appState.semesters);

    if (semesters.length === 0) {
        document.getElementById('highestSGPA').textContent = '-';
        document.getElementById('lowestSGPA').textContent = '-';
        document.getElementById('avgSGPA').textContent = '0.00';
        document.getElementById('academicStatus').textContent = 'Add semesters to get started';
        return;
    }

    const sgpas = semesters.map(s => s.sgpa);
    const highestSGPA = Math.max(...sgpas);
    const lowestSGPA = Math.min(...sgpas);
    const avgSGPA = sgpas.reduce((a, b) => a + b, 0) / sgpas.length;

    document.getElementById('highestSGPA').textContent = highestSGPA.toFixed(2);
    document.getElementById('lowestSGPA').textContent = lowestSGPA.toFixed(2);
    document.getElementById('avgSGPA').textContent = avgSGPA.toFixed(2);

    // Academic Status
    const cgpa = calculateCGPA().cgpa;
    let status = '';
    if (cgpa >= 9.0) status = '🌟 Excellent';
    else if (cgpa >= 8.0) status = '⭐ Very Good';
    else if (cgpa >= 7.0) status = '👍 Good';
    else if (cgpa >= 6.0) status = '📈 Average';
    else status = '💪 Keep Improving';

    document.getElementById('academicStatus').textContent = status;
}

function updateSemesterTracker() {
    const semesters = Object.values(appState.semesters).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });

    // Update timeline
    const timeline = document.getElementById('semesterTimeline');
    timeline.innerHTML = semesters.map((semester, index) => `
        <div class="timeline-item">
            <div class="timeline-item-label">Sem ${index + 1}</div>
            <div class="timeline-item-value">${semester.sgpa.toFixed(2)}</div>
        </div>
    `).join('');

    // Update semester cards
    const container = document.getElementById('semesterCardsContainer');
    container.innerHTML = semesters.map((semester, index) => `
        <div class="semester-card glass-effect">
            <div class="semester-card-header">
                <div class="semester-card-title">
                    ${semester.name}
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">
                        ${semester.date}
                    </div>
                </div>
                <div class="semester-card-actions">
                    <button class="btn-small btn-delete" onclick="deleteSemester('${semester.id}')">Delete</button>
                </div>
            </div>
            <div class="semester-card-content">
                <div class="card-stat">
                    <div class="card-stat-label">SGPA</div>
                    <div class="card-stat-value">${semester.sgpa.toFixed(2)}</div>
                </div>
                <div class="card-stat">
                    <div class="card-stat-label">Credits</div>
                    <div class="card-stat-value">${semester.credits}</div>
                </div>
                <div class="card-stat">
                    <div class="card-stat-label">Subjects</div>
                    <div class="card-stat-value">${semester.subjects.length}</div>
                </div>
                <div class="card-stat">
                    <div class="card-stat-label">Avg Grade</div>
                    <div class="card-stat-value">${(semester.sgpa / 4.0 * 100).toFixed(0)}%</div>
                </div>
            </div>
        </div>
    `).join('');

    // Update comparison
    if (semesters.length > 0) {
        const sgpas = semesters.map(s => s.sgpa);
        const bestSem = semesters[sgpas.indexOf(Math.max(...sgpas))];
        const mostCreditsSem = semesters.reduce((prev, current) =>
            (prev.credits > current.credits) ? prev : current
        );

        document.getElementById('bestSemester').textContent = `${bestSem.name} (${bestSem.sgpa.toFixed(2)})`;
        document.getElementById('mostCredits').textContent = `${mostCreditsSem.name} (${mostCreditsSem.credits} credits)`;
        document.getElementById('avgDuration').textContent = `${(semesters.length * 6).toFixed(0)} months`;
    }
}

// ========== Charts Initialization ==========
let chartInstances = {};

function initializeCharts() {
    const semesters = Object.values(appState.semesters).sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    if (semesters.length === 0) {
        document.querySelectorAll('.chart-card canvas').forEach(canvas => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'var(--text-secondary)';
            ctx.textAlign = 'center';
            ctx.fillText('Add semesters to view charts', canvas.width / 2, canvas.height / 2);
        });
        return;
    }

    // CGPA Growth Chart
    createCGPAGrowthChart(semesters);

    // Semester Performance Chart
    createSemesterPerformanceChart(semesters);

    // Credits Distribution Chart
    createCreditsDistributionChart(semesters);

    // Grade Distribution Chart
    createGradeDistributionChart();
}

function createCGPAGrowthChart(semesters) {
    const canvas = document.getElementById('cgpaGrowthChart');

    // Destroy existing chart
    if (chartInstances.cgpaGrowth) {
        chartInstances.cgpaGrowth.destroy();
    }

    let cumulativeCGPA = [];
    let totalCredits = 0;
    let totalGradePoints = 0;

    semesters.forEach(semester => {
        totalGradePoints += semester.sgpa * semester.credits;
        totalCredits += semester.credits;
        cumulativeCGPA.push((totalGradePoints / totalCredits).toFixed(2));
    });

    chartInstances.cgpaGrowth = new Chart(canvas, {
        type: 'line',
        data: {
            labels: semesters.map((s, i) => `Sem ${i + 1}`),
            datasets: [{
                label: 'CGPA Trend',
                data: cumulativeCGPA,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-primary'),
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4.0,
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
                    },
                    grid: {
                        color: 'rgba(99, 102, 241, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createSemesterPerformanceChart(semesters) {
    const canvas = document.getElementById('semesterPerformanceChart');

    if (chartInstances.semesterPerformance) {
        chartInstances.semesterPerformance.destroy();
    }

    chartInstances.semesterPerformance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: semesters.map((s, i) => `Sem ${i + 1}`),
            datasets: [{
                label: 'SGPA',
                data: semesters.map(s => s.sgpa.toFixed(2)),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-primary')
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4.0,
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
                    },
                    grid: {
                        color: 'rgba(99, 102, 241, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createCreditsDistributionChart(semesters) {
    const canvas = document.getElementById('creditsDistributionChart');

    if (chartInstances.creditsDistribution) {
        chartInstances.creditsDistribution.destroy();
    }

    chartInstances.creditsDistribution = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: semesters.map((s, i) => `${s.name}: ${s.credits}c`),
            datasets: [{
                data: semesters.map(s => s.credits),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderColor: getComputedStyle(document.body).getPropertyValue('--bg-primary'),
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-primary')
                    }
                }
            }
        }
    });
}

function createGradeDistributionChart() {
    const canvas = document.getElementById('gradeDistributionChart');

    if (chartInstances.gradeDistribution) {
        chartInstances.gradeDistribution.destroy();
    }

    const allSubjects = Object.values(appState.semesters)
        .flatMap(sem => sem.subjects);

    const gradeCount = {};
    Object.keys(GRADE_LABELS).forEach(grade => {
        gradeCount[grade] = allSubjects.filter(s => s.grade === parseInt(grade)).length;
    });

    chartInstances.gradeDistribution = new Chart(canvas, {
        type: 'radar',
        data: {
            labels: Object.values(GRADE_LABELS),
            datasets: [{
                label: 'Grade Count',
                data: Object.keys(GRADE_LABELS).map(g => gradeCount[g]),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: '#6366f1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-primary')
                    }
                }
            },
            scales: {
                r: {
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary')
                    },
                    grid: {
                        color: 'rgba(99, 102, 241, 0.1)'
                    }
                }
            }
        }
    });
}

// ========== Export Functions ==========
function exportToPDF() {
    const element = document.querySelector('.main-content');
    const opt = {
        margin: 10,
        filename: 'grade-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
    showToast('Report exported as PDF', 'success');
}

function exportJSON() {
    const dataToExport = {
        appState: appState,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grade-data-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Data exported successfully', 'success');
}

function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            appState = data.appState;
            saveToLocalStorage();
            updateAllDisplays();
            showToast('Data imported successfully', 'success');
            window.location.reload();
        } catch (error) {
            showToast('Error importing file: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

// ========== Local Storage Functions ==========
function saveToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appState));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            appState = JSON.parse(saved);
            loadProfileData();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
}

// ========== Reset Function ==========
function resetAllData() {
    if (confirm('Are you sure? This will delete all your data permanently.')) {
        appState = {
            studentName: '',
            studentRoll: '',
            currentSemester: null,
            semesters: {},
            currentSubjects: [],
            targetCGPA: 8.5
        };
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        clearSubjectForm();
        renderSubjectsTable();
        calculateSGPA();
        renderSemesterSelect();
        updateAllDisplays();
        loadProfileData();
        showToast('All data has been reset', 'success');
    }
}

// ========== Toast Notification ==========
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show`;

    // Color based on type
    const bgColor = {
        'success': '#10b981',
        'error': '#ef4444',
        'info': '#6366f1'
    };

    toast.style.background = bgColor[type] || bgColor['info'];

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== Update All Displays ==========
function updateAllDisplays() {
    updateCGPADisplay();
    updateDashboard();
    updateSemesterTracker();
    updateGoalProgress();
    loadProfileData();
    renderSemestersCGPAList();
}

// ========== Utility Functions ==========
function getGradeLabel(grade) {
    return GRADE_LABELS[grade] || 'Unknown';
}

function getGradePoint(grade) {
    return GRADE_POINTS[grade] || 0;
}

// ========== Animation & Smooth Loading ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Smooth page transitions
document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('.nav-item') || target.closest('.nav-item')) {
        const section = target.closest('.nav-item').dataset.section;
        if (section !== 'analytics') {
            // Smooth scroll to top
            document.querySelector('.main-content').scrollTop = 0;
        }
    }
});

// Initialize on load
window.addEventListener('load', () => {
    updateAllDisplays();
});
