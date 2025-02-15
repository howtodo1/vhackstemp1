import matplotlib.pyplot as plt
def pie_chart(time_spent): # time_spent is a list:  time_spent = [class1, class2, class3, class4, ...]
    totalTime = 0
    for classNum in time_spent:
        totalTime += classNum
    average = totalTime/len(time_spent)
    print (average)
    piePercent = []
    for classNum2 in time_spent:
        piePercent.append(classNum2/totalTime)

    labels = ['class1', 'class2', 'class3', 'class4']
    colors = ['red', 'yellow', 'pink', 'brown']  
    plt.pie(piePercent, labels=labels, colors=colors, autopct='%1.1f%%', startangle=140)
    plt.title("% time spent on each subject")
    plt.show()

def line_graph(last7days): #last7days is a list of the time spent on each for past 7 days 
    #last7days = [[class1, class2, class3, ...], [], [], []] where each [] is a list of time spent each day
    
    print()


if __name__ == "__main__":
    pie_chart([3,4,2,1])



    


