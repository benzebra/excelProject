window.onload = setup()

let firstFile
let secondFile
let result = []
let removed = []
let added = []

function setup(){
    let container = document.getElementById("main-container")
    let button = document.getElementById("confirm")
    let results = document.getElementById("results")

    let file1 = document.getElementById("formFileLgFirst")
    let file2 = document.getElementById("formFileLgSecond")

    file1.addEventListener("change", () => {
        resetTable()
        handleFile(file1.files[0], 0)
    });

    file2.addEventListener("change", () => {
        resetTable()
        handleFile(file2.files[0], 1)
    });

    button.addEventListener("click", () => {
        if(file1.files[0] && file2.files[0]){

            firstFile = result[0]
            secondFile = result[1]

            if(result[0] == result[1]){
                setSpinState(1)
            }else{
                if(firstFile && secondFile){
                    resetTable()
    
                    removed = linearSearch(firstFile, secondFile)
                    added = linearSearch(secondFile, firstFile)
    
                    displayChanges()
                }else{
                    setSpinState(2)
                    console.log("--------------")
                    console.log(firstFile)
                    console.log(secondFile)
                    console.log("--------------")
                }
            }
        }else{
            setSpinState(3)
        }
    })
}

function handleFile(file, id){
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function(e) {
        let data = e.target.result;
        let workbook = XLSX.read(data, {
            type: 'binary'
        });

        let roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames]);
        if(roa.length > 0) {
            result[id] = roa
        }
    }
}

function linearSearch(a, b){
    let tmpArray = []
    let flag
    for(let i=0; i<a.length; i++){
        flag = false 
        for(let j=0; j<b.length; j++){
            if(a[i].CODICE_FISCALE){
                if(b[j].CODICE_FISCALE){
                    if(a[i].CODICE_FISCALE == b[j].CODICE_FISCALE){
                        flag = true
                    }
                }
            }else{
                if(b[j].PARTITA_IVA){
                    if(a[i].PARTITA_IVA == b[j].PARTITA_IVA){
                        flag = true
                    }
                }
            }
        }

        if(flag == false){
            tmpArray.push(a[i])
        }
    }

    return tmpArray
}

function displayChanges(){
    let removedTable = document.getElementById("table-rimossi-body")
    let addedTable = document.getElementById("table-aggiunti-body")

    let tmpTR
    let tmpTD

    for(let i=0; i<removed.length; i++){
        tmpTR = document.createElement("tr")

        // CF / P.iva
        tmpTD = document.createElement("td")
        if(removed[i].CODICE_FISCALE){
            tmpTD.innerText = removed[i].CODICE_FISCALE
        }else{
            tmpTD.innerText = removed[i].PARTITA_IVA
        }
        tmpTR.appendChild(tmpTD)

        // NOME COGNOME
        tmpTD = document.createElement("td")
        if(removed[i].RAGIONE_SOCIALE){
            tmpTD.innerText = removed[i].RAGIONE_SOCIALE
        }else{
            tmpTD.innerText = removed[i].COGNOME + " " + removed[i].NOME
        }
        tmpTR.appendChild(tmpTD)

        removedTable.appendChild(tmpTR)
    }

    for(let j=0; j<added.length; j++){
        tmpTR = document.createElement("tr")

        // CF / P.iva
        tmpTD = document.createElement("td")
        if(added[j].CODICE_FISCALE){
            tmpTD.innerText = added[j].CODICE_FISCALE
        }else{
            tmpTD.innerText = added[j].PARTITA_IVA
        }
        tmpTR.appendChild(tmpTD)

        // NOME COGNOME
        tmpTD = document.createElement("td")
        if(added[j].RAGIONE_SOCIALE){
            tmpTD.innerText = added[j].RAGIONE_SOCIALE
        }else{
            tmpTD.innerText = added[j].COGNOME + " " + added[j].NOME
        }
        tmpTR.appendChild(tmpTD)

        addedTable.appendChild(tmpTR)
    }

    setSpinState(4)
}

function resetTable() {
    let oldRemoved = document.getElementById("table-rimossi-body")
    let oldAdded = document.getElementById("table-aggiunti-body")

    oldRemoved.innerHTML = " "
    oldAdded.innerHTML = " "
}

function setSpinState(index){
    let spinningDiv = document.getElementById("spinning")
    console.log(index)
    switch(index){
        case 0:
            spinningDiv.setAttribute("class","spinner-border m-5")
            break;
        case 1:
            spinningDiv.setAttribute("class","display-4 text-danger")
            spinningDiv.innerHTML = "INSERISCI DUE FILES DIFFERENTI"
            break;
        case 2:
            spinningDiv.setAttribute("class","display-4 text-danger")
            spinningDiv.innerHTML = "ERRORE CARICAMENTO FILES, CHIUDERE IL PROGRAMMA E RIPROVARE"
            break;
        case 3:
            spinningDiv.setAttribute("class","display-4 text-danger")
            spinningDiv.innerHTML = "INSERISCI ENTRAMBI I FILES"
            break;
        case 4:
            document.getElementById("spinning").setAttribute("class","spinner-border m-5 visually-hidden")
            break;
    }
}