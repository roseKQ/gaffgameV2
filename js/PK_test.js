$(document).ready(function () {
    /**
     * Variable to toggle display of definitions
     * @type Boolean
     */
    var definitionsEnabled = false;

    // Toggle display of additional buttons when "Show Data" is clicked
    $('#showData').click(function () {
        $('#dataButtons').toggle('slow', function () {
            // Animation complete.
        });
    });
    // Toggle display of schema mockup when "Show Schema" is clicked
    $('#showSchema').click(function () {
        $('#schema').toggle('slow', function () {});
    });
    // Toggle display of definition tooltips when "Show Definitions" is clicked
    $('#showDefinitions').click(function() {
        definitionsEnabled = !definitionsEnabled;
        if ( definitionsEnabled ) {
            $(this).addClass('active');
        }
        else {
            $(this).removeClass('active');
        }
    });
    // Handle displaying the tooltip based on whether definitions are enabled or not
    $('body').on('mouseover focus', '.cardOption[data-toggle=tooltip]', function(e) {
        var target;
        if ( definitionsEnabled ) {
            target = $(e.currentTarget || e.target);
            if ( !target.data('bs.tooltip') ) {
                target.tooltip({
                    trigger: 'manual',
                    title: function() {
                        // Take the title from the 'data-title' attribute
                        // This avoids having the definition still display as an
                        //  HTML title, but prevents us from having to hard-code 
                        //  every definition
                        return $(this).data('title');
                    }
                });
            }
            target.tooltip('show');
        }
    });
    // Handle hiding the tooltip
    $('body').on('mouseout blur', '.cardOption[data-toggle=tooltip]', function(e) {
        try {
            $(e.currentTarget || e.target).tooltip('hide');
        } catch (e) {
            // Tooltips may not be enabled, so ignore any exceptions thrown
        }
    });
    // Hide elements with the 'hidden' class, and then remove the class (or the
    //  show() function will not actually display them)
    $('.hidden').hide().removeClass('hidden');
});

var idReplaceChars = /[ \\\/(*-,'"=<>]/g;
var correctCards = 0;
var attempts = 0;


var create = 0;
var insert = 0;
var retrieve = 0;

var summary = 0;
var JOIN_UNION_DELETE = 0;
var pos = 0;
var totalAnswer = 0;
var attempts = 0;
var JOIN_UNION_DELETE = 0;
var JOIN_UPDATE_DELETE = 0;

//var data = [create, insert, retrieve, summary, join, update, DeleteQuestion]; 

$(init);

var questions = [
    [
        ["img/parkKeeper_icon.png", "Park Keeper Norris is creating the playground table. Define the primary key with the appropriate datatype. Primary keys cannot be null. The primary key should increment", [" Playgrounds ( Playground ID ", " NOT NULL ", " )"], ["CREATE TABLE", "INT", "IDENTITY"], "CREATE", "SQL"],
        ["img/principle_icon.png", "Principal Parker is creating the Schools table. Define the primary key with the appropriate datatype. Primary keys cannot be null. The primary key should increment", [" Schools ( School ID ", " NOT NULL ", " )"], ["CREATE TABLE", "INT", "IDENTITY"], "CREATE", "SQL"],
        ["img/principle_icon.png", "Principal Parker is creating the Schools table. Build the query to define the primary key. Use the schema to help you", ["CREATE TABLE", "INT", "IDENTITY"], ["Schools ( School ID", "NOT NULL", ")"], "CREATE", "INTERROGATE"],
        ["img/parkKeeper_icon.png", "Park Keeper Norris is inserting values into the playground table. Help him complete the query. Use the schema to help you", ["Playgrounds", "(Name, Address, Postcode, Playground ID, Latitude, Longitude", " PlayCapacity)"], ["INSERT INTO", "VALUES", "PlaygroundType"], "INSERT", "SQL"],
        ["img/principle_icon.png", "Principal Parker is inserting values into the SCHOOL_TYPE table. Help her complete the query. Use the schema to help you", ["", "", "", "", "", ""], ["INSERT INTO", "SCHOOL_TYPE", "VALUES", "(SchoolType,", "SchoolDefinition", ")"], "INSERT", "BLANKS"],
        ["img/sergeant_icon.png", "Sergeant Bloom is inserting values into the CRIME_TYPE table. Help him complete the query. Use the schema to help you", ["INSERT INTO", "VALUES", "CrimeDefinition"], ["CRIME_TYPE", "(CrimeType,", " )"], "INSERT", "INTERROGATE"],
        // ["img/winnie_icon.png", "Winnie is inserting values into the Area table. Help her complete the query. Use the schema to help you", ["", "", "", "", "", ""], ["INSERT INTO", "Area", "VALUES", "(Date,", "Location", " Postcode)"], "INSERT", "BLANKS"],
        // ["img/sergeant_icon.png", "Sergeant Bloom is inserting values into the Crime table. Help him complete this query. Use the schema to help you", ["INSERT INTO", "VALUES", "Location"], ["Crime", " (CrimeType, Latitude, Longitude", " Date)"], "INSERT", "INTERROGATE"],
        ["img/winnie_icon.png", "Winnie wants to see all the robberies between May and August. Help her write the query", [" ", " ", " ", " ", " ", " ", " ", " "], ["SELECT", "CrimeType", "FROM", "Crime", "WHERE", "CrimeType = 'Robberies'", "BETWEEN", "'2016/05/01' AND '2016/08/31'"], "RETRIEVE", "BLANKS"],
        ["img/winnie_icon.png", "Winnie is worried about burglaries and bike theft and wants to order the data by date. Help her complete the query", ["CrimeType FROM Crime WHERE CrimeType='burglary'", "CrimeType='bike theft'", "Date"], ["SELECT", "OR", "ORDER BY"], "RETRIEVE", "SQL"],
        ["img/winnie_icon.png", "Winnie wants to know about schools that are nurseries and grammar schools and order them by SchoolPopulation. Help her complete the query", ["SchoolType FROM Schools WHERE SchoolType='nursery'", "SchoolType='grammar'", "SchoolPopulation"], ["SELECT", "OR", "ORDER BY"], "RETRIEVE", "SQL"],
        ["img/peter_icon.png", "Peter wants to know the number of the different types of schools in the dataset and the number of each school", ["SELECT COUNT", "SUM", "FROM"], ["(SchoolType) AS SchoolNo, ", "(SchoolType) AS TOTAL", "Schools"], "SUMMARY", "INTERROGATE"],
        ["img/peter_icon.png", "Peter wants to know the number of the different types of crimes in the dataset and the number of each crimes", ["SELECT COUNT", "SUM", "FROM"], ["(CrimeType) AS CrimeNo, ", "(CrimeType) AS TOTAL", "Crimes"], "SUMMARY", "INTERROGATE"],
        ["img/peter_icon.png", "Peter wants to know the number of the different types of crimes in the dataset and the number of each crimes", [" ", " ", " ", " ", " ", " ", " ", " "], ["SELECT COUNT", "(CrimeType) AS CrimeNo, ", "SUM", "(CrimeType) AS TOTAL", "FROM", "Crimes"], "SUMMARY", "BLANKS"],
        ["img/peter_icon.png", "Peter wants to see what a 5% rise in the school population would look like. Help him by adding 5% to the schools population", [" ", " ", " ", " ", " ", " "], ["UPDATE", "Schools", "SET", "SchoolPopulation=SchoolPopulation*1.05", "WHERE", "Postcode='BT15'"], "JOIN_UPDATE_DELETE", "BLANKS"],
        ["img/peter_icon.png", "Peter wants to remove crimes that are classified as case closed. Help him complete the query", [" ", "Crimes", "CaseClosed='true'"], ["DELETE", "FROM", "WHERE"], "JOIN_UPDATE_DELETE", "SQL"],
        ["img/peter_icon.png", "Peter wants to remove any playgrounds that have capacity for less that 10 children. Help him complete the query", ["", "Playgrounds", "PlayCapacity<10"], ["DELETE", "FROM", "WHERE"], "JOIN_UPDATE_DELETE", "SQL"],
        //["img/winnie_icon.png", "Someone has mispelt playground as 'palyground' in the dataset. Replace the incorrect spelling", ["", "", "", "", "", ""], ["UPDATE", "Playgrounds", "SET", "Name =", "REPLACE", "(Name, 'Palyground', 'Playground')"], "JOIN_UPDATE_DELETE", "BLANKS"],
        //["img/winnie_icon.png", "Join the Playgrounds and Schools data where postcode = 'BT7'", ["SELECT", "UNION", "WHERE"], ["Name, Location FROM Playgrounds where Postcode='BT7'", "SELECT Name, Location FROM Schools", "POSTCODE='BT7'"], "JOIN_UPDATE_DELETE", "INTERROGATE"],
    ],
    [
        ["img/parkKeeper_icon.png", "Park Keeper Norris is creating the playground table. Build the query to define the primary key. Use the schema to help you", ["CREATE TABLE", "INT", "IDENTITY"], ["Playgrounds ( Playground ID", "NOT NULL", ")"], "CREATE", "INTERROGATE"],
        // ["img/parkKeeper_icon.png", "Park Keeper Norris is inserting values into the playground table. Help him complete the query. Use the schema to help you", ["INSERT INTO", "VALUES", "PlaygroundType"], ["Playgrounds,(Name, Address, Postcode, Playground ID, Latitude, Longitude", " PlayCapacity)"], "INSERT", "INTERROGATE"],
        ["img/principle_icon.png", "Principal Parker is creating the Schools table. Define the primary key with the appropriate datatype. Primary keys cannot be null. The primary key should increment", [" Schools ( School ID ", " NOT NULL ", " )"], ["CREATE TABLE", "INT", "IDENTITY"], "CREATE", "SQL"],
        ["img/principle_icon.png", "Principal Parker is creating the Schools table. Build the whole query to define the primary key", ["(", " ", ")"], ["CREATE TABLE Schools", "School ID, INT", "NOT NULL IDENTITY"], "CREATE", "BLANKS"],
        ["img/sergeant_icon.png", "Sergeant Bloom is inserting values into the CRIME_TYPE table. Help him complete the query. Use the schema to help you", ["CRIME_TYPE", "(CrimeType,", " )"], ["INSERT INTO", "VALUES", "CrimeDefinition"], "INSERT", "SQL"],
         ["img/winnie_icon.png", "Winnie is inserting values into the Area table. Help her complete the query. Use the schema to help you", ["INSERT INTO", "VALUES", "Location"], ["Area", "(Date,", " Postcode)"], "INSERT", "INTERROGATE"],
        ["img/sergeant_icon.png", "Sergeant Bloom is inserting values into the Crime table. Build the whole query to define the primary key", ["", " ( ", " ", " ", " ", "", ")"], ["INSERT INTO", "Crime", "Values", "CrimeType", "latitude, longitude", "location, Date"], "INSERT", "BLANKS"],
        ["img/winnie_icon.png", "Winnie wants to see all the robberies between May and August. Help her complete the query", ["CrimeType", "Crime", "CrimeType = 'Robberies'", "'2016/05/01' AND '2016/08/31'"], ["SELECT", "FROM", "WHERE", "BETWEEN"], "RETRIEVE", "SQL"],
        ["img/winnie_icon.png", "Winnie is worried about burglaries and bike theft and wants to order the data by date. Help her query the data", ["SELECT", "OR", "ORDER BY"], ["CrimeType FROM Crime WHERE CrimeType='burglary'", "CrimeType='bike theft'", "Date"], "RETRIEVE", "INTERROGATE"],
        ["img/winnie_icon.png", "Winnie wants to know about schools that are nurseries and grammar schools and order them by SchoolPopulation. Help her write the query", [" ", " ", " ", " ", " ", " ", ""], ["SELECT", "SchoolType FROM Schools", " WHERE SchoolType='nursery'", "OR", "SchoolType='grammar'", "ORDER BY", "SchoolPopulation"], "RETRIEVE", "BLANKS"],

        ["img/peter_icon.png", "Peter wants to know the number of the different types of schools in the dataset and the number of each school", [" ", " ", " ", " ", " ", " ", " ", " "], ["SELECT COUNT", "(SchoolType) AS SchoolNo, ", "SUM", "(SchoolType) AS TOTAL", "FROM", "Schools"], "SUMMARY", "BLANKS"],

        ["img/peter_icon.png", "Peter wants to know the number of the different types of crimes in the dataset and the number of each crime", ["(CrimeType) AS CrimeNo, ", "(CrimeType) AS TOTAL", "Crimes"], ["SELECT COUNT", "SUM", "FROM"], "SUMMARY", "SQL"],
        ["img/peter_icon.png", "Peter wants to know the number of the different types of crimes in the dataset and the number of each crimes", [" ", " ", " ", " ", " ", " ", " ", " "], ["SELECT COUNT", "(CrimeType) AS CrimeNo, ", "SUM", "(CrimeType) AS TOTAL", "FROM", "Crimes"], "SUMMARY", "BLANKS"],

        // ["img/peter_icon.png", "Peter wants to see what a 5% rise in the school population would look like. Help him by adding 5% to the schools population", ["Schools", "SchoolPopulation=SchoolPopulation*1.05", "Postcode='BT15'"], ["UPDATE", "SET", "WHERE"], "JOIN_UPDATE_DELETE", "SQL"],
        ["img/peter_icon.png", "Peter wants to remove crimes that are classified as case closed. Help him query the data", ["DELETE FROM", "WHERE"], ["Crimes", "CaseClosed='true'"], "JOIN_UPDATE_DELETE", "INTERROGATE"],
        ["img/peter_icon.png", "Peter wants to remove any playgrounds that have capacity for less that 10 children. Help him query the data", ["DELETE", "FROM", "WHERE"], ["", "Playgrounds", "PlayCapacity<10"], "JOIN_UPDATE_DELETE", "INTERROGATE"],
        ["img/winnie_icon.png", "Someone has mispelt playground as 'palyground' in the dataset. Replace the incorrect spelling", ["UPDATE", "SET", "REPLACE"], ["Playgrounds", "Name =", "(Name, 'Palyground', 'Playground')"], "JOIN_UPDATE_DELETE", "INTERROGATE"],
        //["img/winnie_icon.png", "Join the Playgrounds and Schools data where postcode = 'BT7'", ["", "", "", "", "", "", ""], ["SELECT", "Name, Location FROM Playgrounds where Postcode='BT7'", "UNION", "SELECT Name, Location FROM Schools", "WHERE", "POSTCODE='BT7'"], "JOIN_UPDATE_DELETE", "BLANKS"]

    ], [
        ["img/parkKeeper_icon.png", "Park Keeper Norris is creating the playground table. Build the whole query to define the primary key", ["(", " ", ")"], ["CREATE TABLE Playgrounds", "Playground ID, INT", "NOT NULL IDENTITY"], "CREATE", "BLANKS"], ,
        ["img/sergeant_icon.png", "Sergeant Bloom is inserting values into the Crime table. Help him complete this query. Use the schema to help you", ["Crime", " (CrimeType, Latitude, Longitude ", " Date)"], ["INSERT INTO", "VALUES", "LOCATION"], "INSERT", "SQL"],
        //["img/parkKeeper_icon.png", "Park Keeper Norris is inserting values into the playground table. Help him complete the query. Use the schema to help you", ["", "", "", "", "", ""], ["Playgrounds", "INSERT INTO", "VALUES", "(Name, Address, Postcode, Playground ID, Latitude, Longitude", "PlaygroundType", " PlayCapacity)"], "INSERT", "BLANKS"],
        ["img/principle_icon.png", "Principal Parker is creating the Schools table. Build the query to define the primary key. Use the schema to help you", ["CREATE TABLE", "INT", "IDENTITY"], ["Schools ( School ID", "NOT NULL", ")"], "CREATE", "INTERROGATE"],
        ["img/principle_icon.png", "Principal Parker is creating the Schools table. Build the whole query to define the primary key", ["(", " ", ")"], ["CREATE TABLE Schools", "School ID, INT", "NOT NULL IDENTITY"], "CREATE", "BLANKS"],
        ["img/principle_icon.png", "Principal Parker is inserting values into the SCHOOL_TYPE table. Help her complete the query. Use the schema to help you", ["SCHOOL_TYPE", "(SchoolType,", " )"], ["INSERT INTO", "VALUES", "SchoolDefinition"], "INSERT", "SQL"],
        ["img/winnie_icon.png", "Winnie is inserting values into the Area table. Help her complete the query. Use the schema to help you", ["Area", "(Date,", " Postcode)"], ["INSERT INTO", "VALUES", "Location"], "INSERT", "SQL"],
        // ["img/sergeant_icon.png", "Sergeant Bloom is inserting values into the CRIME_TYPE table. Help him complete the query. Use the schema to help you", ["", "", "", "", "", ""], ["INSERT INTO", "CRIME_TYPE", "VALUES", "(CrimeType,", "CrimeDefinition", ")"], "INSERT", "BLANKS"],
        //["img/principle_icon.png", "Principle Parker is inserting values into the SCHOOL_TYPE table. Help her complete the query. Use the schema to help you", ["INSERT INTO", "VALUES", "CrimeDefinition"], ["CRIME_TYPE", "(CrimeType,", " )"], "INSERT", "INTERROGATE"],
        ["img/winnie_icon.png", "Winnie wants to see all the robberies between May and August. Help her query the data", ["SELECT", "FROM", "WHERE", "BETWEEN"], ["CrimeType", "Crime", "CrimeType = 'Robberies'", "'2016/05/01' AND '2016/08/31'"], "RETRIEVE", "INTERROGATE"],
        ["img/winnie_icon.png", "Winnie is worried about burglaries and bike theft and wants to order the data by date. Help her write the query", [" ", " ", " ", " ", " ", " ", ""], ["SELECT", "CrimeType FROM Crime", " WHERE CrimeType='burglary'", "OR", "CrimeType='bike theft'", "ORDER BY", "Date"], "RETRIEVE", "BLANKS"],
        ["img/winnie_icon.png", "Winnie wants to know about schools that are nurseries and grammar schools and order them by SchoolPopulation. Help her query the data", ["SELECT", "OR", "ORDER BY"], ["SchoolType FROM Schools WHERE SchoolType='nursery'", "SchoolType='grammar'", "SchoolPopulation"], "RETRIEVE", "INTERROGATE"],
        ["img/peter_icon.png", "Peter wants to know the number of the different types of schools in the dataset and the number of each school", ["(SchoolType) AS SchoolNo, ", "(SchoolType) AS TOTAL", "Schools"], ["SELECT COUNT", "SUM", "FROM"], "SUMMARY", "SQL"],
        ["img/peter_icon.png", "Peter wants to know the number of the different types of crimes in the dataset and the number of each crime", ["(CrimeType) AS CrimeNo, ", "(CrimeType) AS TOTAL", "Crimes"], ["SELECT COUNT", "SUM", "FROM"], "SUMMARY", "SQL"],
        ["img/peter_icon.png", "Peter wants to know the number of the different types of crimes in the dataset and the number of each crimes", ["SELECT COUNT", "SUM", "FROM"], ["(CrimeType) AS CrimeNo, ", "(CrimeType) AS TOTAL", "Crimes"], "SUMMARY", "INTERROGATE"],
        //["img/peter_icon.png", "Peter wants to see what a 5% rise in the school population would look like. Help him by adding 5% to the schools population", ["UPDATE", "SET", "WHERE"], ["Schools", "SchoolPopulation=SchoolPopulation*1.05", "Postcode='BT15'"], "JOIN_UPDATE_DELETE", "INTERROGATE"],
        //["img/peter_icon.png", "Peter wants to remove crimes that are classified as case closed. Help him write the query", [" ", " ", " ", " ", " ", " ", " ", " "], ["DELETE", "Crimes", "FROM", "WHERE", "CaseClosed='true'"], "JOIN_UPDATE_DELETE", "BLANKS"],
        ["img/peter_icon.png", "Peter wants to remove any playgrounds that have capacity for less that 10 children. Help him write the query", [" ", " ", " ", " ", " "], ["DELETE", "FROM", "Playgrounds", "WHERE", "PlayCapacity<10"], "JOIN_UPDATE_DELETE", "BLANKS"],
        ["img/winnie_icon.png", "Someone has mispelt playground as 'palyground' in the dataset. Replace the incorrect spelling", ["Playgrounds", "Name =", "(Name, 'Palyground', 'Playground')"], ["UPDATE", "SET", "REPLACE"], "JOIN_UPDATE_DELETE", "SQL"],
        ["img/winnie_icon.png", "Join the Playgrounds and Schools data where postcode = 'BT7'", ["Name, Location FROM Playgrounds where Postcode='BT7'", "SELECT Name, Location FROM Schools", "POSTCODE='BT7'"], ["SELECT", "UNION", "WHERE"], "JOIN_UPDATE_DELETE", "SQL"],

    ]];

// https://msdn.microsoft.com/en-us/library/ms165911.aspx
// http://www.sqlstrings.com/Database-Glossary.htm
// http://www.w3schools.com/sql/
var definitions = {
    AND: 'A logical operator used to ensure both conditions given are met.',
    BETWEEN: 'A conditional operator used to test whether a value is "between" the two given values.',
    COUNT: 'A function that returns the number of rows matching a specified criteria.',
    CREATE: 'An SQL command used to create new objects in the database.',
    DECIMAL: 'A keyword indicating a decimal number type.',
    DELETE: 'An SQL command used to delete records from a table in the database.',
    'FOREIGN KEY': 'A field (column) that identifies records in a different table by referencing the PRIMARY KEY for that table.',
    FROM: 'A statement used to define the tables where the existing data resides.',
    IDENTITY: 'A keyword indicating that the field should generate a new incremental value for each new row INSERTed into the table.',
    INSERT: 'An SQL command used to add a new record to a table within the database.',
    INT: 'A keyword indicating an integer type.',
    JOIN: 'An SQL command used to combine records (rows) from two or more tables.',
    LEFT: 'A type of JOIN that returns all rows from the left table, placing NULL in the right side when there are no matches.',
    NULL: 'A keyword used to represent a missing value.',
    OR: 'A logical operator used to ensure that one of the conditions given have been met.',
    'ORDER BY': 'A keyword used to sort the result set.',
    'PRIMARY KEY': 'A field (column) or fields that hold a unique value identifying each record (row) in the table.',
    REFERENCES: 'A keyword indicating which table and field (column) a FOREIGN KEY is referring to.',
    RIGHT: 'A type of JOIN that returns all rows from the right table, placing NULL in the left side when there are no matches.',
    SELECT: 'An SQL command which is the primary means for retrieving data from a database.',
    SUM: 'A function that returns the total sum of a numeric column.',
    TABLE: 'A database object that stores data in records (rows) and fields (columns).',
    UNION: 'An operator that combines the results of two or more SELECT statements.',
    UPDATE: 'An SQL command used to edit/update existing records in a table.',
    VALUES: 'A statement used to provide field (column) values.',
    VARCHAR: 'A keyword indicating a string type of variable length (usually up to a given maximum).',
    WHERE: 'A statement which limits the rows retreived to those meeting the given conditions.'
};

function init() {
    var random = Math.floor((Math.random() * 2) + 0);
    console.log("random variable " + random);

    if (pos >= questions[random].length) {
        // document.getElementById('scoreOverall').innerHTML = overallMedal();
        //here I will be placing all the data drill down stuff and overall score eventually in the form of a method??
        //pos=0; 
        addScores();
        scoreOverall();
    } else {
        console.log(questions[random][pos]);
        document.getElementById('premise').innerHTML = questions[random][pos][1];
        document.getElementById('image').src = questions[random][pos][0];
        document.getElementById('questionDescription').innerHTML = "Move the command to the right box to complete the query";

        // Hide the success message and correct message
        $('#successMessage').hide();
        $('#correctMessage').hide();

        // Reset the game
        correctCards = 0;
        attempts = 0;
        $('#cardPile').html('');
        $('#cardSlots').html('');


        var retrievalwords = questions[random][pos][3];
        var retrievalQuestions = questions[random][pos][2];
        var questionTypeKey = questions[random][pos][5];
        console.log("Check question type " + questionTypeKey);
        if ( questionTypeKey === "SQL" || questionTypeKey === "BLANKS" ) {
            for (var i = 0; i < retrievalwords.length; i++) {
                //$('<div class="cardSlot">' + retrievalwords[i] + '</div>')
                $('<div class="cardSlot"></div>')
                        .data('expected-option', retrievalwords[i])
                        .appendTo('#cardSlots')
                        .droppable({
                            accept: '.cardOption',
                            hoverClass: 'hovered',
                            drop: handleCardDrop
                        });
                $('<div class="cardQuestions">' + retrievalQuestions[i] + '</div>')
                        .data('fill', retrievalQuestions[i])
                        .appendTo('#cardSlots');
            }
        }
        else {
            for (var i = 0; i < retrievalwords.length; i++) {
                $('<div class="cardQuestions">' + retrievalQuestions[i] + '</div>')
                        .data('fill', retrievalQuestions[i])
                        .appendTo('#cardSlots');
                //$('<div class="cardSlot">' + retrievalwords[i] + '</div>')
                $('<div class="cardSlot"></div>')
                        .data('expected-option', retrievalwords[i])
                        .appendTo('#cardSlots')
                        .droppable({
                            accept: '.cardOption',
                            hoverClass: 'hovered',
                            drop: handleCardDrop
                        });
            }
        }




        var retrievalCommands = [];

        if (questions[random][pos][4] == "CREATE") {

            console.log("Retrieval Commands " + retrievalCommands)
            if (questions[random][pos][5] == "SQL") {

                var retrievalCommands = ["CREATE", "CREATE TABLE", "VARCHAR", "PRIMARY KEY", "FOREIGN KEY", "IDENTITY", "INT", "DECIMAL", "NULL", "NOT NULL", "REFERENCES"];
                console.log("Retrieval Commands SQL " + retrievalCommands)
            } else if (questions[random][pos][5] == "INTERROGATE") {

                var retrievalCommands = ["TABLE",
                    "Schools",
                    "Crime",
                    "CrimeType",
                    "SchoolType", "Playground", "Postcode", "Playgrounds ( Playground ID", "Playgrounds ( Name", "CREATE TABLE", "NOT NULL", ")"]
            } else
                var retrievalCommands = ["CREATE", "CREATE TABLE", "VARCHAR", "PRIMARY KEY", "FOREIGN KEY", "IDENTITY", "INT", "DECIMAL", "NULL", "NOT NULL", "REFERENCES", "TABLE", "CREATE table Playgrounds", "Playground ID, INT", "NOT NULL IDENTITY", "Schools", "Crime", "CrimeType", "SchoolType", "Playground", "Postcode", "Playgrounds ( Playground ID", "Playgrounds ( Name", "Playground ID, INT", "NOT NULL IDENTITY", "CREATE TABLE Playgrounds"]
        } else if (questions[random][pos][4] == "INSERT") {

            if (questions[random][pos][5] == "SQL") {
                var retrievalCommands = ["INSERT", "INSERT INTO", "VALUES", "NAME", "ADDRESS", "DATE", "LOCATION", "POSTCODE", "CRIMETYPE", "SCHOOLTYPE", "SELECT", "FROM", "WHERE", "BETWEEN"];
            } else if (questions[random][pos][5] == "INTERROGATE") {

                var retrievalCommands = ["TABLE", "Schools", "Crime", "CrimeType", "SchoolType", "Playground", "Postcode", "Crime", " (CrimeType, Latitude, Longitude", " Date)"]
            } else
                var retrievalCommands = ["INSERT", "BETWEEN", "INSERT INTO", "VALUES", "NAME", "ADDRESS", "DATE", "LOCATION", "POSTCODE", "CRIMETYPE", "SCHOOLTYPE", "SELECT", "FROM", "WHERE", "INSERT INTO", "Crime", "Values", "latitude, longitude", "location, Date", "CrimeType", "Values"];

        } else if (questions[random][pos][4] == "RETRIEVE") {
            var retrievalCommands = ["SELECT", "FROM", "WHERE", "ORDER BY", "AND", "OR", "LIKE", "DATEDIFF", "DATEADD", "DATENAME", "LEFT", "RIGHT", "SELECT", "CrimeType", "FROM", "Crime", "WHERE", "CrimeType = 'Robberies'", "BETWEEN", "'2016/05/01' AND '2016/08/31'", "SELECT", "CrimeType FROM Crime", " WHERE CrimeType='burglary'", "OR", "CrimeType='bike theft'", "ORDER BY", "Date", "CrimeType FROM Crime WHERE CrimeType='burglary'", "CrimeType='bike theft'"];

        } else if (questions[random][pos][4] == "SUMMARY") {
            var retrievalCommands = ["SELECT", "MIN", "MAX", "COUNT", "SUM", "ORDER BY", "HAVING", "GROUP BY", "FROM", "WHERE", "SELECT COUNT", "(SchoolType) AS SchoolNo, ", "SUM", "(SchoolType) AS TOTAL", "FROM", "Schools"];

        } else if (questions[random][pos][4] == "JOIN_UNION_DELETE") {
            var retrievalCommands = ["UNION", "SELECT", "AS", "FROM", "WHERE", "JOIN", "ON", "SELECT", "Name, Location FROM Playgrounds where Postcode='BT7'", "UNION", "SELECT Name, Location FROM Schools", "WHERE", "POSTCODE='BT7'", "UPDATE", "Playgrounds", "SET", "Name =", "REPLACE", "(Name, 'Palyground', 'Playground')", "DELETE", "Crimes", "FROM", "WHERE", "CaseClosed='true'", "UPDATE", "Schools", "SET", "SchoolPopulation=SchoolPopulation*1.05", "WHERE", "Postcode='BT15'"];
        } else {
            var retrievalCommands = ["UPDATE", "SET", "WHERE", "REPLACE", "DELETE", "DELETE FROM", "FROM", "SELECT", "Name, Location FROM Playgrounds where Postcode='BT7'", "UNION", "SELECT Name, Location FROM Schools", "WHERE", "POSTCODE='BT7'", "UPDATE", "Playgrounds", "SET", "Name =", "REPLACE", "(Name, 'Palyground', 'Playground')", "DELETE", "Crimes", "FROM", "WHERE", "CaseClosed='true'", "Playgrounds", "WHERE", "PlayCapacity<10", "UPDATE", "Schools", "SET", "SchoolPopulation=SchoolPopulation*1.05", "WHERE", "Postcode='BT15'", "PlaygroundCapacity"];
        }
        ;

        var el;
        // Create the cards for the retrieval of data questions 
        for (var i = 0; i < retrievalCommands.length; i++) {
            console.log(retrievalCommands[1]);
            el = $('<div class="cardOption">' + retrievalCommands[i] + '</div>')
                    .data('option', retrievalCommands[i])
                    .attr('id', 'card' + retrievalCommands[i].replace(idReplaceChars, '_'))
                    .appendTo('#cardPile')
                    .draggable({
                        containment: 'body',
                        stack: '#cardPile div',
                        cursor: 'move',
                        revert: true
                    });
            if ( definitions[retrievalCommands[i]] ) {
                el.attr('data-toggle', 'tooltip')
                        .attr('data-title', definitions[retrievalCommands[i]]);
            }
        }


        test = document.getElementById("test").addEventListener("click", checkAnswer, false);
        document.getElementById('test').innerHTML = "Next";
        document.getElementById('showData').innerHTML = "Show Data";
        //test.innerHTML += "<button onclick='checkAnswer()'>Submit Answer</button>";
        handleCardDrop();
        //checkAnswer();
    }

    function handleCardDrop(event, ui) {
        var slot = $(this);
        var slotNumber = slot.data('expected-option');
        console.log(slotNumber);
        var cardNumber = ui.draggable.data('option');
        console.log(ui.draggable.data('option'));

        // Move the card into the slot, disabling the drop target of the slot
        //  as well as the dragging of the card
        slot.append(ui.draggable)
                .droppable('disable')
                .addClass('filled');
        ui.draggable.draggable('disable')
                .draggable('option', 'revertDuration', 0)
                .position({within: slot, my: 'left top', at: 'left top'});
        attempts++;
        
        // Mark the card correct or incorrect
        if ( slotNumber !== cardNumber ) {
            ui.draggable.addClass('incorrect');
            $('#card' + slotNumber.replace(idReplaceChars, '_')).addClass('correct');
            console.log(correctCards);
        }
        else {
            ui.draggable.addClass('correct');
            correctCards++;
            console.log(correctCards);
        }

        if (correctCards == retrievalwords.length)
        {
            if (questions[random][pos][4] == "CREATE")
            {
                create++;
                console.log("Create questions count " + create);
            } else if (questions[random][pos][4] == "INSERT") {
                insert++;
                console.log("Insert questions count " + insert);

            } else if (questions[random][pos][4] == "RETRIEVE") {
                retrieve++;
                console.log("Retrieve questions count " + retrieve);

            } else if (questions[random][pos][4] == "SUMMARY") {

                summary++;
                console.log("Summary questions count " + summary);

            } else {

                JOIN_UNION_DELETE++;

            }
            totalAnswer++;


            console.log("Total right answer " + totalAnswer);
            console.log("Attempts " + attempts);
            console.log("Create questions count " + create);
            console.log("Insert questions count " + insert);
            console.log("Retrieve questions count " + retrieve);
            console.log("Summary questions count " + summary);
            console.log("Join / Union / Delete questions count " + JOIN_UNION_DELETE);


        }
    }
}

function checkAnswer() {
    pos++;
    console.log("position variable " + pos);
    init();
}


function addScores() {
    var dataThis = {"create": create, "insert": insert, "retrieve": retrieve, "summary": summary, "join": JOIN_UNION_DELETE, "total": totalAnswer};
//localStorage.setItem('data', JSON.stringify(data));
    console.log(dataThis);
}


function scoreOverall(totalAnswer) {

    var total = this.totalAnswer;

    console.log("Is the method working? " + total);
    document.getElementById('premise').innerHTML = "You got " + total + " out of " + pos + " this time. Check out the drill down to see how you performed in each area";
    document.getElementById('questionDescription').innerHTML = "";
    $('#cardPile').html('');
    $('#cardSlots').html('');
    document.getElementById('test').innerHTML = "refresh";
    document.getElementById("test").addEventListener("click", restart, false);
    viewData = document.getElementById("showData").addEventListener("click", dataView, false);
    document.getElementById('showData').innerHTML = "Data Visualization";

    if (total <= (pos - 3)) {
        document.getElementById('image').src = "img/bronze_big.png";
    } else if (total <= (pos - 2)) {
        document.getElementById('image').src = "img/silver_big.png";
    } else if (total <= (pos - 1)) {
        document.getElementById('image').src = "img/gold_big.png";
    } else if (total == pos) {
        document.getElementById('image').src = "img/platinum_big.png";
    } else
        document.getElementById('image').src = "";
    drillDown();
}

function restart() {
    window.location.href = 'PK_test.html';
}

function dataView() {
    window.location.href = 'DataDashboard.html';
}

function drillDown() {

    var data = [
        {name: "create", score: create},
        {name: "insert", score: insert},
        {name: "retrieve", score: retrieve},
        {name: "summary", score: summary},
        {name: "join", score: JOIN_UPDATE_DELETE},
    ];

    var width = 1200,
            height = 600,
            barHeight = 70;

    var x = d3.scale.linear()
            .range([0, width]);


    var svg = d3.select("#drillDown").append("svg")
            .attr("width", width)
            .attr("height", height);

    var chart = svg.append("g").attr("width", width);

    x.domain([0, d3.max(data, function (d) {
            return +d.score + 200;
        })])

    chart.attr("height", barHeight * data.length * 10);

    var bar = chart.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * barHeight + ")";
            });

    bar.append("rect")
            .attr("width", function (d) {
                return x(d.score) * 30;
            })
            .attr("height", barHeight - 1)
            .attr("rx", 20)
            .attr("ry", 20)
            .style({
                'fill': function (d) {

                    if (d.score <= 0) {
                        return '#CD7F32';
                    } else if (d.score == 1) {
                        return '#c0c0c0';
                    } else if (d.score == 2) {
                        return '#FFD700';
                    } else {
                        return '#E5E4E2';
                    }
                    ;
                },
                'stroke': '#ffffff',
                'stroke-width': '10'
            });

    bar.append("text")
            .style({'fill': '#ffffff', 'font-size': 35})
            .attr("x", function (d) {
                return x(d.score) * 10;
            })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.score;
            });

    bar.append("text")
            .style({"fill": "#ffffff", "font-size": 30})
            .attr("x", - 30)
            .attr("y", barHeight / 2)
            .text(function (d) {
                return d.name;
            });

    bar.append("image")
            .attr("xlink:href", function (d) {

                if (d.score <= 0) {
                    return 'img/bronze_small_medal.png';
                } else if (d.score == 1) {
                    return 'img/silver_small_medal.png';
                } else if (d.score == 2) {
                    return 'img/gold_small_medal.png';
                } else {
                    return 'img/platinum_small_medal.png';
                }
                ;
            })
            .attr("x", function (d) {
                return x(d.score) * 30;
            })
            .attr("y", barHeight / 10)
            .attr("width", barHeight)
            .attr("height", barHeight);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function random() {

    random = Math.floor((Math.random() * 3) + 0);
    console.log(random);
    return random;
}
