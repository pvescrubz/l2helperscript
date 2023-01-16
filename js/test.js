
(() => {

    // include question array object;
      let questions = jsq_questions;

      let question_index = 0;
      let score = 0;
      let current_question_completed = false;

      const next_button = document.getElementById("next_question");
      const start_button = document.getElementById("jsq_start");

      const replaceHTMLtags = text => text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      // get all options radio
      const getAllOptions = () => document.querySelectorAll("input[name=jsq_option]");

      // after selected option disable radio
      const disableOptions = () => {
        let option_radios = getAllOptions();
        option_radios.forEach(element => {
          element.disabled = true;
          element.nextElementSibling.classList.add("disabled");
        });
      };


      // evaluate the user selected option answer
      const optionSelected = () => {
        let score_set = '0';
        let status = 'time out';
        let answer = questions[question_index].answer;
        let options_radios = getAllOptions();
        options_radios.forEach(element => {

          // correct answer [color green]
          if (element.value == answer) {
            element.nextElementSibling.classList.add("jsq-correct");
          }

          // user selected incorrect answer [color red].
          if (element.checked && element.value != answer) {
            element.nextElementSibling.classList.add("jsq-incorrect", "jsq_shake");

            // set user selected option. after preview all answers list
            questions[question_index].user_selected = element.value;
            score_set = 0;

            status = 'incorrect answer';
          }

          // user selected answer correct
          if (element.checked && element.value == answer) {
            score++;
            score_set = 1;

            status = 'correct answer';
          }

        });
        // set question answer status
        questions[question_index].status = status;
        // set score
        questions[question_index].score = score_set;
        // set current question completed
        questions[question_index].completed = true;

        current_question_completed = true;

        disableOptions();
        next_button.style.visibility = 'visible';
      };

      // show next question and options
      const showQuestion = () => {
        let current_question = questions[question_index];
        let options_div = '';
        let options = current_question.options;
        let id_number = 0;
        let option_id = ['A', 'B', 'C', 'D'];

        for (let key in options) {
          options_div += '<div class="jsq_anm" style="--jsq_at:' + (id_number + 1) + '">' +
            '<input type="radio" name="jsq_option" id="option_' + id_number + '" value="' + key + '">' +
            '<label for="option_' + id_number + '"><span>' + option_id[id_number] + '</span><span>' + replaceHTMLtags(options[key]) + '</span></label>' +
            '</div>';
          id_number++;
        }
        document.getElementById("jsq_question").innerText =  current_question.question;
        document.getElementById("jsq_options").innerHTML = options_div;
        document.getElementById("jsq_total").innerText = '' + (question_index + 1) + ' of  ' + questions.length + ' Questions';
        showCodeBox(current_question);
        let option_radios = getAllOptions();
        option_radios.forEach(element => {
          element.addEventListener("change", optionSelected);
        });
        current_question_completed = false;
      };

      // show all question answers
      const showAllAnswers = () => {
        let div = '';
        for (let i = 0; i < questions.length; i++) {
          let question_list = questions[i];
          let options = question_list.options;
          div += '<div class="jsq_answer_block">';
          div += '<div class="jsq_fnsh_question">'   + replaceHTMLtags(question_list.question) + '</div>';
          div += '<div class="jsq_fnsh_options">';
          for (let key in options) {

            if (question_list.answer == key) {
              div += '<p class="green-answer" style="color: green;font-weight: bold;">' + replaceHTMLtags(options[key]) + '</p>';
            } else if (question_list.user_selected == key) {
              div += '<p class="red-answer" style="color: red;font-weight: bold;">' + replaceHTMLtags(options[key]) + '</p>';
            } else {
              div += '<p>' + replaceHTMLtags(options[key]) + '</p>';
            }
          }

          div += '</div>';
          div += '</div>';
        }
        // div += '<a class="begin-study-button quiz-button-start-study popup-form-button" href="#">Начать обучение</a>'
        document.getElementById("jsq_all_answers").innerHTML = div;
        document.getElementById("all_answer_btn").remove();
      };


      // If there is coding in this question, it will appear in this code box. show hide box
      const showCodeBox = (current_question) => {
        let code_box = document.getElementById("jsq_code_box");
        let pre_code = document.querySelector("#jsq_code_box code");

        if (current_question.code == undefined) {
          code_box.style.display = 'none';
          pre_code.innerText = '';
        }else{
          code_box.style.display = 'block';
          pre_code.innerText = current_question.code;
        }
        // highlight code
        pre_code.innerHTML = Prism.highlight(pre_code.innerText, Prism.languages.javascript, 'javascript');
      };

      // question completed show result
      const completedQuiz = () => {
        let div = '<div class="jsq_finish_box">';
        div += '<br>';
        div += '<div class="jsq_score">Ваш результат: <b>' + '<span class="green-result">Верно: ' + score  +  '</span>                   '+ '' + '<span class="red-result">Неверно: ' + ( questions.length - score)  +  '</span>'+ '</b> <b>'  + '</b></div>';
        div += '<div class="jsq_score">Ваш уровень знаний: '+ yourlvl +'</div>';
        div += ' <button class="jsq_btn link__try result_bnt" id="all_answer_btn">Узнать результат</button>';

        div += '<div id="jsq_all_answers"></div>';
        div += '<a href="#0" class="begin-study-button quiz-button-start-study popup-form-button2" >Начать обучение</a>';
        div += '</div>';
        document.getElementById("jsq_box").innerHTML = div;
        const all_answer_btn = document.getElementById("all_answer_btn");

        all_answer_btn.addEventListener("click", showAllAnswers);
        [...document.querySelectorAll('.popup-form-button2')].forEach(function(item) {
          item.addEventListener('click', function() {
            document.querySelector('.modal').classList.toggle('modal_active'),
            document.querySelector('body').classList.toggle('body_active')
          });
           });




      };


      // go next question
      const nextQuestion = () => {
        // if option not selected
        if (!current_question_completed) {
          return;
        }

        question_index++;
        $("#progress_in").css({width: (100 * question_index / questions.length) + "%"});
        if (questions.length - 1 < question_index) {
          completedQuiz();
          return;
        }


        next_button.style.visibility = 'hidden';

        if (questions[question_index].completed) {
          next_button.style.visibility = 'visible';
        }

          showQuestion();
      };
      let yourlvl = '';

      if ( Math.round((100 * score) / questions.length) > 50 ) {
        yourlvl = 'Уровень знаний 1'
      }
      else if ( Math.round((100 * score) / questions.length) > 75 ) {
        yourlvl = 'Уровень знаний 2'
      }
      else if ( Math.round((100 * score) / questions.length) < 30 ) {
        yourlvl = 'Уровень знаний 3'
      }



      // start quiz
      const startQuiz = () => {
        document.querySelector(".jsq_header").removeAttribute("style");
        document.querySelector(".jsq_main_content").removeAttribute("style");
        document.querySelector(".jsq_footer").removeAttribute("style");
        document.querySelector("#jsq_ifo_box").remove();
        showQuestion();
      };

      next_button.addEventListener("click", nextQuestion);
      start_button.addEventListener("click", startQuiz);
      start_button.addEventListener("click", function (el) {
        start_button.style = "display: none;"
      });
      $(document).ready(function() {
        $('.burger-button').click(function() {
          $('.nav__list').toggleClass('open-menu');
        });
      });



    })();
