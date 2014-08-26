$(function() {
var startDate = new Date('01/01/2000');
var FromEndDate = new Date();
var ToEndDate = new Date();

ToEndDate.setDate(ToEndDate.getDate());

$('.from_date').datepicker({
    
    weekStart: 1,
    startDate: '01/01/2000',
    endDate: FromEndDate, 
    autoclose: true
})
    .on('changeDate', function(selected){
        startDate = new Date(selected.date.valueOf());
        startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
        $('.to_date').datepicker('setStartDate', startDate);
    }); 
$('.to_date')
    .datepicker({
        weekStart: 1,
        startDate: startDate,
        endDate: ToEndDate,
        autoclose: true
    })
    .on('changeDate', function(selected){
        FromEndDate = new Date(selected.date.valueOf());
        FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
        $('.from_date').datepicker('setEndDate', FromEndDate);
    });  
});

$('.check').on('click',function(){
    var beginDate = $('.from_date').val();
    var endDate = $('.to_date').val();
    var selectedTypes = [];
    $('.controls input:checked').each(function() {
    selectedTypes.push($(this).attr('value'));
    });
    selectedTypes = selectedTypes.join(",");
    $('#allTypes').val(selectedTypes);
});

$('#allTrans').on('click', function() {
    var currentURL = window.location;
    console.log(currentURL);
    var storedUrlParam = currentURL.search;
    console.log(storedUrlParam);
    window.open('/Transactions' + storedUrlParam);
});

//redirect user to /transactions with query string param

//transactions?begindate=something&endDate=something&types=money_received,money_sent

//https://www.dwolla.com/oauth/rest/transactions/?
//oauth_token={oauth_token}
//&sinceDate=05/01/2014
//&endDate=06/06/2014
//&limit=200
//&types=money_sent%2Cmoney_received%2Cdeposit%2Cwithdrawal%2Cfee

 //  $.get('/Transactions?be')

