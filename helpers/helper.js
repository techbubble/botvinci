'use strict';

// Source: https://www.frankmitchell.org/2015/01/fisher-yates/
function shuffle(array) {
    var i = 0
      , j = 0
      , temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
}

function askQuestion(convo, convoInfo, userData, callback) {
    // Start the conversation

    if (convoInfo.itemIndex == 0) {
      convo.say(`OK, let\'s start the **${convoInfo.quiz.subject}** ${convoInfo.quizType}.` + (convoInfo.quiz.help ? `<br/>${convoInfo.quiz.help}` : ''));                     
    }
    else {
      let prevMessage = '';

      var lastResult = userData.answers[`answer_${userData.completed}`];
     
      if (lastResult === true) {
        prevMessage = `Woohooo! That is correct. 🎉🎉🎉<br/>`;
      }
      else if (lastResult === false) {
        prevMessage = `Sorry. That is incorrect. 😕<br/>`;
      }
      convo.say(`${prevMessage} Let\'s continue the ${convoInfo.quizType} **${convoInfo.quiz.subject}** ...` + (convoInfo.quiz.help ? `<br/>${convoInfo.quiz.help}` : ''));
    }
  
    convo.ask(convoInfo.question, function(response, convo) {
        if (response.text === 'bye') {
            callback(null);
        }
        else if (isNaN(response.text)) {
          convo.say(`Ummm...I was expecting a number as a reply.`);  
          callback(null);
        }
        else {
          callback(parseInt(response.text));        
        }
    });
      
}

module.exports = {
  shuffle: shuffle,
  askQuestion: askQuestion
};


