$(function() {
    var times = ['Vasco da Gama', 'São Paulo', 'Corinthians', 'Vitória', 'Volta Redonda', 'Fluminense', 'Flamengo', 'Botafogo', 'Sport', 'Santa Cruz', 'Palmeiras', 'Santos', 'Grêmio', 'Internacional', 'Goiás', 'Vila Nova', 'Aparecidense', 'Anápolis', 'Anapolina', 'Atlético GO', 'Atlético MG', 'Real Madrid', 'Juventus', 'Barcelona', 'Manchester United', 'Manchester City', 'Liverpool', 'Chelsea', 'Paris Saint Germain', 'Borussia Dortmund', 'Bayern de Munique'];
    var autocomplete = false;
    var maxChars = 40;
    var maxLines = 5;

    function split(val) {
        return val.split(/ \s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }

    $("#list").autocomplete({
        //source: manufacturers,
        source: function(request, response) {
            // delegate back to autocomplete, but extract the last term
            response($.ui.autocomplete.filter(
                    times, extractLast(request.term)));
        },
        focus: function() {
            // prevent value inserted on focus
            return false;
        },
        select: function(event, ui) {
            //var terms = split(this.value);
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(" ");
            return false;
        }
    })
            .autocomplete('disable')
            .bind('keydown', function(event) {
        if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
            event.preventDefault();
        }
        //Detecta se CTRL+SPACE foi pressionado e habilita o autocomplete.
        if (event.ctrlKey && event.keyCode === 32) {
            $(this).autocomplete('enable');
            autocomplete = true;
            return false;
        }
        //Detecta se APENAS espaço foi pressionado e desabilita o autocomplete.
        if (!event.ctrlKey && event.keyCode === 32) {
            if (autocomplete) {
                autocomplete = false;
                return false;
            }
            $(this).autocomplete('close');
            $(this).autocomplete('disable');
        }
    })
            .on('input focus keydown keyup', function(e) {
        var lineLength = $(this).val().split("\n").length;
        var text = $(this).val();
        var lines = text.split(/(\r\n|\n|\r)/gm);
        if (e.keyCode === 13 && lineLength >= maxLines) {
            return false;
        }
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].length > maxChars) {
                lines[i] = lines[i].substring(0, maxChars);
            }
        }
        $(this).val(lines.join(''));
    });
    // Sobrescreve o filtro do (JQuery.UI.Autocomplete) filtrando apenas o começo da string. (prefixo)
    $.ui.autocomplete.filter = function(array, term) {
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
        return $.grep(array, function(value) {
            return matcher.test(value.label || value.value || value);
        });
    };
})();