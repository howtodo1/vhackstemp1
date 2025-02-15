const date = new Date();
const taskList = [];
// time is amount of time taken to complete task, 
// difficulty is the amount of effort needed, from 1 to 10
// importance is the urgency of the task, from 1 to 10
const currentDate = new Date();
const dueDate = new Date(2017, 4, 16, 8, 21, 10); // Month is 0-indexed in JavaScript
const difference = currentDate - dueDate;
const minutes = difference / 1000 / 60;
console.log("Difference is " + difference);
console.log("in minutes, this is " + minutes);

const current = [date.getMinutes(), date];

function importance_calc(ECT, grade, dueIn, points) {
    // ECT is the estimated completion time
    // grade is the current grade in the class
    // dueIn is the number of minutes before the assignment is due
    // points is the number of points the assignment is worth
    
    const deficit = 100 - grade;

    const ppt = points / dueIn;
    const dpt = (deficit * ppt / ECT) * 10000;
    return dpt;
}

function knapsack_with_items(weights, values, capacity) {
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    const included_items = [];
    let w = capacity;
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            included_items.push(i - 1);
            w -= weights[i - 1];
        }
    }
    
    return included_items;
}

function schedule_calc(list, schedule, mode) {
    // mode 0 tries to fit as many assignments in as possible
    // modes 1 and 2 try to work as efficiently as possible, may overlook large assignments
    const prioList = [];
    const timeList = [];
    const weightedTimeList = [];
    let output = [];
    
    for (let i = 0; i < list.length; i++) {
        const task = list[i];
        const ECT = task[1];
        const grade = task[2];
        const dueIn = task[3];
        const points = task[4];
        const imp = importance_calc(ECT, grade, dueIn, points);
        prioList.push(imp);
        timeList.push(list[i][1]);
        weightedTimeList.push(imp * list[i][1]);
    }
    
    for (let i = 0; i < schedule.length; i++) {
        let newBlock = [];
        if (mode === 0) {
            newBlock = knapsack_with_items(timeList, timeList, schedule[i]);
        }
        if (mode === 1) {
            newBlock = knapsack_with_items(timeList, weightedTimeList, schedule[i]);
        }
        if (mode === 2) {
            newBlock = knapsack_with_items(timeList, prioList, schedule[i]);
        }
        
        output = output.concat(newBlock);
        newBlock.sort((a, b) => b - a);
        for (let i of newBlock) {
            weightedTimeList[i] = 0;
            prioList[i] = 0;
        }
    }
    // Returns the schedule that fits the most assignments into the given schedule
    return output;
}

taskList.push(["Review for APCS test", 45, 85, 12960 * 3, 25]);
taskList.push(["Limits review worksheet", 20, 90, 12960 * 2, 5]);
taskList.push(["Literary Analysis Essay", 90, 75, 12960 * 1, 40]);
taskList.push(["Chemistry Honors Lab Report", 25, 80, 12960 * 1, 10]);
taskList.push(["Charge calculator", 2, 90, 12960 * 3, 5]);

console.log(schedule_calc(taskList, [65, 120], 0));
console.log(schedule_calc(taskList, [65, 120], 1));
console.log(schedule_calc(taskList, [65, 120], 2));

