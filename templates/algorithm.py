import datetime
taskList = []
# time is amount of time taken to complete task, 
# difficulty is the amount of effort needed, from 1 to 10
# importance is the urgency of the task, from 1 to 10
date=datetime.datetime.now()
currentDate = datetime.datetime.now()
dueDate = datetime.datetime(2017, 5, 16, 8, 21, 10)
# need to update this with vaeriables
difference = currentDate - dueDate
minutes = difference.total_seconds() / 60
print("Difference is" + str(difference))
print("in minuteds, this is " + str(minutes))

current = [date.minute, datetime.date]


def importance_calc(ECT, grade, dueIn, points):
    #ECT is the estimated completion time
    #grade is the current grade in the class
    #dueIn is the number of minutes before the assignment is due
    #points is the number of points the assignment is worth
    
    deficit = 100-grade

    ppt = points/dueIn
    dpt = deficit*ppt/ECT*10000
    return dpt

    #print(currentMin)
def knapsack_with_items(weights, values, capacity):
    n = len(weights)
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]

    included_items = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i-1][w]:
            included_items.append(i-1)
            w -= weights[i-1]
    
    return included_items


def schedule_calc(list, schedule, mode):
    #mode 0 tries to fit as many assignments in as possible
    #modes 1 and 2 try to work as efficiently as possible, may overlook large assignments
    prioList = []
    timeList = []
    weightedTimeList = []
    output = []
    for i in range(len(list)):
        task = list[i]
        ECT = task[1]
        grade = task[2]
        dueIn = task[3]
        points = task[4]
        imp = importance_calc(ECT,grade,dueIn,points)
        prioList.append(imp)
        timeList.append(list[i][1])
        weightedTimeList.append(imp*list[i][1])
    for i in range(len(schedule)):
        newBlock = []
        if mode==0:
            newBlock = knapsack_with_items(timeList, timeList, schedule[i])
        if mode==1:
            newBlock = knapsack_with_items(timeList, weightedTimeList, schedule[i])
        if mode==2:
            newBlock = knapsack_with_items(timeList, prioList, schedule[i])
        
        
        output = output + newBlock
        newBlock.sort(reverse = True)
        for i in newBlock:
            weightedTimeList[i]=0
            prioList[i]=0
    #Returns the schedule that fits the most assignments into the given schedule

    return output

taskList.append(["Limits review worksheet",20, 90, 12960*2, 5])
taskList.append(["Literary Analysis Essay",90, 75, 12960*1, 40])
taskList.append(["Review for APCS test",45, 85, 12960*3, 25])
taskList.append(["Chemistry Honors Lab Report",25, 80, 12960*1, 10])
taskList.append(["Charge calculator",2, 90, 12960*3, 5])

print(schedule_calc(taskList, [65, 120], 0))
print(schedule_calc(taskList, [65, 120], 1))
print(schedule_calc(taskList, [65, 120], 2))





