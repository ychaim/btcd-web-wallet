var $ = window.$
var console = window.console
var pangea = window.pangea
var WebSocket = window.WebSocket

pangea.API = new Object()

pangea.API.seats = function(seatArray){
  for (var i=0; i < seatArray.length; i++){
    var seatIndex = seatArray[i]['seat']
    pangea.seats[seatIndex].update(seatArray[i])
  }
  pangea.update()
}

pangea.API.player = function(playerArray){
  for (var param in playerArray){
    if (pangea.player.hasOwnProperty(param)){
      pangea.player[param] = playerArray[param]
    } else {
      console.log("Property not found ", param)
    }
  }
  pangea.update()
}

pangea.API.game = function(gameArray){
  for (var param in gameArray){
    if (pangea.game.hasOwnProperty(param)){
      pangea.game[param] = gameArray[param]
    } else {
      console.log("Property not found ", param)
    }
  }
  pangea.update()
}

pangea.API.deal = function(message){
  function dealer(new_dealer){
    pangea.dealer = new_dealer
    pangea.update()
  }
  function holecards(new_cards){
    for (var seat in pangea.seats){
      // pangea.seats[seat].playercards = null
      pangea.player.holecards = new_cards
      if (seat == pangea.player.seat){
        pangea.seats[seat].playercards = pangea.player.holecards
      }
    }
    is_holecards = true
  }
  function boardcards(new_card){
    for (var position in new_card){
      pangea.boardcards[position].card = new_card[position]
    }
  }
  var is_holecards = false
  var newholecards = []
  var handlers = {'holecards':holecards, 'dealer':dealer,
                 'board':boardcards}
  for (var key in message){
    if (message.hasOwnProperty(key)){
      var handler = handlers[key]
      handler(message[key])
    }
  }
  if (is_holecards){pangea.gui.dealcards()}
  pangea.update()
}

pangea.API.action = function(actionArray){
  var handlers = {'chipsToPot':pangea.gui.chipsToPot, 'chipsToPlayer':pangea.gui.chipsToPlayer}
  // var single_player = [pangea.gui.chipsToPlayer]
  // ** Refactor: Don't think I should use 'in' here... is actionArray an array or object?
  // Since `in` seems to work, I think it is actually an object
  // Right, so using `in` is fine, but the parameter shouldn't have 'array' in it's name that is
  // stupid
  for (var action in actionArray){
    console.log(action)
    if (actionArray.hasOwnProperty(action)){
      if (action == 'chipsToPot'){(pangea.gui.chipsToPot())}
      if (action == 'chipsToPlayer'){
        pangea.gui.chipsToPlayer(actionArray[action])
      }
      if (action == 'returnPlayerCards'){
        var thisseat = parseInt(actionArray[action])
        console.log(thisseat)
        pangea.seats[thisseat].returnCards()
      }
      if (action == 'returnCards'){
        pangea.gui.returnCards()
      }
    }
  }
  return true
}

pangea.API.checkAutoControls = function(){
  if (pangea.game.myturn == 1){
    var foldClicked = $('#checkbox1').prop('checked')
    if (foldClicked){
      pangea.sendMessage({'action':{'fold':'1'}})
    }
  }
}

pangea.API.chat = function(messages){
  var chatbox = $('#chatbox')
  for (var i=0; i< messages.length; i++) {
    chatbox.append(messages[i])
    chatbox.append('<br>')
  }
}