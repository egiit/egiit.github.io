fetch('https://covid19.mathdro.id/api/confirmed') //Api Ambil Nama Negara yang terkena Covid-19
.then(response => response.json())
.then(response => {
        const allCountry = response;
        // console.log(allCountry)
        const arrCountry = []; //Semua provincy dan negara terkena covif
        for(const country of allCountry){
            arrCountry.push(country.countryRegion);
        }
        const newCountry = arrCountry.filter((countries, i) => arrCountry.indexOf(countries) === i); //ambil hanya negara
        
        /* ini ambil data jumlah korban per negara */       
        const data = [];
        newCountry.forEach( (country, i) => {
            fetch('https://covid19.mathdro.id/api/countries/'+ country )
            .then(response => response.json())
            .then(response => {
                const allNewCountries = response;
                // console.log(allNewCountries);
                data.push({
                    countries: country, 
                    confirmed: allNewCountries.confirmed.value,
                    recovered: allNewCountries.recovered.value,
                    deaths: allNewCountries.deaths.value
                });
            });
        }); 
        // console.log(data);
        setTimeout(function(){ 
            let tabel = '';
            data.sort(function(a, b){return b.confirmed - a.confirmed})
            data.forEach((m, i) => {
                tabel += showTabel(m, i);
                const tabelData = document.querySelector('.tabel-data');
                tabelData.innerHTML = tabel;
            });
            const detailCountry = document.querySelectorAll('.btn-country-detail');
            detailCountry.forEach(detail => {
                // console.log(detail)
                detail.addEventListener('click', function(){
                    const idCountry = this.dataset.country;
                    // console.log(idCountry);
                    let detCountries = '';
                    fetch('https://covid19.mathdro.id/api/countries/'+ idCountry +'/confirmed')
                    .then(response => response.json())
                    .then(response => {
                        const res = response;
                        res.forEach((m, i) => {
                            detCountries += countryDetail(m, i);
                            const modal = document.querySelector('.tabel-data-detail');
                            modal.innerHTML = detCountries;
                        });
                    });
                });
            })

        }, 1500)
    });

//Indonesia data 
fetch('https://covid19.mathdro.id/api/countries/ID')
.then(response => response.json())
.then(response => {
    const data = response;
    const confirmed = document.querySelector('.confirmed-indonesia')
    const recovered = document.querySelector('.recovered-indonesia')
    const deaths = document.querySelector('.deaths-indonesia')
    const updateD = document.querySelector('.update-date-indonesia')
    updateD.innerHTML = updateDate(data);
    confirmed.innerHTML = cardConfirmGlobal(data);
    recovered.innerHTML = cardRecoveredGlobal(data);
    deaths.innerHTML = cardDeathsGlobal(data);
})

//Search by Countries
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', function(){
    const valSearch = document.querySelector('.inputKey');
    fetch('https://covid19.mathdro.id/api/countries/' + valSearch.value)
    .then(response => response.json())
    .then(response => {
            const data = response;
            const cardData = document.querySelector('.card-data');
            cardData.innerHTML = cardTabel(data);
            // console.log(cardData)
        });
});

//search by provence
fetch('https://covid19.mathdro.id/api/countries/[country]')
.then(response => response.json())
.then(response => {
        const data = response;
        const confirmed = document.querySelector('.confirmed-global')
        const recovered = document.querySelector('.recovered-global')
        const deaths = document.querySelector('.deaths-global')
        const updateD = document.querySelector('.update-date')
        updateD.innerHTML = updateDate(data);
        confirmed.innerHTML = cardConfirmGlobal(data);
        recovered.innerHTML = cardRecoveredGlobal(data);
        deaths.innerHTML = cardDeathsGlobal(data);
        // console.log(data.confirmed.value);
});

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