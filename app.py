from flask import render_template, Flask

app = Flask(__name__)

taskList = []

@app.route("/")
def hello_world():
    return render_template('index.html')

# time is amount of time taken to complete task, 
# difficulty is the amount of effort needed, from 1 to 10
# importance is the urgency of the task, from 1 to 10
def importance_calc(time, difficulty, importance):
    taskList.insert([time, difficulty, importance])
