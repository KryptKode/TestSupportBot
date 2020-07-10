export const displayBotMessage = (message) => {
  $("#type").prop("disabled", true);
  $(".typing").removeClass("hidden");
  setTimeout(function () {
    $("#type").prop("disabled", false);

    $("#chatbody").append(
      `<div class="d-flex justify-content-start mb-4">
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
    $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
    $(".typing").addClass("hidden");
  }, 1000);

  $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
};

export const displayUserMessage = (message) => {
  $("#chatbody").append(
    '<div class="alert alert-success text-right pull-right" style="min-width: 80%">' +
    message +
    "<br>" +
    createTimeStamp() +
    '</div><div class="clearfix">'
  );
};

export const displayButtons = (buttons) => {
  setTimeout(function () {
    $("#chatbody").append(`<center>${buttons}</center>`);
    $("#chatbody").scrollTop($("#chatbody").prop("scrollHeight"));
  }, 1000);
};

export const hideButtons = () => {
  $(".bot-btn").remove();
};

export const clearInput = () => {
  $("#type").val("");
};

export const showBotTyping = () => {
  $(".typing").removeClass("hidden");
};

export const hideBotTyping = () => {
  $(".typing").addClass("hidden");
};

const createTimeStamp = () => {
  var date = new Date();
  var h = date.getHours();
  var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  return "<i class='' style='font-size:9px'>Today at " + h + ":" + m + "</i>";
};
