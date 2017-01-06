$(document).ready(function(){

        $('#crimepk').click(function(){

            $('#pop_background').fadeIn();
            document.getElementById("paragraph").innerHTML = "Hint crimepk displayed!";
            $('#pop_box').fadeIn();
            return false;       
        });

        $('#crimiefk').click(function(){

            $('#pop_background').fadeIn();
            document.getElementById("paragraph").innerHTML = "Hint crimefk displayed!";
            $('#pop_box').fadeIn();
            return false;       
        });

        $('#schoolpk').click(function(){

            $('#pop_background').fadeIn();
            document.getElementById("paragraph").innerHTML = "Hint schoolpk displayed!";
            $('#pop_box').fadeIn();
            return false;       
        });

        $('#schoolfk').click(function(){

            $('#pop_background').fadeIn();
            document.getElementById("paragraph").innerHTML = "Hint schoolfk displayed!";
            $('#pop_box').fadeIn();
            return false;       
        });

        $('#parkpk').click(function(){

            $('#pop_background').fadeIn();
            document.getElementById("paragraph").innerHTML = "Hint parkpk displayed!";
            $('#pop_box').fadeIn();
            return false;       
        });

        $('#close').click(function(){

            $('#pop_background').fadeOut();
            $('#pop_box').fadeOut();
            return false;       
        });

        $('#pop_background').click(function(){

            $('#pop_background').fadeOut();
            $('#pop_box').fadeOut();
            return false;       
        });
    });

var buttonActive = false;
var count = 0;

$( "button" ).click(function() {

    if(count == 0){
    $( "div.dropzone" ).replaceWith( 
    "<div id=\"drop_zone\" class=\"A1\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\"ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/month_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.dropzone1" ).replaceWith( 
    "<div id=\"drop_zone1\" class=\"A2\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/month_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.dropzone2" ).replaceWith( 
    "<div id=\"drop_zone2\" class=\"A3\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/month_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.dropzone3" ).replaceWith( 
    "<div id=\"drop_zone3\" class=\"A4\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/month_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.dropzone4" ).replaceWith( 
    "<div id=\"drop_zone4\" class=\"A5\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/month_column.png\" width=\"90px\" height=\"150px\"></div>" );
    count = 1;
    }else if(count == 1){
    $( "div.A1" ).replaceWith( 
    "<div id=\"drop_zone\" class=\"B1\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\"ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/id_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.A2" ).replaceWith( 
    "<div id=\"drop_zone1\" class=\"B2\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/id_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.A3" ).replaceWith( 
    "<div id=\"drop_zone2\" class=\"B3\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/id_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.A4" ).replaceWith( 
    "<div id=\"drop_zone3\" class=\"B4\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/id_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.A5" ).replaceWith( 
    "<div id=\"drop_zone4\" class=\"B5\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/id_column.png\" width=\"90px\" height=\"150px\"></div>" );
    count = 2;
    }else if(count == 2){
    $( "div.B1" ).replaceWith( 
    "<div id=\"drop_zone\" class=\"C1\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\"ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/crime_type_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.B2" ).replaceWith( 
    "<div id=\"drop_zone1\" class=\"C2\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/crime_type_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.B3" ).replaceWith( 
    "<div id=\"drop_zone2\" class=\"C3\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/crime_type_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.B4" ).replaceWith( 
    "<div id=\"drop_zone3\" class=\"C4\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/crime_type_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.B5" ).replaceWith( 
    "<div id=\"drop_zone4\" class=\"C5\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/crime_type_column.png\" width=\"90px\" height=\"150px\"></div>" );
    count = 3;
    }else if(count == 3){
    $( "div.C1" ).replaceWith( 
    "<div id=\"drop_zone\" class=\"D1\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\"ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/longitude_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.C2" ).replaceWith( 
    "<div id=\"drop_zone1\" class=\"D2\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/longitude_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.C3" ).replaceWith( 
    "<div id=\"drop_zone2\" class=\"D3\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/longitude_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.C4" ).replaceWith( 
    "<div id=\"drop_zone3\" class=\"D4\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/longitude_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.C5" ).replaceWith( 
    "<div id=\"drop_zone4\" class=\"D5\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/longitude_column.png\" width=\"90px\" height=\"150px\"></div>" );
    count = 4;
    }else if(count == 4){
    $( "div.D1" ).replaceWith( 
    "<div id=\"drop_zone\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\"ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/id_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.D2" ).replaceWith( 
    "<div id=\"drop_zone1\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/id_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.D3" ).replaceWith( 
    "<div id=\"drop_zone2\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/id_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.D4" ).replaceWith( 
    "<div id=\"drop_zone3\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/id_column.png\" width=\"90px\" height=\"150px\"></div>" );
    $( "div.D5" ).replaceWith( 
    "<div id=\"drop_zone4\" ondragenter=\"drag_enter(event)\" ondrop=\"drag_drop(event)\"ondragover=\"return false\" ondragleave=\"drag_leave(event)\"><img id=\"column_month\" class=\"database_columns\" src=\"img/id_column.png\" width=\"90px\" height=\"150px\"></div>" );
    buttonActive = true;
    }
      });

