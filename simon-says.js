$(document).ready(function() {
  var i, start, random, curr, match, audio;
  var disable = false;
  var flash = false;
  var strict = false;
  var playingSequence = false;
  var one = 'one';
  var two = 'two';
  var three = 'three';
  var four = 'four';
  var options = [one, two, three, four];
  var inPlay = [];
  var humanClicks = [];
  var score = 1;
  var idx = -1;
  var humanTurn = {
    index: 'none',
    option: 'none'
  };

  var sound1 = 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3';
  var sound2 = 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3';
  var sound3 = 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3';
  var sound4 = 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3';

  $('body').keydown(function(event){
    if (event.which == 65){
      $('#one').click();
    } else if (event.which == 83) {
      $('#two').click();
    } else if (event.which == 68) {
      $('#three').click();
    } else if (event.which == 70) {
      $('#four').click();
    }
});

  function resetGame() {
    audio.pause();
    inPlay = [];
    humanClicks = [];
    score = 1;
    $('#score').empty();
    flash = false;
    match = true;
    strict = false;
    i = 0;
    $('#beginMsg').removeClass('hide');
    $('#strictOn').addClass('hide');
    addDisable();
  }

  function playAudio(x) {
    if (x == one) {
      audio = new Audio(sound1);
      audio.play();
    } else if (x == two) {
      audio = new Audio(sound2);
      audio.play();
    } else if (x == three) {
      audio = new Audio(sound3);
      audio.play();
    } else if (x == four) {
      audio = new Audio(sound4);
      audio.play();
    }
  }
  //highlights/removes highlight of selection; used for both comp & human
  function action(id) {
    playAudio(id);
    $('#' + id).addClass('clicked');
    setTimeout(function() {$('#' + id).removeClass('clicked')}, 500);
  }

 //randomizes selection of of four possible options [1, 2, 3, 4]
  function randomize() {
    random = Math.floor(Math.random() * (options.length));
    curr = options[random];
    inPlay.push(curr);
    humanClicks = [];
    idx = -1;
  }

  //performs action on comps selection
  function computerSelection() {
    action(curr);
  }

  function addDisable() {
    $('#one').attr('disabled');
    $('#two').attr('disabled');
    $('#three').attr('disabled');
    $('#four').attr('disabled');
    disable = true;
  }

  function removeDisable() {
    $('#one').removeAttr('disabled');
    $('#two').removeAttr('disabled');
    $('#three').removeAttr('disabled');
    $('#four').removeAttr('disabled');
    disable = false;
  }

  function showVictory() {
     $('#game').fadeOut();
     $('#win').fadeIn().removeClass('hide');
    setTimeout(function() {$('#game').fadeIn(); $('#win').addClass('hide')}, 2000);
  }

  function showLoss() {
      $('#game').fadeOut();
      $('#lose').fadeIn().removeClass('hide');
     setTimeout(function() {$('#game').fadeIn(); $('#lose').addClass('hide')}, 2000);
  }
 //stops circles from flashing
  function removeFlashes () {
    audio.pause();
    $('#one').removeClass('clicked');
    $('#two').removeClass('clicked');
    $('#three').removeClass('clicked');
    $('#four').removeClass('clicked');
  }
  //resets back to beginning/first round
  function backToBeginning() {
    audio.pause();
    inPlay = [];
    humanClicks = [];
    idx = -1;
    score = 1;
    $('#score').html(score);
    flash = false;
    match = true;
    i = 0;
  }

  //compare computer clicks & human clicks
 function compare(id) {
     if (inPlay[humanTurn.index] !== humanTurn.option) {
        match = false;
     } else if (inPlay[humanTurn.index] == humanTurn.option) {
        match = true;
     }

     if (match == false && strict == true) {
        showLoss();
        backToBeginning();
        setTimeout(function() {theGame()}, 2400);

     } else if (match == false && strict == false) {
       audio.pause();
         alert('Wrong move. Try again.');
         $('#' + id).removeClass('clicked');
         idx = -1;
         humanClicks = [];
         timed();

     } else if (match == true && inPlay.length == humanClicks.length) {
         randomize();       //pick new random, add to inPlay to be played at end of seq
         timed();      //plays seq

         score = score + 1;
         $('#score').html(score);

           if (score == 21 && match == true) {
             $('#score').html('');
             resetGame();
             showVictory();
           }
     }                                    //make playback when error is made; bugs with end game/etc;;
   }


  //human clicks
 function clickButton(id, soundVar) {
    $('#' + id).click(function() {

      if (inPlay.length < 1) {
        $('#' + id).attr('disabled');
        humanClicks.length = 0;
        alert('You must click start to begin');

      } else if (playingSequence == true) {
          alert('Please wait your turn.');

      } else {
        action(id);
        humanClicks.push(id);
        idx = idx + 1;
        humanTurn.index = idx;
        humanTurn.option = id;
        compare(id);

      }
    })
  }

  /* on(), off(), timed(), play() used to show sequence on inPlay */
  /*thanks to JohnL3 on FCC for helping with this portion of my code when I wasn't totally getting it!*/

  function on () {
    playAudio(inPlay[i]);
    $('#' + inPlay[i]).addClass('clicked');
  }

  function off() {
    $('#' + inPlay[i]).removeClass('clicked');
  }

  function timed() {
    playingSequence = true;
    setTimeout(function() {playingSequence = false}, (inPlay.length * 2) * 800);
    start = setInterval(function() {play()}, 800);
    i = 0;
  }

  function play() {
    if (i < inPlay.length) {
      (flash === false)? on(): off();
      if (flash === false) {
        flash = true;
      } else {
        i++;
        flash = false;
      }
    } else {
      clearInterval(start);
    }
  }

  function theGame() {
    if (inPlay.length < 1) {
      randomize();
      computerSelection();
    }
  }

  $('#howToPlay').click(function() {
    window.location.href = 'help.html';
  })

  $('#return').click(function() {
    window.location.href = 'index.html';
  })

  $('#endGame').click(function() {
    resetGame();
    removeFlashes();
    $('#game').addClass('hide');
    $('#end').fadeIn().removeClass('hide');
    setTimeout(function() {$('#end').fadeOut().addClass('hide');
                          $('#game').fadeIn().removeClass('hide')}, 2000);
  })

  $('#restart').click(function() {
    removeFlashes();
    backToBeginning();
    setTimeout(function() {theGame()}, 300);
  })

  $('#strict').click(function() {
    if (inPlay.length >= 1) {
      alert('Game in progress.');
    } else {
    strict = true;
    $('#strictOn').removeClass('hide');
    }
  })

  $('#start').click(function() {
    removeDisable();
    $('#beginMsg').addClass('hide');
    inPlay = [];
    theGame();
    $('#score').html(score);
  })



//calling human clicks function
  clickButton(one);
  clickButton(two);
  clickButton(three);
  clickButton(four);
})
