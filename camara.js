let videoRef;
let Uniquekey;
let array = [];
let nombre;

$(document).ready(function () {
    initializeFirebase();
    const dummy = firebase.database().ref().child("data");
    videoRef = document.getElementById('video');

    dummy.on("child_added", (snap) => {
        let key = snap.key;
        let data = snap.val();

        if (data.nombre == nombre) {
            Uniquekey = key;
        }
    });

    dummy.on("child_changed", (snap) => {
        let key = snap.key;
        let data = snap.val();
        let add = true;

        let object = {
            id: key,
            img: data.img
        }

        //sava data into array
        if (array.length == 0) {
            array.push(object);
            add = false;
        }
        else {
            for (let i = 0; i < array.length; i++) {
                if (array[i].id == key) {
                    array[i].img = data.img;
                    add = false;
                    break;
                }
            }
        }

        if (add == true) {
            array.push(object);
        }

        let str = "";
        $("#container").html("");

        for (let i = 0; i < array.length; i++) {
            str += `
            <img src="` + array[i].img + ` "width="600" height="400">
            `;
        }
        $("#container").html(str);

    });

    $("#xd").click(function (event) {
        event.preventDefault();

        //push a firebase
        var data = dummy.push();
        let img = "img";
        nombre = document.querySelector("#nombrexd").value;
        data.set({
            img,
            nombre
        });

        navigator.mediaDevices.getUserMedia({
            video: { width: 300, height: 250 },
            audio: true
        }).then(stream => {
            videoRef.srcObject = stream;
        })

        setInterval((e) => {
            let video = document.getElementById('video');
            //
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext("2d");
            canvas.width = 1280;
            canvas.height = 720;
            //
            context.drawImage(video, 0, 0);
            let blob = canvas.toDataURL('image/webp');
            updateFirebase(Uniquekey, blob);
        }, 1000)
    });
});

function initializeFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyA3IALTAfEwknn1Gs3p15BZnbrPxyaJcgU",
        authDomain: "videollamda-ff7d3.firebaseapp.com",
        databaseURL: "https://videollamda-ff7d3-default-rtdb.firebaseio.com",
        projectId: "videollamda-ff7d3",
        storageBucket: "videollamda-ff7d3.appspot.com",
        messagingSenderId: "791478390988",
        appId: "1:791478390988:web:2400f9583e17d3e1f17269"
      };
      
    firebase.initializeApp(firebaseConfig);
}

function updateFirebase(currentKey, blob) {
    const dummy = firebase.database().ref().child(`data/${currentKey}`);
    dummy.update({
        img: blob
    })
}