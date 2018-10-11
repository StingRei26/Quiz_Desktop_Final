

// Global Variables -------------------

var dataObject;
var correctAnswerQueue = [];


"use strict";

$(".slider").slick("getSlick").slideCount;

var initSlideshow = function(id) {
  $("#" + id).slick({
    dots: false,
    infinite: true,
    focusOnSelect: false,
    draggable: false,
    slidesToShow: 1,
    slidesToScroll:1,
    arrows: true,
    speed: 50,
    fade: true,
    cssEase: 'linear'
  });

  var currentSlide = $('#slider').slick('slickCurrentSlide');
  $('.slick-prev').toggle(currentSlide != 0);
  $('.slick-next').toggle(currentSlide != 2);
  
  $('#slider').one('afterChange', function(){
    $('.slick-prev,.slick-next').show();
  });
};


$(".slider").slick({
  autoplay: false,
  dots: true,
  customPaging: function(slider, i) {
    var thumb = $(slider.$slides[i]).data();
    return "<a>" + (i + 1) + "</a>";
  },
  responsive: [
    {
      breakpoint: 500,
      settings: {
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: false
      }
    }
  ]
},10);


//custom function showing current slide
var $status = $(".pagingInfo");
var $slickElement = $("#slider");

$slickElement.on("init reInit afterChange", function(
  event,
  slick,
  currentSlide,
  nextSlide
) {
//currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
  var i = (currentSlide ? currentSlide : 0) + 1;
  $status.text(i + " of " + slick.slideCount);

  userActionCounterinView (currentSlide); // <------ tracking code here --------
});

/* end of dot code */

/* to stop click to drag */

/* end of click to drag */

var createQuiz = function createQuiz(props) {
  var self = {};

  self.props = props;
  //console.log("props: ",props);

  self.state = {
    selectedAnswerIndex: undefined
  };

  self.handleChange = function(event) {
    event.preventDefault();

    // tracking codes here  ----------------------------------------------------
    var currentlySelectedBtnString = event.target.id;
    var currentQuestionSlide = currentlySelectedBtnString.substr(4,1);
    var currentSelectedOption = currentlySelectedBtnString.substr(6,1);
    
    customMetrics (currentQuestionSlide,currentSelectedOption);
    // end of tracking code here -----------------------------------------------

    if (!self.state.selectedAnswerIndex) {
      self.state.selectedAnswerIndex = event.currentTarget.value;
      self.render();
    }
  };

  self.renderLogo = function() {
    var img = document.createElement("img");
    img.className = "Logoimage";
    img.src = self.props.logo;
    img.alt = self.props.alt;
    return img;
  };

  self.renderImage = function() {
    var div = document.createElement("div");
    div.className = "image";
    div.setAttribute('aria-label', self.props.alt);
    return div;
  };

  self.renderHeader = function() {
    var header = document.createElement("h3");
    header.className = "header";
    header.textContent = props.header;
    return header;
  };

  self.renderQuestion = function() {
    var question = document.createElement("h4");
    question.className = "question";
    question.textContent = self.props.question;
    return question;
  };

  self.renderCTA = function() {
    var cta = document.createElement("button");
    cta.className = "cta";
    cta.textContent = props.cta;
    return cta;
  };

  self.renderPagingInfo = function() {
    var pagingInfo = document.createElement("span");
    pagingInfo.className = "pagingInfo";
    pagingInfo.textContent = self.props.pagingInfo;
    return pagingInfo;
  };


  self.renderAnswer = function(answer, i) {
    var key = [self.props.id, i].join("-");
    var isSelected = typeof self.state.selectedAnswerIndex !== "undefined";
    var isCorrect =
      isSelected && i.toString() === self.props.correctAnswerIndex;
    var isWrong =
      isSelected &&
      i.toString() !== self.props.correctAnswerIndex &&
      i.toString() === self.state.selectedAnswerIndex;

      correctAnswerQueue.push(self.props.correctAnswerIndex);

    var liClassNames = [
      "answer",
      isCorrect && "isCorrect",
      isWrong && "isWrong",
      isSelected && "isNotHoverable"
    ].filter(Boolean);

    var labelClassNames = [isSelected && "hidePointer"].filter(Boolean);

    var answerEl = document.createElement("li");
    answerEl.className = liClassNames.join(" ");

    var label = document.createElement("label");
    label.htmlFor = key;
    label.className = labelClassNames.join(" ");

    var answerText = document.createTextNode(answer);

    var input = document.createElement("input");
    input.id = key;
    input.className = "hide";
    input.type = "radio";
    input.value = i;
    input.addEventListener("change", self.handleChange);

    label.appendChild(input);
    label.appendChild(answerText);
    answerEl.appendChild(label);

    return answerEl;
  };

  self.renderAnswers = function() {
    var answers = document.createElement("ul");
    answers.className = "answers";

    var answerEls = self.props.answers.map(self.renderAnswer);
    answerEls.forEach(function(answerEl) {
      answers.appendChild(answerEl);
    });

    return answers;
  };

  self.renderTrivia = function() {
    var triviaEl = document.createElement("div");
    triviaEl.className = [
      "trivia",
      self.state.selectedAnswerIndex && "hasTransition"
    ]
      .filter(Boolean)
      .join(" ");
    triviaEl.textContent = self.props.trivia;
    return triviaEl;
  };

  self.render = function() {
    var root = document.getElementById(self.props.id);

    if (!root) {
      return;
    }

    root.className = ["root", self.props.className, self.props.dark && "dark"]
      .filter(Boolean)
      .join(" ");
    root.innerHTML = "";

    var shouldRenderTrivia =
      self.props.trivia &&
      typeof self.state.selectedAnswerIndex !== "undefined";

    // Render each part of the quiz and append the returned elements to `root`
    [
      // self.renderCTA(),
      self.renderPagingInfo(),
      self.renderImage(), // Render the image first to clear other elements...
      self.renderLogo(),
      self.renderHeader(), // ...and render the header _after_ the logo
      self.renderCTA(),
      self.renderQuestion(),
      self.renderAnswers(),
      
      
      shouldRenderTrivia && self.renderTrivia()
    ]
      .filter(Boolean)
      .forEach(function(el) {
        root.appendChild(el);
      });
  };

  self.render();
  return self;
};




/*-----------------------------*/
/*-----> EVENT LISTENERS <-----*/
/*-----------------------------*/

/*-----> NAV CLICKS <-----*/
function onLeftArrowClk(e){
  //  EB.userActionCounter('Previous_Slide');
    goPrevSlide();
    //console.log("left arrow clicked");
}

function onRightArrowClk(e){
   // EB.userActionCounter('Next_Slide');
   goNextSlide();
   // console.log("right arrow clicked");
}

/*-----> CLICK OUTS <-----*/
function onCtaClk(e){
   // EB.clickthrough('CTA_Click');
}

function onLogoClk(e){
   // EB.clickthrough('Logo_Click');
}

function onBgClk(e){
   // EB.clickthrough('Background_Click');
}


function onSlideClk(e){
	//fireSlideClk(currentSlide);
}
function onSlidePreviewClk(e){
   // fireSlideClk(currentSlide === creativeConfigObj.slides.length?1:currentSlide+1);
}


/***************************************** COPY FOR QUIZ ***************************************************/

function init (ad) {

 // console.log("ad information: ",ad.EB);
  dataObject = ad.EB;

  initSlideshow('slider'); 

  createQuiz({
    logo: 'images/black@2x.png',
    question: 'Who was the first president of the United States? Test your civics knowledge.',
    answers: ['George Washington', 'John Adams', 'Barack Obama'],
    cta:'',
    correctAnswerIndex: '0',
    trivia: 'Washington was widely admired for his strong leadership qualities and was unanimously elected president by the Electoral College in the first two national elections.',
    id: 'quiz1',
    alt: 'Image alt text',
    header: 'HOW MUCH DO YOU REALLY KNOW ABOUT THE U.S?',
    pagingInfo: ''
  });

  createQuiz({
    logo: 'images/black@2x.png',
    header: '',
    question: 'Who was the first president of the United States? Test your civics knowledge.',
    answers: ['George Washington', 'John Adams', 'Barack Obama'],
    cta:'',
    correctAnswerIndex: '0',
    trivia: 'Washington was widely admired for his strong leadership qualities and was unanimously elected president by the Electoral College in the first two national elections.',
    id: 'quiz2',
    alt: 'Image alt text',
    pagingInfo: ''
  });

  createQuiz({
    logo: 'images/black@2x.png',
    header: '',
    question: 'Who was the first president of the United States? Test your civics knowledge.',
    answers: ['George Washington', 'John Adams', 'Barack Obama'],
    cta:'',
    correctAnswerIndex: '0',
    trivia: 'Washington was widely admired for his strong leadership qualities and was unanimously elected president by the Electoral College in the first two national elections.',
    id: 'quiz3',
    alt: 'Image alt text',
    pagingInfo: '',
  });

  createQuiz({
    logo: 'images/black@2x.png',
    header: '',
    question: 'Who was the first president of the United States? Test your civics knowledge.',
    answers: ['George Washington', 'John Adams', 'Barack Obama'],
    cta:'',
    correctAnswerIndex: '0',
    trivia: 'Washington was widely admired for his strong leadership qualities and was unanimously elected president by the Electoral College in the first two national elections.',
    id: 'quiz4',
    alt: 'Image alt text',
    pagingInfo: '',
  });

  createQuiz({
    cta:'LEARN MORE',
    logo: 'images/black@2x.png',
    header: '',
    question: 'Who was the first president of the United States? Test your civics knowledge.',
    answers: [],
    // cta:'LEARN MORE',
    correctAnswerIndex: '0',
    trivia: '',
    id: 'quiz5',
    alt: 'Image alt text',
    pagingInfo: '',
    
  });


//for pagingInfo 

//this moves pagingInfo to the left when prev arrow appears //

  $(document).ready(function() {
    $('.pagingInfo').animate({left:"36px", right:"0px"}, 10);
    var sideMenu = false;
    $(".slick-next").click(function() {
      if (!sideMenu) {
        $(".pagingInfo").animate({right: "40px", left:"0px"}, 0);
        sideMenu = true;
      }
    });

    $(".image").click(function() {exits ("background");});
    $(".Logoimage").click(function() {exits ("logo");});
    $(".cta").click(function() {exits ("cta");});

  }); 

}

// tracking codes -------------------------------------------------------------------------------------------------

function userActionCounterinView (whichOne) {

  switch (whichOne) {
      case 0:
          dataObject.userActionCounter('inView-frame-1');
          break;
      case 1:
          dataObject.userActionCounter('inView-frame-2');
          break;
      case 2:
          dataObject.userActionCounter('inView-frame-3');
          break;
      case 3:
          dataObject.userActionCounter('inView-frame-4');
          break;
      case 4:
          dataObject.userActionCounter('inView-frame-5');
  }
}


function calculateCorrectAnswer (q,o) {
  var currentQ = Number(q) - 1;
  var currentO = Number(o);
 // console.log("calculate correct answer: ", currentQ, currentO);

  if (correctAnswerQueue[currentQ] == currentO) {
  //  console.log("answer is correct");
    correctAnswerCount(currentQ);
  }
  else {
  //  console.log("answer is incorrect");
  }
}


function correctAnswerCount (whichOne) {
  switch (whichOne) {
      case 0:
          dataObject.userActionCounter('correct-selected-for-question-1');
          break;
      case 1:
          dataObject.userActionCounter('correct-selected-for-question-2');
          break;
      case 2:
          dataObject.userActionCounter('correct-selected-for-question-3');
          break;
      case 3:
          dataObject.userActionCounter('correct-selected-for-question-4');
  }
}


function customMetrics (q,o) {
  calculateCorrectAnswer (q,o);
 // console.log("questions ",q, "   option: ",o);
  var question = Number(q);
  var option = Number(o);

  if ((question == 1) && (option == 0)) {dataObject.userActionCounter('selected-Question-1-option-1');}
  if ((question == 1) && (option == 1)) {dataObject.userActionCounter('selected-Question-1-option-2');}
  if ((question == 1) && (option == 2)) {dataObject.userActionCounter('selected-Question-1-option-3');}
  if ((question == 2) && (option == 0)) {dataObject.userActionCounter('selected-Question-2-option-1');}
  if ((question == 2) && (option == 1)) {dataObject.userActionCounter('selected-Question-2-option-2');}
  if ((question == 2) && (option == 2)) {dataObject.userActionCounter('selected-Question-2-option-3');}
  if ((question == 3) && (option == 0)) {dataObject.userActionCounter('selected-Question-3-option-1');}
  if ((question == 3) && (option == 1)) {dataObject.userActionCounter('selected-Question-3-option-2');}
  if ((question == 3) && (option == 2)) {dataObject.userActionCounter('selected-Question-3-option-3');}
}


function exits (whichOne) {
  if (whichOne == "logo")               { dataObject.clickthrough("Logo_Click");}
  else if (whichOne == "cta")           { dataObject.clickthrough("CTA_Click");}
  else if (whichOne == "background")    { dataObject.clickthrough("Background_Click");}

//  console.log("exits: ", whichOne);
}

// end of tracking function here -----------------------------------------------------------------------------------




