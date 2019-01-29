var students = { };
    
var schedule = [
    { "period": 1,
      "short_start":"08:55",
      "short_end":"09:34",
      "long_start":"08:55",
      "long_end":"10:15"},
    { "period": 2,
      "short_start":"09:39",
      "short_end":"10:18",
      "long_start":"08:55",
      "long_end":"10:15"},
    { "period": 3,
      "short_start":"10:23",
      "short_end":"11:02",
      "long_start":"10:20",
      "long_end":"11:45"},
    { "period": 4,
      "short_start":"11:07",
      "short_end":"11:46",
      "long_start":"10:20",
      "long_end":"11:45"},
    { "short_start":"11:46",
      "short_end":"12:26",
      "long_start":"11:45",
      "long_end":"12:30"},
    { "period": 5,
      "short_start":"12:34",
      "short_end":"13:13",
      "long_start":"12:38",
      "long_end":"14:00"},
    { "period": 6,
      "short_start":"13:18",
      "short_end":"13:57",
      "long_start":"12:38",
      "long_end":"14:00"},
    { "period": 7,
      "short_start":"14:02",
      "short_end":"14:41",
      "long_start":"14:05",
      "long_end":"15:25"},
    { "period": 8,
      "short_start":"14:46",
      "short_end":"15:25",
      "long_start":"14:05",
      "long_end":"15:25"}
];
var pad = function(num, len) { return ("00000000" + num).substr(-len) };
var convertTo12Hour = function(timeString) {
    var parts = timeString.split(":");
    var hour = parseInt(parts[0]);

    if (hour > 12) {
        hour = hour - 12;
    }
    return `${hour}:${parts[1]}`;
};

var addKidsToHeader = function(myKids) {
    var allHeader = document.querySelector('th[class=all_col]');
    var cell, text;
    for (var k of myKids) {
        cell = document.createElement('th');
        text = document.createTextNode(students[k].name);
        cell.appendChild(text);
        allHeader.parentNode.insertBefore(cell, allHeader);
    }
};

var drawScheduleTable = function(myKids) {
    var cell, text;
    var oddCell, evenCell;
    var tbody = document.getElementById('schedule_body');
    var current = getCurrentPeriod();

    var now = getDate();
    var dayType;
    switch (now.getDay()) {
    case 0:
    case 6:
        // weekend
        dayType = 'weekend';
        break;
    case 1:
        // Monday
        dayType = 'full';
        break;
    case 2:
    case 4:
        // Tuesday or Thursday
        dayType = 'odd';
        break;
    case 3:
    case 5:
        // Wednesday or Friday
        dayType = 'even';
        break;
    }

    tbody.innerHTML = "";

    for (i in schedule) {
        var item = schedule[i];

        var newRow = tbody.insertRow(tbody.rows.length);
        var displaying_now = false;
        var kid, subject;
        var textCell;
        if (item.period == current.period) {
            displaying_now = true;
        }

        cell = newRow.insertCell();
        cell.className = "center";
        if (displaying_now)
            cell.className += " current_period";
        text = document.createTextNode(item.period==undefined?"":item.period);
        cell.appendChild(text);

        for (var k of myKids) {
            cell = newRow.insertCell();
            kid = students[k];
            subject = kid[item.period];
            if (subject == undefined) {
                subject = "STEP";
            }
            text = document.createTextNode(subject);
            if (subject == "free") {
                cell.className = "free";
            }
            if (displaying_now)
                cell.className += " current_period";
            cell.appendChild(text);
        }

        cell = newRow.insertCell();
        if (dayType == "full") {
            cell.className = "current_day_type";
            if (displaying_now)
                cell.className += " current_period";
        }
        textCell = createTimeCell(item, "short");
        cell.appendChild(textCell);

        oddCell = newRow.insertCell();
        evenCell = newRow.insertCell();
        textCell = createTimeCell(item, "long");
        if (item.period == undefined) {
            // STEP
            oddCell.appendChild(textCell);
            var text2 = textCell.cloneNode(true);
            evenCell.appendChild(text2);
            if (dayType == "odd") {
                oddCell.className = "current_day_type";
                if (displaying_now)
                    oddCell.className += " current_period";
            }
            if (dayType == "even") {
                evenCell.className = "current_day_type";
                if (displaying_now)
                    evenCell.className += " current_period";
            }
        } else if (item.period % 2 == 1) {
            oddCell.appendChild(textCell);
            if (dayType == "odd") {
                oddCell.className = "current_day_type";
                if (displaying_now)
                    oddCell.className += " current_period";
            }
        } else {
            evenCell.appendChild(textCell);
            if (dayType == "even") {
                evenCell.className = "current_day_type";
                if (displaying_now)
                    evenCell.className += " current_period";
            }
        }
    }
};

var createTimeCell = function(item, periodType) {
    var startKey = `${periodType}_start`;
    var endKey = `${periodType}_end`;
    var timeCell = document.createElement('span');
    timeCell.className = 'time_span';

    var startSpan = document.createElement('span');
    startSpan.className += ' start_time';
    var textNode = document.createTextNode(`${convertTo12Hour(item[startKey])} `);
    startSpan.appendChild(textNode);
    timeCell.appendChild(startSpan);

    var endSpan = document.createElement('span');
    endSpan.className += ' end_time';
    textNode = document.createTextNode(`${convertTo12Hour(item[endKey])}`);
    endSpan.appendChild(textNode);
    timeCell.appendChild(endSpan);

    return timeCell;
};

var writeCurrentStatus = function(output) {
    document.getElementById("current").innerHTML = output;
}

var getParameterByName = function(name, url) {
    try {
        var params = (new URL(document.location)).searchParams;
        var paramValue = params.get(name);
        return paramValue;
    } catch (error) {
        // Support for iOS 9 and probably some other older browsers
        // Adapted from https://stackoverflow.com/a/901144/138776
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
};

var getDate = function() {
    var d = new Date();
    // ?date=2018-08-21T13:09:00
    var dateParam = getParameterByName("date");
    if (dateParam !== null) {
        d = new Date(dateParam);
    }
    return d;
};

var getKids = function() {
    var studentParam = getParameterByName("students");
    if (studentParam !== null) {
        theKids = studentParam.split(/[ ,+]/);
        localStorage.setItem('theKids', theKids);
    } else if (localStorage.getItem('theKids')) {
        theKids = localStorage.getItem('theKids').split(/[ ,+]/);
    }

    if (!theKids) {
        theKids = [ "one", "two" ];
        var overlay = "<div id='overlay'><span>Sample<br>Schedules</span></div>";
        var table = document.querySelector("table");
        table.insertAdjacentHTML('beforeend', overlay);
    }
};

var getCurrentPeriod = function() {
    var schoolBegins = "08:55";
    var schoolEnds = "15:25";

    var now = getDate();
    var h = pad(now.getHours(), 2);
    var m = pad(now.getMinutes(), 2);
    var currentTime = `${h}:${m}`;

    var dummyEntry = {
        "period": "0",
        "student1": ""
    };

    var periodType, periodInterval;
    if (now.getDay() == 1) {
        periodType = "short";
        periodInterval = 1;
    } else if ([2,3,4,5].includes(now.getDay())) {
        periodType = "long";
        periodInterval = 2;
    } else {
        periodType = "weekend";
    }

    if (periodType == "weekend") {
        dummyEntry['student1'] = "Weekend";
        dummyEntry['periodType'] = periodType;
        return dummyEntry;
    }

    if (currentTime < schoolBegins || currentTime > schoolEnds) {
        dummyEntry['student1'] = "School's out";
        return dummyEntry;
    }

    var start_key = `${periodType}_start`;
    var end_key = `${periodType}_end`;
    for (var i in schedule) {
        var period = schedule[i].period;
        if (periodType == 'long' &&
            (period % 2) == (now.getDay() % 2)) {
            // get the right even/odd dasy
            continue;
        }
        if (currentTime >= schedule[i][start_key]) {
            var periodToReturn;
            var nextIndex;
            if (i == 3 || i == 4) {
                // Don't skip over lunch!
                nextIndex = parseInt(i) + 1;
            } else {
                nextIndex = parseInt(i) + periodInterval;
            }
            if (currentTime <= schedule[i][end_key]) {
                periodToReturn = schedule[i];
            } else if (currentTime < schedule[nextIndex][start_key]) {
                // In between periods, show next period.
                periodToReturn = schedule[nextIndex];
                periodToReturn['coming'] = true;
            } else {
                continue;
            }
            periodToReturn['periodType'] = periodType;
            return periodToReturn;
        }
    }
};

var whereAreTheyNow = function(myKids) {
    var current = getCurrentPeriod();

    var now = getDate();
    var h = pad(now.getHours(), 2);
    var m = pad(now.getMinutes(), 2);
    var current_time = `${h}:${m}`;

    if (current.period == 0) {
        writeCurrentStatus(`<span>${current.student1}</span>`);
        return;
    }

    var start_key = `${current.periodType}_start`;
    var end_key = `${current.periodType}_end`;

    var output = "";
    var student;
    for (var k of myKids) {
        student = students[k];
        output = output +`<span id="${k}">${student.name} is in `;
        if (current.period === undefined) {
            output = output + "STEP";
        } else {
            output = output + student[current.period];
        }
        output = output + "</span>";
    }
    if (current.coming) {
        output = output + "<span class=\"free\">in between periods</span>";
    } else {
        output = output + `<span>until ${convertTo12Hour(current[end_key])}</span>`;
    }
    writeCurrentStatus(output);
};

var showCurrentTime = function() {
    var options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    var now = getDate();
    document.getElementById("time").innerHTML = now.toLocaleDateString("en-US", options);
    document.getElementById("testString").innerHTML = `?date=${now.toISOString()}`;
};

var handleVisibilityChange = function() {
    if (hidden === undefined || !document[hidden]) {
        whereAreTheyNow(theKids);
        drawScheduleTable(theKids);
        showCurrentTime();
    }
};

var loadOneStudent = function(aKid) {
    var xhr = new XMLHttpRequest();
    var url = `http://data.wilsonschedule.com/${aKid}.json`;
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
          var data = xhr.response;
          students[data["code"]] = data; 
      } else {
          console.log(`Could not load schedule data for ${aKid}`);
      }
    };
    xhr.send();
};

var loadStudents = function(myKids) {
    var allKidRequests = [];
    for (var s of myKids) {
        loadOneStudent(s);
    }
};

var drawFirstTable = function(myKids) {
    if (Object.keys(students).length == myKids.length) {
        addKidsToHeader(myKids);
        handleVisibilityChange();
    } else {
        var waitTime = 100;
        setTimeout(drawFirstTable, waitTime, myKids);
    }
};

var showSchedule = function() {
    getKids();
    loadStudents(theKids);
    drawFirstTable(theKids);
};

var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

if (typeof document.addEventListener === "undefined" || hidden === undefined) {
    console.log("This browser does not support visibility events");
} else {
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

var theKids;

