$(document).ready(function() {
    /**
     * Variable to toggle display of definitions
     * @type Boolean
     */
    var definitionsEnabled = false;

    // Check for a correct answer when the "Next" button is clicked
    $('#test').on('click', checkAnswer);
    // Toggle display of additional buttons when "Show Data" is clicked
    $('#showData').click(function() {
        $('#dataButtons').toggle('slow', function() {
            // Animation complete.
        });
    });
    // Toggle display of schema mockup when "Show Schema" is clicked
    $('#showSchema').click(function() {
        $('#schema').toggle('slow', function() {});
    });
    $('#showTables').click(function() {
        $('#tables').toggle('slow', function() {});
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
    $('body').on('mouseover focus', '.cardOption[data-toggle=tooltip]', function( e ) {
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
    $('body').on('mouseout blur', '.cardOption[data-toggle=tooltip]', function( e ) {
        try {
            $(e.currentTarget || e.target).tooltip('hide');
        }
        catch ( e ) {
            // Tooltips may not be enabled, so ignore any exceptions thrown
        }
    });
    // Hide elements with the 'hidden' class, and then remove the class (or the
    //  show() function will not actually display them)
    $('.hidden').hide().removeClass('hidden');
});

var idReplaceChars = /[ \\\/(*-,'"=<>?]/g;
var scores = {
    simple: 0,
    create: 0,
    insert: 0,
    retrieve: 0,
    summary: 0,
    join_update_delete: 0
};

var pos = 0;
var correctAnswer = 0;
var setNo;

$(init);

var questionSet = [
    [
        {
            icon: 'img/gaff_icon.png',
            description: "Gaff wants to help you learn SQL. Let's start with some easier questions. What does SQL stand for?",
            pieces: [
                "STRUCTURED", "QUERY", "LANGUAGE"
            ],
            mask: '___',
            herrings: ["STRONG", "QUESTIONS"],
            group: 'SIMPLE'
        },
        {
            icon: 'img/gaff_icon.png',
            description: 'Select everything from the Crime Table',
            pieces: [
                "SELECT", "*", "FROM", "Crime"
            ],
            mask: '____',
            herrings: [],
            group: 'SIMPLE'
        },
        {
            icon: 'img/gaff_icon.png',
            description: 'How would you make a table in a database?',
            pieces: [
                "CREATE", "TABLE"],
            mask: '__',
            herrings: [],
            group: 'SIMPLE'
        },
        {

            icon: 'img/gaff_icon.png',
            description: 'How would you put values into a table?',
            pieces: [
                "INSERT", "INTO"],
            mask: '__',
            herrings: [],
            group: 'SIMPLE'

        },
        {
            icon: 'img/parkKeeper_icon.png',
            description: 'Park Keeper Norris is creating the playground table. Define the primary key with the appropriate datatype. Primary keys cannot be null. The primary key should increment automatically when new rows are added.',
            pieces: [
                'CREATE', 'TABLE', 'Playgrounds', '(', 'Playground_ID', 'INT', 'NOT NULL', 'IDENTITY', ')'
            ],
            mask: 'XXXX_X__X',
            herrings: [],
            group: 'CREATE'
        },
        {
            icon: 'img/principle_icon.png',
            description: 'Principal Parker is creating the schools table. Define the primary key with the appropriate datatype. Primary keys cannot be null. The primary key should increment automatically when new rows are added.',
            pieces: [
                'CREATE', 'TABLE', 'Schools', '(', 'School_ID', 'INT', 'NOT NULL', 'IDENTITY', ')'
            ],
            mask: 'XX_X_X_XX',
            herrings: [],
            group: 'CREATE'
        },
        {
            icon: 'img/principle_icon.png',
            description: 'Principal Parker is creating the Schools table. Build the query to define the primary key. Use the schema to help you',
            pieces: [
                'CREATE', 'TABLE', 'Schools', '(', 'School_ID', 'INT', 'NOT NULL', 'IDENTITY', ')'
            ],
            mask: '__XXX_X_X',
            herrings: [],
            group: 'CREATE'
        },
        {
            icon: 'img/principle_icon.png',
            description: 'Principal Parker is inserting values into the SCHOOL_TYPE table. Help her complete the query. Use the schema to help you.',
            pieces: [
                'INSERT', 'INTO', 'SCHOOL_TYPE', 'VALUES', '(', 'SchoolType', 'SchoolDefinition', ')'
            ],
            mask: '____X__X',
            herrings: [],
            group: 'INSERT'
        },
        {
            icon: 'img/parkKeeper_icon.png',
            description: 'Park Keeper Norris is inserting values into the playground table. Help him complete the query. Use the schema to help you',
            pieces: [
                'INSERT', 'INTO', 'Playgrounds', 'VALUES', '(', 'Name,', 'Address,', 'Postcode,', 'Playgound_ID,', 'Latitude,', 'Longitude,', 'PlaygroundType,', 'PlayCapacity', ')'
            ],
            mask: 'XX_XX___X___XX',
            herrings: [],
            group: 'INSERT'
        },
        {
            icon: 'img/sergeant_icon.png',
            description: 'Sergeant Bloom is inserting values into the CRIME_TYPE table. Help him complete the query. Use the schema to help you',
            pieces: [
                'INSERT', 'INTO', 'CRIME_TYPE', 'VALUES', '(', 'CrimeType', 'CrimeDefinition', ')'
            ],
            mask: '__X_XX_X',
            herrings: [],
            group: 'INSERT'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Winnie wants to see all the robberies that occurred between May and August. Help her write the query.',
            pieces: [
                'SELECT', 'CrimeType', 'FROM', 'Crime', 'WHERE', 'CrimeType = \'Robberies\'', 'BETWEEN', '\'2016/05/01\' AND \'2016/08/31\''
            ],
            mask: '_XX_X___',
            herrings: [],
            group: 'RETRIEVE'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Winnie is worried about burglaries and bike theft and wants to order the data by date. Help her complete the query',
            pieces: [
                'SELECT', 'CrimeType', 'FROM', 'Crime', 'WHERE', 'CrimeType = \'Burglary\'', 'OR', 'CrimeType = \'Bike Theft\'', 'ORDER BY', 'Date'
            ],
            mask: 'XX__X_X_X_',
            herrings: [],
            group: 'RETRIEVE'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Winnie wants to know about schools that are nurseries and grammar schools and order them by SchoolPopulation. Help her complete the query',
            pieces: [
                'SELECT', 'SchoolType', 'FROM', 'Schools', 'WHERE', 'SchoolType = \'Nursery\'', 'OR', 'SchoolType = \'Grammar\'', 'ORDER BY', 'SchoolPopulation'
            ],
            mask: 'X_X_X_X_X_',
            herrings: [],
            group: 'RETRIEVE'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to know the number of the different types of schools in the dataset and the number of each school',
            pieces: [
                'SELECT', 'COUNT', '(SchoolType) AS SchoolNo, ', 'SUM', '(SchoolType) AS Total', 'FROM', 'Schools'
            ],
            mask: '__X_X_X',
            herrings: [],
            group: 'SUMMARY'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to know the number of the different types of crimes in the dataset and the number of each crimes',
            pieces: [
                'SELECT', 'COUNT', '(CrimeType) AS CrimeNo, ', 'SUM', '(CrimeType) AS Total', 'FROM', 'Crimes'
            ],
            mask: '__X_X_X',
            herrings: [],
            group: 'SUMMARY'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to know the number of the different types of crimes in the dataset and the number of each crimes',
            pieces: [
                'SELECT', 'COUNT', '(CrimeType) AS CrimeNo, ', 'SUM', '(CrimeType) AS Total', 'FROM', 'Crimes'
            ],
            mask: '_______',
            herrings: [],
            group: 'SUMMARY'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to see what a 5% rise in the school population would look like. Help him by adding 5% to the schools population',
            pieces: [
                'UPDATE', 'Schools', 'SET', 'SchoolPopulation = SchoolPopulation * 1.05', 'WHERE', 'Postcode = \'BT15\''
            ],
            mask: '____XX',
            herrings: [],
            group: 'JOIN_UPDATE_DELETE'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to remove crimes that are classified as case closed. Help him complete the query',
            pieces: [
                'DELETE', 'FROM', 'Crimes', 'WHERE', 'CaseClosed = \'true\''
            ],
            mask: 'XX_X_',
            herrings: [],
            group: 'JOIN_UPDATE_DELETE'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to remove any playgrounds that have capacity for less that 10 children. Help him complete the query',
            pieces: [
                'DELETE', 'FROM', 'Playgrounds', 'WHERE', 'PlayCapacity < 10'
            ],
            mask: 'XX_X_',
            herrings: [],
            group: 'JOIN_UPDATE_DELETE'
        }
    ],
    [
        {
            icon: 'img/gaff_icon.png',
            description: "Gaff wants to help you learn SQL. Let's start with some easier questions. What does SQL stand for?",
            pieces: [
                "STRUCTURED", "QUERY", "LANGUAGE"
            ],
            mask: '___',
            herrings: ["STRONG", "QUESTIONS"],
            group: 'SIMPLE'
        },
        {
            icon: 'img/gaff_icon.png',
            description: 'Select everything from the Crime Table',
            pieces: [
                "SELECT", "*", "FROM", "Crime"
            ],
            mask: '____',
            herrings: [],
            group: 'SIMPLE'
        },
        {
            icon: 'img/gaff_icon.png',
            description: 'How would you make a table in a database?',
            pieces: [
                "CREATE", "TABLE"],
            mask: '__',
            herrings: [],
            group: 'SIMPLE'
        },
        {

            icon: 'img/gaff_icon.png',
            description: 'How would you put values into a table?',
            pieces: [
                "INSERT", "INTO"],
            mask: '__',
            herrings: [],
            group: 'SIMPLE'

        },
        {
            icon: 'img/parkKeeper_icon.png',
            description: 'Park Keeper Norris is creating the playground table. Build the query to define the primary key. Use the schema to help you',
            pieces: [
                'CREATE', 'TABLE', 'Schools', '(', 'School_ID', 'INT', 'NOT NULL', 'IDENTITY', ')'
            ],
            mask: '__XXX_X_X',
            herrings: [],
            group: 'CREATE'
        },
        {
            icon: 'img/principle_icon.png',
            description: 'Principal Parker is creating the Schools table. Define the primary key with the appropriate datatype. Primary keys cannot be null. The primary key should increment',
            pieces: [
                'CREATE', 'TABLE', 'Schools', '(', 'School_ID', 'INT', 'NOT NULL', 'IDENTITY', ')'
            ],
            mask: 'XX_X_X_XX',
            herrings: [],
            group: 'CREATE'
        },
        {
            icon: 'img/principle_icon.png',
            description: 'Principal Parker is creating the Schools table. Build the whole query to define the primary key',
            pieces: [
                'CREATE', 'TABLE', 'Schools', '(', 'School_ID', 'INT', 'NOT NULL', 'IDENTITY', ')'
            ],
            mask: '___X____X',
            herrings: [],
            group: 'CREATE'
        },
        {
            icon: 'img/sergeant_icon.png',
            description: 'Sergeant Bloom is inserting values into the CRIME_TYPE table. Help him complete the query. Use the schema to help you',
            pieces: [
                'INSERT', 'INTO', 'CRIME_TYPE', 'VALUES', '(', 'CrimeType', 'CrimeDefinition', ')'
            ],
            mask: 'XX_XX__X',
            herrings: [],
            group: 'INSERT'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Winnie is inserting values into the Area table. Help her complete the query. Use the schema to help you',
            pieces: [
                'INSERT', 'INTO', 'Area', 'VALUES', '(', 'Location, ', 'Postcode', ')'
            ],
            mask: '__X_X_XX',
            herrings: [],
            group: 'INSERT'
        },
        {
            icon: 'img/sergeant_icon.png',
            description: 'Sergeant Bloom is inserting values into the Crime table. Build the whole query to define the primary key',
            pieces: [
                'INSERT', 'INTO', 'Crime', 'VALUES', '(', 'CrimeType, ', 'latitude, ', 'longitude, ', 'location, ', 'Date', ')'
            ],
            mask: '____X_____X',
            herrings: [],
            group: 'INSERT'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Winnie wants to see all the robberies between May and August. Help her complete the query',
            pieces: [
                'SELECT', 'CrimeType', 'FROM', 'Crime', 'WHERE', 'CrimeType = \'Robberies\'', 'BETWEEN', '\'2016/05/01\' AND \'2016/08/31\''
            ],
            mask: 'X_X_X_X_',
            herrings: [],
            group: 'RETRIEVE'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Winnie is worried about burglaries and bike theft and wants to order the data by date. Help her query the data',
            pieces: [
                'SELECT', 'CrimeType', 'FROM', 'Crime', 'WHERE', 'CrimeType = \'Burglary\'', 'OR', 'CrimeType = \'Bike Theft\'', 'ORDER BY', 'Date'
            ],
            mask: '_XXXXX___X',
            herrings: [],
            group: 'RETRIEVE'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Winnie wants to know about schools that are nurseries and grammar schools and order them by SchoolPopulation. Help her write the query',
            pieces: [
                'SELECT', 'SchoolType', 'FROM', 'Schools', 'WHERE', 'SchoolType = \'Nursery\'', 'OR', 'SchoolType = \'Grammar\'', 'ORDER BY', 'SchoolPopulation'
            ],
            mask: '____XX__X_',
            herrings: [],
            group: 'RETRIEVE'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to know the number of the different types of schools in the dataset and the number of each school',
            pieces: [
                'SELECT', 'COUNT', '(SchoolType) AS SchoolNo, ', 'SUM', '(SchoolType) AS Total', 'FROM', 'Schools'
            ],
            mask: '__X____',
            herrings: [],
            group: 'SUMMARY'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to know the number of the different types of crimes in the dataset and the number of each crime',
            pieces: [
                'SELECT', 'COUNT', '(CrimeType) AS CrimeNo, ', 'SUM', '(CrimeType) AS Total', 'FROM', 'Crimes'
            ],
            mask: 'XX_X_X_',
            herrings: [],
            group: 'SUMMARY'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to know the number of the different types of crimes in the dataset and the number of each crimes',
            pieces: [
                'SELECT', 'COUNT', '(CrimeType) AS CrimeNo, ', 'SUM', '(CrimeType) AS Total', 'FROM', 'Crimes'
            ],
            mask: '_____XX',
            herrings: [],
            group: 'SUMMARY'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to remove crimes that are classified as case closed. Help him query the data',
            pieces: [
                'DELETE', 'FROM', 'Crimes', 'WHERE', 'CaseClosed = \'true\''
            ],
            mask: '__X_X',
            herrings: [],
            group: 'JOIN_UPDATE_DELETE'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to remove any playgrounds that have capacity for less that 10 children. Help him query the data',
            pieces: [
                'DELETE', 'FROM', 'Playgrounds', 'WHERE', 'PlayCapacity < 10'
            ],
            mask: '__X_X',
            herrings: [],
            group: 'JOIN_UPDATE_DELETE'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Someone has mispelt playground as \'palyground\' in the dataset. Replace the incorrect spelling',
            pieces: [
                'UPDATE', 'Playgrounds', 'SET', 'Name =', 'REPLACE', '(Name, \'Palyground\', \'Playground\')'
            ],
            mask: '_X_X_X',
            herrings: [],
            group: 'JOIN_UPDATE_DELETE'
        }
    ],
    [
        {
            icon: 'img/gaff_icon.png',
            description: "Gaff wants to help you learn SQL. Let's start with some easier questions. What does SQL stand for?",
            pieces: [
                "STRUCTURED", "QUERY", "LANGUAGE"
            ],
            mask: '___',
            herrings: ["STRONG", "QUESTIONS"],
            group: 'SIMPLE'
        },
        {
            icon: 'img/gaff_icon.png',
            description: 'Select everything from the Crime Table',
            pieces: [
                "SELECT", "*", "FROM", "Crime"
            ],
            mask: '____',
            herrings: [],
            group: 'SIMPLE'
        },
        {
            icon: 'img/gaff_icon.png',
            description: 'How would you make a table in a database?',
            pieces: [
                "CREATE", "TABLE"],
            mask: '__',
            herrings: [],
            group: 'SIMPLE'
        },
        {

            icon: 'img/gaff_icon.png',
            description: 'How would you put values into a table?',
            pieces: [
                "INSERT", "INTO"],
            mask: '__',
            herrings: [],
            group: 'SIMPLE'

        },
        {
            icon: 'img/parkKeeper_icon.png',
            description: 'Park Keeper Norris is creating the playground table. Build the whole query to define the primary key',
            pieces: ["CREATE", "TABLE", "Playgrounds", "Playground ID, INT", "NOT NULL", "IDENTITY"],
            mask: '_______',
            herrings: [],
            group: 'CREATE'
        },
        {
            icon: 'img/principle_icon.png',
            description: 'Principal Parker is creating the Schools table. Build the query to define the primary key. Use the schema to help you',
            pieces: ["CREATE", "TABLE", "Schools", "(", "School ID", "INT", "IDENTITY", "NOT NULL", ")"],
            mask: 'X_X___X__',
            herrings: [],
            group: 'CREATE'
        },
        {
            icon: 'img/sergeant_icon.png',
            description: 'Sergeant Bloom is creating the Crime table. Build the query to define the primary key. Use the schema to help you',
            pieces: ["CREATE", "TABLE", "Crime", "(", "Crime ID", "INT", "IDENTITY", "NOT NULL", ")"],
            mask: '___X____X',
            herrings: [],
            group: 'CREATE'
        },
        {
            icon: 'img/parkKeeper_icon.png',
            description: 'Park Keeper Norris is inserting values into the playground table. Help him complete the query. Use the schema to help you',
            pieces: ["INSERT", "INTO", "Playgrounds", "VALUES", "(", "Name", "Address", "Postcode", "Playground ID", "Latitude", "Longitude", "PlaygroundType", " PlayCapacity)"],
            mask: 'X_X_____X____',
            herrings: [],
            group: 'INSERT'
        },
        {
            icon: 'img/sergeant_icon.png',
            description: 'Sergeant Bloom is inserting values into the Crime table. Help him complete this query. Use the schema to help you',
            pieces: ["INSERT", "INTO", "Crime", "VALUES", "(", "CrimeType", "Latitude", "Longitude", "Crime ID ", "Date", "CaseClosed", "Location", ")"],
            mask: '_XX_X_XXX___X',
            herrings: [],
            group: 'INSERT'
        },
        {
            icon: 'img/principle_icon.png',
            description: 'Principle Parker is inserting values into the School table. Help him complete the query. Use the schema to help you',
            pieces: ["INSERT", "INTO", "Schools", "VALUES", "(", "Name", "Address", "Postcode", "School ID", "Latitude", "Longitude", "SchoolType", "SchoolPopulation", ")"],
            mask: 'X_X__X__X__X__',
            herrings: [],
            group: 'INSERT'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Winnie wants to see all the robberies between May and August. Help her query the data',
            pieces: ["SELECT", "FROM", "Crime", "WHERE", "CrimeType = 'Robberies'", "BETWEEN", "'2016/05/01' AND '2016/08/31'"],
            mask: '__XX_X_',
            herrings: [],
            group: 'RETRIEVE'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Winnie is worried about burglaries and bike theft and wants to order the data by date. Help her write the query',
            pieces: ["SELECT", "CrimeType", "FROM", "Crime", "WHERE", "CrimeType='burglary'", "OR", "CrimeType='bike theft'", "ORDER BY", "Date"],
            mask: 'X_X__XX_X_',
            herrings: [],
            group: 'RETRIEVE'
        },
        {
            icon: 'img/winnie_icon.png',
            description: 'Winnie wants to know about schools that are nurseries and grammar schools and order them by SchoolPopulation. Help her query the data',
            pieces: ["SELECT", "SchoolType", "FROM", "Schools", "WHERE", "SchoolType='nursery'", "OR", "SchoolType='grammar'", "ORDER BY", "SchoolPopulation"],
            mask: 'X_X__XX_X_',
            herrings: [],
            group: 'RETRIEVE'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to know the number of the different types of schools in the dataset and the number of each school',
            pieces: ["SELECT", "COUNT", "(SchoolType) AS SchoolNo", "SUM", "(SchoolType) AS TOTAL", "FROM", "Schools"],
            mask: 'X__X_XX',
            herrings: [],
            group: 'SUMMARY'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to know the number of the different types of crimes in the dataset and the number of each crime',
            pieces: ["SELECT", "COUNT", "(CrimeType) AS CrimeNo", "SUM", "(CrimeType) AS TOTAL", "FROM", "Crime"],
            mask: 'X__X_XX',
            herrings: [],
            group: 'SUMMARY'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to know the number of the different types of crimes in the dataset and the number of each crime',
            pieces: ["SELECT", "COUNT", "(CrimeType) AS CrimeNo", "SUM", "(CrimeType) AS TOTAL", "FROM", "Crime"],
            mask: '_XX_X__',
            herrings: [],
            group: 'SUMMARY'
        },
        {
            icon: 'img/peter_icon.png',
            description: 'Peter wants to remove any playgrounds that have capacity for less that 10 children. Help him write the query',
            pieces: ["DELETE", "FROM", "Playgrounds", "WHERE", "PlayCapacity<10"],
            mask: '_____',
            herrings: [],
            group: 'JOIN_UPDATE_DELETE'
        },
        {
            icon: 'img/winnie_icon.png',
            description: "Someone has mispelt playground as 'palyground' in the dataset. Replace the incorrect spelling",
            pieces: ["UPDATE", "Playgrounds", "SET", "Name =", "REPLACE", "(", "Name,", "'Palyground'", "'Playground'", ")"],
            mask: '_X_X_XXXXXX',
            herrings: [],
            group: 'JOIN_UPDATE_DELETE'
        },
        {
            icon: 'img/winnie_icon.png',
            description: "Join the Playgrounds and Schools data where postcode = 'BT7'",
            pieces: ["SELECT", "Name, Location", "FROM", "Playgrounds where Postcode='BT7'", "UNION", "SELECT", "Name, Location", "FROM", "Schools", "WHERE", "POSTCODE='BT7'"],
            mask: '___________',
            herrings: [],
            group: 'JOIN_UPDATE_DELETE'
        }
    ]
];

var commandSets = {
    'SIMPLE': ["LANGUAGE", "SELECT", "PUT", "FROM", "Crime"],
    'CREATE': ['CREATE', 'TABLE', 'VARCHAR', 'PRIMARY KEY', 'FOREIGN KEY', 'IDENTITY', 'INT', 'DECIMAL', 'NULL', 'NOT NULL', 'REFERENCES'],
    'INSERT': ['INSERT', 'INTO', 'VALUES', 'SELECT', 'FROM', 'WHERE', 'BETWEEN'],
    'RETRIEVE': ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'AND', 'OR', 'LIKE', 'DATEDIFF', 'DATEADD', 'LEFT', 'RIGHT', 'WHERE', 'BETWEEN'],
    'SUMMARY': ['SELECT', 'MIN', 'MAX', 'COUNT', 'SUM', 'ORDER BY', 'HAVING', 'GROUP BY', 'FROM', 'WHERE'],
    'JOIN_UPDATE_DELETE': ['UPDATE', 'SET', 'WHERE', 'REPLACE', 'DELETE', 'FROM', 'SELECT', 'UNION']
};

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
    // Choose a question set at random
    setNo = Math.floor(Math.random() * questionSet.length);

    if ( pos >= questionSet[setNo].length ) {
        // We're at the end of the question set - time for the score!
        scoreOverall();
    }
    else {
        // Reset the game playfield
        $('#cardPile').children().remove();
        $('#cardSlots').children().remove();

        // Setup the question blanks and answers
        var retrievalCommands = [].concat(commandSets[questionSet[setNo][pos].group]);
        var pieces = questionSet[setNo][pos].pieces;
        var mask = questionSet[setNo][pos].mask;
        $('#premise').text(questionSet[setNo][pos].description);
        $('#image').attr('src', questionSet[setNo][pos].icon);
        $('#questionDescription').text("Move the command to the right box to complete the query");

        // Loop through the question pieces, placing the static pieces and the 
        //  answer slots based on the mask given
        for ( var i = 0, ln = pieces.length; i < ln; i++ ) {
            if ( i > mask.length || mask.charAt(i) === 'X' ) {
                // Either we've overrun the mask length, or mask is explicitly
                //  stating a static position
                $('<div class="cardQuestions">' + pieces[i] + '</div>')
                        .data('fill', pieces[i])
                        .appendTo('#cardSlots');
            }
            else {
                // Answer slot here
                $('<div class="cardSlot"></div>')
                        .data('expected-option', pieces[i])
                        .appendTo('#cardSlots')
                        .droppable({
                            accept: '.cardOption',
                            hoverClass: 'hovered',
                            drop: handleCardDrop
                        });
                if ( retrievalCommands.indexOf(pieces[i]) < 0 ) {
                    // Append the statement segment to the list of available commands
                    retrievalCommands.push(pieces[i]);
                }
            }
        }

        var el;
        // Create the cards for the retrieval of data questions 
        for ( var i = 0; i < retrievalCommands.length; i++ ) {
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
            // If there's a corresponding definition, enable the tooltip
            if ( definitions[retrievalCommands[i]] ) {
                el.attr('data-toggle', 'tooltip')
                        .attr('data-title', definitions[retrievalCommands[i]]);
            }
        }
    }

    // Handle a card being placed on the answer slot
    function handleCardDrop( event, ui ) {
        var slot = $(this);
        var slotNumber = slot.data('expected-option');
        var cardNumber = ui.draggable.data('option');

        // Move the card into the slot, disabling the drop target of the slot
        //  as well as the dragging of the card
        slot.append(ui.draggable)
                .droppable('disable')
                .addClass('filled');
        ui.draggable.draggable('disable')
                .draggable('option', 'revertDuration', 0)
                .position({within: slot, my: 'left top', at: 'left top'});

        // Mark the card correct or incorrect
        if ( slotNumber !== cardNumber ) {
            ui.draggable.addClass('incorrect');
            $('#card' + slotNumber.replace(idReplaceChars, '_')).addClass('correct');
        }
        else {
            ui.draggable.addClass('correct');
        }
    }
}

function checkAnswer() {
    // If the number of correct card placements is equal to the number of total 
    //  card slots, then award a point for a fully correct answer
    if ( $('.cardOption.correct').length === $('.cardSlot').length ) {
        scores[questionSet[setNo][pos].group.toLowerCase()]++;
      correctAnswer++;  
    }
    // Either way, we go to the next question
    pos++;
    init();
}

function scoreOverall() {
    var total = correctAnswer;

    // Change text and click handlers as needed
    $('#premise').text("You got " + total + " out of " + pos + " this time. Check out the drill down to see how you performed in each area");
    $('#questionDescription').text('');
    $('#cardPile').html('');
    $('#cardSlots').html('');
    $('#test').text("Refresh")
            .off('click')       // Prevent firing previously placed handlers
            .on('click', restart);
    $("#showData").text('Data Visualization')
            .off('click')       // Prevent firing previously placed handlers
            .on('click', dataView);
    $('#image').hide();

    // Determine which medal to "award" the player with, based on their score
    if ( total <= (pos - 3) ) {
        $('#medal').attr('src', "img/bronze_big.png");
    }
    else if ( total <= (pos - 2) ) {
        $('#medal').attr('src', "img/silver_big.png");
    }
    else if ( total <= (pos - 1) ) {
        $('#medal').attr('src', "img/gold_big.png");
    }
    else if ( total === pos ) {
        $('#medal').attr('src', "img/platinum_big.png");
    }
    else {
        $('#medal').attr('src', "");
    }
    // Provide a breakdown of how the player did on each type of question
    drillDown();
}

// Restart the game (reloads the page)
function restart() {
    window.location.href = 'PK_test.html';
}

// Go to the Data Visualization page
function dataView() {
    window.location.href = 'DataDashboard.html';
}

function drillDown() {
    var parentEl = $('#drillDown');

    var data = [
        {name: "simple", score: scores.simple},
        {name: "create", score: scores.create},
        {name: "insert", score: scores.insert},
        {name: "retrieve", score: scores.retrieve},
        {name: "summary", score: scores.summary},
        {name: "join", score: scores.join_update_delete}
    ];

    var width = parentEl.width(),
            barHeight = 70,
            height = barHeight * data.length;

    var x = d3.scale.linear()
            .range([0, width]);


    var svg = d3.select("#drillDown").append("svg")
            .attr("width", width)
            .attr("height", height);

    var chart = svg.append("g")
            .attr("width", width)
            .attr('height', height);

    x.domain([0, d3.max(data, function( d ) {
            return +d.score + 200;
        })]);

    var bar = chart.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function( d, i ) {
                return "translate(200," + i * barHeight + ")";
            });

    bar.append("rect")
            .attr("width", function( d ) {
                return x(d.score + 1) * 30;
            })
            .attr("height", barHeight - 1)
            .attr("rx", 20)
            .attr("ry", 20)
            .style({
                'fill': function( d ) {

                    if ( d.score <= 0 ) {
                        return '#CD7F32';
                    }
                    else if ( d.score == 1 ) {
                        return '#c0c0c0';
                    }
                    else if ( d.score == 2 ) {
                        return '#FFD700';
                    }
                    else {
                        return '#E5E4E2';
                    }
                    ;
                },
                'stroke': '#ffffff',
                'stroke-width': '10'
            });

    bar.append("text")
            .style({'fill': '#ffffff', 'font-size': 35})
            .attr("x", function( d ) {
                return x(d.score + 1) * 10;
            })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function( d ) {
                return d.score;
            });

    bar.append("text")
            .style({"fill": "#888889", "font-size": 30})
            .attr("x", -120)
            .attr("y", barHeight / 2)
            .text(function( d ) {
                return d.name;
            });

    bar.append("image")
            .attr("xlink:href", function( d ) {

                if ( d.score <= 0 ) {
                    return 'img/bronze_small_medal.png';
                }
                else if ( d.score == 1 ) {
                    return 'img/silver_small_medal.png';
                }
                else if ( d.score == 2 ) {
                    return 'img/gold_small_medal.png';
                }
                else {
                    return 'img/platinum_small_medal.png';
                }
                ;
            })
            .attr("x", function( d ) {
                return x((d.score + 1) * 30) - 30;
            })
            .attr("y", barHeight / 10)
            .attr("width", barHeight)
            .attr("height", barHeight);
}
