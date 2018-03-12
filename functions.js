$(document).ready(function(){
  var timerCheck = false;
  var sessionCheck = true;
  //booleans for checking timer status and whether the timer is doing a session countdown or a break countdown (to be used later)
  var breakTime = 5;
  var sessionTime = 25;
  //initial values for session time and break time
  var count = sessionTime;
  //set initial count (first countdown will always be the session time) by multiplying number of minutes by 60 so that we have seconds. we want seconds because the countdown display will change with each second.
  function minsAndSecs(timeLength) {
    timeLength = timeLength*60;
    var mins = (Math.floor(timeLength/60) > 9) ? Math.floor(timeLength/60) : "0" + Math.floor(timeLength/60);
    var secs = (timeLength % 60) > 9 ? (timeLength % 60) : "0" + (timeLength % 60);
    var formattedTime = mins + ":" + secs;
    return formattedTime;
  }
  //function to display count, or break/session setting times, in minutes and seconds - initally multiply value by 60 to get time in seconds. Then for minutes: (seconds divided by 60 gives minutes then just to extract the WHOLE number of minutes used Math.floor to get rid of the decimal points (these are the excess seconds which will be in the seconds part of the display)) - for seconds: the remainder of the seconds divided by 60, this is the excess (since all other seconds will form the minutes which are displayed in the minutes part of the display) NB the minutes and seconds bit is for the current count since our inputted settings will always be done in increments of 1 minute
  function indicator() {
    if (timerCheck && sessionCheck) {
      $("#sessionIndicator").css({"color": "#004C99", "text-shadow": "0px 0px 1px #33FFFF"});
      //can change more than one css property at a time by inserting them as an object
      $("#breakIndicator").css({"color": "black", "text-shadow": ""});
    } else if (timerCheck && !sessionCheck) {
      $("#breakIndicator").css({"color": "#004C99", "text-shadow": "0px 0px 1px #33FFFF"});
      $("#sessionIndicator").css({"color": "black", "text-shadow": ""});
    } else {
      $("#breakIndicator").css({"color": "black", "text-shadow": ""});
      $("#sessionIndicator").css({"color": "black", "text-shadow": ""});
    }
  }
  //indicator function to be called later (when start/pause is clicked, and when we go from session countdown to break countdown and vice versa)
  function flashAlarm() {
    $(".screen").css("background-color", ($(".screen").css("background-color") == "rgb(255, 128, 0)") ? "#DC0000" : "#FF8000");
    //if screen is at original color then flash screen from original color to red; and if screen is red, flash from red back to original color NB had to check background color using the rgb format version of the background color that is currently set (seems to be the format that it is extracted in by jQuery)
  }
  //function for alarm; alarm will be triggered when countdown time reaches zero and it wll call this function once every interval
  $("#breakTime").html(minsAndSecs(breakTime));
  $("#sessionTime").html(minsAndSecs(sessionTime));
  //initial time settings displayed
  $("#breakDec").click(function(){
    //when brealDec clicked
    if (breakTime > 1) {
      //if we have not hit our minumum setting limit
      breakTime -= 1;
      $("#breakTime").html(minsAndSecs(breakTime));
      //decrease setting by one and show this on setting display
    }
  })
  $("#breakInc").click(function(){
    if (breakTime < 59) {
      //if we have not hit our maximum setting limit
      breakTime += 1;
      $("#breakTime").html(minsAndSecs(breakTime));
      //increase the setting by onw and show this on the setting display
    }
  })
  $("#sessionDec").click(function(){
    if (sessionTime > 1) {
      sessionTime -= 1;
      $("#sessionTime").html(minsAndSecs(sessionTime));
    }
  })
  $("#sessionInc").click(function(){
    if (sessionTime < 59) {
      sessionTime += 1;
      $("#sessionTime").html(minsAndSecs(sessionTime));
    }
  })
  //these two click function are the same as those of the breakTime setting click functions above only these are for the session time settings instead
  $("#timeLeft").html(minsAndSecs(count));
  //display the time of the current segment (session time if sessionCheck is true and break time if sessionCheck is false)
  function countdown() {
    if (count == 0 && sessionCheck) {
      //if count hits zero and the timer was showing the session countdown
      count = breakTime;
      sessionCheck = false;
      indicator();
      //set indicator
      var alarm = setInterval(flashAlarm, 350);
      //set the flashAlarm function from before (in other words alternate the screen colour every 350ms)
      setTimeout(function(){
        clearInterval(alarm);
        $(".screen").css("background-color", "#FF8000");
      }, 5000);
      //once the alarm (intervals) has been running for 5000ms (5s) stop the intervals and change the screen colour back to its default color (incase it stops on the alternate colour due to the flash alarm being called once for each interval)
    } else if (count == 0 && !sessionCheck) {
      //if count hits zero and the timer was showing the break countdown
      count = sessionTime;
      sessionCheck = true;
      indicator();
      //set indicator
      var alarm = setInterval(flashAlarm, 350);
      setTimeout(function(){
        clearInterval(alarm);
        $(".screen").css("background-color", "#FF8000");
      }, 5000);
    } else {
      count = (count*60 - 1)/60;       //take away one second from count (which is measured in minutes)
      $("#timeLeft").html(minsAndSecs(count));
    }
  }
  //this function what will happen at each interval of our setInterval (every 1000ms, in other words, every second)
  $("#startPause").click(function(){    
    if (!timerCheck) { 
      timer = setInterval(countdown, 1000);
      timerCheck = true;
      indicator();
      //if timer is currently in a paused state, start it off (begin calling the counter function at each interval)
    } else if (timerCheck = true){
      clearInterval(timer);
      timerCheck = false;
      indicator();
      //if timer is in a running state, pause it (stop the intervals of calling the counter function)
    }   
  })
  $("#switchButton").click(function(){
    if (!timerCheck) {
      if (sessionCheck) {
        count = breakTime;
        sessionCheck = false;
      } else {
        count = sessionTime;
        sessionCheck = true;
      }
      $("#timeLeft").html(minsAndSecs(count));
    }
  })
  $("#reset").click(function(){
    if (!timerCheck) {
      if (sessionCheck) {
        count = sessionTime;
      } else {
        count = breakTime;
      }
      $("#timeLeft").html(minsAndSecs(count));
    }
    //reset all important (state declaring) values to initial state
  })
})
//THIS HAS 21 LINES OF CODE MORE THAN THAT OF THE EXAMPLE PROVIDED BY FREE CODE CAMP, YET IT HAS A BIT MORE FUNCTIONALITY (CAN CHANGE TIME SETTING WHILE TIMER IS RUNNING, CAN SWITCH BETWEEN SESSION AND BREAK AT WILL, CAN CHANGE TIME SETTING OF CURRENT SEGMENT (SESSION/BREAK) WITHOUT IT AFFECTING THE CURRENT COUNTDOWN - BUT THE CONTDOWN CAN BE RESET TO THIS NEW SETTING BY HITTING THE RESET BUTTON)