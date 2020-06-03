

function populatesUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    
    } )
}

populatesUFs()


function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    console.log(event.target.value)

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    
    
    citySelect.innerHTML = "<option value>Selecione a cidade</option>"
    citySelect.disabled = true


    fetch(url)
    .then( res => res.json() )
    .then( cities => {

        for( const city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
        
        citySelect.disabled = false
    } )

}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


// itens de coleta 
//pega todos os li's
const intensToCollect = document.querySelectorAll(".itens-grid li")

for (const iten of intensToCollect) {
    iten.addEventListener("click" , handleSelectedItens)
}

const collectedItens = document.querySelector("input[name=items]")

let selectItems = []

function handleSelectedItens(event) {
    const itemLi = event.target
    
    //adicionar ou remover uma classe
    itemLi.classList.toggle("selected")
    
    const itemId = itemLi.dataset.id

    // Vou verificar se a itens selecionados
    // se sim pega os intens selecionados
    
    const alreadySelected = selectItems.findIndex( item => {
        const itemFound  = item == itemId //isso sera true ou false
        return itemFound
    })

    // se ja estiver selecionado 
    if(alreadySelected >= 0) {
        // tira da selecao
        const filteredItems = selectItems.filter( item => {
            const itemIsDifferent = item != itemId 
            return itemIsDifferent 
        } )

        selectItems = filteredItems
    } else {
        // se nao estiver selecionado, 
        // adiciona a selecao
        selectItems.push(itemId)
    }
    
    //atualizaro campo escondido
    
    collectedItens.value = selectItems

}
