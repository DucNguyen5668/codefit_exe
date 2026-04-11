require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Course = require("./models/Course");
const Exercise = require("./models/Exercise");
const User = require("./models/User");

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Course.deleteMany({});
    await Exercise.deleteMany({});
    await User.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Create admin user
    const adminPass = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
        name: "Admin",
        email: "admin@codefit.dev",
        password: adminPass,
        role: "admin",
        level: "Advanced",
        xp: 999,
        aiUsageLeft: 100,
    });

    // Create demo user
    const userPass = await bcrypt.hash("demo123", 10);
    await User.create({
        name: "Alex Nguyen",
        email: "demo@codefit.dev",
        password: userPass,
        level: "Intermediate",
        xp: 320,
        aiUsageLeft: 7,
    });

    console.log("👤 Created users: admin@codefit.dev / admin123, demo@codefit.dev / demo123");

    // Create Courses
    const courses = await Course.insertMany([
        {
            title: "JavaScript Fundamentals",
            description: "Master the core concepts of JavaScript: variables, functions, loops, and arrays.",
            level: "Beginner",
            language: "javascript",
            tags: ["JavaScript", "Variables", "Functions"],
            duration: "3 hours",
        },
        {
            title: "Array & String Algorithms",
            description: "Solve real interview problems using array manipulation and string operations.",
            level: "Intermediate",
            language: "javascript",
            tags: ["Arrays", "Strings", "Algorithms"],
            duration: "4 hours",
        },
        {
            title: "Data Structures & Advanced JS",
            description: "Deep dive into stacks, queues, linked lists, and advanced JavaScript patterns.",
            level: "Advanced",
            language: "javascript",
            tags: ["Data Structures", "OOP", "Recursion"],
            duration: "6 hours",
        },
    ]);

    console.log("📚 Created 3 courses");

    // Exercises for Course 1 (Beginner)
    const c1Exercises = [
        {
            courseId: courses[0]._id,
            title: "Hello World",
            description: "Write a function `solution` that returns the string `Hello, World!`.\n\nExample:\n- `solution()` → `\"Hello, World!\"`",
            difficulty: "Easy",
            starterCode: "function solution() {\n  // Return 'Hello, World!'\n  \n}",
            solution: "function solution() { return 'Hello, World!'; }",
            testCases: [
                { input: "", expected: '"Hello, World!"', description: "Returns greeting" },
            ],
            hints: ["Use the return keyword", "Strings are wrapped in quotes"],
            order: 1,
        },
        {
            courseId: courses[0]._id,
            title: "Sum of Two Numbers",
            description: "Write a function `solution(a, b)` that returns the sum of two numbers.\n\nExample:\n- `solution(2, 3)` → `5`\n- `solution(-1, 4)` → `3`",
            difficulty: "Easy",
            starterCode: "function solution(a, b) {\n  // Return the sum of a and b\n  \n}",
            solution: "function solution(a, b) { return a + b; }",
            testCases: [
                { input: "2, 3", expected: "5", description: "2 + 3 = 5" },
                { input: "-1, 4", expected: "3", description: "-1 + 4 = 3" },
                { input: "0, 0", expected: "0", description: "0 + 0 = 0" },
            ],
            hints: ["Use the + operator", "JavaScript will handle integer and float addition"],
            order: 2,
        },
        {
            courseId: courses[0]._id,
            title: "Is Even Number",
            description: "Write a function `solution(n)` that returns `true` if `n` is even, `false` otherwise.\n\nExample:\n- `solution(4)` → `true`\n- `solution(7)` → `false`",
            difficulty: "Easy",
            starterCode: "function solution(n) {\n  // Return true if n is even\n  \n}",
            solution: "function solution(n) { return n % 2 === 0; }",
            testCases: [
                { input: "4", expected: "true", description: "4 is even" },
                { input: "7", expected: "false", description: "7 is odd" },
                { input: "0", expected: "true", description: "0 is even" },
            ],
            hints: ["Use the modulo operator %", "Even numbers have remainder 0 when divided by 2"],
            order: 3,
        },
        {
            courseId: courses[0]._id,
            title: "Reverse a String",
            description: "Write a function `solution(str)` that returns the reversed string.\n\nExample:\n- `solution('hello')` → `'olleh'`\n- `solution('abc')` → `'cba'`",
            difficulty: "Easy",
            starterCode: "function solution(str) {\n  // Reverse the string\n  \n}",
            solution: "function solution(str) { return str.split('').reverse().join(''); }",
            testCases: [
                { input: "'hello'", expected: '"olleh"', description: "Reverse hello" },
                { input: "'abc'", expected: '"cba"', description: "Reverse abc" },
                { input: "'a'", expected: '"a"', description: "Single char" },
            ],
            hints: ["Try split('').reverse().join('')", "split('') converts string to array of chars"],
            order: 4,
        },
    ];

    // Exercises for Course 2 (Intermediate)
    const c2Exercises = [
        {
            courseId: courses[1]._id,
            title: "Find Maximum in Array",
            description: "Write a function `solution(arr)` that returns the maximum value in the array.\n\nExample:\n- `solution([3, 1, 4, 1, 5, 9])` → `9`",
            difficulty: "Medium",
            starterCode: "function solution(arr) {\n  // Return the maximum value\n  \n}",
            solution: "function solution(arr) { return Math.max(...arr); }",
            testCases: [
                { input: "[3, 1, 4, 1, 5, 9]", expected: "9", description: "Max of array" },
                { input: "[-5, -1, -3]", expected: "-1", description: "Max of negatives" },
                { input: "[42]", expected: "42", description: "Single element" },
            ],
            hints: ["Try Math.max() with spread operator", "Or use reduce() to compare"],
            order: 1,
        },
        {
            courseId: courses[1]._id,
            title: "Count Vowels",
            description: "Write a function `solution(str)` that returns the count of vowels (a, e, i, o, u) in the string (case-insensitive).\n\nExample:\n- `solution('hello')` → `2`",
            difficulty: "Medium",
            starterCode: "function solution(str) {\n  // Count vowels in string\n  \n}",
            solution: "function solution(str) { return (str.toLowerCase().match(/[aeiou]/g) || []).length; }",
            testCases: [
                { input: "'hello'", expected: "2", description: "h-e-l-l-o has 2 vowels" },
                { input: "'rhythm'", expected: "0", description: "No vowels" },
                { input: "'AEIOU'", expected: "5", description: "All vowels uppercase" },
            ],
            hints: ["Convert to lowercase first", "Use regex /[aeiou]/g to match all vowels"],
            order: 2,
        },
        {
            courseId: courses[1]._id,
            title: "Remove Duplicates",
            description: "Write a function `solution(arr)` that returns the array with duplicate values removed.\n\nExample:\n- `solution([1, 2, 2, 3, 3])` → `[1, 2, 3]`",
            difficulty: "Medium",
            starterCode: "function solution(arr) {\n  // Remove duplicates\n  \n}",
            solution: "function solution(arr) { return [...new Set(arr)]; }",
            testCases: [
                { input: "[1, 2, 2, 3, 3]", expected: "[1,2,3]", description: "Remove duplicates" },
                { input: "[1, 1, 1]", expected: "[1]", description: "All same" },
                { input: "[1, 2, 3]", expected: "[1,2,3]", description: "No duplicates" },
            ],
            hints: ["Use Set data structure", "Spread operator ... converts Set back to array"],
            order: 3,
        },
    ];

    // Exercises for Course 3 (Advanced)
    const c3Exercises = [
        {
            courseId: courses[2]._id,
            title: "Fibonacci Sequence",
            description: "Write a function `solution(n)` that returns the nth Fibonacci number.\n\nFibonacci: 0, 1, 1, 2, 3, 5, 8, 13...\n- `solution(0)` → `0`\n- `solution(7)` → `13`",
            difficulty: "Hard",
            starterCode: "function solution(n) {\n  // Return the nth Fibonacci number\n  \n}",
            solution: "function solution(n) { if(n<=1) return n; let a=0,b=1; for(let i=2;i<=n;i++){let c=a+b;a=b;b=c;} return b; }",
            testCases: [
                { input: "0", expected: "0", description: "fib(0) = 0" },
                { input: "1", expected: "1", description: "fib(1) = 1" },
                { input: "7", expected: "13", description: "fib(7) = 13" },
                { input: "10", expected: "55", description: "fib(10) = 55" },
            ],
            hints: [
                "Use iteration (not recursion) for efficiency",
                "Keep track of previous two numbers",
                "Base cases: fib(0)=0, fib(1)=1",
            ],
            order: 1,
        },
        {
            courseId: courses[2]._id,
            title: "Palindrome Check",
            description: "Write `solution(str)` that returns `true` if the string is a palindrome (reads same forwards and backwards), ignoring spaces and case.\n\n- `solution('racecar')` → `true`\n- `solution('hello')` → `false`",
            difficulty: "Hard",
            starterCode: "function solution(str) {\n  // Check if palindrome\n  \n}",
            solution: "function solution(str) { const s = str.toLowerCase().replace(/[^a-z0-9]/g,''); return s === s.split('').reverse().join(''); }",
            testCases: [
                { input: "'racecar'", expected: "true", description: "racecar is palindrome" },
                { input: "'hello'", expected: "false", description: "hello is not" },
                { input: "'A man a plan a canal Panama'", expected: "true", description: "Ignoring spaces" },
            ],
            hints: ["Strip non-alphanumeric characters", "Compare with reversed version", "Use toLowerCase() for case insensitive"],
            order: 2,
        },
    ];

    const allExercises = [...c1Exercises, ...c2Exercises, ...c3Exercises];
    await Exercise.insertMany(allExercises);

    // Update exercise counts
    await Course.findByIdAndUpdate(courses[0]._id, { exerciseCount: c1Exercises.length });
    await Course.findByIdAndUpdate(courses[1]._id, { exerciseCount: c2Exercises.length });
    await Course.findByIdAndUpdate(courses[2]._id, { exerciseCount: c3Exercises.length });

    console.log(`✅ Created ${allExercises.length} exercises across 3 courses`);
    console.log("\n🎉 Database seeded successfully!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
});
