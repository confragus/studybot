// submit score ############################################s####

function submit_score(){
  var score_report = prompt("You have died. Your score is " + score + 
                            ". Please enter your nickname:", "studybot");
  
  var score_form = document.createElement('form');
  score_form.setAttribute('action', 'https://empirestreet.com.au/highscores');
  score_form.setAttribute('method', 'post');
  score_form.setAttribute('target', 'dummyframe');
  container.appendChild(score_form);

  var score_name = document.createElement("INPUT");
  score_name.setAttribute("id", score_name);
  score_name.setAttribute("value", score_report);
  score_name.setAttribute('name', 'score_name');

  var score_recorded = document.createElement("INPUT");
  score_recorded.setAttribute("value", score);
  score_recorded.setAttribute('name', 'score_recorded');

  var quiz_type = document.createElement("INPUT");
  quiz_type.setAttribute("value", filename);
  quiz_type.setAttribute('name', 'quiz_type');

  score_form.appendChild(score_name);
  score_form.appendChild(score_recorded);
  score_form.appendChild(quiz_type);
  score_form.submit(function(evt){
     evt.preventDefault();
  });

  hide(score_form);

  rank = 1;
  total_got_score = 0;

  score_storage.forEach(got_score=> {
    if (score <= got_score.score){
      rank++;
    }
    total_got_score++;
  })

  const finish_header = document.createElement('h3');
  finish_header.innerHTML = score_report + ' records posted'; 
  container.appendChild(finish_header);

  const close_board_div = document.createElement('div');
  close_board_div.setAttribute('class', 'd_calculator');
  container.appendChild(close_board_div);

  var your_score_title = document.createElement('div')
  close_board_div.appendChild(your_score_title);

  var score_title = document.createElement('p')
  score_title.setAttribute('class', 'center');
  score_title.innerHTML = 'score'; 
  your_score_title.appendChild(score_title);

  var your_score_value = document.createElement('div')
  close_board_div.appendChild(your_score_value);

  var h1_score = document.createElement('p')
  h1_score.setAttribute('class', 'center');
  h1_score.innerHTML = score; 
  your_score_value.appendChild(h1_score);

  var your_rank_title = document.createElement('div')
  close_board_div.appendChild(your_rank_title);

  var rank_title = document.createElement('p')
  rank_title.setAttribute('class', 'center');
  rank_title.innerHTML = 'rank'; 
  your_rank_title.appendChild(rank_title);

  var your_rank_value = document.createElement('div')
  close_board_div.appendChild(your_rank_value);

  var h1_rank = document.createElement('p')
  h1_rank.setAttribute('class', 'center');
  h1_rank.innerHTML = Math.max((100 - round(rank/total_got_score*100,0)),0) + "%"; 
  your_rank_value.appendChild(h1_rank);


  var restart_button = document.createElement('button');
  restart_button.setAttribute('class', 'button');
  restart_button.textContent = 'restart';
  restart_button.addEventListener("click", restart_script);
  container.appendChild(restart_button);
  smoothScroll(restart_button);
}


// get high scores ########################################################################

score_storage = {};

function get_highscores(){

  var top_ten_list = document.createElement('h2')
  top_ten_list.innerHTML = 'High Scores'; 
  container.appendChild(top_ten_list);

  top_ten = 0;

  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest();

  // Open a new connection, using the GET request on the URL endpoint

  request.open('GET', 'https://empirestreet.com.au/savescores', true);
  request.onload = function () {

    // Begin accessing JSON data here
    var data = JSON.parse(this.response);

    data.sort(function(b, a){
      return a.score - b.score;
    });

    score_storage = data;

    const top_ten_div = document.createElement('div');
    top_ten_div.setAttribute('class', 'd_calculator');
    container.appendChild(top_ten_div);

    data.forEach(got_score => {
        if(top_ten <5 && got_score.quiz == filename){
          top_ten++;
          const table_titles = document.createElement('div');
          top_ten_div.appendChild(table_titles);

          var h_names = document.createElement('p')
          h_names.setAttribute('class', 'center');
          h_names.innerHTML = got_score.name; 
          table_titles.appendChild(h_names);

          const table_values = document.createElement('div');
          top_ten_div.appendChild(table_values);

          var h_score = document.createElement('p')
          h_score.setAttribute('class', 'center');
          h_score.innerHTML = got_score.score;
          table_values.appendChild(h_score); 
        }
        
    })
  }
  request.send();
}



// Timer ########################################################################

var showmns = document.getElementById('showmns');
var showscs = document.getElementById('showscs');
var d_ready = document.getElementById('d_ready');
var s_health = document.getElementById('s_health');

var timer_count = 0;
var timer_add = 0;

function pad2(n) {
    return n < 10 ? '0' + n : n;
};

function show() {
  showscs.innerHTML = round(timer_count,0);
};


function restart_script(){
  location.reload();
}

function timer() {
  timer_count--;
  timer_count += timer_add;
  timer_add = 0;
  if (lives <= 0){
    document.getElementsByClassName('button').disabled = true;
    submit_score();
  } else {
      if (timer_count >= 0) {
          show();
          setTimeout(timer, 1000);
      } else {
        lives = lives - 1/100;
        s_health.innerHTML = round(lives,2);
        show();
        setTimeout(timer, 1000);
      };
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
        i++; if (i > 10) return;
        c.scrollTop = a + (b - a) / 10 * i;
        setTimeout(function(){ scroll(c, a, b, i); }, 10);
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
var imgv = "";
var card_id = 0;
var current_qn = 0;
var lives = 3;
var saved_marks = [];
var limit_questions = 0;
var path = window.location.pathname;
var page = path.split("/").pop();
var button_count = 0;
var Core_printed = 0;
var marks_seconds = 0;

const app = document.getElementById('root');
const p_score = document.getElementById('p_score');
const container = document.createElement('div');
container.setAttribute('class', 'container');

var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);

if( (filename == "index.html" || filename == "") == false) {
  app.appendChild(container);
}

var subjectlink = '';

if (filename == 'quiz.html'){
  subjectlink = 'https://empirestreet.com.au/questionlist';
} 
if (filename == 'MG2.html'){
  subjectlink = 'https://empirestreet.com.au/MG2list';
} 
if (filename == 'SelectiveNSW.html'){
  subjectlink = 'https://empirestreet.com.au/SelectiveNSWlist';
} 
if (filename == 'SelectiveVIC.html'){
  subjectlink = 'https://empirestreet.com.au/SelectiveVIClist';
} 

// Demo Section ################################################################

if( filename == "index.html" || filename == "") {
  const demo = document.getElementById('demo');
  const input_demo = document.createElement('input');

  const input_User_text = document.createElement('h5');
  input_User_text.innerHTML = "calculator:";

  const eval_User_text = document.createElement('h5');
  eval_User_text.innerHTML = "result:";

  const eval_demo = document.createElement('input');
  eval_demo.readOnly = true; 

  demo.appendChild(input_User_text);
  demo.appendChild(eval_User_text);
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
        eval_demo.value = "";
      } else {
        if (isNaN(eval(expression.toString())) != true){           
          eval_demo.value = "= " + eval(expression.toString());
        }
      }
    }
  });
}

// Question Section ################################################################

function new_question(){

  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest();

  // Open a new connection, using the GET request on the URL endpoint

  request.open('GET', subjectlink, true);
  request.onload = function () {

    // Begin accessing JSON data here
    var data = JSON.parse(this.response);

    data.forEach(question => { //########################################################################

      // Create a div with a card class

      const hr_bar = document.createElement('hr');

      const card = document.createElement('div');
      card.setAttribute('class', 'card');

      const p_id = document.createElement('h5');

      const p_timeadded = document.createElement('h5');

      const p_CoreQuestion = document.createElement('p');
      const img_question = document.createElement('img');

      const img_q1 = document.createElement('img');

      const p_Question = document.createElement('p');

      const d_mc = document.createElement('div');
      d_mc.setAttribute('class', 'd_mc');
      const p_mcA = document.createElement('button');
      const p_mcB = document.createElement('button');
      const p_mcC = document.createElement('button');
      const p_mcD = document.createElement('button');
      const p_mcE = document.createElement('button');

      p_mcA.setAttribute('class', 'button');
      p_mcB.setAttribute('class', 'button');
      p_mcC.setAttribute('class', 'button');
      p_mcD.setAttribute('class', 'button');
      p_mcE.setAttribute('class', 'button');

      const d_calculator = document.createElement('div');
      d_calculator.setAttribute('class', 'd_calculator');

      const input_User_text = document.createElement('h5');
      input_User_text.innerHTML = "calculator:";

      const eval_User_text = document.createElement('h5');
      eval_User_text.innerHTML = "result:";

      const input_User = document.createElement('input');
      const eval_User = document.createElement('input');
      eval_User.readOnly = true;  
      
      const p_mcanswer = document.createElement('p');
      hide(p_mcanswer);
      p_mcanswer.innerHTML = "";
      
      const button_submit = document.createElement('button');
      button_submit.setAttribute('class', 'button');
      
      const p_Answer = document.createElement('p');

      const p_Solution = document.createElement('p');

      const p_Result = document.createElement('h3');
      p_Result.innerHTML = "";
      
      function marks(x){
        if (x === '1'){
          return " (" + x + " mark)"
        } else {
          return " (" + x + " marks)"
        }
      }

      //multiple choice questions
      if (question.A != "") {
        if (question.A.toLowerCase() != "a"){
          p_mcA.textContent = "A) " + question.A;
          p_mcB.textContent = "B) " + question.B;
          p_mcC.textContent = "C) " + question.C;
          p_mcD.textContent = "D) " + question.D;
          p_mcE.textContent = "E) " + question.E;
        } else {
          p_mcA.textContent = "A";
          p_mcB.textContent = "B";
          p_mcC.textContent = "C";
          p_mcD.textContent = "D";
          p_mcE.textContent = "E";
        }
          
      }
      
      p_mcA.addEventListener("click", myClickScriptA);
      p_mcB.addEventListener("click", myClickScriptB);
      p_mcC.addEventListener("click", myClickScriptC);
      p_mcD.addEventListener("click", myClickScriptD);
      p_mcE.addEventListener("click", myClickScriptE);

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
      button_submit.addEventListener("click", myClickScriptW);
      button_submit.textContent = "submit calculator";

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
              eval_User.value = "";
            } else {
              if (isNaN(eval(expression.toString())) != true){           
                eval_User.value = "= " + eval(expression.toString());
              }
            }
          }
      });
      // input_User.addEventListener('focusout', function(e) {button_submit.click();});

      function myClickScriptA() {myClickScript("a")};
      function myClickScriptB() {myClickScript("b")};
      function myClickScriptC() {myClickScript("c")};
      function myClickScriptD() {myClickScript("d")};
      function myClickScriptE() {myClickScript("e")};
      function myClickScriptW() {myClickScript("w")};

      function disablebutton(x){
        x.disabled = true;
        x.setAttribute('class', 'submitted');
      }

      function myClickScript(mc) {
        // force answer on all inputs
        if (input_User.value === "" && mc == "w") {
          return;
        } else {      
          // lock last question
          disablebutton(button_submit);
          disablebutton(p_mcA);
          disablebutton(p_mcB);
          disablebutton(p_mcC);
          disablebutton(p_mcD);
          disablebutton(p_mcE);
          if (mc=="a"){
            p_mcA.style.backgroundColor = '#357e7b';
          } else if (mc=="b"){
            p_mcB.style.backgroundColor = '#357e7b';
          } else if (mc=="c"){
            p_mcC.style.backgroundColor = '#357e7b';
          } else if (mc=="d"){
            p_mcD.style.backgroundColor = '#357e7b';
          } else if (mc=="e"){
            p_mcE.style.backgroundColor = '#357e7b';
          }

          button_submit.style.backgroundColor = '#357e7b';

          input_User.readOnly = true;    
          button_count--;  

          // display answers
          display(p_id);
          display(p_Result);
          display(p_Answer);
          display(p_Solution);
          // smoothScroll(p_Solution);

          if (input_User.value.toLowerCase() === String(question.Answer).toLowerCase() || 
              round(parseFloat(input_User.value),6) === round(parseFloat(question.Answer),6) ||
              round(parseFloat(eval_User.value.substring(2)),6) === round(parseFloat(question.Answer),6) ||
              mc === String(question.Answer).toLowerCase()) {
            if (timer_count < 0){
              p_Result.innerHTML = "Correct but out of time half marks awarded! +" + 
                                        parseFloat(question.Marks)/2 + 
                                        " Score! "
              card.style.backgroundColor = "#D7D8EF";
              score = score + parseFloat(question.Marks)/2;
              p_score.innerHTML = score;
            } else {
              p_Result.innerHTML = "Correct! +" + 
                                        parseFloat(question.Marks) + 
                                        " Score!";
              card.style.backgroundColor = "#D8EFD7";
              score = score + parseFloat(question.Marks);
              p_score.innerHTML = score;
            }
          } else {
            p_Result.innerHTML = "Incorrect! Lost a life!";
            card.style.backgroundColor = "#F0DADB";
            lives = lives-1;
            s_health.innerHTML = round(lives,2);
          };

          // New Question
          if (button_count == 0 && lives > 0){
            Core_printed = 0;
            timer_count = 1;
            new_question();
            level = Math.floor(score/5);
           };
        };
      };

      if (question.Exclude == ""){

        if (question.Syllabus == "Reading"){
          marks_seconds = (40/45)*60; 
        } else if (question.Syllabus == "Mathematics"){
          marks_seconds = (40/40)*60; 
        } else if (question.Syllabus == "General Ability"){
          marks_seconds = (40/60)*60; 
        } else {
          marks_seconds = 90;
        }
        marks_seconds = round(marks_seconds,0);

        timer_add += parseFloat(question.Marks)*(marks_seconds-score);
        p_timeadded.innerHTML = ""+parseFloat(question.Marks)*(marks_seconds-score)+
                                " seconds added to the clock [ "+parseFloat(question.Marks)+"marks x ( " + 
                                marks_seconds +" seconds - "+ score + " score ) ]";

        // Append the cards to the container element
                     
        container.appendChild(hr_bar);
        container.appendChild(card);
        card.appendChild(p_timeadded);          
        card.appendChild(p_CoreQuestion);
        if( question.CorePicture != "") {
          card.appendChild(img_question);
        };

        card.appendChild(p_Question);
        if( question.Picture != "") {
          card.appendChild(img_q1);
        };

        card.appendChild(p_Result);

        if( question.A != "") {
          card.appendChild(p_mcA);
          card.appendChild(p_mcB);
          card.appendChild(p_mcC);
          card.appendChild(p_mcD);
        }
        if( question.E != "") {
          card.appendChild(p_mcE);
        }

        card.appendChild(d_calculator)
        
        d_calculator.appendChild(input_User_text);
        d_calculator.appendChild(eval_User_text);
        d_calculator.appendChild(input_User);
        d_calculator.appendChild(eval_User);
        
        card.appendChild(button_submit);
        if( question.A != "") {
          hide(button_submit);
        }

        card.appendChild(p_id);
        card.appendChild(p_Answer);
        card.appendChild(p_Solution);

        button_count++;

        // Hide answers
        hide(p_id);
        hide(p_Result);
        hide(p_Answer);
        hide(p_Solution);
      }          

    });
   
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  }
  request.send();
}



//start up ###########################
if ((filename == "index.html" || filename == "") == false) {
  get_highscores();
  new_question();
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  timer_count = 0;
  starttimer(0,3);
}



