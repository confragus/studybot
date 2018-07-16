// Timer ########################################################################

var showmns = document.getElementById('showmns');
var showscs = document.getElementById('showscs');
var d_ready = document.getElementById('d_ready');

var timer_count = 0;
var timer_add = 0;

function pad2(n) {
    return n < 10 ? '0' + n : n;
};

function show() {
  // var s = timer_count % 60;
  // var m = Math.floor(timer_count / 60);
  // showmns.innerHTML = pad2(m);
  // showscs.innerHTML = pad2(s);
  showscs.innerHTML = timer_count;
};

function timer() {
  timer_count--;
  timer_count += timer_add;
  timer_add = 0;
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

// Health Bar ########################################################################

function health_bar(start,end) {
  var elem = document.getElementById("myBar");   
  var width = start;
  var id = setInterval(frame, 30); 
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

// Collapsible ########################################################################
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

// Scrolling ########################################################################
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

// rounding ########################################################################

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

// Hide/Display ########################################################################
function display(x) {
  x.style.display = "block";
}

function hide(x){
  x.style.display = "none";
}

//Shuffle ########################################################################
function shuffle(sourceArray) {
  for (var i = 0; i < sourceArray.length - 1; i++) {
      var j = i + Math.floor(Math.random() * (sourceArray.length - i));

      var temp = sourceArray[j];
      sourceArray[j] = sourceArray[i];
      sourceArray[i] = temp;
  }
  return sourceArray;
}

//calculator ########################################################################

function productRange(a,b) {
  var product=a,i=a;
 
  while (i++<b) {
    product*=i;
  }
  return product;
}

function combinations(n,k) {
  if (n==k) {
    return 1;
  } else {
    k=Math.max(k,n-k);
    return productRange(k+1,n)/productRange(1,n-k);
  }
}

function permutations(n,k) {
  return productRange(k+1,n);
}

var pi = Math.PI;
function sin(angle) {return Math.sin(angle/180*Math.PI);};
function cos(angle) {return Math.cos(angle/180*Math.PI);};
function tan(angle) {return Math.tan(angle/180*Math.PI);};
function asin(x) {return Math.asin(x)*180/pi;};
function acos(x) {return Math.acos(x)*180/pi;};
function atan(x) {return Math.atan(x)*180/pi;};
function pow(a,b) {return Math.pow(a,b);};
function sqrt(a) {return Math.sqrt(a);};
function comb(a,b) {return combinations(a, b);}
function perm(a,b) {return permutations(a, b);}

// Variables ########################################################################
var score = 0;
var maxscore = 0;
var accuracy = 0;
var imgv = "?0.2";
var card_id = 0;
var current_qn = 0;
var lives = 100;
var saved_marks = [];
var stop_clock = 0;
var limit_questions = 0;
var path = window.location.pathname;
var page = path.split("/").pop();
var button_count = 0;
var Core_printed = 0;

// Demo Section ################################################################

const demo = document.getElementById('demo');
const input_demo = document.createElement('input');

const eval_demo = document.createElement('p');
eval_demo.setAttribute('class', 'parsed_User');
eval_demo.innerHTML = "";

demo.appendChild(input_demo);
demo.appendChild(eval_demo);

//Javascript parsing
input_demo.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
  } else {
    var expression = new String(input_demo.value);
    if (input_demo.value == "" || 
        input_demo.value == null ||
        expression.indexOf('=') != -1
        ){
      eval_demo.innerHTML = "";
    } else {
      if (isNaN(eval(expression.toString())) != true){           
        eval_demo.innerHTML = "= " + eval(expression.toString());
      }
    }
  }
});

// Root Section ################################################################

// Access div in index.html
const app = document.getElementById('root');

// set up container
const container = document.createElement('div');
container.setAttribute('class', 'container');

const p_score = document.getElementById('p_score');
const p_level = document.getElementById('p_level');

// add logo and containder to the app root
app.appendChild(container);

function new_question(){

  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest();

  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'https://empirestreet.com.au/questionlist', true);
  request.onload = function () {

    // Begin accessing JSON data here
    var data = JSON.parse(this.response);

    data.forEach(question => { //########################################################################

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

      const eval_User = document.createElement('p');
      eval_User.setAttribute('class', 'parsed_User');
      eval_User.innerHTML = "";
      
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
      img_question.setAttribute('src',"https://empirestreet.com.au/img/qn/"+ question.CorePicture +".png" + imgv);
      img_q1.setAttribute('src',"https://empirestreet.com.au/img/qn/"+ question.Picture +".png" + imgv);
      
      //content
      p_Answer.textContent = "Answer is: " + question.Answer;
      p_Solution.textContent = question.Solution;

      //button
      button_submit.addEventListener("click", myClickScript);
      button_submit.textContent = "submit";

      //Javascript parsing
      input_User.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          // button_submit.click();
          } else {
            var expression = new String(input_User.value);
            if (input_User.value == "" || 
                input_User.value == null ||
                expression.indexOf('=') != -1
                ){
              eval_User.innerHTML = "";
            } else {
              if (isNaN(eval(expression.toString())) != true){           
                eval_User.innerHTML = "= " + eval(expression.toString());
              }
            }
          }
      });
      // input_User.addEventListener('focusout', function(e) {button_submit.click();});

      function myClickScript() {
        // force answer on all inputs
        if (input_User.value === "") {
          return;
        } else {      
          // lock last question
          button_submit.disabled = true;
          button_submit.setAttribute('class', 'submitted');
          input_User.readOnly = true;    
          button_count--;  

          // display answers
          display(p_Answer);
          display(p_Solution);
          smoothScroll(p_Solution);

          if (input_User.value.toLowerCase() === String(question.Answer).toLowerCase() || 
              round(parseFloat(input_User.value),6) === round(parseFloat(question.Answer),6) ||
              round(parseFloat(eval_User.innerHTML.substring(2)),6) === round(parseFloat(question.Answer),6)) {
            if (timer_count < 0){
              button_submit.innerHTML = "Correct but out of time half marks awarded! +" + 
                                        parseFloat(question.Marks)/2 + 
                                        " Score! "
              card.style.backgroundColor = "#355d7e";
              score = score + parseFloat(question.Marks)/2;
              p_score.innerHTML = score;
            } else {
              button_submit.innerHTML = "Correct! +" + 
                                        parseFloat(question.Marks) + 
                                        " Score! ";
              card.style.backgroundColor = "#357e7b";
              score = score + parseFloat(question.Marks);
              p_score.innerHTML = score;
            }
          } else {
            button_submit.innerHTML = "Incorrect! 35 seconds lost from timebank.";
            card.style.backgroundColor = "#7e3538";
            health_bar(lives,lives-35);
            lives = lives-35;  
          };

          if (button_count == 0){
            Core_printed = 0;
            timer_count = 1;
            new_question();
            level = Math.floor(score/5);
            p_level.innerHTML = level;
           };
        };
      };

      if (question.Exclude == ""){

        timer_add = parseFloat(question.Marks)*(90-score);

        // Append the cards to the container element
        container.appendChild(card);

        card.appendChild(p_id);
        if (Core_printed == 0){
          Core_printed = 1;
          card.appendChild(p_CoreQuestion);
          if( question.CorePicture != "") {
            card.appendChild(img_question);
          };
        }

        card.appendChild(p_Question);
        if( question.Picture != "") {
          card.appendChild(img_q1);
        };
        card.appendChild(p_mcA);
        card.appendChild(p_mcB);
        card.appendChild(p_mcC);
        card.appendChild(p_mcD);
        
        card.appendChild(input_User);
        card.appendChild(eval_User);
        
        card.appendChild(button_submit);
        smoothScroll(button_submit);
        button_count++;

        card.appendChild(p_Answer);
        card.appendChild(p_Solution);

        // Hide answers
        hide(p_Answer);
        hide(p_Solution);
      }          

    });
   
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  }
  request.send();
}

//start up
new_question();
MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
MathJax.Hub.Queue(function(){
  hide(document.getElementById('load_icon'));
  timer_count = 0;
  starttimer(0,0);
});


