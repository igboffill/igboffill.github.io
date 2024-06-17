let result = '';

document.addEventListener("DOMContentLoaded", () => {
    const enterBtn = document.getElementById('enter-btn');

    enterBtn.addEventListener('click', () => {
        const varName = document.getElementById('var-name').value,
            lineLength = document.getElementById('line-length').value,
            sourceText = document.getElementById('source').value;
        keebBrakes = document.getElementById('keep-breaks').checked,
            selectedCharacter = document.getElementById('selected-character').value == 'double' ? '"' : "'",
            endLineCharacterValue = document.getElementById('end-line-character').value;

        const opositeCharacter = selectedCharacter == "'" ? "'  + \"'\" + '" : "\" + '\"' + \"";

        switch (endLineCharacterValue) {
            case 'none':
                endLineCharacter = '';
                break;
            case 'space':
                endLineCharacter = ' ';
                break;
            case 'chr-13':
                endLineCharacter = 'chr(13)';
                break;
            case 'br':
                endLineCharacter = '<br />';
                break;

            default:
                break;
        }

        var lines = sourceText.split(/\r?\n/);
        if (!keebBrakes) {
            lines = splitLineByLength(lines.join(((endLineCharacter == '' || endLineCharacter == ' ') ? endLineCharacter : '')), lineLength);
        }

        const newLines = [];

        lines.forEach((element, index) => {
            if (element.length <= lineLength) {
                if (element) {
                    let item = (index == 0 ? varName + ' = !' : '+= !') + selectedCharacter + element.replaceAll(selectedCharacter, opositeCharacter)
                        + ((keebBrakes && endLineCharacter !== 'chr(13)') ? endLineCharacter : '')
                        + selectedCharacter
                        + ((keebBrakes && endLineCharacter == 'chr(13)') ? ' + chr(13)' : '');
                    newLines.push(item);
                }

            } else {
                let splittedItem = splitLineByLength(element, lineLength);
                splittedItem.forEach((se, si) => {
                    let sitem = ((index == 0 && si == 0) ? varName + ' = !' : '+= !') + selectedCharacter + se + selectedCharacter;
                    newLines.push(sitem);
                });
            }

        });

        result = newLines.join('\r\n');
        document.getElementById('result').innerText = result;
    });

    document.getElementById('copy-icon').addEventListener('click', () => {
        navigator.clipboard.writeText(result);
        alert("Resultado copiado al clipboard");
    });
});

function splitLineByLength(line, length) {
    if (!length) { length = 10000; }
    return line.match(new RegExp('.{1,' + length + '}', 'g'));
}