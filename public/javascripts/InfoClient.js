"use strict";

var InfoClient = function () {

    this.start = function () {

        window.onbeforeunload = function () {
            if (connection.readyState === 1) {
                connection.close();
            }
        };

        $(document).ready(function () {
            window.WebSocket = window.WebSocket || window.MozWebSocket;
            if (!window.WebSocket) {
                return;
            }

            connection = new WebSocket('ws://' + WebSocketURL + ':' + WebSocketPort);

            connection.onopen = function () {
                console.log('open');
            };

            connection.onerror = function (error) {
                console.log('error');
            };

            connection.onmessage = function (message) {
                var msg = JSON.parse(message.data);
					 // console.log('message recu');
					 
                if (msg.type === 'connected') {
                    console.log('nb clients connectes : ' + msg['users'].length);
						  var playersNumber= msg['users'].length -1;
                    $('div#countPlayers').html( playersNumber );
						  
                }
            };

            var loop = setInterval(function () {
                if (connection.readyState !== 1) {
                    console.log('error connection');
                } else {
                    console.log('connecting ...');

                    var msg = {
                        type: 'info',
								user_id: 'root'
                    };

                    connection.send(JSON.stringify(msg));
                    clearInterval(loop);
                }
            }, 1000);
        });
    };

    var connection;

};