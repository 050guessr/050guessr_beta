
function encodeToBase64(str) {
    return btoa(str);
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function RNG(daily) {

    if (daily == "1") {
        var info = JSON.parse(httpGet("info.json"));
        var temp = "";
        const daily_seeds = [];
        for (let loop = 1; loop < 6; console.log(loop)) {
            temp = Math.floor(Math.random() * info.foto_hoeveelheid) + 1;
            if (!daily_seeds.includes(temp)) {
                daily_seeds[loop] = temp;
                sessionStorage.setItem("DAILY_" + loop, temp);
                loop++;
            }

        }

    }
    var RNG = sessionStorage.getItem("DAILY_" + daily);
    var foto = document.getElementById("img");
    foto.src = "fotos/" + RNG + "/" + RNG + ".jpeg";
    return httpGet("fotos/" + RNG + "/" + RNG + ".json");
}
