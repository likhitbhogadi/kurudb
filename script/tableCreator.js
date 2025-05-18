document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const rowsInput = document.getElementById('rows');
    const columnsInput = document.getElementById('columns');
    const createTableButton = document.getElementById('createTable');
    const tableContainer = document.getElementById('tableContainer');
    const saveTableButton = document.getElementById('saveTable');
    const tableActions = document.querySelector('.table-actions');
    
    const tableEditor = document.querySelector('.table-editor');
    const editableTableContainer = document.getElementById('editableTable');
    const cellContentTextarea = document.getElementById('cellContent');
    const applyCellChangesButton = document.getElementById('applyCellChanges');
    
    const boldButton = document.getElementById('boldText');
    const italicButton = document.getElementById('italicText');
    const alignLeftButton = document.getElementById('alignLeft');
    const alignCenterButton = document.getElementById('alignCenter');
    const alignRightButton = document.getElementById('alignRight');
    
    const addRowButton = document.getElementById('addRow');
    const addColumnButton = document.getElementById('addColumn');
    const deleteRowButton = document.getElementById('deleteRow');
    const deleteColumnButton = document.getElementById('deleteColumn');
    const finishEditingButton = document.getElementById('finishEditing');
    
    let currentTable = null;
    let selectedCell = null;
    
    // Create initial table
    createTableButton.addEventListener('click', function() {
        const rows = parseInt(rowsInput.value);
        const columns = parseInt(columnsInput.value);
        
        if (rows > 0 && columns > 0 && rows <= 10 && columns <= 10) {
            createTable(rows, columns);
            tableActions.style.display = 'block';
        } else {
            alert('Please enter valid number of rows and columns (1-10)');
        }
    });
    
    // Create table function
    function createTable(rows, columns) {
        const table = document.createElement('table');
        table.classList.add('created-table');
        
        // Create table header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        for (let i = 0; i < columns; i++) {
            const th = document.createElement('th');
            th.textContent = `Header ${i + 1}`;
            headerRow.appendChild(th);
        }
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('tr');
            
            for (let j = 0; j < columns; j++) {
                const cell = document.createElement('td');
                cell.textContent = `Cell ${i + 1},${j + 1}`;
                row.appendChild(cell);
            }
            
            tbody.appendChild(row);
        }
        
        table.appendChild(tbody);
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
        currentTable = table;
    }
    
    // Save and edit table
    saveTableButton.addEventListener('click', function() {
        if (currentTable) {
            // Clone the table
            const editableTable = currentTable.cloneNode(true);
            editableTable.classList.add('editable-table');
            
            // Make cells clickable for editing
            const cells = editableTable.querySelectorAll('th, td');
            cells.forEach(cell => {
                cell.addEventListener('click', function() {
                    selectCell(cell);
                });
            });
            
            // Display the editable table
            editableTableContainer.innerHTML = '';
            editableTableContainer.appendChild(editableTable);
            
            // Show the table editor
            tableEditor.style.display = 'block';
        }
    });
    
    // Select cell for editing
    function selectCell(cell) {
        // Deselect previously selected cell
        if (selectedCell) {
            selectedCell.classList.remove('selected-cell');
        }
        
        // Select new cell
        selectedCell = cell;
        selectedCell.classList.add('selected-cell');
        
        // Update cell content textarea
        cellContentTextarea.value = selectedCell.innerHTML;
    }
    
    // Apply cell changes
    applyCellChangesButton.addEventListener('click', function() {
        if (selectedCell) {
            selectedCell.innerHTML = cellContentTextarea.value;
        }
    });
    
    // Bold text
    boldButton.addEventListener('click', function() {
        wrapSelectedTextInTag('strong');
    });
    
    // Italic text
    italicButton.addEventListener('click', function() {
        wrapSelectedTextInTag('em');
    });
    
    // Text alignment
    alignLeftButton.addEventListener('click', function() {
        if (selectedCell) {
            selectedCell.style.textAlign = 'left';
            updateCellContent();
        }
    });
    
    alignCenterButton.addEventListener('click', function() {
        if (selectedCell) {
            selectedCell.style.textAlign = 'center';
            updateCellContent();
        }
    });
    
    alignRightButton.addEventListener('click', function() {
        if (selectedCell) {
            selectedCell.style.textAlign = 'right';
            updateCellContent();
        }
    });
    
    // Helper function to wrap selected text in a tag
    function wrapSelectedTextInTag(tag) {
        const textarea = cellContentTextarea;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        if (start !== end) {
            const selectedText = textarea.value.substring(start, end);
            const wrappedText = `<${tag}>${selectedText}</${tag}>`;
            
            textarea.value = textarea.value.substring(0, start) + wrappedText + textarea.value.substring(end);
        }
    }
    
    // Update cell content textarea when cell style changes
    function updateCellContent() {
        if (selectedCell) {
            cellContentTextarea.value = selectedCell.innerHTML;
        }
    }
    
    // Add row
    addRowButton.addEventListener('click', function() {
        const table = editableTableContainer.querySelector('table');
        if (table) {
            const rows = table.rows;
            const lastRow = rows[rows.length - 1];
            const newRow = document.createElement('tr');
            
            // Create cells for the new row
            for (let i = 0; i < lastRow.cells.length; i++) {
                const cell = document.createElement('td');
                cell.textContent = `New Cell ${i + 1}`;
                cell.addEventListener('click', function() {
                    selectCell(cell);
                });
                newRow.appendChild(cell);
            }
            
            table.querySelector('tbody').appendChild(newRow);
        }
    });
    
    // Add column
    addColumnButton.addEventListener('click', function() {
        const table = editableTableContainer.querySelector('table');
        if (table) {
            const rows = table.rows;
            
            // Add a new header cell
            const headerCell = document.createElement('th');
            headerCell.textContent = `New Header`;
            headerCell.addEventListener('click', function() {
                selectCell(headerCell);
            });
            rows[0].appendChild(headerCell);
            
            // Add cells to each row (skipping the header row)
            for (let i = 1; i < rows.length; i++) {
                const cell = document.createElement('td');
                cell.textContent = `New Cell ${i}`;
                cell.addEventListener('click', function() {
                    selectCell(cell);
                });
                rows[i].appendChild(cell);
            }
        }
    });
    
    // Delete row
    deleteRowButton.addEventListener('click', function() {
        if (selectedCell) {
            const row = selectedCell.parentNode;
            const table = row.parentNode.parentNode;
            
            // Don't delete if there's only one row left in the body
            if (table.querySelector('tbody').rows.length <= 1 && row.parentNode.tagName === 'TBODY') {
                alert('Cannot delete the last row');
                return;
            }
            
            row.parentNode.removeChild(row);
            selectedCell = null;
            cellContentTextarea.value = '';
        }
    });
    
    // Delete column
    deleteColumnButton.addEventListener('click', function() {
        if (selectedCell) {
            const table = editableTableContainer.querySelector('table');
            const rows = table.rows;
            const cellIndex = selectedCell.cellIndex;
            
            // Don't delete if there's only one column
            if (rows[0].cells.length <= 1) {
                alert('Cannot delete the last column');
                return;
            }
            
            // Remove the cell at the same index from each row
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].cells.length > cellIndex) {
                    rows[i].deleteCell(cellIndex);
                }
            }
            
            selectedCell = null;
            cellContentTextarea.value = '';
        }
    });
    
    // Finish editing
    finishEditingButton.addEventListener('click', function() {
        // Update the original table with the edited version
        if (editableTableContainer.firstChild) {
            tableContainer.innerHTML = '';
            tableContainer.appendChild(editableTableContainer.firstChild.cloneNode(true));
            currentTable = tableContainer.firstChild;
            
            // Hide the editor
            tableEditor.style.display = 'none';
            selectedCell = null;
        }
    });
});