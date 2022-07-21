var peer = new Peer();
let conexion = null;

const mostrarMensaje = (msg) => {
  document.getElementById("lblMensajes").innerText += `\n${msg}`;
};

peer.on("open", function (id) {
  console.log("My peer ID is: " + id);
  document.getElementById("lblID").innerText = id;
});

peer.on("connection", function (conn) {
  console.dir("Conectado!");
  document.getElementById("conexion").hidden = true;
  document.getElementById("conectado").hidden = false;
  conn.on("data", (data) => {
    console.log("Received", data);
    mostrarMensaje(data);
  });
  conexion = conn;
});

peer.on("call", (call) => {
  var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  call.answer();
  call.on("stream", (stream) => {
    console.dir(stream);
  });

  // getUserMedia({ video: true, audio: true }, (mediaStream) => {
  //   currentUserVideoRef.current.srcObject = mediaStream;
  //   currentUserVideoRef.current.play();
  //   call.answer(mediaStream);
  //   call.on("stream", function (remoteStream) {
  //     remoteVideoRef.current.srcObject = remoteStream;
  //     remoteVideoRef.current.play();
  //   });
  // });
});

document.getElementById("btnConectarse").addEventListener("click", () => {
  console.log(
    `Intentando conectarse a ${document.getElementById("txtID").value}`
  );
  conexion = peer.connect(document.getElementById("txtID").value);

  conexion.on("open", () => {
    document.getElementById("conectado").hidden = false;
    document.getElementById("conexion").hidden = true;
    console.log("Conectado!");

    conexion.on("data", (data) => {
      console.log("Received", data);
      mostrarMensaje(data);
    });
  });
});

document.getElementById("btnSaludar").addEventListener("click", () => {
  conexion.send(document.getElementById("txtMsg").value);
  document.getElementById("txtMsg").value = "";
});

document.getElementById("btnLlamar").addEventListener("click", () => {
  var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      var call = peer.call(conexion.peer, stream);
      call.on("stream", function (remoteStream) {
        // Show stream in some video/canvas element.
      });
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
});
