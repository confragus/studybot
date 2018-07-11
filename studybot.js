// Collapsible
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      } 
    });
  }

// Scrolling
window.smoothScroll = function(target) {
    var scrollContainer = target;
    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    scroll = function(c, a, b, i) {
        i++; if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(function(){ scroll(c, a, b, i); }, 20);
    }
    // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}

// Variables
var score = 0;
var maxscore = 0;
var accuracy = 0;
var imgv = "?0.2";
var card_id = 0;
var current_qn = 1;
var lives = 100;
var saved_marks = [];
var stop_clock = 0;
var limit_questions = 0;

// Hide/Display
function display(x) {
  x.style.display = "block";
}

function hide(x){
  x.style.display = "none";
}

//Shuffle
function shuffle(sourceArray) {
  for (var i = 0; i < sourceArray.length - 1; i++) {
      var j = i + Math.floor(Math.random() * (sourceArray.length - i));

      var temp = sourceArray[j];
      sourceArray[j] = sourceArray[i];
      sourceArray[i] = temp;
  }
  return sourceArray;
}

// Root Section ################################################################

// Access div in index.html
const app = document.getElementById('root');

// set up container
const container = document.createElement('div');
container.setAttribute('class', 'container');

// add logo and containder to the app root
app.appendChild(container);

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();

const p_score = document.getElementById('p_score');

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'http://empirestreet.com.au/questionlist', true);
request.onload = function () {

  // Begin accessing JSON data here
  var data = JSON.parse(this.response);

  datarandom = shuffle(data);

  datarandom.forEach(question => {

    limit_questions++;
    if(limit_questions<100){

      // Create a div with a card class
      const card = document.createElement('div');
      card.setAttribute('class', 'card');

      const p_id = document.createElement('h5');
      const p_CoreQuestion = document.createElement('p');
      const img_question = document.createElement('img');

      const img_q1 = document.createElement('img');

      const p_Question = document.createElement('p');

      const p_mcA = document.createElement('p');
      const p_mcB = document.createElement('p');
      const p_mcC = document.createElement('p');
      const p_mcD = document.createElement('p');

      const input_User = document.createElement('input');
      
      const button_submit = document.createElement('button');
      button_submit.setAttribute('class', 'button');
      
      const p_Answer = document.createElement('p');

      const p_Solution = document.createElement('p');
      
      function marks(x){
        if (x === '1'){
          return " (" + x + " mark)"
        } else {
          return " (" + x + " marks)"
        }
      }

      //multiple choice questions
      if (question.A != "") {
        p_mcA.textContent = "A) " + question.A;
        p_mcB.textContent = "B) " + question.B;
        p_mcC.textContent = "C) " + question.C;
        p_mcD.textContent = "D) " + question.D;
      }
      
      //tag
      p_id.textContent = question.Subject + "-" + question.Year + " Q-"
        + question.ID + question.ID2 + question.ID3 + question.Exclude;  

      //question
      if (question.Question != ""){
        p_CoreQuestion.textContent = question.CoreQuestion;
        p_Question.textContent = question.Question + marks(question.Marks);
      } else {
        p_CoreQuestion.textContent = question.CoreQuestion + marks(question.Marks);
      }
             
      //images
      if (location.hostname === "") {
        img_question.setAttribute('src',"../static/img/qn/"+ question.CorePicture +".png" + imgv);
        img_q1.setAttribute('src',"../static/img/qn/"+ question.Picture +".png" + imgv);
      } else {
        img_question.setAttribute('src',"../img/qn/"+ question.CorePicture +".png" + imgv);
        img_q1.setAttribute('src',"../img/qn/"+ question.Picture +".png" + imgv);
      };

      //content
      p_Answer.textContent = "Answer is: " + question.Answer;
      p_Solution.textContent = question.Solution;

      //button
      button_submit.addEventListener("click", myClickScript);
      button_submit.textContent = "submit";
      input_User.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          button_submit.click();
        }
      });
      input_User.addEventListener('focusout', function(e) {button_submit.click();});

      function myClickScript() {
        // force answer on all inputs
        if (input_User.value === "") {
          return;
        } else {      
          // lock last question
          button_submit.disabled = true;
          button_submit.setAttribute('class', 'submitted');
          input_User.readOnly = true;      

          // display answers
          display(p_Answer);
          display(p_Solution);
          smoothScroll(p_Solution);

          if (input_User.value.toLowerCase() === String(question.Answer).toLowerCase() || 
          parseFloat(input_User.value) === parseFloat(question.Answer)) {
            if (timer_count < 0){
              button_submit.innerHTML = "Correct but out of time half marks awarded! +" + 
                                        parseFloat(question.Marks)/2 + 
                                        " Score! " + 
                                        -timer_count +
                                        " seconds spent from health points."
              card.style.backgroundColor = "#355d7e";
              score = score + parseFloat(question.Marks)/2;
              p_score.innerHTML = score;
            } else {
              button_submit.innerHTML = "Correct! +" + 
                                        parseFloat(question.Marks) + 
                                        " Score! " + 
                                        timer_count +
                                        " health points gained.";
              card.style.backgroundColor = "#357e7b";
              health_bar(lives,lives+timer_count)
              lives = lives+timer_count;
              score = score + parseFloat(question.Marks);
              p_score.innerHTML = score;
            }
          } else {
            if (timer_count < 0){
              button_submit.innerHTML = "Incorrect! " + 
                                        -timer_count +
                                        " seconds spent from health points. " +
                                        "Additional 35 health points lost.";
            } else {
              button_submit.innerHTML = "Incorrect! 35 health points lost.";
            }
            card.style.backgroundColor = "#7e3538";
            health_bar(lives,lives-35);
            lives = lives-35;  
          };
          current_qn += 1;
          
          // show next question
          stop_clock = 1;
          setTimeout(function(){
            if (lives <= 0){
              document.getElementsByClassName('button').disabled = true;
              alert("You have died. Your score is: " + score);
            } else {
              stop_clock = 0;
              starttimer_break(0,5);
              setTimeout(function(){
              display(document.getElementById(current_qn));
              smoothScroll(document.getElementById(current_qn));
              timer_count = 0;
              starttimer(0,saved_marks[current_qn]*(90-score));
              }, 5000);
            }
          } ,1000);
        };
      };

      // Append the cards to the container element
      container.appendChild(card);

      card.appendChild(p_id);
      card.appendChild(p_CoreQuestion);
      if( question.CorePicture != "") {
        card.appendChild(img_question);
      };
      card.appendChild(p_Question);
      if( question.Picture != "") {
        card.appendChild(img_q1);
      };
      card.appendChild(p_mcA);
      card.appendChild(p_mcB);
      card.appendChild(p_mcC);
      card.appendChild(p_mcD);
      card.appendChild(input_User);
      card.appendChild(button_submit);
      card.appendChild(p_Answer);
      card.appendChild(p_Solution);

      // Hide answers
      hide(p_Answer);
      hide(p_Solution);
      hide(card);

      // Exclude and add track Id
      if (question.Exclude === ""){
        card_id += 1;
        card.id = card_id;
        saved_marks[card_id] = parseFloat(question.Marks);
      };
    };
  });

  // Start up
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  MathJax.Hub.Queue(function(){
    
    document.getElementById('loading_message').innerHTML = 'Starting in 5 seconds';
    starttimer_break(0,5);
    setTimeout(function(){
    document.getElementById('loading_message').innerHTML = 'studybot';
    hide(document.getElementById('load_icon'));
    display(document.getElementById(current_qn));
    smoothScroll(document.getElementById(current_qn));
    timer_count = 0;
    starttimer(0,saved_marks[current_qn]*(90-score));
    }, 5000);
  });

}
request.send();

// Timer ########################################################################

var showmns = document.getElementById('showmns');
var showscs = document.getElementById('showscs');
var d_ready = document.getElementById('d_ready');

var timer_count = 0;

function pad2(n) {
    return n < 10 ? '0' + n : n;
};

function show() {
  // var s = timer_count % 60;
  // var m = Math.floor(timer_count / 60);
  // showmns.innerHTML = pad2(m);
  // showscs.innerHTML = pad2(s);
  showscs.innerHTML = timer_count;
  showscs.style.color = "#f8f8f2";
};

function timer() {
  timer_count--;
  if (lives <= 0){
    document.getElementsByClassName('button').disabled = true;
    alert("You have died. Your score is: " + score);
  } else {
    if (stop_clock === 0){
      if (timer_count >= 0) {
          show();
          setTimeout(timer, 1000);
      } else {
        health_bar(lives,lives-1);
        lives--;
        show();
        setTimeout(timer, 1000);
      };
    }
  }
};

function starttimer(mns,scs) {
  var s = parseInt(scs, 10);
  var m = parseInt(mns, 10);
  if (isNaN(s) || isNaN(m)) return;
  scs = s;
  mns = m;
  
  // reset timer_count to zero
  var current = timer_count;
  timer_count += (m * 60) + s;
  
  // only restart the timer_counter loop if it was previously stopped
  if (current <= 0) {
      timer();
  } else {
      show();
  };

};

// Break Timer ########################################################################

var timer_count_break = 0;

function show_break() {
    // var s = timer_count_break % 60;
    // var m = Math.floor(timer_count_break / 60);
    // showmns.innerHTML = pad2(m);
    // showscs.innerHTML = pad2(s);
    showscs.innerHTML = timer_count_break;
    showscs.style.color = "#222";
  };

function timer_break() {
    timer_count_break--;
    if (timer_count_break >= 0) {
        show_break();
        setTimeout(timer_break, 1000);
    } else {
      timer_count_break = 0;
    };

};


function starttimer_break(mns,scs) {
  var s = parseInt(scs, 10);
  var m = parseInt(mns, 10);
  if (isNaN(s) || isNaN(m)) return;
  scs = s;
  mns = m;
  
  // reset timer_count to zero
  var current = timer_count_break;
  timer_count_break += (m * 60) + s;
  
  // only restart the timer_counter loop if it was previously stopped
  if (current <= 0) {
      timer_break();
  } else {
      show_break();
  };

};

// Health Bar ########################################################################

function health_bar(start,end) {
  var elem = document.getElementById("myBar");   
  var width = start;
  var id = setInterval(frame, 10); 
  function frame() {
    if (width > end) {
      width--; 
      elem.style.width = width + '%'; 
      elem.innerHTML = width * 1;
    };
    if (width < end) {
      width++; 
      elem.style.width = width + '%'; 
      elem.innerHTML = width * 1;
    };
  }
}