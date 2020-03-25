//Data Card Global
fetch('https://covid19.mathdro.id/api/countries/[country]')
.then(response => response.json())
.then(response => {
        const data          = response;
        const confirmed     = document.querySelector('.confirmed-global')
        const recovered     = document.querySelector('.recovered-global')
        const deaths        = document.querySelector('.deaths-global')
        const updateD       = document.querySelector('.update-date')
        updateD.innerHTML   = updateDate(data);
        confirmed.innerHTML = cardConfirmGlobal(data);
        recovered.innerHTML = cardRecoveredGlobal(data);
        deaths.innerHTML    = cardDeathsGlobal(data);
});

//Data Card Indonesia
fetch('https://covid19.mathdro.id/api/countries/ID')
.then(response => response.json())
.then(response => {
    const data              = response;
    const confirmed         = document.querySelector('.confirmed-indonesia')
    const recovered         = document.querySelector('.recovered-indonesia')
    const deaths            = document.querySelector('.deaths-indonesia')
    const updateD           = document.querySelector('.update-date-indonesia')
    updateD.innerHTML       = updateDate(data);
    confirmed.innerHTML     = cardConfirmId(data);
    recovered.innerHTML     = cardRecoveredId(data);
    deaths.innerHTML        = cardDeathsId(data);
})

//Search by Countries
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', function(){
    const valSearch = document.querySelector('.inputKey');
    fetch('https://covid19.mathdro.id/api/countries/' + valSearch.value)
    .then(response => response.json())
    .then(response => {
            const data          = response;
            const cardData      = document.querySelector('.card-data');
            cardData.innerHTML  = cardTabel(data);
        });
});

//fungsi ambil data array nama dari api/confirmed
function getCountryName (){
    return fetch('https://covid19.mathdro.id/api/confirmed') //
    .then(response => response.json())
    .then(res => {
       const objCountries = arrCountryName(res);
       start(objCountries);
    });
}

function start(objCountries){
        const dbArr = getAlldata(objCountries);
        console.log(dbArr)
        setTimeout( function(){ 
        const dbAll                 = getDataTabel(dbArr);
        const tabelData             = document.querySelector('.tabel-data');
                tabelData.innerHTML = dbAll;
        }, 1500);
}

// ambil nama Negara saja, masukan ke Array dan filter jadi identik
function arrCountryName(res){
    const arrCountry = [];
    for(const country of res){ arrCountry.push(country.countryRegion)}
    const newCountry = arrCountry.filter((countries, i) => arrCountry.indexOf(countries) === i);
    return newCountry;
}

//gabungkan data dan nama negara kedalam array baru
function getAlldata(arrCountries){
    const data = []
    arrCountries.forEach(country => {
        fetch('https://covid19.mathdro.id/api/countries/'+ country )
        .then(response => response.json())
        .then(res => { 
            const all = res;
            data.push({
                countries: country, 
                confirmed: all.confirmed.value,
                recovered: all.recovered.value,
                deaths: all.deaths.value
            });
        });
    });
    return data;
}


function getDataTabel(data){
    let tabel='';
    data.sort(function(a, b){return b.confirmed - a.confirmed});
    data.forEach((m, i) => {
             tabel += showTabel(m, i);
        });
    return tabel;
    }

document.addEventListener('click', async function(e){
    if(e.target.classList.contains('btn-country-detail')){
        const idCountry     = e.target.dataset.country;
        const detailCountry = await getCountryDetail(idCountry);
        updateCountryDetail(detailCountry); 
    }
});


function getCountryDetail(idCountry){
    return fetch('https://covid19.mathdro.id/api/countries/'+ idCountry +'/confirmed')
    .then(response => response.json())
    .then(res => res);
}

function updateCountryDetail(res){
    let detCountries = '';
    res.forEach((m, i) =>{
        detCountries += countryDetail(m, i);
        const modal = document.querySelector('.tabel-data-detail');
        modal.innerHTML = detCountries;
    })
}

getCountryName();


function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

const convertDate = function (dateIn){
    let date = new Date(dateIn);
    const formatOptions = { 
        day:    '2-digit', 
        month:  '2-digit', 
        year:   'numeric',
        hour:   '2-digit', 
        minute: '2-digit',
        hour12: true 
    };
    let dateString = date.toLocaleDateString('en-US', formatOptions);
    // => "02/17/2017, 11:32 PM"

    dateString = dateString.replace(',', '')
                        .replace('PM', 'p.m.')
                        .replace('AM', 'a.m.');
    // => "02/17/2017 11:32 p.m."
    return dateString;
}


function updateDate(data){
    let dateString = convertDate(data.lastUpdate);
    return `Update ${dateString}`
}

function cardConfirmId(data){
    return `<h6 class="card-subtitle ina mb-2 text-light">Confirmed</h6>
    <h5 class="card-title display-4 num-conf">${formatNumber(data.confirmed.value)}</h5>
    <div class="">${` `}</div>`
}

function cardRecoveredId(data){
    return `<h6 class="card-subtitle ina mb-2 text-light">Recovered</h6>
    <h5 class="card-title display-4 num-rec">${formatNumber(data.recovered.value)}</h5>
    <p class="card-text rate-recovered ina text-center text-light">${((data.recovered.value / data.confirmed.value)*100).toFixed(2)}% Recovery Rate</p>`
}

function cardDeathsId(data){
    return `<h6 class="card-subtitle ina mb-2 text-light">Deaths</h6>
    <h5 class="card-title display-4 num-deaths">${formatNumber(data.deaths.value)}</h5>
    <p class="card-text rate-deaths ina text-center text-light">${((data.deaths.value / data.confirmed.value)*100).toFixed(2)}% Fatality Rate</p>`
}
function cardConfirmGlobal(data){
    return `<h6 class="card-subtitle mb-2 text-light">Confirmed</h6>
    <h5 class="card-title display-4 num-conf">${formatNumber(data.confirmed.value)}</h5>
    <div class="">${` `}</div>`
}

function cardRecoveredGlobal(data){
    return `<h6 class="card-subtitle mb-2 text-light">Recovered</h6>
    <h5 class="card-title display-4 num-rec">${formatNumber(data.recovered.value)}</h5>
    <p class="card-text rate-recovered text-center text-light">${((data.recovered.value / data.confirmed.value)*100).toFixed(2)}% Recovery Rate</p>`
}

function cardDeathsGlobal(data){
    return `<h6 class="card-subtitle mb-2 text-light">Deaths</h6>
    <h5 class="card-title display-4 num-deaths">${formatNumber(data.deaths.value)}</h5>
    <p class="card-text rate-deaths text-center text-light">${((data.deaths.value / data.confirmed.value)*100).toFixed(2)}% Fatality Rate</p>`
}

function showTabel(m, i) {
    return  `<tr><th scope="row">${i+1}</th>
        <td> ${m.countries}</a></td>
        <td>${formatNumber(m.confirmed)}</td>
        <td>${formatNumber(m.recovered)}</td>
        <td>${formatNumber(m.deaths)}</td>
        <td> <a href="#" class="btn btn-secondary btn-sm btn-country-detail" data-toggle="modal" data-country="${m.countries}" data-target="#countryModal">Detail</a></td></tr>`
    };


function cardTabel(data) {
    return  `<div class="col-4 d-flex">
        <div class="card-search" style="width: 18rem;">
            <div class="card-body">
                <h6 class="card-subtitle mb-2 text-light">Confrimed</h6>
                <h5 class="card-title num-conf">${formatNumber(data.confirmed.value)}</h5>
                <h6 class="card-subtitle mb-2 text-light">${convertDate(data.lastUpdate)}</h6>
            </div>
        </div>
    </div>
    <div class="col-4 d-flex">
        <div class="card-search" style="width: 18rem;">
            <div class="card-body">
                <h6 class="card-subtitle mb-2 text-light">Recovered</h6>
                <h5 class="card-title num-rec">${formatNumber(data.recovered.value)}</h5>
                <h6 class="card-subtitle mb-2 text-light rate-recovered text-center">${((data.recovered.value / data.confirmed.value)*100).toFixed(2)}%</h6>
            </div>
        </div>
    </div>
    <div class="col-4 d-flex">
        <div class="card-search" style="width: 18rem; card-search">
            <div class="card-body">
                <h6 class="card-subtitle mb-2 text-light">Deaths</h6>
                <h5 class="card-title num-deaths">${formatNumber(data.deaths.value)}</h5>
                <h6 class="card-subtitle mb-2 text-light rate-deaths text-center">${((data.deaths.value / data.confirmed.value)*100).toFixed(2)}%</h6>
            </div>
        </div>
    </div>
  `
    }


function countryDetail(m, i){
    return `<tr><th scope="row">${i+1}</th>
    <td> ${m.provinceState}</a></td>
    <td>${formatNumber(m.confirmed)}</td>
    <td>${formatNumber(m.recovered)}</td>
    <td>${formatNumber(m.deaths)}</td>
    <td>${formatNumber(m.active)}</td></tr>`
}
