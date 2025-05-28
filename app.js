// Data storage
let workoutData = [];
let nutritionData = [];
let waterData = [];
let dailyWater = 0;

// DOM Elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const workoutForm = document.getElementById('workout-form');
const nutritionForm = document.getElementById('nutrition-form');
const workoutLog = document.getElementById('workout-log');
const nutritionLog = document.getElementById('nutrition-log');
const waterLog = document.getElementById('water-log');
const recentActivity = document.getElementById('recent-activity');
const waterFill = document.getElementById('water-fill');
const waterFillDetail = document.getElementById('water-fill-detail');
const currentWater = document.getElementById('current-water');
const currentWaterDetail = document.getElementById('current-water-detail');
const resetWaterBtn = document.getElementById('reset-water');

// Stats elements
const totalWorkoutsEl = document.getElementById('total-workouts');
const totalCaloriesEl = document.getElementById('total-calories');
const totalWaterEl = document.getElementById('total-water');
const totalProteinEl = document.getElementById('total-protein');

// Tab switching functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Workout form submission
workoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const exercise = document.getElementById('exercise').value;
    const sets = parseInt(document.getElementById('sets').value);
    const reps = parseInt(document.getElementById('reps').value);
    const weight = parseFloat(document.getElementById('weight').value);
    
    const workout = {
        id: Date.now(),
        exercise,
        sets,
        reps,
        weight,
        timestamp: new Date().toLocaleTimeString()
    };
    
    workoutData.push(workout);
    saveData();
    renderWorkoutLog();
    renderRecentActivity();
    updateStats();
    workoutForm.reset();
});

// Nutrition form submission
nutritionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const food = document.getElementById('food').value;
    const calories = parseInt(document.getElementById('calories').value);
    const protein = parseFloat(document.getElementById('protein').value);
    const carbs = parseFloat(document.getElementById('carbs').value);
    const fat = parseFloat(document.getElementById('fat').value);
    
    const nutrition = {
        id: Date.now(),
        food,
        calories,
        protein,
        carbs,
        fat,
        timestamp: new Date().toLocaleTimeString()
    };
    
    nutritionData.push(nutrition);
    saveData();
    renderNutritionLog();
    renderRecentActivity();
    updateStats();
    nutritionForm.reset();
});

// Add water functionality
function addWater(amount) {
    dailyWater += amount;
    waterData.push({
        id: Date.now(),
        amount,
        timestamp: new Date().toLocaleTimeString()
    });
    
    saveData();
    renderWaterLog();
    updateWaterDisplay();
    renderRecentActivity();
    updateStats();
}

// Set up water buttons
document.getElementById('add-100ml').addEventListener('click', () => addWater(100));
document.getElementById('add-250ml').addEventListener('click', () => addWater(250));
document.getElementById('add-500ml').addEventListener('click', () => addWater(500));
document.getElementById('add-100ml-detail').addEventListener('click', () => addWater(100));
document.getElementById('add-250ml-detail').addEventListener('click', () => addWater(250));
document.getElementById('add-500ml-detail').addEventListener('click', () => addWater(500));

// Reset water button
resetWaterBtn.addEventListener('click', () => {
    dailyWater = 0;
    waterData = [];
    saveData();
    renderWaterLog();
    updateWaterDisplay();
    renderRecentActivity();
    updateStats();
});

// Delete workout
function deleteWorkout(id) {
    workoutData = workoutData.filter(workout => workout.id !== id);
    saveData();
    renderWorkoutLog();
    renderRecentActivity();
    updateStats();
}

// Delete nutrition
function deleteNutrition(id) {
    nutritionData = nutritionData.filter(nutrition => nutrition.id !== id);
    saveData();
    renderNutritionLog();
    renderRecentActivity();
    updateStats();
}

// Delete water entry
function deleteWaterEntry(id) {
    const entry = waterData.find(w => w.id === id);
    if (entry) {
        dailyWater -= entry.amount;
        waterData = waterData.filter(w => w.id !== id);
        saveData();
        renderWaterLog();
        updateWaterDisplay();
        renderRecentActivity();
        updateStats();
    }
}

// Render workout log
function renderWorkoutLog() {
    if (workoutData.length === 0) {
        workoutLog.innerHTML = '<div class="log-item"><p>No workouts logged today</p></div>';
        return;
    }
    
    workoutLog.innerHTML = '';
    workoutData.forEach(workout => {
        const workoutEl = document.createElement('div');
        workoutEl.className = 'log-item';
        workoutEl.innerHTML = `
            <div class="log-details">
                <div class="log-title">${workout.exercise}</div>
                <div class="log-stats">
                    <span>${workout.sets} sets</span>
                    <span>${workout.reps} reps</span>
                    <span>${workout.weight} kg</span>
                </div>
            </div>
            <button class="delete-btn" data-id="${workout.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        workoutLog.appendChild(workoutEl);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('#workout-log .delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            deleteWorkout(id);
        });
    });
}

// Render nutrition log
function renderNutritionLog() {
    if (nutritionData.length === 0) {
        nutritionLog.innerHTML = '<div class="log-item"><p>No nutrition logged today</p></div>';
        return;
    }
    
    nutritionLog.innerHTML = '';
    nutritionData.forEach(nutrition => {
        const nutritionEl = document.createElement('div');
        nutritionEl.className = 'log-item';
        nutritionEl.innerHTML = `
            <div class="log-details">
                <div class="log-title">${nutrition.food}</div>
                <div class="log-stats">
                    <span>${nutrition.calories} cal</span>
                    <span>P: ${nutrition.protein}g</span>
                    <span>C: ${nutrition.carbs}g</span>
                    <span>F: ${nutrition.fat}g</span>
                </div>
            </div>
            <button class="delete-btn" data-id="${nutrition.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        nutritionLog.appendChild(nutritionEl);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('#nutrition-log .delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            deleteNutrition(id);
        });
    });
}

// Render water log
function renderWaterLog() {
    if (waterData.length === 0) {
        waterLog.innerHTML = '<div class="log-item"><p>No water logged today</p></div>';
        return;
    }
    
    waterLog.innerHTML = '';
    waterData.forEach(water => {
        const waterEl = document.createElement('div');
        waterEl.className = 'log-item';
        waterEl.innerHTML = `
            <div class="log-details">
                <div class="log-title">+${water.amount} ml</div>
                <div class="log-stats">${water.timestamp}</div>
            </div>
            <button class="delete-btn" data-id="${water.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        waterLog.appendChild(waterEl);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('#water-log .delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            deleteWaterEntry(id);
        });
    });
}

// Render recent activity
function renderRecentActivity() {
    if (workoutData.length === 0 && nutritionData.length === 0 && waterData.length === 0) {
        recentActivity.innerHTML = '<div class="log-item"><p>No recent activity</p></div>';
        return;
    }
    
    // Combine all data and sort by timestamp
    const allData = [
        ...workoutData.map(item => ({...item, type: 'workout'})),
        ...nutritionData.map(item => ({...item, type: 'nutrition'})),
        ...waterData.map(item => ({...item, type: 'water'}))
    ].sort((a, b) => b.id - a.id);
    
    recentActivity.innerHTML = '';
    
    // Show only the 5 most recent items
    const recentItems = allData.slice(0, 5);
    
    recentItems.forEach(item => {
        const activityEl = document.createElement('div');
        activityEl.className = 'log-item';
        
        let content = '';
        if (item.type === 'workout') {
            content = `
                <div class="log-title">
                    <i class="fas fa-running"></i> ${item.exercise}
                </div>
                <div class="log-stats">
                    ${item.sets} sets × ${item.reps} reps (${item.weight}kg)
                </div>
            `;
        } else if (item.type === 'nutrition') {
            content = `
                <div class="log-title">
                    <i class="fas fa-utensils"></i> ${item.food}
                </div>
                <div class="log-stats">
                    ${item.calories} cal | P:${item.protein}g C:${item.carbs}g F:${item.fat}g
                </div>
            `;
        } else if (item.type === 'water') {
            content = `
                <div class="log-title">
                    <i class="fas fa-tint"></i> +${item.amount} ml water
                </div>
                <div class="log-stats">${item.timestamp}</div>
            `;
        }
        
        activityEl.innerHTML = `
            <div class="log-details">
                ${content}
            </div>
        `;
        
        recentActivity.appendChild(activityEl);
    });
}

// Update water display
function updateWaterDisplay() {
    const waterGoal = 2000;
    const percent = Math.min(100, (dailyWater / waterGoal) * 100);
    
    waterFill.style.height = `${percent}%`;
    waterFillDetail.style.height = `${percent}%`;
    currentWater.textContent = dailyWater;
    currentWaterDetail.textContent = dailyWater;
}

// Update stats
function updateStats() {
    totalWorkoutsEl.textContent = workoutData.length;
    
    const totalCalories = nutritionData.reduce((sum, item) => sum + item.calories, 0);
    totalCaloriesEl.textContent = totalCalories;
    
    totalWaterEl.textContent = dailyWater;
    
    const totalProtein = nutritionData.reduce((sum, item) => sum + item.protein, 0);
    totalProteinEl.textContent = totalProtein.toFixed(1);
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('fitpro-workout', JSON.stringify(workoutData));
    localStorage.setItem('fitpro-nutrition', JSON.stringify(nutritionData));
    localStorage.setItem('fitpro-water', JSON.stringify(waterData));
    localStorage.setItem('fitpro-dailyWater', dailyWater.toString());
}

// Load data from localStorage
function loadData() {
    const savedWorkout = localStorage.getItem('fitpro-workout');
    const savedNutrition = localStorage.getItem('fitpro-nutrition');
    const savedWater = localStorage.getItem('fitpro-water');
    const savedDailyWater = localStorage.getItem('fitpro-dailyWater');
    
    if (savedWorkout) workoutData = JSON.parse(savedWorkout);
    if (savedNutrition) nutritionData = JSON.parse(savedNutrition);
    if (savedWater) waterData = JSON.parse(savedWater);
    if (savedDailyWater) dailyWater = parseInt(savedDailyWater);
    
    renderWorkoutLog();
    renderNutritionLog();
    renderWaterLog();
    updateWaterDisplay();
    renderRecentActivity();
    updateStats();
}

// Initialize the app
function init() {
    loadData();
}

// Start the app
init();
