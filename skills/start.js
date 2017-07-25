module.exports = function(controller) {


  controller.on('bot_space_join', function(bot, message) {

    bot.reply(message, 'I am a bot that helps students with learning outside the classroom.');

  });

  controller.on('user_space_join', function(bot, message) {

    bot.reply(message, 'Hello, ' + message.original_message.data.personDisplayName);

  });

  controller.hears(['start','help'], 'direct_message,direct_mention', function(bot, message) {
    
     bot.reply(message,'Try saying "quiz _class-code_" or "language _class-code_" or "lessons"' +
                       '<br />You can get a class code from your teacher.<br />' +
                       '<br /><br/>For the Cisco Spark Hackathon, type the text in bold to see that Botvinci skill:' +
                       '<br />\n## Quiz Skills' +
                       '\nMath Quiz: **quiz zz1233**' +
                       '<br />Science Quiz: **quiz bb3343**' +
                       '<br />Social Studies Quiz: **quiz ss1234**' +
                       '<br /><br />\n## Language Trainer Skills' +
                       '\nSpanish Antonym Trainer: **language ab1234**' +
                       '<br />Spanish Phrase Trainer: **language sp1234**' +
                       '<br />Spanish Vocabulary Trainer: **language gh1912**' +
                       '<br /><br />\n## Personalized Lesson Plan Skill' +
                       '\n**lessons**'
               );
    
  });
  
  controller.hears(['quiz'], 'direct_message,direct_mention', function(bot, message) {
    
     bot.reply(message,'Try saying "quiz _class-code_"');
    
  });

  controller.hears(['language'], 'direct_message,direct_mention', function(bot, message) {
    
     bot.reply(message,'Try saying "language _class-code_"');
    
  });
  
  controller.hears(['clear'], 'direct_message,direct_mention', function(bot, message) {
     bot.reply(message, '<br />'.repeat(50));
  });
};

