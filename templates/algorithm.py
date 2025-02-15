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

def weight_calc(minutes, difficulty, importance,):
    taskList.insert(1, [minutes, difficulty, importance])
    firstWeght = importance*difficulty*24*60*30/100
    weight = 4*importance/10 + 3*difficulty/10 + 3*minutes/firstWeght
    print(taskList, "\n", weight)
    print(current)
    #print(currentMin)
    return weight

weight_calc(minutes, 10, 10)

    


    


