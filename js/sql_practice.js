$(document).ready(function () {
    var
            worker = new Worker('vendor/sql.js/worker.sql.js'),
            editor = CodeMirror.fromTextArea($('#userInput')[0], {
                mode: 'text/x-mysql',
                viewportMargin: Infinity,
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true,
                autofocus: true,
                extraKeys: {
                    'Ctrl-Enter': runSqlFromEditor
                }
            });
    $('button#execute').on('click', runSqlFromEditor);
    function runSqlFromEditor() {
        runSql(editor.getValue() + ';');
    };
    function runSql(sql) {
        worker.postMessage({action: 'exec', sql: sql});
    };
    worker.onmessage = function (event) {
        $('#errorResult').hide();
        $('#queryResult').show().empty();
        if (event.data.results && event.data.results.length > 0) {
            $(event.data.results).each(function (idx, result) {
                $('#queryResult').append(createTable(result.columns, result.values));
            });
        } else {
            $('#queryResult').text('Query returned no results');
        }
    };
    worker.onerror = function (e) {
        $('#queryResult').hide();
        $('#errorResult').show().text(e.message);
    };
    function createTable(headings, rows) {
        var table = $('<table class="table table-striped">');
        var header = $('<thead>');
        table.append(header);
        $(headings).each(function (idx, col) {
            header.append($('<th>').text(col));
        });
        var tbody = $('<tbody>');
        table.append(tbody);
        $(rows).each(function (idx, cols) {
            var row = $('<tr>');
            tbody.append(row);
            $(cols).each(function (idx, col) {
                row.append($('<td>').text(col));
            });
        });
        return table;
    };
    function getQueryParam(name) {
        var el = $.grep(window.location.search.substring(1).split('&'), function (el) {
            return el.indexOf(name + '=') === 0;
        });
        return el.length ? el[0].split('=')[1] : undefined;
    };


    worker.postMessage({action: 'open'});
    var
            seed = getQueryParam('seed'),
            greeting = getQueryParam('greeting');
    if (seed) {
        $.get(seed, runSql);
    }
    if (greeting) {
        $.get(greeting, $.proxy(editor.setValue, editor));
    }
});
