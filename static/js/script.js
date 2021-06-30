const callsURL = 'http://citycalls.krlv.ml/calls?expand=customer,scopes,technologies,types,relatedCalls';
const customersURL = 'http://citycalls.krlv.ml/customers';
const scopesURL = 'http://citycalls.krlv.ml/scope';
const typeTasksURL = 'http://citycalls.krlv.ml/type-of-problem';
const techURL = 'http://citycalls.krlv.ml/technology';
let cardsHtml = document.querySelector('.req-cards');
let cardsArr = [];
let typeTaskArr = [];
let customerArr = [];
let sphereArr = [];
let techArr = [];

function sendRequest(url) {
    return fetch(url)
        .then(response => {
            if(response.ok)
                return response.json();

            return response.json().then(error => {
                const e = new Error('Ошибка');
                e.data = error;
                throw e;
            })
        })
}

sendRequest(customersURL)
    .then(data => updateCustomers(data))
    .catch(err => console.log(err))
function updateCustomers(content) {
    for(let i = 0; i < content.length; i++)
        customerArr.push(content[i].brandName);

    $.each(customerArr, function(k,v){
        $('<option value="'+v+'">'+v+'</option>').appendTo("select#customer-select");
    });
    $('.city-select').selectpicker('refresh');
}

sendRequest(scopesURL)
    .then(data => updateScopes(data))
    .catch(err => console.log(err))
function updateScopes(content) {
    for(let i = 0; i < content.length; i++)
        sphereArr.push(content[i].scopeName);

    $.each(sphereArr, function(k,v){
        $('<option value="'+v+'">'+v+'</option>').appendTo("select#sphere-select");
    });
    $('.city-select').selectpicker('refresh');
}

sendRequest(typeTasksURL)
    .then(data => updateTypeTasks(data))
    .catch(err => console.log(err))
function updateTypeTasks(content) {
    for(let i = 0; i < content.length; i++)
        typeTaskArr.push(content[i].name);

    $.each(typeTaskArr, function(k,v){
        $('<option value="'+v+'">'+v+'</option>').appendTo("select#typeTask-select");
    });
    $('.city-select').selectpicker('refresh');
}

sendRequest(techURL)
    .then(data => updateTech(data))
    .catch(err => console.log(err))
function updateTech(content) {
    for(let i = 0; i < content.length; i++)
        techArr.push(content[i].name);

    $.each(techArr, function(k,v){
        $('<option value="'+v+'">'+v+'</option>').appendTo("select#tech-select");
    });
    $('.city-select').selectpicker('refresh');
}

sendRequest(callsURL)
    .then(data => updateCalls(data))
    .catch(err => console.log(err))
function updateCalls(content) {
    for(let i = 0; i < content.length; i++){
        let options = '<div class="req-card__options" hidden>A'+content[i].isArchived+' '+content[i].customer.brandName+' ';
        for(let j = 0; j < content[i].scopes.length; j++)
            options += content[i].scopes[j].scopeName + ' ';
        for(let j = 0; j < content[i].technologies.length; j++)
            options += content[i].technologies[j].name + ' ';
        for(let j = 0; j < content[i].types.length; j++)
            options += content[i].types[j].name + ' ';

        let tags = '';
        for(let j = 0; j < content[i].technologies.length; j++)
            tags += '<a class="tag">'+content[i].technologies[j].name+'</a>';

        cardsArr.push('<div class="req-card">\
            <div class="req-card__top">\
                <div class="req-card__header">\
                    <div class="department">\
                        <svg class="department__logo" width="44px" height="53px">\
                            <use xlink:href="static/img/svg-symbols.svg#moscow-for-fill"></use>\
                        </svg>\
                        <div class="department__name">' + content[i].customer.brandName + '</div>\
                    </div>\
                </div>\
                <div class="req-card__date">' + parseDate(content[i].expireDate) + '</div>\
                <div class="req-card__name">' + content[i].callName + '</div>\
                <div class="req-card__description">' + content[i].briefDescription + '</div>\
                <div class="tags-list">'+ tags +'</div>\
            </div>\
            <div class="req-card__footer"><a target="_blank"\
                                                 href="https://innovationmap.innoagency.ru/request/?request=14"\
                                                 class="btn btn-outline-red">Откликнуться</a></div>\
            '+ options +'</div>\
        </div>')
    }
    setFilters();
    document.querySelector('#count-active').innerHTML = document.body.querySelectorAll('.req-card').length;
}

function setFilters(){
    let arr = {};
    if($('select[name="typeTask"]').val() != ''){
        typeTask = $('select[name="typeTask"]').val() || [];
        arr['typeTask'] = $('select[name="typeTask"]').val();
    }
    if($('select[name="customer"]').val() != ''){
        customer = $('select[name="customer"]').val() || [];
        arr['customer'] = $('select[name="customer"]').val();
    }
    if($('select[name="sphere"]').val() != ''){
        sphere = $('select[name="sphere"]').val() || [];
        arr['sphere'] = $('select[name="sphere"]').val();
    }
    if($('select[name="tech"]').val() != ''){
        tech = $('select[name="tech"]').val() || [];
        arr['tech'] = $('select[name="tech"]').val();
    }
    if ($('#req-filters__checkbox').is(':checked')){
        arr['archive'] = 'A1';
    }else{
        arr['archive'] = 'A0';
    }
    filterCards(arr);
}

function filterCards(options) {
    let filteredCardsArr = [];
    for (let i = 0; i < cardsArr.length; i++)
        filteredCardsArr.push(cardsArr[i]);

    defineByOption(filteredCardsArr, options.archive);
    defineByOption(filteredCardsArr, options.customer);
    defineByOption(filteredCardsArr, options.sphere);
    defineByOption(filteredCardsArr, options.tech);
    defineByOption(filteredCardsArr, options.typeTask);

    cardsHtml.innerHTML = '';
    for(let i = 0; i < filteredCardsArr.length; i++)
        cardsHtml.innerHTML += filteredCardsArr[i];

    if (window.innerWidth <= 625) {
        $("#req-cards").slick("unslick");
    }
    if (document.body.querySelectorAll('.req-card').length < 6) {
        $('#more-link-wrap').hide();
    } else {
        $('#more-link-wrap').show();
        $('.req-card:nth-child(n + 7)').removeClass('visible');
        $('.more-link').removeClass('active');
        $('.more-link').html('Показать еще');
    }
    if (window.innerWidth <= 625) {
        $("#req-cards").slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            infinite: false,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 15000,
        });
    }
}

function defineByOption(cards, option){
    let count = 0;
    let length = cards.length;
    for (let i = 0; i < length; i++){
        if (option == 'A1')
            count = cards.length;
        else
        if (cards[i].split('<div class="req-card__options" hidden>').pop().search(option) != -1){
            cards.push(cards[i]);
            count++;
        }
    }
    cards.splice(0, cards.length-count);
}

function parseDate(sqlDate){
    let date = new Date(sqlDate);
    let day = date.getDate();
    let month = date.getMonth()+1;

    if(day < 10)
        day = "0" + day;
    if(month < 10)
        month = "0" + month;

    return day + "." + month + "." + date.getFullYear();
}

$(document).ready(function () {
    let prevTypeTask,prevCustomer,prevSphere,prevTech;
    $("#typeTask-select").on('hide.bs.select', function(){
        if($('#typeTask-select').val() !== prevTypeTask){
            prevTypeTask = $('#typeTask-select').val();
        }else{
            $('#typeTask-select').val('');
            $('#typeTask-select').removeClass('active');
            setFilters();
        }
    });
    $("#customer-select").on('hide.bs.select', function(){
        if($('#customer-select').val() !== prevCustomer){
            prevCustomer = $('#customer-select').val();
        }else{
            $('#customer-select').val('');
            $('#customer-select').removeClass('active');
            setFilters();
        }
    });
    $("#sphere-select").on('hide.bs.select', function(){
        if($('#sphere-select').val() !== prevSphere){
            prevSphere = $('#sphere-select').val();
        }else{
            $('#sphere-select').val('');
            $('#sphere-select').removeClass('active');
            setFilters();
        }
    });
    $("#tech-select").on('hide.bs.select', function(){
        if($('#tech-select').val() !== prevTech){
            prevTech = $('#tech-select').val();
        }else{
            $('#tech-select').val('');
            $('#tech-select').removeClass('active');
            setFilters();
        }
    });
    $('select').on('change', function(){
        setFilters();
    });
    $('#req-filters__checkbox').on('click', function () {
        setFilters();
    });
});
