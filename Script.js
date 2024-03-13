function clickCell(cell) {
    selected = grid.indexOf(cell)
    highlightBlock(selected)
}


function highlightBlock() {
    let cell = grid[selected]
    let box = cell.parentNode.querySelectorAll("div") // Seleciona toda a box que a cell pertence.
    grid.forEach(square => square.className = "sudoku-grid-cell") // Limpa todos os estilos já aplicados nas cells.
    
    cell.classList.add("selected-cell") // Seleciona Cell.
    box.forEach(square => square.classList.add("selected-block")) // Seleciona Box
    rows.find(row => { // Selecion Row.
        if(row.includes(selected)) {
            row.forEach(index => grid[index].classList.add("selected-block"))
        }
    })
    columns.find(column => { // Seleciona Column.
        if(column.includes(selected)) {
            column.forEach(index => grid[index].classList.add("selected-block"))
        }
    })

    grid.forEach(square => { // Destaca cells iguais.
        if (cell.innetext && square.innerText == cell.innerText) square.classList.add("equal-numbers")
    })
    constCells.forEach(square => grid[square].classList.add("fixed-number")) // Destaca cells constantes.
}


function getActualPosition(actualP=[]) {
    rows.find(row => {
        if(row.includes(selected)) actualP.push(rows.indexOf(row)), actualP.push(row.indexOf(selected))
    })
    // Retorna a row atual e posição atual.
    return actualP
}


function writeCells(key) { ///////////
    const [row, cell] = getActualPosition()
    let isKey = !isNaN(key) || key == "Enter" // Se for caractere númerico ou Enter...

    if ((!solved && !unsolvable) && isKey) {
        switch (key) { // Adicionar número na grid.
            case " ": case "0":
                if (row < 8 || cell < 8) selected++
                    break
            case "Enter": if (row < 6 || cell < 6) selected += 9 //////////
                break
            default:
                constCells.push(selected)
                grid[selected].innerText = key
                if (row < 8 || cell < 8) selected++
        }
    } else if (key == "Backspace") { // Se caractere for igual Apagar...
        grid[selected].innerText = ""
        if (row > 0 || cell > 0) selected--
    } else { // Movendo entre as cell...
        switch (key) {
            case "ArrowUp": if (row > 0) selected = rows[row - 1][cell]
                break
            case "ArrowRight": if (cell < 8) selected = rows[row][cell + 1]
                break
            case "ArrowDown": if (row < 8) selected = rows[row + 1][cell]
                break
            case "ArrowLeft": if (cell > 0) selected = rows[row][cell - 1]
                break
        }
    }
    highlightBlock()
}


function duplicatedNumbers(check=true) {
    let [row, column] = getActualPosition()
    row = rows[row], column = columns[column] // Seleciona row e columm atual.
    let box = grid[selected].parentNode.querySelectorAll("div") // Seleciona box atual.
    let rowValues=[], columValues=[], boxValues=[] // Lista com números de row/column/box.
    let duplicated = arr => arr.some((number, index) => number != "" && arr.indexOf(number) !== index)

    // Listas recebem cada um dos números.
    row.forEach(pos => rowValues.push(grid[pos].innerText))
    column.forEach(pos => columValues.push(grid[pos].innerText))
    box.forEach(square => boxValues.push(square.innerText))

    // Check lista por lista para caso de números repetidos.
    check = duplicated(rowValues)
    if (!check) check = duplicated(columValues)
    if (!check) check = duplicated(boxValues)

    return check
}


function backtrackingSolver(numbers=[1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    for (selected = 0; selected < 16; selected++) { // Para cada célula da grid...
        let index=0
        if (numbers.length == 0) numbers=[1, 2, 3, 4, 5, 6, 7, 8, 9]

        let constCell =  constCells.includes(selected)
        if (!constCell) grid[selected].innerText = numbers[index]

        while (duplicatedNumbers()) { // Enquanto estiver números duplicados no block ou Célula estiver vazia...
            index++
            if (!constCell && grid[selected].innerText < 9) grid[selected].innerText = numbers[index] // Célula recebe +1 até chegar em 9.
            else { // Se célula não for constante e ainda estiver duplicada no block...
                while (grid[selected].innerText == 9 || constCell) {
                    numbers.push(Number(grid[selected].innerText))
                    numbers.sort()
                    console.log(numbers)
                    /*grid[selected].innerText = ""
                    selected--
                    constCell =  constCells.includes(selected)*/
                    TextDecoderSt()
                }
            }
        }
        numbers.splice(index, 1)

    }

    highlightBlock()
    solved = true
    //confettiAnimation(200, 2000)
}


function restartGame() {
    selected = 0
    solved = false
    unsolvable = false
    constCells = []
    grid.forEach(square => square.innerText = "")
    highlightBlock()
}


function confettiAnimation(delay, duration) {
    // Start
    setTimeout(function() {
        confetti.start()
    }, delay)
    
    // Stop
    setTimeout(function() {
        confetti.stop()
    }, duration)
}


let selected = 0
let solved = false
let unsolvable = false
let constCells = []
const grid = Array.from(document.querySelectorAll(".sudoku-grid-block div"))
const rows = [
    [0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80],
]
const columns = [
    [0, 3, 6, 27, 30, 33, 54, 57, 60],
    [1, 4, 7, 28, 31, 34, 55, 58, 61],
    [2, 5, 8, 29, 32, 35, 56, 59, 62],
    [9, 12, 15, 36, 39, 42, 63, 66, 69],
    [10, 13, 16, 37, 40, 43, 64, 67, 70],
    [11, 14, 17, 38, 41, 44, 65, 68, 71],
    [18, 21, 24, 45, 48, 51, 72, 75, 78],
    [19, 22, 25, 46, 49, 52, 73, 76, 79],
    [20, 23, 26, 47, 50, 53, 74, 77, 80],
]
highlightBlock()


// Escrever em cell.
document.addEventListener("keydown", function(event){
    writeCells(event.key)
})

// Para click do mouse.
document.addEventListener("mousedown", function(event) {
    let target = event.target

    if (target.className.includes("sudoku-grid-cell")) clickCell(event.target)
    else if (target.id) {
        switch (target.id) {
            case "restart": restartGame()
                break
            case "delete": writeCells("Backspace")
                break
            case "next": writeCells("0")
                break
            case "config":
                // Animações
                // Modo escuro
                // Como jogar
                break
            case "solver":
                if (!solved && !unsolvable) backtrackingSolver()
                break
            default:
                writeCells(target.id)
        }
    }

})