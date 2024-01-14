package com.example;


import java.io.IOException;
import java.util.*;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class Mapping {


    @Autowired
    private JdbcTemplate jdbcTemplate;

    private List<Map<String, Object>>  selectAllSongDB() {

        String sql = "SELECT * FROM thorsten_music.song;";
        List<Map<String, Object>> list =  jdbcTemplate.queryForList(sql);

        return list;
    }
    private List<Map<String, Object>>  selectSongFromYear(String year) {

        java.lang.Object[] args = {year};

        String sql = "SELECT * FROM thorsten_music.song WHERE year = ?;";


        List<Map<String, Object>> list =  jdbcTemplate.queryForList(sql, args);

        return list;
    }


    private void  removeSongDB(int ID) {


        String sql = "DELETE FROM thorsten_music.song WHERE songID = ?;";
                jdbcTemplate.update(sql, ID);

    }
    private void InsertSongDB(String name, String artist, String category, String year) {
        java.lang.Object[] args;
        if(!year.isEmpty()) {
            int intYear = Integer.parseInt(year);
            args = new java.lang.Object[]{name, artist, category, intYear};
        }else {
            args = new java.lang.Object[]{name, artist, category, 0};
        }


        String sql = "INSERT INTO thorsten_music.song (`name`, `artist`, `category`, `year`) VALUES (?, ?, ?, ?);";
        jdbcTemplate.update(sql, args);
    }
    private void UpdateSongDB(String name, String artist, String category, String year, int ID) {

        java.lang.Object[] args;
        if(!year.isEmpty()) {
            int intYear = Integer.parseInt(year);
            args = new java.lang.Object[]{name, artist, category, intYear, ID};
        }else {
            args = new java.lang.Object[]{name, artist, category, 0, ID};
        }
        String sql = "UPDATE thorsten_music.song\n" +
                "SET name = ?, artist = ?, category = ?, year = ?\n" +
                "WHERE songID = ?;";
        jdbcTemplate.update(sql, args);
    }
    private List<Map<String, Object>>  selectAllUsersDB() {

        String sql = "SELECT * FROM thorsten_music.user;";
        List<Map<String, Object>> list =  jdbcTemplate.queryForList(sql);

        return list;
    }

    private void InsertVotesDB(String songID, String userID, String rating ) {
        java.lang.Object[] args = new java.lang.Object[]{songID, userID, rating};



        String sql = "INSERT INTO thorsten_music.vote (`songID`, `userID`, `rating`) VALUES (?, ?, ?);";
        jdbcTemplate.update(sql, args);
    }
    private void UpdateVotesDB(String songID, String userID, String rating ) {
        java.lang.Object[] args = new java.lang.Object[]{rating, songID , userID};



        String sql = "UPDATE thorsten_music.vote SET rating = ? WHERE songID = ? AND userID = ?";
        jdbcTemplate.update(sql, args);
    }


    private List<Map<String, Object>> selectVoteFull(String userID, String year) {



        ArrayList<java.lang.Object> argsList = new ArrayList<>();

        String sql = "SELECT song.name, user.username, vote.rating\n" +
                "FROM thorsten_music.song, thorsten_music.user, thorsten_music.vote\n" +
                "WHERE 1 = 1";


        if(!userID.equals("userID")) {
            sql += " AND user.userID = ?";
            argsList.add(Integer.parseInt(userID));

        }
        if(!year.equals("year")) {
            sql += " AND song.year = ?";
            argsList.add(Integer.parseInt(year));
        }
        sql += ";";
        java.lang.Object[] args = argsList.toArray();


        List<Map<String, Object>> list =  jdbcTemplate.queryForList(sql, args);

        return list;
    }

    private String getUsernameDB(String userID) {

        ArrayList<java.lang.Object> argsList = new ArrayList<>();

        String query = "SELECT username FROM thorsten_music.user WHERE userID = ?";

        Object[] args = {userID};

        List<Map<String, Object>> list =  jdbcTemplate.queryForList(query, args);

        String username = list.get(0).get("username").toString();

        System.out.println("in getUsernameDB method, username = " + username);


        return username;
    }

    //LOOK AT THE 2 METHODS BELOW, DO I NEED BOTH, WHAT IS GOING ON HERE
    private String[] selectVote(String userID, String year) {

        Object[] args = {userID, year};

        String sql = "SELECT  vote.rating\n" +
                "FROM thorsten_music.vote\n" +
                "JOIN thorsten_music.song ON vote.songID = song.songID\n" +
                "JOIN thorsten_music.user ON vote.userID = user.userID\n" +
                "WHERE vote.userID = ? AND song.year = ?;";

        List<Map<String, Object>> list =  jdbcTemplate.queryForList(sql, args);

        String[] arrayOfStrings = list.stream()
                .map(map -> String.valueOf(map.get("rating")))
                .toArray(String[]::new);

        return arrayOfStrings;
    }

    private List<Map<String, Object>> getVoteTable(String userID, String year) {

        List<Map<String, Object>> list;
            ArrayList<java.lang.Object> argsList = new ArrayList<>();

            String sql = "SELECT  vote.rating, user.username, song.name\n" +
                    "FROM thorsten_music.vote\n" +
                    "JOIN thorsten_music.song ON vote.songID = song.songID\n" +
                    "JOIN thorsten_music.user ON vote.userID = user.userID\n" +
                    "WHERE 1 = 1";

            if(!userID.equals("alla")) {
                sql += " AND vote.userID = ?";
                argsList.add(Integer.parseInt(userID));
            }
            if(!year.equals("alla")) {
                sql += " AND song.year = ?";
                argsList.add(Integer.parseInt(year));
            }
        sql += ";";
        java.lang.Object[] args = argsList.toArray();

        list =  jdbcTemplate.queryForList(sql, args);




        return list;
    }
    private List<Map<String, Object>> getVoteFromSongIDAndUserID(String userID, String songID) {

        Object[] args = {userID, songID};

        String sql = "SELECT  vote.rating, user.username, song.name\n" +
                "FROM thorsten_music.vote\n" +
                "JOIN thorsten_music.song ON vote.songID = song.songID\n" +
                "JOIN thorsten_music.user ON vote.userID = user.userID\n" +
                "WHERE vote.userID = ? AND song.songID = ?;";

        List<Map<String, Object>> list =  jdbcTemplate.queryForList(sql, args);


        return list;
    }
    private List<Map<String, Object>> getResultsFromYear(String year) {

        Object[] args = {year};

        String sql = "SELECT s.songID, s.name, s.artist, s.category, s.year, SUM(v.rating) AS total_rating\n" +
                "FROM thorsten_music.song s\n" +
                "JOIN thorsten_music.vote v ON s.songID = v.songID\n" +
                "WHERE s.year = ?\n" +
                "GROUP BY s.songID, s.name, s.artist, s.category, s.year\n" +
                "ORDER BY total_rating DESC;";

        List<Map<String, Object>> list =  jdbcTemplate.queryForList(sql, args);

        System.out.println(list);
        return list;
    }
    private void  removeUserDB(int ID) {
        String sql = "DELETE FROM thorsten_music.user WHERE userID = ?;";
        jdbcTemplate.update(sql, ID);

    }
    private void insertUserDB(String username, String password) {
          java.lang.Object[] args;
          args = new java.lang.Object[]{username, password};

          String sql = "INSERT INTO thorsten_music.user (`username`, `password`) VALUES (?, ?, ?, ?);";
          jdbcTemplate.update(sql, args);
    }
    private void updateUserDB(String username, String password, int ID) {

        java.lang.Object[] args;
        args = new java.lang.Object[]{username, password, ID};
        String sql = "UPDATE thorsten_music.user\n" +
                     "SET username = ?, password = ?\n" +
                     "WHERE userID = ?;";
        jdbcTemplate.update(sql, args);
    }




    /* /
     * HTML Mappings
      * */

    @GetMapping("/")
    public String index(Model model) {

        return "login";
    }

    @GetMapping("/admin")
    public String loginaHandler(Model model) {

        return "admin";
    }
    @GetMapping("/user")
    public String userHandler(Model model) {

        return "user";
    }
    @GetMapping("/login")
    public String loginHandler(Model model) {


        return "login";
    }
    @GetMapping("/votes")
    public String voteHandler(Model model) {

        return "votes";
    }
    @GetMapping("/results")
    public String resultHandler(Model model) {
        getResultsFromYear("2020");

        return "results";
    }
    @GetMapping("/userEditing")
    public String userEditingHandler(Model model) {


        return "userEditing";
    }

    /* /
     * DB Mappings
     * */


    @PostMapping("/getVotes")
    public @ResponseBody String[] getVotes(@RequestBody String data) {

        String userID = data.split(",")[0];
        String year = data.split(",")[1];

        return selectVote(userID, year);
    }

    @PostMapping("/getVoteTable")
    public @ResponseBody List<Map<String, Object>> getVoteTable(@RequestBody String data) {


        String userID = data.split(",")[0];
        String year = data.split(",")[1];


        return getVoteTable(userID, year);
    }


    @PostMapping("/login")
    public @ResponseBody int attemptLogin(@RequestBody String userInfo) throws IOException {
        System.out.println("in attemptLogin method, userinfo = " + userInfo);
        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> userData = mapper.readValue(userInfo, new TypeReference<Map<String, String>>(){});

        String username = userData.get("username");
        String password = userData.get("password");

        return authLogin(username, password);
    }

    @PostMapping("/updateDB")
    public @ResponseBody List<Map<String, Object>> updateDB(@RequestBody String modifiedTable) {


        List<Map<String, Object>> DBmap = stringToMapList(modifiedTable);
        for (int i = 0; i < DBmap.size(); i++) {
            Map<String, Object> MapRow = DBmap.get(i);

            String artist = MapRow.get("artist").toString();
            String name = MapRow.get("name").toString();
            String category = MapRow.get("category").toString();
            String year = MapRow.get("year").toString();
            if (MapRow.get("songID").toString().isEmpty()) {
                InsertSongDB(name,artist,category,year);
                System.out.println("inserted song" + name);
            } else {
                int songID = Integer.parseInt(MapRow.get("songID").toString());
                if (MapRow.get("name").toString().isEmpty() && MapRow.get("artist").toString().isEmpty()) {
                    removeSongDB(songID);
                    System.out.println("removed song" + name);
                } else {
                    UpdateSongDB(name,  artist,  category, year, songID);
                    System.out.println("updated song" + name);
                }
            }

        }
        return selectAllSongDB();
    }
    @PostMapping("/confirmVotes")
    public @ResponseBody String confirmVotes(@RequestBody String points) {
        List<Map<String, Object>> pointList = stringToMapList(points);

        for(int i = 0; i < pointList.size(); i++) {

            String songID = pointList.get(i).get("songID").toString();
            String userID = pointList.get(i).get("userID").toString();
            String rating = pointList.get(i).get("rating").toString();

            if(rating.isEmpty()) {
                rating = "-1";
            }

            //user has not voted on song before
            if(getVoteFromSongIDAndUserID(userID, songID).isEmpty()) {
                InsertVotesDB(songID,userID , rating);
            }//user has voted on song before
            else {
                UpdateVotesDB(songID, userID, rating);
            }

           //
        }

        return "aaahh";
    }

    @PostMapping("/selectFromYear")
    public @ResponseBody List<Map<String, Object>> selectFromCategory(@RequestBody String value) {

        return selectSongFromYear(value);
    }

    @PostMapping("/getUsername")
    public @ResponseBody String getUsername(@RequestBody String userID) {
        System.out.println("in getUsername method, userID = " + userID);

        return getUsernameDB(userID);
    }
    @PostMapping("/getResults")
    public @ResponseBody List<Map<String, Object>> getResults(@RequestBody String year) {

        return getResultsFromYear(year);
    }
    @PostMapping("/getAllUsers")
    public @ResponseBody List<Map<String, Object>> getAllUsers() {
        System.out.println("in all users " + selectAllUsersDB());

        return selectAllUsersDB();
    }
    //todo this being void must be a problem for some reason

    @PostMapping("/addUser")
    public @ResponseBody void addUser(@RequestBody String username, String password) {

        insertUserDB(username, password);
    }
    @PostMapping("/removeUser")
    public @ResponseBody void removeUser(@RequestBody int userID) {

        removeUserDB(userID);
    }
    @PostMapping("/editUser")
    public @ResponseBody void editUser(@RequestBody String username, String password, int userID) {

        updateUserDB(username, password, userID);
    }





//helper functions

    private int authLogin(String username, String password) {

        List<Map<String, Object>> userList = selectAllUsersDB();

        for(int i = 0; i < userList.size(); i++) {
            Map<String, Object> row = userList.get(i);
            if(username.equals(row.get("username"))) {
                if(password.equals(row.get("password"))) {
                    return Integer.parseInt(row.get("userID").toString());
                }
            }
        }

        System.out.println("Failed to authenticate user: " + username);
        return -1;
    }

    private int getIndex(String ID, List<Map<String, Object>> DBlist) {
    for(int j = 0; j < DBlist.size(); j++) {
        if(DBlist.get(j).get("songID").toString().equals(ID)) {
            return j;

        }
    }
    return 400;
}
    private void printList(List<Map<String, Object>> list){
    for (int i = 0; i < list.size(); i++) {
        for (Map.Entry<String, Object> entry : list.get(i).entrySet()) {
            System.out.print(entry.getKey() + ": " + entry.getValue().toString() + " ");
        }
        System.out.println(" ");
        
    }

}

    private List<Map<String, Object>> stringToMapList(String HTTPstring) {

        List<Map<String, Object>> list = new ArrayList<>();

    //will break if user inputs {
    int amountOfRows = HTTPstring.length() - HTTPstring.replace("{", "").length();

    String stringRemaining = HTTPstring;

    for(int i = 0; i < amountOfRows; i++ ) {

        String rowString = stringRemaining.substring(stringRemaining.indexOf('{'), stringRemaining.indexOf('}')+1);
        stringRemaining = stringRemaining.replace(rowString, "");



        try {
            Map<String, Object> mapping = new ObjectMapper().readValue(rowString, HashMap.class);
            list.add(mapping);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    return list;
}


   /* private JSONObject readJsonFile() throws Exception {
    File file = new File("src/main/resources/userFiles/users.json");
    String content = FileUtils.readFileToString(file, "utf-8");

    // Convert JSON string to JSONObject
    JSONObject tomJsonObject = new JSONObject(content);

    return tomJsonObject;


}
    private void jsonToFile() {
    String path = "src/main/resources/userFiles/users.json";

    String fileNamePath = "src/main/resources/";
    Path pathToFile = Paths.get(fileNamePath);

    JSONObject json = new JSONObject();
    try {
        json.put("joipoi", "musse2010");
        json.put("straight_spoon", "karthop9");

    } catch (JSONException e) {
        e.printStackTrace();
    }

    try (PrintWriter out = new PrintWriter(new FileWriter(path))) {
        out.write(json.toString());
    } catch (Exception e) {
        e.printStackTrace();
    }

} */




}