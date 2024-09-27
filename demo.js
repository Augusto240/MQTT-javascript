function startConnect() {
    clientID = "clientID - " + parseInt(Math.random() * 100);

    host = document.getElementById("host").value;
    port = document.getElementById("port").value;
    userId = document.getElementById("username").value;
    passwordId = document.getElementById("password").value;

    document.getElementById("messages").innerHTML += '<span>Conectando no servidor: ' + host + ' na porta: ' + port + '</span><br/>';
    document.getElementById("messages").innerHTML += '<span>Usando o clienteID: ' + clientID + '</span><br/>';

    client = new Paho.Client(host, Number(port), clientID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({
        onSuccess: onConnect,
        userName: userId,
        password: passwordId
    });
}

function onConnect() {
    topic = document.getElementById("topic_s").value; // Corrigido aqui

    document.getElementById("messages").innerHTML += '<span>Subscribing to topic ' + topic + '</span><br/>';

    client.subscribe(topic);
}

function onConnectionLost(responseObject) {
    document.getElementById("messages").innerHTML += '<span>Conexão perdida: ' + responseObject.errorMessage + '</span><br/>';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>ERRO: ' + responseObject.errorMessage + '</span><br/>';
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
    const msg = document.getElementById("message").value; // Mensagem que será publicada
    const topic = document.getElementById("topic_p").value; // Tópico para a publicação

    if (!msg || !topic) {
        document.getElementById("messages").innerHTML += '<span>Erro: Mensagem ou tópico ausente!</span><br/>';
        return;
    }

    const message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;

    client.send(message);
    document.getElementById("messages").innerHTML += '<span>Mensagem publicada: ' + msg + ' no tópico: ' + topic + '</span><br/>';
}

