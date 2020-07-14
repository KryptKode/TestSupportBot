export const displayBotMessage = (message) => {
  disableInput();
  showBotTyping();
  setTimeout(function () {
    $("#type").prop("disabled", false);

    $("#chatbody").append(
      `
      <div class="d-flex justify-content-start mb-4">
      <div class="img_cont_msg">
        <img
          src="images/chatbot.png"
          class="rounded-circle user_img_msg"
        />
      </div>
      <div class="msg_cotainer">
        ${message}
        <span class="msg_time">${createTimeStamp()}</span>
      </div>
    </div>
      `
    );
    scrollToBottom();
    hideBotTyping();
    focusInput();
  }, 1000);

  scrollToBottom();
};

export const displayUserMessage = (message) => {
  $("#chatbody").append(
    `
    <div class="d-flex justify-content-end mb-4">
            <div class="msg_cotainer_send">
              ${message}
              <span class="msg_time_send">${createTimeStamp()}</span>
            </div>
            <div class="img_cont_msg">
              <!--<img src="images/img/download.jpg" class="rounded-circle user_img_msg">-->
            </div>
          </div>
    `
  );
  focusInput();
};

export const displayButtons = (buttons) => {
  setTimeout(function () {
    $("#chatbody").append(`<center><div class="ch-menu clearfix">${buttons}</div></center>`);
    $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
  }, 1000);
};

export const hideButtons = () => {
  $(".ch-menu").remove();
};

export const displayText = (text, buttons) => {
  setTimeout(function () {
    $("#chatbody").append(`<center><div class=""><p>${text}</p></div></center>`);
    $("#chatbody").append(`<center><div class="d-flex flex-wrap justify-content-center">${buttons}</div></center>`);
    scrollToBottom();
  }, 1000);
};

export const createButton = (button) => {
  return `<button class="btn chat-button ml-2" id="button_${button.id}" data-type="${button.type}" data-id="${button.id}">${button.title}</button>`
}

export const createArticle = (article) => {
  return `
  <div class="card mt-2 border-0">
  <div class="article-title">
  <i class="fa fa-chevron-right" aria-hidden="true"></i>
  <a href="#collapse${article.id}" class="link ml-2" data-parent="#accordion" data-toggle="collapse">
        ${article.title}</a>
  </div>

  <div id="collapse${article.id}" class="collapse">
    <div class="card-body">
     ${article.content}
    </div>
  </div>
</div>`
}

export const createArticles = (message, articles) => {
  return message + `<div id="accordion">${
    articles.map(article => createArticle(article)).join("")
    }</div>`
}


export const clearInput = () => {
  $("#type").val("");
};

export const disableInput = () => {
  $("#type").prop("disabled", true);
}

export const enableInput = () => {
  $("#type").prop("disabled", false);
}

export const showBotTyping = () => {
  $(".typing").removeClass("hidden");
};

export const hideBotTyping = () => {
  $(".typing").addClass("hidden");
};

export const focusInput = () => {
  $("#type").focus();
}

export const scrollToBottom = () => {
  $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
}

const createTimeStamp = () => {
  var date = new Date();
  var h = date.getHours();
  var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  return "<i class='' style='font-size:9px'>Today at " + h + ":" + m + "</i>";
};
