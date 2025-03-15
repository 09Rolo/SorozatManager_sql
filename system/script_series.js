var port = 80



let visszagomb = document.getElementById("vissza")
window.addEventListener('load', function() {
    visszagomb.href = "index.html#" + window.location.href.split('#')[1];
});


async function loaded() {
    try {
        const response = await fetch(`http://${location.href.split("/")[2]}:${port}/api/series?username=${window.location.href.split('#')[1]}`);
        const series = await response.json();

        var data = JSON.parse(series[0].sorozatok)

        var sorozat = window.location.href.split('#')[2];



        let soriszam;
        let soriname = document.getElementById("sori_name");





        setTimeout(function() {
            for (let i = 0; i < data.sorozatok.length; i++) {
            
                if (data.sorozatok[i].files == sorozat) {
                    soriszam = i;
                    soriname.textContent = data.sorozatok[i].name;
                    break
                }
    
            }


            if (soriname != null) {
                let seasons_number = document.getElementById("seasons_number");
                let total_episodes_number = document.getElementById("total_episodes_number");



                let seasons_length = null
                for (let i = 1; i < 1000; i++) {
                    valami = i.toString()
                    if(data.sorozatok[soriszam].seasons[i] == null) {
                        parseInt(valami)
                        seasons_length = valami - 1
                        break
                    }
                }

                seasons_number.textContent = seasons_length

                
                let osszeg = 0;
                let osszegint;
                for (let v = 1; v <= seasons_length; v++) {
                    console.log(parseInt(data.sorozatok[soriszam].seasons[v].episodes))
                    osszegint = parseInt(data.sorozatok[soriszam].seasons[v].episodes);

                    if (data.sorozatok[soriszam].seasons[v].pilot) {
                        osszegint += 1;
                    }
            
                    osszeg += osszegint;
                }

                total_episodes_number.textContent = osszeg;
            }




            let shadowimg = document.getElementById("simg");
            let image = document.getElementById("img");
    
            if (data.sorozatok[soriszam].files.slice(0, 11) == "DEV_NO_LINK") {
                shadowimg.src = "./imgs/" + sorozat + ".jpg"
                image.src = "./imgs/" + sorozat + ".jpg"
            } else {
                shadowimg.src = data.sorozatok[soriszam].files
                image.src = data.sorozatok[soriszam].files
            }





            var season = window.location.href.split('#')[3];



            addSeasons(data, soriszam)

            addEpisodes(data, soriszam, season)
            


            setWatched(window.location.href.split('#')[1], window.location.href.split('#')[2], season, data.sorozatok[soriszam].seasons[season].episodes)
        }, 10);






        window.addEventListener('popstate', function() {
            var season = window.location.href.split('#')[3];
            var episodeSelected = window.location.href.split('#')[4];

            addEpisodes(data, soriszam, season, episodeSelected)



            setWatched(window.location.href.split('#')[1], window.location.href.split('#')[2], season, data.sorozatok[soriszam].seasons[season].episodes)
        });



    } catch (error) {
        console.error('Error: ', error);
    }

}








function addSeasons(data, soriszam) {
    let season_list = document.querySelector("#season_list");

    let out = "";
    let href = window.location.href.split('#')[0] + "#" + window.location.href.split('#')[1] + "#" + window.location.href.split('#')[2] + "#"

    
    let seasons_length = null
    for (let i = 1; i < 1000; i++) {
        valami = i.toString()
        if(data.sorozatok[soriszam].seasons[i] == null) {
            parseInt(valami)
            seasons_length = valami - 1
            break
        }
    }

    var hrefszam = null
    for (let v2 = 0; v2 < seasons_length; v2++) {
        hrefszam = v2 + 1

        out += `
            <a href="${href + hrefszam}" class="season_in_list" id="season${hrefszam}">${hrefszam}</a>
        `;
                
    }
    season_list.innerHTML = out;
}






function addEpisodes(data, soriszam, season, episodeSelected) {
    let episode_list = document.querySelector("#episode_list");

    let out_eps = "";
    let href = window.location.href.split('#')[0] + "#" + window.location.href.split('#')[1] + "#" + window.location.href.split('#')[2] + "#" + window.location.href.split('#')[3] + "#"


    season = season.toString()

    let pilothozzaadva = false
    for (let v3 = 0; v3 < data.sorozatok[soriszam].seasons[season].episodes; v3++) {
        if (data.sorozatok[soriszam].seasons[season].pilot && !pilothozzaadva) {
            out_eps += `
                <a href="${href + v3}" class="episode_in_list" id="episode${v3}">${v3}</a>
            `
            pilothozzaadva = true
        }


        let newv3 = v3+1

        out_eps += `
            <a href="${href + newv3}" class="episode_in_list" id="episode${v3+1}">${v3+1}</a>
        `
    }

    episode_list.innerHTML = out_eps;



    setWatched(window.location.href.split('#')[1], window.location.href.split('#')[2], season, data.sorozatok[soriszam].seasons[season].episodes)




    parseInt(season)
    console.log(season)    

    let elozoaktiv = document.getElementsByClassName("active_season");
    if (elozoaktiv.length != 0) {
        elozoaktiv[0].classList.remove("active_season");
    }

    let jelenlegi_season = document.getElementById("season" + season);
    jelenlegi_season.classList.add("active_season");




    if (episodeSelected != null) {
        let elozoaktivEpisode = document.getElementsByClassName("active_episode");
        if (elozoaktivEpisode.length != 0) {
            elozoaktivEpisode[0].classList.remove("active_episode");
        }

        let jelenlegi_episode = document.getElementById("episode" + episodeSelected);
        jelenlegi_episode.classList.add("active_episode");
    }
}



















function showPass() {
    let pass = document.getElementById("pass")
    let pass2 =document.getElementById("pass2")

    if (document.getElementById("showpass").checked) {
        pass.type = "text"
    } else {
        pass.type = "password"
    }

    if (document.getElementById("showpass2").checked) {
        pass2.type = "text"
    } else {
        pass2.type = "password"
    }
}



let help = document.getElementById("help")

let borito_valtoztatas = document.getElementById("borito_valtoztatas")
let deleteSeries = document.getElementById("deleteSeries")
let addSeasonToSeries = document.getElementById("addSeasonToSeries")
let addEpisodeToSeason = document.getElementById("addEpisodeToSeason")

let borito_valtoztatasresz = document.getElementById("borito_valtoztatasresz")
let evadhozzaadasresz = document.getElementById("evadhozzaadasresz")
let epizodhozzaadasresz = document.getElementById("epizodhozzaadasresz")
let deleteresz = document.getElementById("deleteresz")

let passcontainer = document.getElementById("passcontainer")




help.style.display = "none"

borito_valtoztatas.style.display = "none"
deleteSeries.style.display = "none"
addSeasonToSeries.style.display = "none"
addEpisodeToSeason.style.display = "none"

borito_valtoztatasresz.style.display = "none"
evadhozzaadasresz.style.display = "none"
epizodhozzaadasresz.style.display = "none"
deleteresz.style.display = "none"

passcontainer.style.display = "none"



function edit(buttonbol) {
    if (buttonbol) {
        if (passcontainer.style.display != "none") {
            help.style.display = "none"
        
            borito_valtoztatas.style.display = "none"
            deleteSeries.style.display = "none"
            addSeasonToSeries.style.display = "none"
            addEpisodeToSeason.style.display = "none"
        
            borito_valtoztatasresz.style.display = "none"
            evadhozzaadasresz.style.display = "none"
            epizodhozzaadasresz.style.display = "none"
            deleteresz.style.display = "none"
        
            passcontainer.style.display = "none"
        
        } else {
            help.style.display = ""
        
            borito_valtoztatas.style.display = ""
            deleteSeries.style.display = ""
            addSeasonToSeries.style.display = ""
            addEpisodeToSeason.style.display = ""
            
            borito_valtoztatasresz.style.display = "none"
            deleteresz.style.display = "none"
            evadhozzaadasresz.style.display = "none"
            epizodhozzaadasresz.style.display = "none"
            
            
            passcontainer.style.display = ""
            
            
            passcontainer.scrollIntoView({behavior: "smooth"})
            }
    } else {
        help.style.display = ""
    
        borito_valtoztatas.style.display = ""
        deleteSeries.style.display = ""
        addSeasonToSeries.style.display = ""
        addEpisodeToSeason.style.display = ""
        
        borito_valtoztatasresz.style.display = "none"
        deleteresz.style.display = "none"
        evadhozzaadasresz.style.display = "none"
        epizodhozzaadasresz.style.display = "none"
        
        
        passcontainer.style.display = ""
        
        
        passcontainer.scrollIntoView({behavior: "smooth"})
    }
}




async function deleteSeriesFunc(confirmed) {
    if (!confirmed) {
        edit()
        deleteresz.style.display = ""
        deleteresz.scrollIntoView({behavior: "smooth"})
    } else {
        let passw = document.getElementById("pass").value


        const dataToSend = {}
        dataToSend.kinek = window.location.href.split('#')[1]
        dataToSend.pass = passw
        dataToSend.files = document.getElementById("img").src


        try {
            const response = await fetch('./deleteSeries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
    
            const result = await response.json();
    
            if (response.ok && result.success) {
                window.location.replace("index.html#" + window.location.href.split('#')[1]);
            } else {
                alert(result.message);
                window.location.replace("index.html#" + window.location.href.split('#')[1]);
            }
        } catch (error) {
            alert('Hiba!');
            console.error('Error:', error);
        }

        window.location.replace("index.html#" + window.location.href.split('#')[1]);

    }

}







async function addSeasonToSeriesFunc(confirmed) {
    if (!confirmed) {
        edit()
        evadhozzaadasresz.style.display = ""
        evadhozzaadasresz.scrollIntoView({behavior: "smooth"})
    } else {
        let passw = document.getElementById("pass").value


        const dataToSend = {}
        dataToSend.kinek = window.location.href.split('#')[1]
        dataToSend.pass = passw
        dataToSend.files = document.getElementById("img").src

        dataToSend.pilot = document.getElementById("van_pilotja_plus").checked
        dataToSend.episodes = document.getElementById("epizodok_szama_plus").value


        try {
            const response = await fetch('./addSeason', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
    
            const result = await response.json();
    
            if (response.ok && result.success) {
                window.location.replace("index.html#" + window.location.href.split('#')[1]);
            } else {
                alert(result.message);
                window.location.replace("index.html#" + window.location.href.split('#')[1]);
            }
        } catch (error) {
            alert('Hiba!');
            console.error('Error:', error);
        }

        window.location.replace("index.html#" + window.location.href.split('#')[1]);
    }
}












async function addEpisodeToSeasonFunc(confirmed) {
    if (!confirmed) {
        edit()
        epizodhozzaadasresz.style.display = ""
        epizodhozzaadasresz.scrollIntoView({behavior: "smooth"})
    } else {
        let passw = document.getElementById("pass").value


        const dataToSend = {}
        dataToSend.kinek = window.location.href.split('#')[1]
        dataToSend.pass = passw
        dataToSend.files = document.getElementById("img").src

        dataToSend.ispilot = document.getElementById("ispilot_plus").checked
        dataToSend.season = document.getElementById("evad_szama_plus").value


        try {
            const response = await fetch('./addEpizod', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
    
            const result = await response.json();
    
            if (response.ok && result.success) {
                window.location.replace("index.html#" + window.location.href.split('#')[1]);
            } else {
                alert(result.message);
                window.location.replace("index.html#" + window.location.href.split('#')[1]);
            }
        } catch (error) {
            alert('Hiba!');
            console.error('Error:', error);
        }

        window.location.replace("index.html#" + window.location.href.split('#')[1]);
    }
}











async function borito_valtoztatasFunc(confirmed) {
    if (!confirmed) {
        edit()
        borito_valtoztatasresz.style.display = ""
        borito_valtoztatas.scrollIntoView({behavior: "smooth"})
    } else {
        let passw = document.getElementById("pass").value


        const dataToSend = {}
        dataToSend.kinek = window.location.href.split('#')[1]
        dataToSend.pass = passw
        dataToSend.files = document.getElementById("img").src



        if (document.getElementById("borito_valtoztatas_szoveg_plus").value.slice(0, 7) == "http://" ||  document.getElementById("borito_valtoztatas_szoveg_plus").value.slice(0, 8) == "https://") {

            dataToSend.newfiles = document.getElementById("borito_valtoztatas_szoveg_plus").value


            try {
                const response = await fetch('./boritoValtoztatas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
        
                const result = await response.json();
        
                if (response.ok && result.success) {
                    window.location.replace("index.html#" + window.location.href.split('#')[1]);
                } else {
                    alert(result.message);
                    window.location.replace("index.html#" + window.location.href.split('#')[1]);
                }
            } catch (error) {
                alert('Hiba!');
                console.error('Error:', error);
            }
    
            window.location.replace("index.html#" + window.location.href.split('#')[1]);

        } else {
            alert("Helytelen link a sorozat képéhez!")
        }

    }
}

























let iswatched_container = document.getElementById("iswatched_container")
let selected_evad_szama = document.getElementById("selected_evad_szama")
let selected_episode_szam = document.getElementById("selected_episode_szam")

iswatched_container.style.display = "none"




window.addEventListener('popstate', function() {
    if (window.location.href.split('#')[4]) {
        iswatched_container.style.display = ""
        iswatched_container.scrollIntoView({behavior: "smooth"})


        selected_evad_szama.textContent = window.location.href.split('#')[3]
        selected_episode_szam.textContent = window.location.href.split('#')[4]
    }
});


window.addEventListener('load', function() {
    if (window.location.href.split('#')[4]) {
        iswatched_container.style.display = ""
        iswatched_container.scrollIntoView({behavior: "smooth"})


        selected_evad_szama.textContent = window.location.href.split('#')[3]
        selected_episode_szam.textContent = window.location.href.split('#')[4]
    }
});






//
var counter_forrefresh = 0;
//

async function Watched(yesORno) {
    counter_forrefresh++



    let evad = window.location.href.split('#')[3]
    let epizod = window.location.href.split('#')[4]

    if (yesORno && evad && epizod) {

        if (yesORno == "igen") {

            const dataToSend = {}
            dataToSend.kinek = window.location.href.split('#')[1]
            dataToSend.pass = document.getElementById("pass2").value
            dataToSend.files = document.getElementById("img").src
            dataToSend.allapot = "igen"
            dataToSend.evad = evad
            dataToSend.epizod = epizod
    


            try {
                const response = await fetch('./watched', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
        
                const result = await response.json();
        
                if (response.ok && result.success) {
                    //
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Hiba!');
                console.error('Error:', error);
            }


            if (counter_forrefresh == 4) {
                setTimeout(() => {
                    window.location.reload()
                }, 1250);
            }


        

        } else if (yesORno == "nem") {
        

            const dataToSend = {}
            dataToSend.kinek = window.location.href.split('#')[1]
            dataToSend.pass = document.getElementById("pass2").value
            dataToSend.files = document.getElementById("img").src
            dataToSend.allapot = "nem"
            dataToSend.evad = evad
            dataToSend.epizod = epizod
    


            try {
                const response = await fetch('./watched', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
        
                const result = await response.json();
        
                if (response.ok && result.success) {
                    //
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Hiba!');
                console.error('Error:', error);
            }
        




            if (counter_forrefresh == 4) {
                setTimeout(() => {
                    window.location.reload()
                }, 1250);
            }




        }

    }
}








let loading = document.getElementById("loading")
loading.style.display = "none"



document.getElementById("latta_igen").addEventListener("click", latta_igen_clicked);

function latta_igen_clicked() {

    loading.style.display = ""
    setTimeout(() => {
        window.location.replace(window.location.href);
        loading.style.display = "none"
        
    }, 1000);


    setTimeout(() => {
        let current_ep = document.getElementById("episode" + window.location.href.split('#')[4])
        current_ep.scrollIntoView({behavior: "smooth"})
    }, 1500);



    //current_ep.classList.add("latta_a_reszt")
}




document.getElementById("latta_nem").addEventListener("click", latta_nem_clicked);

function latta_nem_clicked() {

    loading.style.display = ""
    setTimeout(() => {
        window.location.replace(window.location.href);
        loading.style.display = "none"
    }, 1000);




    setTimeout(() => {
        let current_ep = document.getElementById("episode" + window.location.href.split('#')[4])
        current_ep.scrollIntoView({behavior: "smooth"})
    }, 1500);
    //current_ep.classList.remove("latta_a_reszt")
}



















async function setWatched(kinek, files, evad, eps) {

    try {
        const response = await fetch(`http://${location.href.split("/")[2]}:${port}/api/getwatched?username=${window.location.href.split('#')[1]}`);
        const series = await response.json();

        var data = JSON.parse(series[0].watched)


        var sorozatszam = undefined
        for (let sori = 0; sori <= data.sorozatok.length; sori++) {
            if (data.sorozatok[sori].files == files) {
                sorozatszam = sori
                break
            }
        }

        var hanyadikevados = undefined
        for (let evadoscucc = 0; evadoscucc < data.sorozatok[sorozatszam].watched.length; evadoscucc++) {
            if (data.sorozatok[sorozatszam].watched[evadoscucc].evad == evad) {
                hanyadikevados = evadoscucc
                break
            }
        }

        if (hanyadikevados != undefined) {
            var masszivdata = data.sorozatok[sorozatszam].watched[hanyadikevados].epizodok
        

            for (let evadszamok = 0; evadszamok <= masszivdata.length; evadszamok++) {
                
                for (let selector = 0; selector <= eps; selector++) {
                    if (masszivdata[evadszamok]) {
                        if (masszivdata[evadszamok].toString() == selector.toString()) {
                            
                            let ep = document.getElementById("episode" + selector)
    
                            ep.classList.add("latta_a_reszt")
                        }
                    }
                }
            }
        }

    } catch (error) {
        console.error('Error fetching series:', error);
    }
}
