const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const dbpath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());

let db = null;

const connectDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running");
    });
  } catch (e) {
    console.log(`Db error:${e.message}`);
    process.exit(1);
  }
};
connectDbAndServer();

const convertToJsonObject = (object) => {
  return {
    playerId: object.player_id,
    playerName: object.player_name,
    jerseyNumber: object.jersey_number,
    role: object.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayers = `SELECT * FROM cricket_team;`;
  const list = await db.all(getPlayers);
  const convertdata = list.map(convertToJsonObject);
  response.send(convertdata);
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const Query1 = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const player1 = await db.get(Query1);
  response.send(convertToJsonObject(player1));
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const Query2 = ` INSERT INTO
                        cricket_team (player_name,jersey_number,role)
                      VALUES
                        ('${playersName}',${jerseyNumber},'${role}');`;
  const player2 = await db.run(Query2);
  response.send("Player Added to Team");
});

app.put("players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const playerId = request.params;
  const Query3 = `UPDATE
                         cricket_team
                    SET
                        player_name:'${playerName}',
                        jersey_number:${jerseyNumber},
                        role:'${role}',
                    WHERE
                        player_id = ${playerId};`;
  await db.run(Query3);
  response.send("Player Details Updated");
});
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
