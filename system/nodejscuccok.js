var port = 80

const express = require('express');
const path = require('path');
const app = express();


app.use(express.static(path.join(__dirname)));

app.get('/', async(req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});



app.listen(port, () => {
    console.log("Fut, port: " + port);
});




const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.post('/sendInfo', (req, res) => {
    const data = req.body;


    console.log('Received data:', data);
  

});



var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sorozatmanager"
});




function handleDisconnect() {
    con.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    con.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();










app.get('/api/series', (req, res) => {
    const { username } = req.query;

    con.query(`SELECT * FROM users WHERE name = '${username}'`, function (err, result, fields) {
        if (err) {
            res.status(500).send('Hiba');
        } else {
            res.json(result); // Send the results as JSON
        }
    });
});


app.get('/api/getwatched', (req, res) => {
    const { username } = req.query;

    con.query(`SELECT * FROM users WHERE name = '${username}'`, function (err, result, fields) {
        if (err) {
            res.status(500).send('Hiba');
        } else {
            res.json(result); // Send the results as JSON
        }
    });
});









app.post('/addSeries', (req, res) => {
    const data = req.body;


    console.log('Received data:', data);

    //write(data, data.kinek, data.pass)
    
    var mit = data
    var kinek = data.kinek
    var passw = data.pass


    console.log("-----")

    var marletezik = false

    var jsonsorozat = {sorozatok: [{ name: mit.data.name, files: mit.data.files, seasons: mit.data.seasons }] };
    var stringsorozat = JSON.stringify(jsonsorozat);
    
    con.query(`SELECT * FROM users WHERE name = '${kinek}'`, function (err, result, fields) {
        if (err) throw err;
        
        if (result){
        if (result[0]) {
            if (result[0].pass == passw) {
                let eddigisorik = JSON.parse(result[0].sorozatok);

                for(let IndexOfSeries = 0; IndexOfSeries < eddigisorik.sorozatok.length; IndexOfSeries++) {
                    let sorozat = eddigisorik.sorozatok[IndexOfSeries]

                    if(sorozat.files == mit.data.files) {
                        marletezik = true
                        break
                    }
                }

                if (!marletezik) {
            
                    eddigisorik.sorozatok.push({ name: mit.data.name, files: mit.data.files, seasons: mit.data.seasons });
                    //console.log("Updated sorozatok:", eddigisorik);
                    
                    let stringujsorik = JSON.stringify(eddigisorik);
                    var sql = `UPDATE users SET sorozatok = '${stringujsorik.replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                    });

                    return res.status(201).json({ success: true, message: 'oke' });
                } else {
                    console.log("Már létezik!")
                    return res.status(500).json({ success: false, message: 'Már hozzáadtad ezt a sorozatot!' });
                }
            } else {
                console.log("Helytelen Jelszó!");
                return res.status(500).json({ success: false, message: 'Helytelen Jelszó!' });
            }
        } else {
            var sql = `INSERT INTO users (name, pass, sorozatok) VALUES ('${kinek}', '${passw}', '${stringsorozat.replace(/'/g, "''")}')`;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });

            return res.status(201).json({ success: true, message: 'oke' });
        }
        } else {
            var sql = `INSERT INTO users (name, pass, sorozatok) VALUES ('${kinek}', '${passw}', '${stringsorozat.replace(/'/g, "''")}')`;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });

            return res.status(201).json({ success: true, message: 'oke' });
        }
    });
});

//function write(mit, kinek, passw) { 
//}









app.post('/deleteSeries', (req, res) => {
    const data = req.body;


    console.log('Received data:', data);
    


    console.log(data.files)
    if (data.files != "http://") {
        if (data.files != "https://") {
            if (data.files.slice(-1) == "/") {
                data.files = data.files.slice(0, -1)
            }
        }
    }
    console.log(data.files)


    
    //deleteSeries(data, data.kinek, data.pass)
    var mit = data
    var kinek = data.kinek
    var passw = data.pass


    console.log("-----")

    con.query(`SELECT * FROM users WHERE name = '${kinek}'`, function (err, result, fields) {
        if (err) throw err;
        
        if (result){
        if (result[0]) {
            if (result[0].pass == passw) {
                let eddigisorik = JSON.parse(result[0].sorozatok);


                for(let IndexOfSeries = 0; IndexOfSeries < eddigisorik.sorozatok.length; IndexOfSeries++) {
                    let sorozat = eddigisorik.sorozatok[IndexOfSeries]

                    if(sorozat.files == mit.files) {
                        let sorozatszam = eddigisorik.sorozatok.indexOf(sorozat)
    
                        const what = eddigisorik.sorozatok.splice(sorozatszam, 1);
    
                        break
                    }
                }
                
                deleteSeries_fromWatched(mit, kinek)
            
                let stringujsorik = JSON.stringify(eddigisorik);
                var sql = `UPDATE users SET sorozatok = '${stringujsorik.replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                });

                return res.status(201).json({ success: true, message: 'oke' });
            } else {
                console.log("Helytelen Jelszó!");
                return res.status(500).json({ success: false, message: 'Helytelen Jelszó!' });
            }
        }
        }
    });
});

//function deleteSeries(mit, kinek, passw) {
//}









app.post('/addSeason', (req, res) => {
    const data = req.body;


    console.log('Received data:', data);


    console.log(data.files)
    if (data.files != "http://") {
        if (data.files != "https://") {
            if (data.files.slice(-1) == "/") {
                data.files = data.files.slice(0, -1)
            }
        }
    }
    console.log(data.files)

    
    //addSeason(data, data.kinek, data.pass)

    var mit = data
    var kinek = data.kinek
    var passw = data.pass


    console.log("-----")


    con.query(`SELECT * FROM users WHERE name = '${kinek}'`, function (err, result, fields) {
        if (err) throw err;
        
        if (result){
        if (result[0]) {
            if (result[0].pass == passw) {
                let eddigisorik = JSON.parse(result[0].sorozatok);
                

                for(let IndexOfSeries = 0; IndexOfSeries < eddigisorik.sorozatok.length; IndexOfSeries++) {
                    let sorozat = eddigisorik.sorozatok[IndexOfSeries]
    
                    if(sorozat.files == mit.files) {
                        let sorozatszam = eddigisorik.sorozatok.indexOf(sorozat)
    
                        let seasonszam = 0
                        for(let IndexOfNextSeason = 1; IndexOfNextSeason < 10000; IndexOfNextSeason++) {
                            if(eddigisorik.sorozatok[sorozatszam].seasons[IndexOfNextSeason.toString()]) {
                                seasonszam = IndexOfNextSeason
                            } else {
                                seasonszam += 1
    
                                let seasonszam_s = seasonszam.toString()
    
    
                                eddigisorik.sorozatok[sorozatszam].seasons[seasonszam_s] = {"episodes": mit.episodes, "pilot": mit.pilot}
    
                                break
                            }
                        }
    
                        break
                    }
                }

                let stringujsorik = JSON.stringify(eddigisorik);
                var sql = `UPDATE users SET sorozatok = '${stringujsorik.replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                });

                return res.status(201).json({ success: true, message: 'oke' });
            } else {
                console.log("Helytelen Jelszó!");
                return res.status(500).json({ success: false, message: 'Helytelen Jelszó!' });
            }
        }
        }
    })
});

//function addSeason(mit, kinek, passw) {
//}









app.post('/addEpizod', (req, res) => {
    const data = req.body;


    console.log('Received data:', data);



    console.log(data.files)
    if (data.files != "http://") {
        if (data.files != "https://") {
            if (data.files.slice(-1) == "/") {
                data.files = data.files.slice(0, -1)
            }
        }
    }
    console.log(data.files)


    
    //addEpizod(data, data.kinek, data.pass)
    var mit = data
    var kinek = data.kinek
    var passw = data.pass



    console.log("-----")



    con.query(`SELECT * FROM users WHERE name = '${kinek}'`, function (err, result, fields) {
        if (err) throw err;
        
        if (result){
        if (result[0]) {
            if (result[0].pass == passw) {
                let eddigisorik = JSON.parse(result[0].sorozatok);

                for(let IndexOfSeries = 0; IndexOfSeries < eddigisorik.sorozatok.length; IndexOfSeries++) {
                    let sorozat = eddigisorik.sorozatok[IndexOfSeries]
    
                    if(sorozat.files == mit.files) {
                        let sorozatszam = eddigisorik.sorozatok.indexOf(sorozat)
    
    
                        if (!mit.ispilot) {
    
    
                            if (eddigisorik.sorozatok[sorozatszam].seasons[mit.season]) {
                                let szezon = eddigisorik.sorozatok[sorozatszam].seasons[mit.season]
                                
                                let eps = parseInt(szezon.episodes)
                                eps += 1
    
    
                                eddigisorik.sorozatok[sorozatszam].seasons[mit.season].episodes = eps.toString()
                            }
    
    
                        } else {
    
    
                            if (eddigisorik.sorozatok[sorozatszam].seasons[mit.season]) {
                                eddigisorik.sorozatok[sorozatszam].seasons[mit.season].pilot = true
                            }
    
    
                        }
                    
                        
    
    
                        break
                    }
                }

                let stringujsorik = JSON.stringify(eddigisorik);
                var sql = `UPDATE users SET sorozatok = '${stringujsorik.replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                });

                return res.status(201).json({ success: true, message: 'oke' });
            } else {
                console.log("Helytelen Jelszó!");
                return res.status(500).json({ success: false, message: 'Helytelen Jelszó!' });
            }
        }
        }
    })
});

//function addEpizod(mit, kinek, passw) {
//}









app.post('/boritoValtoztatas', (req, res) => {
    const data = req.body;


    console.log('Received data:', data);



    console.log(data.files)
    if (data.files != "http://") {
        if (data.files != "https://") {
            if (data.files.slice(-1) == "/") {
                data.files = data.files.slice(0, -1)
            }
        }
    }
    console.log(data.files)

    
    
    //boritoValtoztatas(data, data.kinek, data.pass)
    var mit = data
    var kinek = data.kinek
    var passw = data.pass


    console.log("-----")


    con.query(`SELECT * FROM users WHERE name = '${kinek}'`, function (err, result, fields) {
        if (err) throw err;
        
        if (result){
        if (result[0]) {
            if (result[0].pass == passw) {
                let eddigisorik = JSON.parse(result[0].sorozatok);
            

                for(let IndexOfSeries = 0; IndexOfSeries < eddigisorik.sorozatok.length; IndexOfSeries++) {
                    let sorozat = eddigisorik.sorozatok[IndexOfSeries]
    
                    if(sorozat.files == mit.files) {
                        let sorozatszam = eddigisorik.sorozatok.indexOf(sorozat)
    
                        if (mit.newfiles) {
                            eddigisorik.sorozatok[sorozatszam].files = mit.newfiles
                        }
    
                        break
                    }
                }

                let stringujsorik = JSON.stringify(eddigisorik);
                var sql = `UPDATE users SET sorozatok = '${stringujsorik.replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                });

                return res.status(201).json({ success: true, message: 'oke' });
            } else {
                console.log("Helytelen Jelszó!");
                return res.status(500).json({ success: false, message: 'Helytelen Jelszó!' });
            }
        }
        }
    })
});
//function boritoValtoztatas(mit, kinek, passw) {
//}









app.post('/watched', (req, res) => {
    const data = req.body;

    let mit = data
    let kinek = data.kinek
    let passw = data.pass


    console.log('Received data:', data);

    if (data.allapot == "igen") {
        //addtowatched(data, data.kinek, data.pass)

        console.log("-----")

        con.query(`SELECT * FROM users WHERE name = '${kinek}'`, function (err, result, fields) {
            if (err) throw err;

            if (result){
                if (result[0]) {
                    if (result[0].pass == passw) {

                        //add_readwatched(mit)
                        var adat = mit

                        let eddigiwatched = JSON.parse(result[0].watched);

                        if (!eddigiwatched) {
                            const toAddWatched = {evad: adat.evad, epizodok: [adat.epizod]}
                        
                            let jsonujwatched = {sorozatok: [{ files: adat.files, watched: [toAddWatched] }] };

                            var sql = `UPDATE users SET watched = '${JSON.stringify(jsonujwatched).replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                            con.query(sql, function (err, result) {
                              if (err) throw err;
                            });

                            return res.status(201).json({ success: true, message: 'oke' });

                        } else if (eddigiwatched.sorozatok.length > 0) {
                            //const toAddWatched = {evad: adat.evad, epizodok: [adat.epizod]}
                        
                            //eddigiwatched.sorozatok.push({files: adat.files, watched: [toAddWatched]})

                            for (let a = 0; a <= eddigiwatched.sorozatok.length; a++) {
                                var vanilyen = false
                            
                                if (eddigiwatched.sorozatok[a]) {
                                    if (eddigiwatched.sorozatok[a].files == adat.files) {
                                        const toAddWatched = eddigiwatched.sorozatok[a].watched
                                    
                                        let ok = false
                                        for (let b = 0; b <= toAddWatched.length; b++) {
                                            //console.log(b)
                                        
                                            if(toAddWatched[b]) {
                                                if (toAddWatched[b].evad == adat.evad) {
                                                    ok = true
                                                
                                                    let epstring = adat.epizod.toString()
                                                    let marbennevan = false
                                                
                                                    for (let c = 0; c <= toAddWatched[b].epizodok.length; c++) {
                                                        //console.log(toAddWatched[b].epizodok[c] + " tostringes")
                                                        if (toAddWatched[b].epizodok[c] == epstring) {
                                                            marbennevan = true
                                                        }
                                                    }
                                                
                                                    if (!marbennevan) {
                                                        toAddWatched[b].epizodok.push(adat.epizod.toString())
                                                    }
                                                
                                                    break
                                                }
                                            }
                                        }
                                    
                                        if (!ok) {
                                            toAddWatched.push({evad: adat.evad, epizodok: [adat.epizod]})
                                        }
                                    
                                        eddigiwatched.sorozatok[a].watched = toAddWatched
                                    
                                        //console.log(toAddWatched)
                                        vanilyen = true
                                        break
                                    }
                                }
                            }
                        
                            if (!vanilyen) {
                                const toAddWatched = {evad: adat.evad, epizodok: [adat.epizod]}
                            
                                eddigiwatched.sorozatok.push({files: adat.files, watched: [toAddWatched]});

                                var sql = `UPDATE users SET watched = '${JSON.stringify(eddigiwatched).replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                                con.query(sql, function (err, result) {
                                  if (err) throw err;
                                });

                                return res.status(201).json({ success: true, message: 'oke' });

                            } else {
                                var sql = `UPDATE users SET watched = '${JSON.stringify(eddigiwatched).replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                                con.query(sql, function (err, result) {
                                  if (err) throw err;
                                }); 

                                return res.status(201).json({ success: true, message: 'oke' });
                            }
                        }

                    } else {
                        console.log("Helytelen Jelszó!");
                        return res.status(500).json({ success: false, message: 'Helytelen Jelszó!' });
                    }
                } else {
                    return res.status(500).json({ success: false, message: 'Szerver hiba' });
                }
            } else {
                return res.status(500).json({ success: false, message: 'Szerver hiba' });
            }
        });
    } else if (data.allapot == "nem") {
        //removefromwatched(data, data.kinek, data.pass)

        console.log("-----")


        con.query(`SELECT * FROM users WHERE name = '${kinek}'`, function (err, result, fields) {
            if (err) throw err;

            if (result){
                if (result[0]) {
                    if (result[0].pass == passw) {

                        //add_readwatched(mit)
                        var adat = mit

                        let eddigiwatched = JSON.parse(result[0].watched);

                        if (eddigiwatched) {
                            for (let a = 0; a <= eddigiwatched.sorozatok.length; a++) {
                                var vanilyen = false
                            
                                if (eddigiwatched.sorozatok[a]) {
                                    if (eddigiwatched.sorozatok[a].files == adat.files) {
                                        const toAddWatched = eddigiwatched.sorozatok[a].watched
                                    
                                        for (let b = 0; b <= toAddWatched.length; b++) {
                                            //console.log(b)
                                        
                                            if(toAddWatched[b]) {
                                                if (toAddWatched[b].evad == adat.evad) {
                                                
                                                    for(let IndexOfEpisode = 0; IndexOfEpisode < toAddWatched[b].epizodok.length; IndexOfEpisode++) {
                                                        let ep = toAddWatched[b].epizodok[IndexOfEpisode]
                                                        //console.log(ep)
                                                    
                                                        if(ep == adat.epizod.toString()) {
                                                            let epszam = toAddWatched[b].epizodok.indexOf(ep)
                                                        
                                                            const what = toAddWatched[b].epizodok.splice(epszam, 1);
                                                        
                                                        
                                                            break
                                                        }
                                                    }
                                                
                                                    break
                                                }
                                            }
                                        }
                                    
                                        eddigiwatched.sorozatok[a].watched = toAddWatched
                                    
                                        //console.log(toAddWatched)
                                        vanilyen = true
                                        break
                                    }
                                }
                            }
                        
                            if (!vanilyen) {
                                const toAddWatched = {evad: adat.evad, epizodok: [adat.epizod]}
                            
                                eddigiwatched.sorozatok.push({files: adat.files, watched: [toAddWatched]});

                                var sql = `UPDATE users SET watched = '${JSON.stringify(eddigiwatched).replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                                con.query(sql, function (err, result) {
                                  if (err) throw err;
                                });

                                return res.status(201).json({ success: true, message: 'oke' });

                            } else {
                                var sql = `UPDATE users SET watched = '${JSON.stringify(eddigiwatched).replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                                con.query(sql, function (err, result) {
                                  if (err) throw err;
                                }); 

                                return res.status(201).json({ success: true, message: 'oke' });

                            }
                        }

                    } else {
                        console.log("Helytelen Jelszó!");
                        return res.status(500).json({ success: false, message: 'Helytelen Jelszó!' });
                    }
                } else {
                    return res.status(500).json({ success: false, message: 'Szerver hiba' });
                }
            } else {
                return res.status(500).json({ success: false, message: 'Szerver hiba' });
            }
        });
    }

});


//function addtowatched(mit, kinek, passw) {
//}


//function removefromwatched(mit, kinek, passw) {
//}









function deleteSeries_fromWatched(adat, kinek) {
    console.log(adat)
    //kinek, pass, files


    console.log("-----")

    con.query(`SELECT * FROM users WHERE name = '${kinek}'`, function (err, result, fields) {
        if (err) throw err;
    
        if (result){
            if (result[0]) {
            
                const jsonData = JSON.parse(result[0].watched)
        
               
                if (jsonData.sorozatok.length == 0) {
                
                } else {
                    for (let a = 0; a <= jsonData.sorozatok.length; a++) {
                    
                        if (jsonData.sorozatok[a]) {
                            if (jsonData.sorozatok[a].files == adat.files) {
                                var sori = jsonData.sorozatok[a]
                                var sori_szam = jsonData.sorozatok.indexOf(sori)
                            
                                //console.log(sori)
                            
                                const valami_eltavolit = jsonData.sorozatok.splice(sori_szam, 1);
                            
                            
                                break
                            }
                        }
                    }
                
                
                
                    var sql = `UPDATE users SET watched = '${JSON.stringify(jsonData).replace(/'/g, "''")}' WHERE name = '${kinek}'`;
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                    });

                
                
                }     

            }
        }
    })
}


//Mükszik :D