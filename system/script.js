var port = 80


let sorozatok_element = document.getElementById("sorozatok")
let bejelentkezo = document.getElementById("bejelentkezo")
let belepesgomb = document.getElementById("belepesgomb")
let logincontainer = document.getElementById("logincontainer")
let info_box_beforelogin = document.getElementById("info_box_beforelogin")
let sorozattext = document.getElementById("sorozattext")
let sorozatadd_container = document.getElementById("sorozatadd_container")
let hozzaadas = document.getElementById("hozzaadas")
let passcontainer = document.getElementById("passcontainer")


sorozatadd_container.style.animationPlayState = 'paused';



if (window.location.href.split('#')[1] == null) {
    sorozatok_element.style.display = "none"
    bejelentkezo.style.display = "none"
    sorozattext.style.display = "none"
    sorozatadd_container.style.display = "none"
    hozzaadas.style.display = "none"
    passcontainer.style.display = "none"

} else {
    let uname = window.location.href.split('#')[1]

    bejelentkezo.style.display = "none"
    logincontainer.style.display = "none"
    info_box_beforelogin.style.display = "none"
    sorozattext.style.display = ""
    sorozatok_element.style.display = ""
    sorozatadd_container.style.display = ""
    hozzaadas.style.display = "none"
    passcontainer.style.display = "none"

    loadSorozatok(uname)
}

window.addEventListener('popstate', function() {
    
if (window.location.href.split('#')[1] == null) {
    sorozatok_element.style.display = "none"
    bejelentkezo.style.display = "none"
    sorozattext.style.display = "none"
    sorozatadd_container.style.display = "none"
    hozzaadas.style.display = "none"
    passcontainer.style.display = "none"
    
} else {
    let uname = window.location.href.split('#')[1]

    bejelentkezo.style.display = "none"
    logincontainer.style.display = "none"
    info_box_beforelogin.style.display = "none"
    sorozattext.style.display = ""
    sorozatok_element.style.display = ""
    sorozatadd_container.style.display = ""
    hozzaadas.style.display = "none"
    passcontainer.style.display = "none"

    loadSorozatok(uname)
}

});





function login(username) {

    if (username == null || username == "") {

       let bejelentkezo = document.getElementById("bejelentkezo")
       belepesgomb.style.display = "none"
       bejelentkezo.style.display = ""
        
    } else {

        window.location.replace(window.location.href.split('#')[0] + "#" + username);

        bejelentkezo.style.display = "none"
        logincontainer.style.display = "none"
        info_box_beforelogin.style.display = "none"
        sorozattext.style.display = ""
        sorozatok_element.style.display = ""
        sorozatadd_container.style.display = ""
        passcontainer.style.display = "none"


        loadSorozatok(username)
    }
}







/*
async function fetchSeries() {
    try {
        const response = await fetch(window.location.href + '/api/series');  //`http://${location.href.split("/")[2]}:${port}/api/series?username=${kie}`
        //const response = await fetch(`http://${location.href.split("/")[2]}:${port}/api/series?username=${window.location.href.split('#')[1]}`);
        const series = await response.json();

    } catch (error) {
        console.error('Error fetching series:', error);
    }
}
*/
//console.log(location.href.split("/")[2])

async function loadSorozatok(kie) {
    if (kie != null) {
        try {
            const response = await fetch(`http://${location.href.split("/")[2]}:${port}/api/series?username=${kie}`);
            const series = await response.json();

            var fodata = JSON.parse(series[0].sorozatok)

            let out = ""
            var images = ""

            if (fodata != null) {
                for (let i = 0; i < fodata.sorozatok.length; i++) {

                        if (fodata.sorozatok[i].files.slice(0, 11) == "DEV_NO_LINK") {
                            images = "./imgs/" + fodata.sorozatok[i].files + ".jpg"
                        } else {
                            images = fodata.sorozatok[i].files
                        }

                        out += `
                            <a class="sorozat" href="./series.html#${kie}#${fodata.sorozatok[i].files}#1">
                                <div class="imgs">
                                    <img class="shadowimg" src="${images}">
                                    <img class="img" src="${images}">
                                </div>
                    
                                <p>${fodata.sorozatok[i].name}</p>
                            </a>
                        `;

                    }
                    sorozatok_element.innerHTML = out;



                }
    
        } catch (error) {
            console.error('Error fetching series:', error);
        }
    }
}













async function Hozzaadas(seasons_number_input, kezdes_ornot, pass) {

    if (kezdes_ornot == "kezdes" && seasons_number_input != "") {
        let hozzaadas_kezdete = document.getElementById("hozzaadas_kezdete")
        hozzaadas_kezdete.style.display = "none"
        hozzaadas.style.display = ""
        passcontainer.style.display = ""


        let seasonok_hozzaadashoz = document.getElementById("seasonok_hozzaadashoz")

        let out = ""
        for(let i2 = 0; i2 < seasons_number_input; i2++) {
            out+= `

                    <div id="season_hozzaadasnal${i2}" class="season_hozzaadasnal">
                        <h3>Évad ${i2+1}</h3>

                        <label for="epizodok_szama${i2}">Epizódok száma</label><br>
                        <input type="number" min="1" name="epizodok_szama${i2}" class="beiroinput" id="epizodok_szama${i2}"><br>

                        <label for="van_pilotja${i2}">Van 0. része?</label>
                        <input type="checkbox" name="van_pilotja${i2}" id="van_pilotja${i2}"> <br>
                    </div>

            `

        }
        seasonok_hozzaadashoz.innerHTML = out


    } else if (kezdes_ornot == "notkezdes" && seasons_number_input != "" && pass != "") {

        if (document.getElementById("filek").value.slice(0, 7) == "http://" ||  document.getElementById("filek").value.slice(0, 8) == "https://") {

            hozzaadas.style.display = "none"

            const dataToSend = {}
            dataToSend.kinek = window.location.href.split('#')[1]
            dataToSend.pass = pass
            dataToSend.data = {
                name: document.getElementById("name").value,
                files: document.getElementById("filek").value,
            }

            dataToSend.data.seasons = {}

            for(i3 = 0; i3 < seasons_number_input; i3++) {
                dataToSend.data.seasons[i3 + 1] = {
                    episodes: document.getElementById("epizodok_szama" + i3).value,
                    pilot: document.getElementById("van_pilotja" + i3).checked
                }

            }

            console.log(dataToSend)

            try {
                const response = await fetch('./addSeries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
        
                const result = await response.json();
        
                if (response.ok && result.success) {
                    location.reload()
                } else {
                    alert(result.message);
                    location.reload()
                }
            } catch (error) {
                alert('Hiba!');
                console.error('Error:', error);
            }

        } else {
            alert("Helytelen link a sorozat képéhez!")
        }


    }
}





function showPass() {
    let pass = document.getElementById("pass")

    if (document.getElementById("showpass").checked) {
        pass.type = "text"
    } else {
        pass.type = "password"
    }
}









let plus_sign_addresz = document.getElementById("plus_sign_addresz")
//plus_sign_addresz.onclick = reveal_ornot_addresz;

sorozatadd_container.style.animationPlayState = 'paused';

function reveal_ornot_addresz() {
    sorozatadd_container.style.animationPlayState = 'paused';


    if (plus_sign_addresz.textContent == "+") {
        sorozatadd_container.style.animationName = "anim_add_reveal";
        sorozatadd_container.style.animationPlayState = 'running';
        plus_sign_addresz.textContent = "-";

        plus_sign_addresz.style.position = "relative";

        plus_sign_addresz.style.width = "100%";

    } else if (plus_sign_addresz.textContent == "-") {
        sorozatadd_container.style.animationName = "anim_add_not_reveal";
        sorozatadd_container.style.animationPlayState = 'running';
        plus_sign_addresz.textContent = "+";
        
        plus_sign_addresz.style.position = "absolute";

        plus_sign_addresz.style.width = "51%";
    };
}