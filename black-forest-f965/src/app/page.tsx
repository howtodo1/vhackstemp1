"use client";

import Image from "next/image";
import React, { useEffect, useState, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { main } from "./calenda";
import { getSession } from "next-auth/react";
import * as chrono from "chrono-node";
import * as stringSimilarity from "string-similarity";

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

async function fetchCalendarEvents(setStat) {
  console.log("calling");
  const session = await getSession();
  console.log(session);
  if(session?.accessToken?.account?.access_token){
  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken.account.access_token}`,
      },
    }
  );
  const data = await res.json();
  setStat(data.items);
  console.log(data);
}
}

const convertToTime = (stamp) => {
  console.log(stamp)
  let date = new Date(stamp * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  return hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
};
const convertToDate = (stamp) => {
  let date = new Date(stamp * 1000);
  return date.toLocaleDateString();
};

export default function Home() {
  const [stat, setStat] = useState({});
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [userInfo, setUserInfo] = useState({
    name: { first: "Akilan", last: "Purushothaman" },
    classes: [{name:"biology", grade:90}, {name:"maths", grade:70}, {name:"english", grade:100}],
    assignments: [
      {
        id: 3922,
        status: 0,
        class: "bio",
        name: "HW 12",
        points: 10,
        due: 1739649757,
        start: 1739649557,
        end: 1739649857,
      },
      {
        id: 3923,
        status: 1,
        class: "bio",
        name: "Very long",
        points: 10,
        due: 1739649757,
        start: 1739649556,
        end: 1739649857,
      },
    ],
  });
  const deleteAssignment = (id) => {
    console.log("test")
    let l = userInfo;
    for(let i = 0; i < l.assignments.length; i++){
      if (l.assignments[i].id == id){
        l.assignments.splice(i, 1)
      }
    }
    setUserInfo(l)
    forceUpdate();
  } 
  function removeDuplicates(arr) {
    return [...new Set(arr)];
  }
  const knackwrapper = () => {
    let t = [];
    let b = [];
    let a = [];
    for (const assignment of userInfo.assignments) {
        
        if(assignment.status!=0){
          b.push(assignment)
          let cls = userInfo.classes.find((c) => c.name == assignment.class);
          t.push(["", 30, cls ? cls.grade : "80", assignment.due - Math.floor(Date.now()/1000), assignment.points]); // Handle missing class
        }
        
    }
    let indexes = schedule_calc(t, [65, 120], 0)
    indexes = removeDuplicates(indexes);
    for (const num of indexes){
      a.push(b[num])
    }
    console.log("tester")
    console.log(a)
    return a; // Ensure function returns the array
};
  const complete = (id) => {
    console.log("test")
    let l = userInfo;
    for(let i = 0; i < l.assignments.length; i++){
      if (l.assignments[i].id == id){
        l.assignments[i].status = 0;
      }
    }
    setUserInfo(l)
    forceUpdate();
  }

  const addAssignment = (subject, due, points) => {
    let l = userInfo;
    let gr = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * (due - Math.floor(Date.now() / 1000)  + 1)); - 1200;
    l.assignments.push({
      id: Math.floor(Math.random() * 10000),
      status: 1,
      class: subject,
      name: subject + " Homework",
      due: due,
      points,
      start: gr,
      end: gr+1100
    });
    setUserInfo(l);
  };

  const parse = (text) => {
    let date = Math.floor(chrono.parseDate(text.target.value) / 1000);
    let words = text.target.value.split(" ");
    let subject;
    let prevnum = { lv: 0 };
    for (const word of words) {
      for (const sub of userInfo.classes) {
        let num = stringSimilarity.compareTwoStrings(sub.name, word);
        if (num >= 0.5 && num > prevnum.lv) {
          prevnum = { lv: num, word: sub };
        }
      }
    }
    let reg = new RegExp(/\d+\s*p/);
    let points = parseInt(text.target.value.match(reg));

    if (prevnum?.word && date && points) {
      setStat({ enabled: true, word: prevnum.word, date, points, okay: true });
      //addAssignment(prevnum.word, date, points)
    } else if (text.target.value) {
      setStat({ enabled: true, word: prevnum.word, date, points });
    } else {
      setStat({ enabled: false, word: prevnum.word, date, points });
    }
  };
  const applyStuff = () => {
    addAssignment(stat.word.name, stat.date, stat.points)
    forceUpdate()
  }
  const aa = async ( )=> {
    const session = await getSession();
    console.log("ere!!")
    console.log(session)
    let n = userInfo;
    if (session?.accessToken?.profile && n?.name?.first ){

      let nm = session?.accessToken?.profile;
      console.log(nm)
      
      n.name.first = nm.given_name
      n.name.last = nm.family_name
      setUserInfo(nm);
      forceUpdate();
    }
  }
  useEffect(() => {
    fetchCalendarEvents(setStat);
    aa();
    main();
  }, []);
  return (
    <div className="text-white body">
      <div className="bg-yellow-500 bx-2 mb-1 py-2">
        <h1 className="text-5xl pb-1 font-mono">
          Hello, {userInfo.name.first}!
        </h1>
      </div>
      <div className="flex justify-between">
        <div className="flex m-3 justify-start">
          <button className="invisible hover:bg-blue-600 rounded px-2 py-4 bg-blue-500">
            Add a Class
          </button>
        </div>
        <div className="w-1/3 my-2 text-black flex flex-col justify-between">
          <div className="flex justify-between">
            <span className={stat.date ? "text-green-700" : ""}>
              Date: {stat.date ? convertToDate(stat.date) : "Unknown"}{" "}
            </span>
            <span className={stat.word ? "text-green-700" : ""}>
              Subject: {stat.word?.name ? stat.word?.name  : "Unknown"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={stat.points ? "text-green-700" : ""}>
              Points: {stat.points ? stat.points : "Unknown"}
            </span>
            <span></span>
          </div>
        </div>
        <div className="flex w-1/3 m-3 justify-end text-black">
          <input
            onChange={parse}
            className="w-full rounded-l border-l-2 border-y-2 border-blue-500"
          ></input>
          <button disabled={!stat.okay} onClick={applyStuff} className="disabled:bg-gray-500 hover:bg-blue-600 w-1/6 rounded-r px-2 py-4 mr-2 bg-blue-500">
            +
          </button>
        </div>
      </div>
      <div className="flex mx-2 justify-between">
        <div className="mr-2 rounded-t border-blue-500 border-4 w-1/2 flex flex-col items-center">
          <h1 className="bg-blue-500 w-full text-center">
            Your Personalized Plan For Today
          </h1>
          <ul className="text-black flex flex-col w-full justify-around">
            <li className="bg-blue-500 text-white flex w-full justify-around">
              <strong className="w-36 truncate">Assignment</strong>
              <strong className="w-36 truncate">Start Time</strong>
              <button className="pr-2 invisible text-green-500 hover:text-green-600">
                  <FontAwesomeIcon icon={faCheck} />
                  </button>
            </li>
            {knackwrapper().map((item, index) => {
              if (item?.status != 0) {
              return (
                <li
                  key={index}
                  className="border-t  bg-white flex w-full justify-around"
                >
                  <span className="w-36 truncate">{item?.name}</span>
                  <span className="w-36 truncate">
                    {convertToTime(item?.start)}
                  </span>
                  <button onClick={() => (complete(item?.id)) } className="pr-2 text-green-500 hover:text-green-600">
                  <FontAwesomeIcon icon={faCheck} />
                  </button>
                </li>
              );
            } else {
              return (<div className="hidden"></div>);
            }
            })}
          </ul>
        </div>
        <div className="rounded-t border-blue-500 border-4 bg-blue-500 w-1/2 flex flex-col items-center">
          <h1>All Assignments</h1>
          <ul className="text-black flex flex-col w-full justify-around">
            <li className="text-yellow-300 flex w-full justify-around">
              <strong className="w-1/5 text-center truncate">Status</strong>
              <strong className="w-1/5 truncate">Class</strong>
              <strong className="w-1/5 truncate">Assignment</strong>
              <strong className="w-1/5 truncate">Pts</strong>
              <strong className="w-1/6 truncate">Due</strong>
              <button className="invisible pr-4 text-red-500 hover:text-red-600">
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button className="invisible pr-2 text-yellow-500 hover:text-yellow-600">
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </li>
            {userInfo.assignments.map((item, index) => {
              let text;
              let color;
              console.log(item)
              switch (item.status) {
                
                case 0:
                  text = "Completed";
                  color = "bg-green-500";
                  break;
                case 1:
                  text = "In Progress";
                  color = "bg-yellow-500";
                  break;
                case 2:
                  text = "Not Stated";
                  color = "bg-orange-500";
                  break;
                case 3:
                  text = "Late!";
                  color = "bg-red-500";
                  break;
              }
              return (
                <li
                  key={index}
                  className="border-t bg-white flex w-full items-center justify-around"
                >
                  <div className={`h-10 rounded my-1 flex items-center w-1/5`}>
                    <div
                      className={`${color} w-full mx-2 h-10 rounded flex items-center`}
                    >
                      <span className="text-center w-full truncate">
                        {text}
                      </span>
                    </div>
                  </div>
                  <span className="w-1/5 truncate">{item.class}</span>
                  <span className="w-1/5 truncate">{item.name}</span>
                  <span className="text-lg w-1/5 truncate">{item.points}</span>
                  <span className="w-1/6 truncate">
                    {convertToDate(item.due)}
                  </span>
                  <button onClick={() => (complete(item.id)) } className="pr-2 text-green-500 hover:text-green-600">
                  <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button onClick={() => (deleteAssignment(item.id)) } className="pr-4 text-red-500 hover:text-red-600">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div></div>
    </div>
  );
}
