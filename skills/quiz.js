
let Helper = require('../helpers/helper.js');

module.exports = function(controller) {

    controller.hears(['quiz (.*)','language (.*)'], 'direct_message,direct_mention', function(bot, message) {
 
        var quizType = message.match[0].split(' ')[0] === 'quiz' ? 'quiz' : 'language trainer';
        var classCode = message.match[1];
        var quiz = null;
      
        if (classCode) {
            quiz = getQuiz(quizType, classCode);
          
            if (!quiz) {
              bot.reply(message, 'Hmmm...sorry, but I can\'t find that class code.');            
            }
            else {
              
              // Get user from storage
              controller.storage.users.get(message.user, function(err, user) {

                let userData = {
                  completed: 0,
                  correct: 0,
                  terminated: false,
                  answers: {}
                }

                // If some user data is stored, let's restore it
                if (user && user.quiz && user.quiz[classCode]) {
                  userData = user.quiz[classCode];                
                }
                
                startConversation(bot, message, userData, quiz, quizType);
                  
                
              });
            }
        }
  

    });
  
    function endConversation(bot, message, userData, quiz, quizType, terminated) {
      let reply = terminated ? 'No problem. We can continue another time' : 'All done!!!';
      reply += `<br/><br/>Your score: ${userData.correct} of ${userData.completed} answered correctly.`;
      bot.reply(message, reply);
    }
  
    function startConversation(bot, message, userData, quiz, quizType) {
        bot.startConversation(message, function(err, convo) {

              // We will use the length of the answers array to figure out which
              // question the user last answered, and continue from there
              let itemIndex = userData.completed;
              let currentItem = quiz.data[itemIndex];
              Helper.shuffle(currentItem.answers); // Shuffle the order of the answers

              // Figure out the position of the correct answer after shuffling
              // and save it in the "correctAnswer" property
              for(let s=0; s < currentItem.answers.length; s++) {
                if (currentItem.answers[s] === currentItem.correctAnswer) {
                  currentItem.answerIndex = s+1;
                  break;
                }
              }

              // Generate the question and answer text that will be displayed to the user
              let question = `<br />**${currentItem.question}**<br />`;
              for(let s=0; s < currentItem.answers.length; s++) {
                  question += `<br/>**${s+1})** ${currentItem.answers[s]}`
              }
              question += `<br/><br/>*Reply with a number from 1 to ${currentItem.answers.length} for your answer, or "bye" to end.*`;

              let convoInfo = {
                question: question,
                itemIndex: itemIndex,
                quiz: quiz,
                quizType: quizType,
                currentItem: currentItem
              };

              Helper.askQuestion(convo, convoInfo, userData, function(result) {
                  
                  convo.on('end', function(convo) {
                    if ((userData.completed == quiz.data.length) || userData.terminated) {
                       endConversation(bot, message, userData, quiz, quizType, userData.terminated);
                    }
                    else {
                      startConversation(bot, message, userData, quiz, quizType);                    
                    }
                  });

                if (result !== null) {
                    userData.completed += 1;
                    
                    if (currentItem.answerIndex == result) {
                      userData.answers[`answer_${userData.completed}`] = true;
                      userData.correct += 1;
                    }
                    else {
                      userData.answers[`answer_${userData.completed}`] = false;                      
                    }
                  
                  }
                  else {
                    userData.terminated = true;
                    
                  }
                  convo.next();
              })

          });
      
    }

    function getQuiz(quizType, classCode) {
        var quizData = {};
        if (quizType === 'quiz') {
          Object.assign(quizData, require('../data/quiz1.json'), require('../data/quiz2.json'), require('../data/quiz3.json'));
        }
        else {
          Object.assign(quizData, require('../data/language1.json'), require('../data/language2.json'), require('../data/language3.json'));          
        }
        if (quizData[classCode])
        {
          return quizData[classCode];
        }
        return null;

    }
}
