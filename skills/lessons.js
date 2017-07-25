
let Helper = require('../helpers/helper.js');
let  Client = require('node-rest-client').Client;
let moment = require('moment');

module.exports = function(controller) {

    controller.hears(['lessons'], 'direct_message,direct_mention', function(bot, message) {
 
        getLessons(function(lessons) {

            startConversation(bot, message, lessons);

        });


    });
  
  
    function startConversation(bot, message, lessons) {
        bot.startConversation(message, function(err, convo) {
          console.log(lessons);
            // Generate the lessons list that will be displayed to the user
            let question = `<br />**Available Lesson Plans are:**<br />`;
            let schedule = null;
            for(let s=0; s < lessons.length; s++) {
                question += `<br/>**${s+1})** ${lessons[s].name}`
            }
            question += `<br/><br/>*Reply with a number from 1 to ${lessons.length} to choose a Lesson Plan.*`;
            convo.on('end', function(convo) {
              
                  bot.startConversation(message, function(err, convo2) {
                    let weeks = '<br />**I can personalize this Lesson Plan for you. When would you like to start?**';
                    for(let s=0;s<5;s++) {
                      weeks += `<br />**${s+1})** ${moment().day((7 * (s+1))+1).format('dddd, MMM D, YYYY')}`
                    }
                    weeks += `<br/><br/>*Reply with a number from 1 to 5 to personalize your Lesson Plan.*`;
                    convo2.ask(weeks, function(response, convo2) {
                        if (isNaN(response.text)) {
                          convo2.say(`Ummm...I was expecting a number as a reply.`);  
                        }
                        else {
                          let it2 = parseInt(response.text);
                          if ((it2<1) || (it2>5)) {
                            it2 = 1;
                          }
                          let week = moment().day((7 * it2)+1);
                          
                          // For Hackathon, we assume all lesson plans start on Jan. 1, 2017
                          let timeshift = week.toDate().getTime() - new Date(2017,0,1,0,0,0).getTime();
                          convo2.say(`All set. Here is your personalized lesson plan starting **${week.format('dddd, MMM D, YYYY')}** for \n# [${schedule.name}](https://botvinci-bot.glitch.me/lesson.html?id=${schedule.id}&ts=${timeshift})`);
                          convo2.next();
                        }
                    });
                    
                  });
          
              
            });

            convo.ask(question, function(response, convo) {
                if (isNaN(response.text)) {
                  convo.say(`Ummm...I was expecting a number as a reply.`);  
                }
                else {
                  let it = parseInt(response.text)-1;
                  if ((it<0) || (it>lessons.length-1)) {
                    it = 0;
                  }
                  schedule = lessons[it];
                  
                }
                convo.next();
            });

          });
      
    }

  
    function getLessons(callback) {
      
      var client = new Client();
      var filter = encodeURIComponent('{"include":[{"relation":"media"}]}');
      
      var url = `https://api.whenhub.com/api/users/${process.env.whenhub_id}/schedules?access_token=${process.env.whenhub_token}`;
      client.get(url, function (data, response) {
          // data = parsed response body as js object 
          
        
          let schedules = [];
          for(let s=0;s<data.length;s++) {
            schedules.push({
              name: data[s].name,
              id: data[s].id
            })
          }
        console.log(schedules);
          callback(schedules);
      });

    }
  
}
