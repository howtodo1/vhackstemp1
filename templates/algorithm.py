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

def importance_calc(time, difficulty, importance,):
    taskList.insert(1, [time, difficulty, importance])
    weight = 5*importance + 10/(time+1)
    print(taskList, "\n", weight)
    print(current)
    #print(currentMin)

importance_calc(90, 9, 8)

    


