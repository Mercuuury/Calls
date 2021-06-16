const requestURL = 'http://cors-anywhere.herokuapp.com/http://citycalls.krlv.ml/calls'
let cardsArr = []
let cardsHtml = document.querySelector('.req-cards')
let typeTaskArr = [
    'Автоматизация процессов',
    'Адаптированная среда',
    'Инструменты контроля',
    'Комфортная среда',
    'Оптимизация процессов',
    'Повышение безопасности',
    'Ресурсосбережение',
    'Сокращение сроков реабилитации'
];
let customerArr = [
    'Департамент жилищно-коммунального хозяйства города Москвы',
    'Департамент информационных техологий',
    'Департамент образования города Москвы',
    'Департамент природопользования города Москвы',
    'Департамент строительства города Москвы',
    'Департамент труда и социальной защиты города Москвы',
    'Департамет спорта города Москвы'
]
let sphereArr = [
    'Безопасность',
    'ЖКХ',
    'Здравоохранение',
    'Образование',
    'Социальная сфера',
    'Спорт',
    'Строительство',
    'Экология',
    'Энергоэффективность'
]
let techArr = [
    'RFID',
    'Биометрия',
    'Большие данные',
    'Инженерная инфраструктура',
    'Интернет вещей',
    'Искусственный интеллект',
    'Компьютерное зрение',
    'Умные устройства',
    'Умный материал',
    'Управление городом'
]

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

function update(content) {
    for(let i = 0; i < 4; i++){
        cardsArr.push('<div class="req-card">\
            <div class="req-card__top">\
                <div class="req-card__header">\
                    <div class="department">\
                        <svg class="department__logo" width="44px" height="53px">\
                            <use xlink:href="static/img/svg-symbols.svg#moscow-for-fill"></use>\
                        </svg>\
                        <div class="department__name">Департамент (надо брать из бд)</div>\
                    </div>\
                </div>\
                <div class="req-card__date">' + parseDate(content[0].expireDate) + '</div>\
                <div class="req-card__name">' + content[0].callName + '</div>\
                <div class="req-card__description">' + content[0].description + '</div>\
                <div class="tags-list">Теги (надо брать из бд)</div>\
            </div>\
            <div class="req-card__footer"><a target="_blank"\
                                                 href="https://innovationmap.innoagency.ru/request/?request=14"\
                                                 class="btn btn-outline-red">Откликнуться</a></div>\
            <div class="req-card__options" hidden>A'+content[0].isArchived+' Департамент труда и социальной защиты города Москвы Здравоохранение Большие данные Автоматизация процессов</div>\
        </div>')

        cardsArr.push('<div class="req-card">\
            <div class="req-card__top">\
                <div class="req-card__header">\
                    <div class="department">\
                        <svg class="department__logo" width="44px" height="53px">\
                            <use xlink:href="static/img/svg-symbols.svg#moscow-for-fill"></use>\
                        </svg>\
                        <div class="department__name">Департамент труда и социальной защиты города Москвы</div>\
                    </div>\
                </div>\
                <div class="req-card__date">30.06.2021</div>\
                <div class="req-card__name">АРХИВНЫЙАльтернатива реабилитационным VR-тренажерам для детей</div>\
                <div class="req-card__description">Решения, направленные на формирование представлений об окружающем\
                    мире и выработку социальных навыков у детей, страдающих эпилепсией и судорожным синдромом</div>\
                <div class="tags-list">\
                    <a class="tag">Большие данные</a>\
                    <a class="tag">Тег2</a>\
                    <a class="tag">Тег3</a>\
                </div>\
            </div>\
            <div class="req-card__footer"><a target="_blank"\
                                                 href="https://innovationmap.innoagency.ru/request/?request=14"\
                                                 class="btn btn-outline-red">Откликнуться</a></div>\
            <div class="req-card__options" hidden>A1 Департамент труда и социальной защиты города Москвы Здравоохранение Большие данные Автоматизация процессов</div>\
        </div>')

        setFilters();
    }
}

function defineByOption(cards, option){
    let count = 0;
    let length = cards.length;
    for (let i = 0; i < length; i++){
        if (option == 'A1')
            count = cards.length;
        else
            if (cards[i].split('<div className="req-card__options" hidden>').pop().search(option) != -1){
                cards.push(cards[i]);
                count++;
            }
    }
    cards.splice(0, cards.length-count);
}

function filterCards(options) {
    let filteredCardsArr = [];

    for (let i = 0; i < cardsArr.length; i++)
        filteredCardsArr.push(cardsArr[i]);

     defineByOption(filteredCardsArr, options.archive) //Фильтр по архивированности

     defineByOption(filteredCardsArr, options.customer) //Фильтр по заказчикам

     defineByOption(filteredCardsArr, options.sphere) //Фильтр по сфере применения

     defineByOption(filteredCardsArr, options.tech) //Фильтр по технологии

     defineByOption(filteredCardsArr, options.typeTask) //Фильтр по типу задачи

    cardsHtml.innerHTML = '';
    for(let i = 0; i < filteredCardsArr.length; i++)
        cardsHtml.innerHTML += filteredCardsArr[i];
}

sendRequest(requestURL)
    .then(data => update(data))
    .catch(err => console.log(err))

$(document).ready(function () {
    $.each(typeTaskArr, function(k,v){
        $('<option value="'+v+'">'+v+'</option>').appendTo("select#typeTask-select");
    });
    $.each(customerArr, function(k,v){
        $('<option value="'+v+'">'+v+'</option>').appendTo("select#customer-select");
    });
    $.each(sphereArr, function(k,v){
        $('<option value="'+v+'">'+v+'</option>').appendTo("select#sphere-select");
    });
    $.each(techArr, function(k,v){
        $('<option value="'+v+'">'+v+'</option>').appendTo("select#tech-select");
    });
    $('.city-select').selectpicker('refresh');

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