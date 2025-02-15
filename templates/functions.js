import { Chart } from 'chart.js';

function pieChart(timeSpent) { // timeSpent is an array: timeSpent = [class1, class2, class3, class4, ...]
    let totalTime = 0;
    for (let classNum of timeSpent) {
        totalTime += classNum;
    }
    let average = totalTime / timeSpent.length;
    console.log(average);
    let piePercent = [];
    for (let classNum2 of timeSpent) {
        piePercent.push(classNum2 / totalTime);
    }

    const labels = ['class1', 'class2', 'class3', 'class4'];
    const colors = ['red', 'yellow', 'pink', 'brown'];

    const ctx = document.createElement('canvas');
    document.body.appendChild(ctx);
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: piePercent,
                backgroundColor: colors,
            }]
        },
        options: {
            title: {
                display: true,
                text: "% time spent on each subject"
            }
        }
    });
}

function lineGraph(last7days) { // last7days is an array of the time spent on each for past 7 days 
    // last7days = [[class1, class2, class3, ...], [], [], []] where each [] is a list of time spent each day
    console.log();
}

document.addEventListener("DOMContentLoaded", function () {
    // Sample data for the pie chart
    const data = {
        labels: ["Work", "Exercise", "Study", "Leisure", "Sleep"],
        datasets: [{
            data: [8, 2, 4, 5, 5], // Example hours
            backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"]
        }]
    };

    // Pie chart initialization
    const ctx = document.getElementById("timeChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: data
    });
});

// Function to add events to the list
function addEvent() {
    let eventText = document.getElementById("eventInput").value;
    if (eventText.trim() !== "") {
        let listItem = document.createElement("li");
        listItem.textContent = eventText;
        document.getElementById("eventList").appendChild(listItem);
        document.getElementById("eventInput").value = ""; // Clear input
    }
}

pieChart([3, 4, 2, 1]);

