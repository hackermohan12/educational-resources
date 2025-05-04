// DOM Elements
const homeElement = document.getElementById('home');
const quizElement = document.getElementById('quiz');
const endElement = document.getElementById('end');
const reviewElement = document.getElementById('review');
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionElement = document.getElementById('question');
const questionCounterElement = document.getElementById('question-counter');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const topicIndicatorElement = document.getElementById('topic-indicator');
const explanationContainer = document.getElementById('explanation-container');
const explanationText = document.getElementById('explanation-text');
const finalScoreElement = document.getElementById('final-score');
const correctCountElement = document.getElementById('correct-count');
const incorrectCountElement = document.getElementById('incorrect-count');
const unansweredCountElement = document.getElementById('unanswered-count');
const topicPerformanceElement = document.getElementById('topic-performance');
const reviewContainer = document.getElementById('review-container');
const choiceElements = Array.from(document.getElementsByClassName('choice-text'));
const topicButtons = Array.from(document.getElementsByClassName('topic-btn'));
const difficultyButtons = Array.from(document.getElementsByClassName('difficulty-btn'));

// Game variables
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let selectedTopic = '';
let selectedDifficulty = '';
let timer;
let timeLeft = 60;
let userAnswers = [];
let topicStats = {};

// Questions database
const questions = [
    // Programming in C
    {
        question: "Which of the following is not a valid data type in C?",
        choices: ["int", "float", "string", "char"],
        answer: 3,
        explanation: "In C, 'string' is not a built-in data type. Strings in C are represented as arrays of characters.",
        topic: "programming",
        difficulty: "easy"
    },
    {
        question: "What is the output of the following code?\n\nint x = 5;\nprintf(\"%d\", ++x);",
        choices: ["5", "6", "4", "Error"],
        answer: 2,
        explanation: "The prefix increment operator (++x) increments the value of x before it is used in the expression. So x becomes 6 before printing.",
        topic: "programming",
        difficulty: "easy"
    },
    {
        question: "Which of the following is used to dynamically allocate memory in C?",
        choices: ["new", "malloc()", "alloc()", "memalloc()"],
        answer: 2,
        explanation: "malloc() is a function in C used to dynamically allocate memory during program execution.",
        topic: "programming",
        difficulty: "medium"
    },
    {
        question: "What is a pointer in C?",
        choices: [
            "A keyword used for creating variables",
            "A variable that stores the address of another variable",
            "A function that points to another function",
            "A data type for storing large integers"
        ],
        answer: 2,
        explanation: "A pointer is a variable that stores the memory address of another variable.",
        topic: "programming",
        difficulty: "medium"
    },
    {
        question: "Which of the following is true about recursion in C?",
        choices: [
            "It is always more efficient than iteration",
            "It always requires less memory than iteration",
            "It involves a function calling itself",
            "It cannot be used to solve complex problems"
        ],
        answer: 3,
        explanation: "Recursion is a programming technique where a function calls itself to solve a problem.",
        topic: "programming",
        difficulty: "medium"
    },
    {
        question: "What will be the output of the following code?\n\nint main() {\n  int arr[5] = {1, 2, 3, 4, 5};\n  int *ptr = arr + 2;\n  printf(\"%d\", *ptr);\n  return 0;\n}",
        choices: ["1", "2", "3", "5"],
        answer: 3,
        explanation: "arr is the base address of the array. arr + 2 points to the third element (index 2) which is 3.",
        topic: "programming",
        difficulty: "hard"
    },
    {
        question: "Which of the following is NOT a storage class in C?",
        choices: ["auto", "register", "volatile", "extern"],
        answer: 3,
        explanation: "volatile is a type qualifier in C, not a storage class. The storage classes in C are auto, register, static, and extern.",
        topic: "programming",
        difficulty: "hard"
    },
    
    // Object-Oriented Programming
    {
        question: "What is encapsulation in OOP?",
        choices: [
            "The process of creating objects",
            "The bundling of data and methods that operate on that data",
            "The ability of a class to inherit from another class",
            "The ability to have multiple forms"
        ],
        answer: 2,
        explanation: "Encapsulation is the bundling of data (attributes) and methods that operate on that data within a single unit (class).",
        topic: "oop",
        difficulty: "easy"
    },
    {
        question: "Which of the following is a principle of OOP?",
        choices: ["Fragmentation", "Isolation", "Polymorphism", "Segregation"],
        answer: 3,
        explanation: "Polymorphism is one of the four main principles of OOP, along with encapsulation, inheritance, and abstraction.",
        topic: "oop",
        difficulty: "easy"
    },
    {
        question: "What is inheritance in OOP?",
        choices: [
            "The process of creating a new class from an existing class",
            "The process of hiding implementation details",
            "The process of creating objects",
            "The process of method overloading"
        ],
        answer: 1,
        explanation: "Inheritance is the mechanism by which a class (derived/child) can inherit properties and behaviors from another class (base/parent).",
        topic: "oop",
        difficulty: "medium"
    },
    {
        question: "What is method overriding in OOP?",
        choices: [
            "Creating multiple methods with the same name but different parameters",
            "Hiding a method in the parent class",
            "Providing a specific implementation of a method in a subclass that is already defined in its superclass",
            "Creating a method that cannot be changed"
        ],
        answer: 3,
        explanation: "Method overriding occurs when a subclass provides a specific implementation for a method that is already defined in its superclass.",
        topic: "oop",
        difficulty: "medium"
    },
    {
        question: "Which of the following best describes polymorphism?",
        choices: [
            "The ability to hide implementation details",
            "The ability to create multiple objects",
            "The ability to take on many forms",
            "The ability to inherit from multiple classes"
        ],
        answer: 3,
        explanation: "Polymorphism allows objects to be treated as instances of their parent class rather than their actual class, enabling the same method to behave differently based on the object calling it.",
        topic: "oop",
        difficulty: "medium"
    },
    {
        question: "What is the difference between an abstract class and an interface?",
        choices: [
            "Abstract classes can have method implementations while interfaces cannot",
            "Interfaces can be instantiated but abstract classes cannot",
            "A class can implement multiple abstract classes but only one interface",
            "Abstract classes support multiple inheritance while interfaces do not"
        ],
        answer: 1,
        explanation: "Abstract classes can have both abstract methods (without implementation) and concrete methods (with implementation), while interfaces traditionally contain only abstract methods (though this has changed in newer versions of some languages).",
        topic: "oop",
        difficulty: "hard"
    },
    {
        question: "What is the diamond problem in multiple inheritance?",
        choices: [
            "A problem related to memory allocation in diamond-shaped data structures",
            "An ambiguity that arises when two classes B and C inherit from A, and class D inherits from both B and C",
            "A problem in designing diamond-shaped class hierarchies",
            "A naming conflict when multiple classes have the same name"
        ],
        answer: 2,
        explanation: "The diamond problem occurs in multiple inheritance when a class inherits from two classes that both inherit from a common base class, creating ambiguity about which implementation to use.",
        topic: "oop",
        difficulty: "hard"
    },
    
    // Database Management System
    {
        question: "What is a primary key in a database?",
        choices: [
            "The first column in a table",
            "A column or set of columns that uniquely identifies each row in a table",
            "The most important field in a database",
            "A key that connects to a foreign database"
        ],
        answer: 2,
        explanation: "A primary key is a column or set of columns that uniquely identifies each record in a database table.",
        topic: "database",
        difficulty: "easy"
    },
    {
        question: "Which of the following is not a type of SQL command?",
        choices: ["DDL", "DML", "DCL", "DPL"],
        answer: 4,
        explanation: "DPL (Data Processing Language) is not a standard type of SQL command. The main types are DDL (Data Definition Language), DML (Data Manipulation Language), DCL (Data Control Language), and TCL (Transaction Control Language).",
        topic: "database",
        difficulty: "easy"
    },
    {
        question: "What does ACID stand for in the context of database transactions?",
        choices: [
            "Atomicity, Consistency, Isolation, Durability",
            "Aggregation, Concurrency, Integrity, Dependency",
            "Authentication, Certification, Identification, Decryption",
            "Allocation, Compression, Indexing, Deallocation"
        ],
        answer: 1,
        explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability, which are properties that guarantee reliable processing of database transactions.",
        topic: "database",
        difficulty: "medium"
    },
    {
        question: "What is normalization in database design?",
        choices: [
            "The process of converting data to a standard format",
            "The process of organizing data to reduce redundancy and improve data integrity",
            "The process of optimizing database queries",
            "The process of backing up a database"
        ],
        answer: 2,
        explanation: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity by dividing large tables into smaller, related tables.",
        topic: "database",
        difficulty: "medium"
    },
    {
        question: "Which normal form deals with removing transitive dependencies?",
        choices: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Fourth Normal Form (4NF)"],
        answer: 3,
        explanation: "Third Normal Form (3NF) deals with removing transitive dependencies, where a non-key attribute depends on another non-key attribute.",
        topic: "database",
        difficulty: "medium"
    },
    {
        question: "What is the difference between INNER JOIN and LEFT JOIN?",
        choices: [
            "INNER JOIN returns all records from both tables, LEFT JOIN returns only matching records",
            "INNER JOIN returns only matching records, LEFT JOIN returns all records from the left table and matching records from the right table",
            "INNER JOIN combines tables horizontally, LEFT JOIN combines tables vertically",
            "There is no difference between them"
        ],
        answer: 2,
        explanation: "INNER JOIN returns only the rows that have matching values in both tables. LEFT JOIN returns all rows from the left table and the matched rows from the right table (with NULL values for non-matches).",
        topic: "database",
        difficulty: "hard"
    },
    {
        question: "What is a deadlock in database systems?",
        choices: [
            "A situation where the database server crashes",
            "A situation where two or more transactions are waiting for each other to release locks",
            "A situation where a query never completes execution",
            "A situation where data becomes corrupted"
        ],
        answer: 2,
        explanation: "A deadlock occurs when two or more transactions are waiting indefinitely for each other to release locks, resulting in none of them being able to proceed.",
        topic: "database",
        difficulty: "hard"
    },
    
    // Web Technology I
    {
        question: "Which HTML tag is used to create a hyperlink?",
        choices: ["<link>", "<a>", "<href>", "<url>"],
        answer: 2,
        explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML, typically with the href attribute specifying the destination.",
        topic: "web",
        difficulty: "easy"
    },
    {
        question: "Which CSS property is used to change the text color?",
        choices: ["text-color", "font-color", "color", "text-style"],
        answer: 3,
        explanation: "The 'color' property in CSS is used to set the color of text content.",
        topic: "web",
        difficulty: "easy"
    },
    {
        question: "What does CSS stand for?",
        choices: [
            "Creative Style Sheets",
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        answer: 3,
        explanation: "CSS stands for Cascading Style Sheets, which is a style sheet language used for describing the presentation of a document written in HTML.",
        topic: "web",
        difficulty: "easy"
    },
    {
        question: "Which of the following is NOT a valid CSS selector?",
        choices: ["#id", ".class", "*element", ":hover"],
        answer: 3,
        explanation: "*element is not a valid CSS selector. The universal selector is just *, element selectors don't use a prefix, and attribute selectors use [].",
        topic: "web",
        difficulty: "medium"
    },
    {
        question: "What is the purpose of the HTML <meta> tag?",
        choices: [
            "To create metadata for search engines",
            "To define metadata about an HTML document",
            "To create a meta description for social media",
            "To link to external metadata files"
        ],
        answer: 2,
        explanation: "The <meta> tag is used to define metadata about an HTML document, such as character set, description, keywords, author, and viewport settings.",
        topic: "web",
        difficulty: "medium"
    },
    {
        question: "What is the difference between 'position: relative' and 'position: absolute' in CSS?",
        choices: [
            "Relative positioning is based on the element's normal position, while absolute positioning is based on the nearest positioned ancestor",
            "Relative positioning moves an element relative to the viewport, while absolute positioning is fixed to a specific location",
            "Relative positioning is for parent elements, while absolute positioning is for child elements",
            "There is no difference between them"
        ],
        answer: 1,
        explanation: "With 'position: relative', an element is positioned relative to its normal position. With 'position: absolute', an element is positioned relative to the nearest positioned ancestor (or the document body if no positioned ancestors exist).",
        topic: "web",
        difficulty: "hard"
    },
    {
        question: "What is the purpose of the 'z-index' property in CSS?",
        choices: [
            "To control the horizontal positioning of elements",
            "To control the vertical positioning of elements",
            "To control the stacking order of positioned elements",
            "To control the transparency of elements"
        ],
        answer: 3,
        explanation: "The 'z-index' property specifies the stack order of an element (which element should be placed in front of, or behind, other elements).",
        topic: "web",
        difficulty: "hard"
    },
    
    // Scripting Language
    {
        question: "Which of the following is a valid way to declare a variable in JavaScript?",
        choices: ["variable x;", "var x;", "v x;", "int x;"],
        answer: 2,
        explanation: "In JavaScript, variables can be declared using 'var', 'let', or 'const' keywords. 'var x;' is a valid variable declaration.",
        topic: "scripting",
        difficulty: "easy"
    },
    {
        question: "What will be the output of console.log(typeof []);?",
        choices: ["array", "object", "list", "undefined"],
        answer: 2,
        explanation: "In JavaScript, arrays are actually objects, so typeof [] returns 'object'.",
        topic: "scripting",
        difficulty: "easy"
    },
    {
        question: "Which method is used to add elements to the end of an array in JavaScript?",
        choices: ["push()", "append()", "add()", "insert()"],
        answer: 1,
        explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
        topic: "scripting",
        difficulty: "medium"
    },
    {
        question: "What is a closure in JavaScript?",
        choices: [
            "A way to close a browser window",
            "A function that has access to variables in its outer (enclosing) function's scope",
            "A method to close database connections",
            "A way to terminate a loop"
        ],
        answer: 2,
        explanation: "A closure is a function that has access to variables from its outer (enclosing) function's scope, even after the outer function has returned.",
        topic: "scripting",
        difficulty: "medium"
    },
    {
        question: "What is the purpose of the 'this' keyword in JavaScript?",
        choices: [
            "It refers to the current HTML document",
            "It refers to the current function",
            "It refers to the object it belongs to",
            "It refers to the parent element"
        ],
        answer: 3,
        explanation: "In JavaScript, 'this' refers to the object it belongs to. The value of 'this' depends on how a function is called.",
        topic: "scripting",
        difficulty: "medium"
    },
    {
        question: "What is the difference between '==' and '===' operators in JavaScript?",
        choices: [
            "They are identical in functionality",
            "'==' compares values while '===' compares both values and types",
            "'===' compares values while '==' compares both values and types",
            "'==' is used for assignment while '===' is used for comparison"
        ],
        answer: 2,
        explanation: "The '==' operator performs type coercion if the operands are of different types before comparison, while the '===' operator compares both value and type without type coercion.",
        topic: "scripting",
        difficulty: "hard"
    },
    {
        question: "What is event bubbling in JavaScript?",
        choices: [
            "A technique for creating animated bubbles on a webpage",
            "The process where an event triggers on the innermost element and propagates outward",
            "A method for handling multiple events simultaneously",
            "A way to prevent events from triggering"
        ],
        answer: 2,
        explanation: "Event bubbling is the process where an event first triggers on the innermost target element, and then propagates upward through its ancestors in the DOM tree.",
        topic: "scripting",
        difficulty: "hard"
    }
];

// Initialize the game
function init() {
    // Add event listeners
    topicButtons.forEach(button => {
        button.addEventListener('click', () => {
            topicButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTopic = button.getAttribute('data-topic');
            checkStartButtonState();
        });
    });

    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedDifficulty = button.getAttribute('data-difficulty');
            checkStartButtonState();
        });
    });

    startButton.addEventListener('click', startGame);
    nextButton.addEventListener('click', () => {
        acceptingAnswers = false;
        explanationContainer.classList.add('hide');
        nextButton.classList.add('hide');
        getNewQuestion();
    });

    choiceElements.forEach(choice => {
        choice.addEventListener('click', e => {
            if (!acceptingAnswers) return;
            
            acceptingAnswers = false;
            clearInterval(timer);
            
            const selectedChoice = e.target;
            const selectedAnswer = parseInt(selectedChoice.dataset.number);
            
            const classToApply = selectedAnswer === currentQuestion.answer ? 'correct' : 'incorrect';
            
            if (classToApply === 'correct') {
                incrementScore();
            }
            
            selectedChoice.parentElement.classList.add(classToApply);
            
            // Record user's answer
            userAnswers.push({
                question: currentQuestion.question,
                userAnswer: selectedAnswer,
                correctAnswer: currentQuestion.answer,
                isCorrect: selectedAnswer === currentQuestion.answer,
                topic: currentQuestion.topic,
                choices: currentQuestion.choices
            });
            
            // Update topic statistics
            if (!topicStats[currentQuestion.topic]) {
                topicStats[currentQuestion.topic] = { correct: 0, total: 0 };
            }
            topicStats[currentQuestion.topic].total++;
            if (selectedAnswer === currentQuestion.answer) {
                topicStats[currentQuestion.topic].correct++;
            }
            
            // Show explanation
            explanationText.textContent = currentQuestion.explanation;
            explanationContainer.classList.remove('hide');
            
            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                nextButton.classList.remove('hide');
            }, 1000);
        });
    });

    document.getElementById('play-again').addEventListener('click', startGame);
    document.getElementById('go-home').addEventListener('click', goHome);
    document.getElementById('show-answers').addEventListener('click', showReview);
    document.getElementById('back-to-end').addEventListener('click', () => {
        reviewElement.classList.add('hide');
        endElement.classList.remove('hide');
    });
}

function checkStartButtonState() {
    if (selectedTopic && selectedDifficulty) {
        startButton.disabled = false;
    } else {
        startButton.disabled = true;
    }
}

function startGame() {
    score = 0;
    questionCounter = 0;
    userAnswers = [];
    topicStats = {};
    
    // Filter questions based on selected topic and difficulty
    availableQuestions = [...questions];
    if (selectedTopic !== 'all') {
        availableQuestions = availableQuestions.filter(q => q.topic === selectedTopic);
    }
    
    if (selectedDifficulty !== 'mixed') {
        availableQuestions = availableQuestions.filter(q => q.difficulty === selectedDifficulty);
    }
    
    // Shuffle questions
    availableQuestions.sort(() => Math.random() - 0.5);
    
    // Limit to 10 questions
    if (availableQuestions.length > 10) {
        availableQuestions = availableQuestions.slice(0, 10);
    }
    
    scoreElement.innerText = 0;
    
    homeElement.classList.add('hide');
    endElement.classList.add('hide');
    reviewElement.classList.add('hide');
    quizElement.classList.remove('hide');
    
    getNewQuestion();
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= availableQuestions.length) {
        // End of quiz
        endQuiz();
        return;
    }
    
    questionCounter++;
    questionCounterElement.innerText = `${questionCounter}/${availableQuestions.length}`;
    
    currentQuestion = availableQuestions[questionCounter - 1];
    questionElement.innerText = currentQuestion.question;
    
    // Set topic indicator
    const topicMap = {
        'programming': 'Programming in C',
        'oop': 'Object-Oriented Programming',
        'database': 'Database Management System',
        'web': 'Web Technology I',
        'scripting': 'Scripting Language'
    };
    topicIndicatorElement.innerText = `Topic: ${topicMap[currentQuestion.topic]}`;
    
    choiceElements.forEach((choice, index) => {
        choice.innerText = currentQuestion.choices[index];
        choice.parentElement.classList.remove('correct', 'incorrect');
    });
    
    acceptingAnswers = true;
    
    // Reset and start timer
    timeLeft = 60;
    timerElement.innerText = timeLeft;
    clearInterval(timer);
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function timeUp() {
    acceptingAnswers = false;
    
    // Record unanswered question
    userAnswers.push({
        question: currentQuestion.question,
        userAnswer: null,
        correctAnswer: currentQuestion.answer,
        isCorrect: false,
        topic: currentQuestion.topic,
        choices: currentQuestion.choices
    });
    
    // Update topic statistics
    if (!topicStats[currentQuestion.topic]) {
        topicStats[currentQuestion.topic] = { correct: 0, total: 0 };
    }
    topicStats[currentQuestion.topic].total++;
    
    // Show explanation
    explanationText.textContent = currentQuestion.explanation;
    explanationContainer.classList.remove('hide');
    nextButton.classList.remove('hide');
}

function incrementScore() {
    score++;
    scoreElement.innerText = score;
}

function endQuiz() {
    quizElement.classList.add('hide');
    endElement.classList.remove('hide');
    
    // Calculate final statistics
    const totalQuestions = userAnswers.length;
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const incorrectAnswers = userAnswers.filter(answer => !answer.isCorrect && answer.userAnswer !== null).length;
    const unansweredQuestions = userAnswers.filter(answer => answer.userAnswer === null).length;
    
    // Update end screen
    finalScoreElement.innerText = `Your score: ${score} out of ${totalQuestions}`;
    correctCountElement.innerText = correctAnswers;
    incorrectCountElement.innerText = incorrectAnswers;
    unansweredCountElement.innerText = unansweredQuestions;
    
    // Display topic performance
    topicPerformanceElement.innerHTML = '';
    for (const topic in topicStats) {
        const percentage = Math.round((topicStats[topic].correct / topicStats[topic].total) * 100);
        const topicMap = {
            'programming': 'Programming in C',
            'oop': 'Object-Oriented Programming',
            'database': 'Database Management System',
            'web': 'Web Technology I',
            'scripting': 'Scripting Language'
        };
        
        const topicDiv = document.createElement('div');
        topicDiv.classList.add('topic-stat');
        topicDiv.innerHTML = `
            <strong>${topicMap[topic]}:</strong> ${topicStats[topic].correct}/${topicStats[topic].total} (${percentage}%)
        `;
        topicPerformanceElement.appendChild(topicDiv);
    }
}

function goHome() {
    endElement.classList.add('hide');
    homeElement.classList.remove('hide');
    
    // Reset selections
    topicButtons.forEach(btn => btn.classList.remove('active'));
    difficultyButtons.forEach(btn => btn.classList.remove('active'));
    selectedTopic = '';
    selectedDifficulty = '';
    startButton.disabled = true;
}

function showReview() {
    endElement.classList.add('hide');
    reviewElement.classList.remove('hide');
    
    reviewContainer.innerHTML = '';
    
    userAnswers.forEach((answer, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        
        const questionNumber = document.createElement('div');
        questionNumber.innerHTML = `<strong>Question ${index + 1}</strong>`;
        
        const questionText = document.createElement('div');
        questionText.classList.add('review-question');
        questionText.textContent = answer.question;
        
        const choicesContainer = document.createElement('div');
        choicesContainer.classList.add('review-choices');
        
        answer.choices.forEach((choice, choiceIndex) => {
            const choiceElement = document.createElement('div');
            choiceElement.classList.add('review-choice');
            
            // Mark user's answer and correct answer
            if (choiceIndex + 1 === answer.userAnswer) {
                choiceElement.classList.add('selected');
                if (answer.isCorrect) {
                    choiceElement.classList.add('correct');
                } else {
                    choiceElement.classList.add('incorrect');
                }
            } else if (choiceIndex + 1 === answer.correctAnswer) {
                choiceElement.classList.add('correct');
            }
            
            const choicePrefix = String.fromCharCode(65 + choiceIndex); // A, B, C, D
            choiceElement.textContent = `${choicePrefix}. ${choice}`;
            
            choicesContainer.appendChild(choiceElement);
        });
        
        const explanationElement = document.createElement('div');
        explanationElement.classList.add('review-explanation');
        
        // Find the explanation for this question
        const questionData = questions.find(q => q.question === answer.question);
        explanationElement.textContent = questionData ? questionData.explanation : "No explanation available.";
        
        reviewItem.appendChild(questionNumber);
        reviewItem.appendChild(questionText);
        reviewItem.appendChild(choicesContainer);
        reviewItem.appendChild(explanationElement);
        
        reviewContainer.appendChild(reviewItem);
    });
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);