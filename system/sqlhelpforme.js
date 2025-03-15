/*/////////////////////////////////////////////////////////////////////////////////////////////////////     [[[[[SQLHELP]]]]]

con.connect(function(err) {
  if (err) throw err;

  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;

    console.log(result);
  });

});



con.connect(function(err) {
    if (err) throw err;
      
    console.log("Connected!");

    console.log("mit: " + mit)
    console.log("stringify mit: " + JSON.stringify(mit))
      
    var sql = `INSERT INTO users (name, pass, sorozatok) VALUES ("${name}", "${pass}", "${sorozatok}")`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
});



con.connect(function(err) {
  if (err) throw err;

  var sql = "UPDATE users SET sorozatok = "sorozatok" WHERE name = "name"";  //nyílván nem így
  con.query(sql, function (err, result) {
    if (err) throw err;

    console.log(result.affectedRows + " record(s) updated");
  });
});



con.connect(function(err) {
  if (err) throw err;

  var sql = "DELETE FROM users WHERE name = 'Mountain 21'";
  con.query(sql, function (err, result) {
    if (err) throw err;

    console.log("Number of records deleted: " + result.affectedRows);
  });
});


con.query(`SELECT * FROM users WHERE name = '${kinek}'`, function (err, result, fields) {
    if (err) throw err;
      
    console.log(result);    
});

*/

/*
app.post('/test', (req, res) => {
    testoutput()
});

function testoutput() {
    //test
    con.connect(function(err) {
        if (err) throw err;
      
        con.query("SELECT sorozatok FROM users WHERE name = 'Rolo'", function (err, result, fields) {
          if (err) throw err;
      
          console.log(result);

          
        });
      
    });
}
*/