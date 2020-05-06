"use strict";

class TableTemplate {
    static fillIn(id, dictionary, columnName) {
        let table = document.getElementById(id);
        let entireFlag = false; // whether we need to replace the entire table
        let columnIndex = -1;
        if (columnName === undefined) {
            entireFlag = true;
        }
        for (let r = 0; r < table.rows.length; r++) {
            let row = table.rows[r];
            for (let c = 0; c < row.cells.length; c++) {
                let cell = row.cells[c];
                let content = cell.textContent;
                if (r === 0 || entireFlag || c === columnIndex) {
                    let processor = new Cs142TemplateProcessor(content);
                    let replacedContent = processor.fillIn(dictionary);
                    cell.innerHTML = replacedContent;
                    if (r === 0 && replacedContent === columnName) {
                        columnIndex = c;
                    }
                }
            }
        }
        if(table.style.visibility === 'hidden') {
            table.style.visibility = 'visible';
        }
    }
}
