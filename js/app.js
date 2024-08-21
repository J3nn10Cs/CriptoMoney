const form = document.querySelector('#formulario')
const moneyCripto = document.querySelector('#criptomonedas')
const result = document.querySelector('#resultado')
const money = document.querySelector('#moneda');

document.addEventListener('DOMContentLoaded', () => {
    consultCipto();
    form.addEventListener('submit', evaluateCripto)
})

async function consultCipto(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    try {
        const response = await fetch(url);
        const result = await response.json();
            optionCripto(result.Data)
    } catch (error) {
        console.log(error);
    }
}

function evaluateCripto(e){
    e.preventDefault();
    if(moneyCripto.value === '' || money.value === ''){
        showAlert('Todos los campos son obligatorios');
        return
    }

    // console.log(`${moneyCripto.value} - ${money.value}`);
    getCripto(moneyCripto.value,money.value)

}

async function getCripto(money, criptoMoney){
    showSpinner()
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptoMoney}&tsyms=${money}`;
    console.log(url);

    try {
        const response = await fetch(url);
        const data = await response.json()
            showImformationCripto(data.DISPLAY[criptoMoney][money])
    } catch (error) {
        console.log(error);
    }
}

function showImformationCripto(cripto){
    deleteHtml(result);
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE,FROMSYMBOL} = cripto;
    const infoDiv = document.createElement('div');
    const pPrice = document.createElement('P');
    pPrice.classList.add('precio')
    pPrice.innerHTML = `The price is : <span> ${FROMSYMBOL} ${PRICE.slice(2)} </span>`

    const pAlto = document.createElement('P');
    pAlto.innerHTML = `<p> Highest price of the day : <span>${FROMSYMBOL} ${HIGHDAY.slice(2)}</span> <p>`

    const pBajo = document.createElement('P');
    pBajo.innerHTML = `<p> Lowest price of the day : <span>${FROMSYMBOL} ${LOWDAY.slice(2)}</span>`

    const pUlthora = document.createElement('P');
    pUlthora.innerHTML = `<p> Variation in the last 24 hours : <span>${CHANGEPCT24HOUR}</span>`

    const pInfoUpdate = document.createElement('P');
    pInfoUpdate.innerHTML = `<p> Last update : <span>${LASTUPDATE}</span>`

    infoDiv.appendChild(pPrice)
    infoDiv.appendChild(pAlto)
    infoDiv.appendChild(pBajo)
    infoDiv.appendChild(pUlthora)
    infoDiv.appendChild(pInfoUpdate)
    result.appendChild(infoDiv)
}

function showSpinner(){
    deleteHtml(result);
    const spinnerDiv = document.createElement('div')
    spinnerDiv.classList.add('spinner');
    spinnerDiv.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `
    result.appendChild(spinnerDiv)

    setTimeout(() => {
        spinnerDiv.remove();
    }, 2000);
}

function showAlert(){
    deleteHtml(result)
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('error')
    alertDiv.textContent = 'Todos los campos son obligatorios'
    result.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function optionCripto(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName,Name} = cripto.CoinInfo;
        const optionC = document.createElement('OPTION');
        optionC.value = Name;
        optionC.textContent = FullName;
        moneyCripto.appendChild(optionC)
    })
}

function deleteHtml(contains){
    while(contains.firstChild){
        contains.removeChild(contains.firstChild)
    }
}
