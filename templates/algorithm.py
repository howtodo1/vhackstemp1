
taskList = []
# time is amount of time taken to complete task, 
# difficulty is the amount of effort needed, from 1 to 10
# importance is the urgency of the task, from 1 to 10
def importance_calc(time, difficulty, importance):
    taskList.insert(1, [time, difficulty, importance])
    weight = 5*importance + 1/(10*(time+1))
    print(taskList, "\n", weight)


importance_calc(90, 9, 8)

    


