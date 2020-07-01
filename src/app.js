var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var phoneformat = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
var greetingsInput = ["Hi", "Hello", "Holla", "Hey"];
var userHasResponded = false;
var WELCOME = "welcome";
var FULL_NAME = "full_name";
var TEN_MINUTE_IN_MILLIS = 3000;
var ONE_MINUTE_IN_MILLIS = 1000;
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

  var welcomeMessage =
    "Good evening, my name is Supportbot, send me a hello if you want to chat with me";
  notifyUser(welcomeMessage, WELCOME);
  setSesssionEndChecker();
}

function setSesssionEndChecker() {
  setTimeout(function () {
    if (userHasResponded) {
      return;
    }

    notifyUser("Hello. Are you still there?", WELCOME);
    setChatEndChecker();
  }, TEN_MINUTE_IN_MILLIS);
}

function setChatEndChecker() {
  setTimeout(function () {
    if (userHasResponded) {
      return;
    }

    notifyUser("Thanks for contacting us..");
    //TODO: Finish up
  }, ONE_MINUTE_IN_MILLIS);
}

function notifyUser(message, name) {
  $("#type").prop("disabled", true);
  $(".typing").removeClass("hidden");
  setTimeout(function () {
    var date = new Date();
    var h = date.getHours();
    var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    var timestamp =
      "<i class='' style='font-size:9px'>Today at " + h + ":" + m + "</i>";
    $("#type").prop("disabled", false);
    $("#type").attr("name", name);

    $("#chatbody").append(
      '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt="">' +
        message +
        "<br>" +
        timestamp +
        '</div><div class="clearfix"></div>'
    );
    $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
    $(".typing").addClass("hidden");
  }, 1000);

  $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
}

function checkIfContains(words, testString) {
  var regex = new RegExp(words.join("|"));
  return regex.test(testString);
}

function getTimeStamp() {
  var date = new Date();
  var h = date.getHours();
  var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  return "<i class='' style='font-size:9px'>Today at " + h + ":" + m + "</i>";
}

function startChat() {
  var welcome =
    "Hello my name is Supportbot and I would like to help you today. Please tell me your first and last name";
  notifyUser(welcome, FULL_NAME);
}

function showGreetError() {
  var welcome = "I did not get that. Say hello if you want to chat with me";
  notifyUser(welcome, WELCOME);
}

/*Input fields*/
$("#type").on("keydown", function (e) {
  var date = new Date();
  var h = date.getHours();
  var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  var timestamp =
    "<i class='' style='font-size:9px'>Today at " + h + ":" + m + "</i>";
  var input = $(this).val();
  userHasResponded = true;
  if (e.which == 13) {
    if ($(this).attr("name") == "welcome") {
      $("#chatbody").append(
        '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
          input +
          "<br>" +
          timestamp +
          '</div><div class="clearfix">'
      );
      var isGreeting = checkIfContains(greetingsInput, input);
      if (isGreeting) {
        startChat();
      } else {
        showGreetError();
      }
      $("#type").val("");
    } else if ($(this).attr("name") == "question") {
      localStorage.setItem("question", $(this).val());
      $("#chatbody").append(
        '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
          input +
          "<br>" +
          timestamp +
          '</div><div class="clearfix">'
      );

      if (WordCount($(this).val()) < 4) {
        $("#type").prop("disabled", true);
        $(".typing").removeClass("hidden");
        setTimeout(function () {
          $("#chatbody").append(
            '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Oops, I didn\'t hear you. Let\'s try it again So that I can help you, Please choose one of the best keywords that best fits your request<br>' +
              timestamp +
              '</div><div class="clearfix"></div><center><button class="bot-btn" value="keywords" title="Account">Account</button><button class="bot-btn" value="keywords" title="Payments">Payments</button><button class="bot-btn" value="keywords" title="Problem">Problem</button><button class="bot-btn" value="keywords" title="Feedback">Feedback</button></center>'
          );
          $(".typing").addClass("hidden");
          $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
        }, 1000);
      } /*count if less then 4*/ else {
        search += "<ul>";
        for (var i = 0; i < keyword.length; i++) {
          if (input.toLowerCase().includes(keyword[i])) {
            index.push(keyword[i]);
            if (!(typeof articles[keyword[i]] === "undefined")) {
              search +=
                '<li><a class="load_file" href="#" title="' +
                articles[keyword[i]] +
                '">' +
                articles[keyword[i]] +
                "</a></li>";
            }
          }
        }
        search += "</ul>";
        console.log(index);
        if (Array.isArray(index) && index.length) {
          $(".typing").removeClass("hidden");
          setTimeout(function () {
            $("#chatbody").append(
              '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> The help articles are ordered by the most frequent match with the customer\'s  keywords<br> Okay, perfect!<br>I have found the following articles on this topic.<br>' +
                search +
                "<br>" +
                timestamp +
                '</div><div class="clearfix"></div>'
            );
            $(".typing").addClass("hidden");
            $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
          }, 1000);
        } else {
          $(".typing").removeClass("hidden");
          setTimeout(function () {
            $("#chatbody").append(
              '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Oops, I didn\'t hear you. Let\'s try it again So that I can help you, Please choose one of the best keywords that best fits your request<br>' +
                timestamp +
                '</div><div class="clearfix"></div><center><button class="bot-btn" value="keywords" title="Account">Account</button><button class="bot-btn" value="keywords" title="Payments">Payments</button><button class="bot-btn" value="keywords" title="Problem">Problem</button><button class="bot-btn" value="keywords" title="Feedback">Feedback</button></center>'
            );
            $(".typing").addClass("hidden");
            $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
          }, 1000);
        }
      }
      $("#type").val("");
      $("#type").attr("name", "question");
    } /*check question*/

    if ($(this).attr("name") == "fullname") {
      localStorage.setItem("fullname", $(this).val());
      $("#type").val("");
      $("#type").attr("name", "question");
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
          '<div class="alert alert-info text-left pull-left" style="min-width: 80%"><img src="img/bot.png" class="avatar" alt=""> Okay, Hello <b>' +
            localStorage.getItem("fullname") +
            "</b> <br> Nice to meet you :) <br>So that I can help you, Please formulate your request briefly with up to 100 punctuation marks<br>" +
            timestamp +
            '</div><div class="clearfix"></div>'
        );

        $(".typing").addClass("hidden");
        $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
      }, 1000);
    } /*check fullname*/
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

/*Button Options */
$(document).on("click", ".bot-btn", function () {
  var input = $(this).val();
  var title = $(this).attr("title");
  var date = new Date();
  var h = date.getHours();
  var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  var timestamp =
    "<i class='' style='font-size:9px'>Today at " + h + ":" + m + "</i>";

  $("#chatbody").append(
    '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
      $(this).text() +
      "<br>" +
      timestamp +
      '</div><div class="clearfix"></div>'
  );
  $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
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
  return str.split(" ").length;
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
