function startConnect() {
    const clientID = "clientID - " + parseInt(Math.random() * 100);

    const host = document.getElementById("host").value;
    const port = document.getElementById("port").value;
    const userId = document.getElementById("username").value;
    const passwordId = document.getElementById("password").value;

    document.getElementById("messages").innerHTML += '<span>Conectando no servidor: ' + host + ' na porta: ' + port + '</span><br/>';
    document.getElementById("messages").innerHTML += '<span>Usando o clientID: ' + clientID + '</span><br/>';

    client = new Paho.Client(host, Number(port), clientID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        userName: userId,
        password: passwordId
    });
}

function onConnectSuccess() {
    const topic = document.getElementById("topic_s").value;
    document.getElementById("messages").innerHTML += '<span>Subscrito ao tópico: ' + topic + '</span><br/>';
    client.subscribe(topic);
}

function onConnectFailure(error) {
    document.getElementById("messages").innerHTML += '<span>Erro na conexão: ' + error.errorMessage + '</span><br/>';
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>Conexão perdida: ' + responseObject.errorMessage + '</span><br/>';
    }
}

function onMessageArrived(message) {
    document.getElementById("messages").innerHTML += '<span>Mensagem recebida: ' + message.payloadString + '</span><br/>';
}

function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Desconectado</span><br/>';
}

function publishMessage() {
    const msg = document.getElementById("message").value;
    const topic = document.getElementById("topic_p").value;

    if (!msg || !topic) {
        document.getElementById("messages").innerHTML += '<span>Erro: Mensagem ou tópico ausente!</span><br/>';
        return;
    }

    const message = new Paho.Message(msg);
    message.destinationName = topic;
    client.send(message);

    document.getElementById("messages").innerHTML += '<span>Mensagem publicada: ' + msg + ' no tópico: ' + topic + '</span><br/>';
}
