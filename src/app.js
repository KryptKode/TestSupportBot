import { getRandomItem, getRandomFrom } from "./util/randomiser";
import * as Messages from "./messages";
import { getGreeting } from "./greeting";
import { helpButtons, articleButtons } from './helpbuttons';
import * as Buttons from './helpbuttons';
import * as UIHandler from "./ui/ui";
import * as localStore from "./util/localstore";
import * as Words from "./util/words";
import * as API from './util/api';


var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var phoneformat = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
var userHasResponded = false;
var WELCOME = "welcome";
var FULL_NAME = "full_name";
var QUESTION = "question";
var TEN_MINUTE_IN_MILLIS = 6000000;
var ONE_MINUTE_IN_MILLIS = 600000;
var stage = "welcome"; //TODO: fetch from local
var selectedArticle;
var keyword = [
  "product",
  "payment",
  "email",
  "receive",
  "forgot",
  "telephone",
  "change",
  "password",
  "reset",
];
var search = "";
var index = [];
var articles = {
  product: "Which product packages are available",
  payment: "What payment methods are available",
  email: "I do not receive emails",
  receive: "I do not receive emails",
  forgot: "I forgot my password",
  telephone: "How can I change my telephone number",
  change: "How can I change my telephone number",
  password: "How i can change my Password",
  lost: "How i can change my Password",
  reset: "How i can change my Password",
};
var url = "inc/chatbot.php";
function init() {
  search = "";
  index = [];
  $("#type").prop("disabled", true);
  localStorage.setItem("question", "");
  localStorage.setItem("phone", "");
  localStorage.setItem("fullname", "");
  localStorage.setItem("name", "");
  localStorage.setItem("lastname", "");
  localStorage.setItem("email", "");
  localStorage.setItem("keywords", "");

  var welcomeMessage = `${getGreeting()}, ${getRandomItem(
    Messages.welcomeMessages
  )}`;
  UIHandler.displayBotMessage(welcomeMessage);
  setSesssionEndChecker();
}

function setSesssionEndChecker() {
  setTimeout(function () {
    if (userHasResponded) {
      return;
    }

    UIHandler.displayBotMessage("Hello. Are you still there?");
    setChatEndChecker();
  }, TEN_MINUTE_IN_MILLIS);
}

function setChatEndChecker() {
  setTimeout(function () {
    if (userHasResponded) {
      return;
    }

    UIHandler.displayBotMessage("Thanks for contacting us..");
    //TODO: Finish up
  }, ONE_MINUTE_IN_MILLIS);
}

const isEnterKey = (e) => {
  return e.which == 13;
};

/*Input fields*/
$("#type").on("keydown", function (e) {
  var date = new Date();
  var h = date.getHours();
  var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  var timestamp =
    "<i class='' style='font-size:9px'>Today at " + h + ":" + m + "</i>";
  var input = $(this).val();
  userHasResponded = true;
  if (isEnterKey(e)) {
    if (stage == WELCOME) {
      UIHandler.displayUserMessage(input);
      const hasAnyKeyWord = Words.checkIfContains(
        Messages.greetingsInput,
        input
      );
      stage = FULL_NAME;
      if (hasAnyKeyWord) {
        UIHandler.displayBotMessage(getRandomItem(Messages.saidHelloMessages));
      } else {
        UIHandler.displayBotMessage(
          getRandomItem(Messages.didNotSayHelloMessages)
        );
      }
      UIHandler.clearInput();
    } else if (stage == FULL_NAME) {
      localStore.storeData(FULL_NAME, input);
      UIHandler.clearInput();
      stage = QUESTION;
      UIHandler.displayUserMessage(input);
      UIHandler.showBotTyping();
      UIHandler.displayBotMessage(
        `Okay, Hello <b>${input}</b>. ${getRandomItem(
          Messages.askQuestionMessages
        )}`
      );
    } /*check fullname*/ else if (stage == QUESTION) {
      localStore.storeData(QUESTION, input);

      UIHandler.displayUserMessage(input);
      UIHandler.showBotTyping();

      API.getArticles(input).then((response) => {
        console.log(response);
        UIHandler.displayBotMessage(UIHandler.createArticles(
          getRandomItem(Messages.foundArticlesMessages),
          response.data
        ));
        UIHandler.clearInput();
        UIHandler.displayText(getRandomItem(Messages.askArticleHelpedMessages), articleButtons.map(button => UIHandler.createButton(button)).join(""));
        UIHandler.disableInput();
        stage = QUESTION;
      }).catch((err) => {
        console.error(err);
        UIHandler.displayBotMessage(
          getRandomItem(Messages.notFoundArticlesMessages)
        );

        const actionButtons = helpButtons.map((button) => {
          return UIHandler.createButton(button)
        })
        UIHandler.displayButtons(actionButtons.join(""));
        UIHandler.clearInput();
        stage = QUESTION;
      });

    } /*check question*/
    if ($(this).attr("name") == "email") {
      if (input.match(mailformat)) {
        $("#type").val("");
        $("#chatbody").append(
          '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
          input +
          "<br>" +
          timestamp +
          '</div><div class="clearfix">'
        );
        localStorage.setItem("email", input);
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Good!<br> Did I got your e-mail address right?<br>Should my colleague answer to <b>' +
            localStorage.getItem("email") +
            "</b><br>To which e-mail address may the colleague answer<br>" +
            timestamp +
            '</div><div class="clearfix"></div><center><button class="bot-btn" value="confirm_email" title="Yes">Yes, Thats my Mail-Address</button><button class="bot-btn" value="confirm_email" title="No">No, Thats not correct</button></center>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
          $("#type").prop("disabled", true);
        }, 1000);
      } else {
        $("#type").prop("disabled", false);
        $("#chatbody").append(
          '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
          input +
          "<br>" +
          timestamp +
          '</div><div class="clearfix">'
        );
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> <span class="text-danger">Email format is inavlid write it again.</span><br>' +
            timestamp +
            '</div><div class="clearfix"></div>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
        return false;
      }
    } /*check email*/
    if ($(this).attr("name") == "customer_message") {
      $("#type").val("");
      $("#type").attr("name", "email");
      $("#chatbody").append(
        '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
        input +
        "<br>" +
        timestamp +
        '</div><div class="clearfix">'
      );
      $(".typing").removeClass("hidden");
      setTimeout(function () {
        $("#chatbody").append(
          '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Okay, I hear you  <br>To which e-mail address may the colleague answer<br>' +
          timestamp +
          '</div><div class="clearfix"></div>'
        );
        $(".typing").addClass("hidden");
        $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
      }, 1000);
    } /*check customer_message*/
    if ($(this).attr("name") == "phone") {
      localStorage.setItem("phone", $(this).val());
      $("#type").val("");
      if (input.match(phoneformat)) {
        $("#chatbody").append(
          '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
          input +
          "<br>" +
          timestamp +
          '</div><div class="clearfix">'
        );
        /*Send When Phone number Taken*/
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Okay, much thanks for your number<br>' +
            timestamp +
            '</div><div class="clearfix"></div></center>'
          );

          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
          $("#type").prop("disabled", true);
        }, 1000);

        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Okay, one last question <b>' +
            localStorage.getItem("fullname") +
            "</b><br> do you want to add customer number so that your request is displayed in the ticket overview of your customer account?<br>" +
            timestamp +
            '</div><div class="clearfix"></div><center><button class="bot-btn" value="ask_customer_number" title="Yes">Yes, I want to add a customer number</button><button class="bot-btn" value="ask_customer_number" title="No">No, I do not want to add a customer number.</button></center>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 2000);
      } else {
        $("#chatbody").append(
          '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
          input +
          "<br>" +
          timestamp +
          '</div><div class="clearfix">'
        );
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> <span class="text-danger">Phone Number allowed only digits</span><br>' +
            timestamp +
            '</div><div class="clearfix"></div>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
        return false;
      }
    } /*check phone*/

    if ($(this).attr("name") == "customer_number") {
      $("#type").prop("disabled", true);
      localStorage.setItem("customer_number", $(this).val());
      $("#type").val("");
      if (input.match(phoneformat)) {
        $("#chatbody").append(
          '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
          input +
          "<br>" +
          timestamp +
          '</div><div class="clearfix">'
        );
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> The message to support is completed and sent.<br>All right, well, a support representive will get back to you soon via email.<br>I thank you for the nice conversation and wish you a nice day :)<br>' +
            timestamp +
            '</div><div class="clearfix"></div><center><button class="bot-btn" value="started" title="Get Started">Get Started</button></center>'
          );

          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
      } else {
        $("#type").prop("disabled", false);
        $("#chatbody").append(
          '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
          input +
          "<br>" +
          timestamp +
          '</div><div class="clearfix">'
        );
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> <span class="text-danger">Phone Number allowed only digits</span><br>' +
            timestamp +
            '</div><div class="clearfix"></div>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
        return false;
      }
    } /*check phone*/

    $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
    e.preventDefault();
  }
});

$(document).on("click", ".chat-button", function () {
  var text = $(this).val();
  var type = $(this).attr("data-type");
  var id = $(this).attr("data-id");

  console.log("this", this);
  console.log("text", text);
  console.log("type", type);
  console.log("id", id);

  UIHandler.displayUserMessage(text);
  UIHandler.scrollToBottom();
  UIHandler.hideButtons();
  UIHandler.showBotTyping();

  if (type == Buttons.ARTICLE_HELP_TYPE) {

    if (id == 23) {
      API.incrementArticleHelped(id)
        .then((response) => {
          console.log("Article helped", response);
        }).catch(err => console.error("Error updating help count", err))
      console.log("Article type");
    } else if (id == 22) {
      API.incrementArticleDidNotHelp(id)
        .then((response) => {
          console.log("Article not helped", response);
        }).catch(err => console.error("Error updating not help count", err))
    }
  } else if (type == Buttons.HELP_TYPE) {

  }
});

/*Button Options */
$(document).on("click", ".btn-chat", function () {
  var input = $(this).val();
  var title = $(this).attr("title");
  var date = new Date();
  var h = date.getHours();
  var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  var timestamp =
    "<i class='' style='font-size:9px'>Today at " + h + ":" + m + "</i>";

  UIHandler.displayUserMessage(input);
  setTimeout(function () {
    if (input == "get_started") {
      init();
    }

    if (input == "question_solved") {
      if (title == "Yes") {
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Great, It was pleasure writing with you!<br>If there are any other questions. I am always at your disposal!<br>Have a nice day :)<br>' +
            timestamp +
            '</div><div class="clearfix"></div><center><button class="bot-btn" value="started" title="Get Started">Get Started</button></center>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
      }
      if (title == "No") {
        $("#type").prop("disabled", true);
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Okay, then I guess only one person can help you. So that I can reach right colleague directly with your request, Please give me keywords that best describes your request.<br>' +
            timestamp +
            '</div><div class="clearfix"></div><center><button class="bot-btn" value="keywords" title="Account">Account</button><button class="bot-btn" value="keywords" title="Payments">Payments</button><button class="bot-btn" value="keywords" title="Problem">Problem</button><button class="bot-btn" value="keywords" title="Feedback">Feedback</button></center>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
      }
    } /*when question_solved yes/no*/

    if (input == "keywords") {
      localStorage.setItem("keywords", title);
      $("#type").prop("disabled", false);
      $("#type").val("");
      $("#type").attr("name", "customer_message");
      $(".typing").removeClass("hidden");
      setTimeout(function () {
        $("#chatbody").append(
          '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Many thanks <b>' +
          localStorage.getItem("fullname") +
          "</b>! I think I have just the right colleague in mind, who is familiar with all questions concerning <b>" +
          title +
          "</b> <br> Please enter a message with your request now, which I can forward to the colleague<br>" +
          timestamp +
          '</div><div class="clearfix"></div>'
        );
        $(".typing").addClass("hidden");
        $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
      }, 1000);
    } /*when keywords*/

    if (input == "confirm_email") {
      if (title == "Yes") {
        $("#type").val("");
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> All right, do you want to add a phone number so that may human colleague call back if he has any further questions? <br>' +
            timestamp +
            '</div><div class="clearfix"></div><center><button class="bot-btn" value="ask_phone" title="Yes">Yes, I would Like</button><button class="bot-btn" value="ask_phone" title="No">No, I do not want to give my phone number.</button></center>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
      }
      if (title == "No") {
        $("#type").prop("disabled", false);
        $("#type").val("");
        $("#type").attr("name", "email");
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> It doesn\'t matter. I\'ll give you another try entering your email address.  <br>' +
            timestamp +
            '</div><div class="clearfix"></div>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
      }
    } /*when confirm_email yes/no*/

    if (input == "ask_customer_number") {
      if (title == "Yes") {
        $("#type").prop("disabled", false);
        $("#type").val("");
        $("#type").attr("name", "customer_number");
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Okay ' +
            localStorage.getItem("fullname") +
            "</b><br> please Type in, your customer number.<br>" +
            timestamp +
            '</div><div class="clearfix"></div>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
      }
      if (title == "No") {
        $("#type").prop("disabled", false);
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#type").prop("disabled", true);
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> The message to support is completed and sent.<br>  All right, well, a support representive will get back to you soon via email.<br>I thank you for the nice conversation and wish you a nice day :)<br>' +
            timestamp +
            '</div><div class="clearfix"></div><center><button class="bot-btn" value="started" title="Get Started">Get Started</button></center>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
      }
    } /*when confirm_email yes/no*/
    if (input == "ask_phone") {
      if (title == "Yes") {
        $("#type").prop("disabled", false);
        $("#type").val("");
        $("#type").attr("name", "phone");
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Okay, Let\'s hear it<br>Enter your <b>phone number</b><br>' +
            timestamp +
            '</div><div class="clearfix"></div>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
      }
      if (title == "No") {
        $("#type").prop("disabled", true);
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Okay, one last question <b>' +
            localStorage.getItem("fullname") +
            "</b><br> do you want to add customer number so that your request is displayed in the ticket overview of your customer account?<br>" +
            timestamp +
            '</div><div class="clearfix"></div><center><button class="bot-btn" value="ask_customer_number" title="Yes">Yes, I want to add a customer number</button><button class="bot-btn" value="ask_customer_number" title="No">No, I do not want to add a customer number.</button></center>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);

        /*$(".typing").removeClass('hidden');
							setTimeout(function(){
						$("#chatbody").append('<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> The message to support is completed and sent.<br>  All right, well, a support representive will get back to you soon via email.<br>I thank you for the nice conversation and wish you a nice day :)<br>'+timestamp+'</div><div class="clearfix"></div><center><button class="bot-btn" value="started" title="Get Started">Get Started</button></center>');
						$(".typing").addClass('hidden');
				    			$("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
							},1000);*/
      }
    } /*when phone yes/no*/
  }, 800); /*all setTimeout*/

  /* Global Get started*/
  if (input == "started") {
    $("#chatbody").html("");
    init();
  }

  $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
  $(".bot-btn").remove();
}); /*document on end*/

function WordCount(str) {
  const count = str.split(" ").length;
  console.log("COUNT--> ", count);
  return count;
}
$(document).on("click", ".load_file", function () {
  var date = new Date();
  var h = date.getHours();
  var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  var timestamp =
    "<i class='' style='font-size:9px'>Today at " + h + ":" + m + "</i>";
  $("#chatbody").append(
    '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
    $(this).attr("title") +
    "<br>" +
    timestamp +
    '</div><div class="clearfix">'
  );
  readTextFile("docs/" + $(this).attr("title") + ".txt");
});
function readTextFile(file) {
  var date = new Date();
  var h = date.getHours();
  var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  var timestamp =
    "<i class='' style='font-size:9px'>Today at " + h + ":" + m + "</i>";
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        $("#type").prop("disabled", true);
        var allText = rawFile.responseText;
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt="">' +
            allText +
            "<br>" +
            timestamp +
            '</div><div class="clearfix"></div>'
          );

          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);

        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt="">Did that solve your problem?<br>' +
            timestamp +
            '</div><div class="clearfix"></div><center><button class="bot-btn" value="question_solved" title="Yes">Yes</button><button class="bot-btn" value="question_solved" title="No">NO, That didn\'t solve my Problem</button></center>'
          );

          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 5000);
      }
    }
  };
  rawFile.send(null);
}


/* Preloader */
$(window).on('load', function () {
  var preloaderFadeOutTime = 500;
  function hidePreloader() {
    var preloader = $('.spinner-wrapper');
    setTimeout(function () {
      preloader.fadeOut(preloaderFadeOutTime);
    }, 500);
  }
  hidePreloader();
});

/* Navbar Scripts */
// jQuery to collapse the navbar on scroll
$(window).on('scroll load', function () {
  if ($(".navbar").offset().top > 60) {
    $(".fixed-top").addClass("top-nav-collapse");
  } else {
    $(".fixed-top").removeClass("top-nav-collapse");
  }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
  $(document).on('click', 'a.page-scroll', function (event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top
    }, 600, 'easeInOutExpo');
    event.preventDefault();
  });
});

// closes the responsive menu on menu item click
$(".navbar-nav li a").on("click", function (event) {
  if (!$(this).parent().hasClass('dropdown'))
    $(".navbar-collapse").collapse('hide');
});



/* Back To Top Button */
// create the back to top button
$('body').prepend('<a href="body" class="back-to-top page-scroll">Back to Top</a>');
var amountScrolled = 700;
$(window).scroll(function () {
  if ($(window).scrollTop() > amountScrolled) {
    $('a.back-to-top').fadeIn('500');
  } else {
    $('a.back-to-top').fadeOut('500');
  }
});


/* Removes Long Focus On Buttons */
$(".button, a, button").mouseup(function () {
  $(this).blur();
});

$(document).ready(function () {
  $('#action_menu_btn').click(function () {
    $('.action_menu').toggle();
  });
});

init();
