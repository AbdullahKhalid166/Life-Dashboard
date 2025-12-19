// Calculator functions
function createMathCalculator() {
    return `
        <div class="calculator">
            <div id="display">
                <div class="input" id="calcInput"></div>
                <div class="output" id="calcOutput"></div>
            </div>
            <div class="buttons">
                <button onclick="calcAppend('7')">7</button>
                <button onclick="calcAppend('8')">8</button>
                <button onclick="calcAppend('9')">9</button>
                <button class="clear" onclick="calcClear()">C</button>
                <button onclick="calcAppend('4')">4</button>
                <button onclick="calcAppend('5')">5</button>
                <button onclick="calcAppend('6')">6</button>
                <button class="operator" onclick="calcAppend('*')">*</button>
                <button onclick="calcAppend('1')">1</button>
                <button onclick="calcAppend('2')">2</button>
                <button onclick="calcAppend('3')">3</button>
                <button class="operator" onclick="calcAppend('+')">+</button>
                <button class="equal" onclick="calcCalculate()">=</button>
                <button onclick="calcAppend('0')">0</button>
                <button class="operator" onclick="calcAppend('-')">-</button>
                <button class="operator" onclick="calcAppend('/')">/</button>
            </div>
        </div>
    `;
}

function createGPACalculator() {
    return `
        <div class="gpa-calculator">
            <h3>GPA Calculator</h3>
            <div id="gpaCourses">
                <div class="course">
                    <input type="text" placeholder="Course Name">
                    <input type="number" placeholder="Credits" min="1">
                    <select>
                        <option value="4.0">A</option>
                        <option value="3.7">A-</option>
                        <option value="3.3">B+</option>
                        <option value="3.0">B</option>
                        <option value="2.7">B-</option>
                        <option value="2.3">C+</option>
                        <option value="2.0">C</option>
                        <option value="1.7">C-</option>
                        <option value="1.3">D+</option>
                        <option value="1.0">D</option>
                        <option value="0.0">F</option>
                    </select>
                    <button onclick="removeCourse(this)">Remove</button>
                </div>
            </div>
            <button onclick="addCourse()">Add Course</button>
            <button onclick="calculateGPA()">Calculate GPA</button>
            <div id="gpaResult"></div>
        </div>
    `;
}


function calculateMath() {
    const input = document.getElementById('mathInput').value;
    try {
        const result = eval(input);
        document.getElementById('mathResult').innerHTML = `Result: ${result}`;
    } catch (e) {
        document.getElementById('mathResult').innerHTML = 'Error: Invalid expression';
    }
}

function addCourse() {
    const container = document.getElementById('gpaCourses');
    const course = document.createElement('div');
    course.className = 'course';
    course.innerHTML = `
        <input type="text" placeholder="Course Name">
        <input type="number" placeholder="Credits" min="1">
        <select>
            <option value="4.0">A</option>
            <option value="3.7">A-</option>
            <option value="3.3">B+</option>
            <option value="3.0">B</option>
            <option value="2.7">B-</option>
            <option value="2.3">C+</option>
            <option value="2.0">C</option>
            <option value="1.7">C-</option>
            <option value="1.3">D+</option>
            <option value="1.0">D</option>
            <option value="0.0">F</option>
        </select>
        <button onclick="removeCourse(this)">Remove</button>
    `;
    container.appendChild(course);
}

function removeCourse(btn) {
    btn.parentElement.remove();
}

function calculateGPA() {
    const courses = document.querySelectorAll('.course');
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(course => {
        const credits = parseFloat(course.querySelector('input[type="number"]').value);
        const grade = parseFloat(course.querySelector('select').value);
        if (!isNaN(credits) && !isNaN(grade)) {
            totalPoints += credits * grade;
            totalCredits += credits;
        }
    });
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    document.getElementById('gpaResult').innerHTML = `GPA: ${gpa}`;
}

// Calculator functions
function calcAppend(value) {
    const input = document.getElementById('calcInput');
    input.innerText += value;
}

function calcClear() {
    document.getElementById('calcInput').innerText = '';
    document.getElementById('calcOutput').innerText = '';
}

function calcCalculate() {
    const input = document.getElementById('calcInput').innerText;
    try {
        const result = eval(input);
        document.getElementById('calcOutput').innerText = result;
    } catch (e) {
        document.getElementById('calcOutput').innerText = 'Error';
    }
}
