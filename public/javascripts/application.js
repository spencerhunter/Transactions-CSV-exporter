$(function() {
    var startDate = new Date('01/01/2000');
    var FromEndDate = new Date();
    var ToEndDate = new Date();

    ToEndDate.setDate(ToEndDate.getDate());

    $('.from_date')
        .datepicker({
            weekStart: 1,
            startDate: '01/01/2000',
            endDate: FromEndDate,
            autoclose: true
        })
        .on('changeDate', function(selected) {
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
        .on('changeDate', function(selected) {
            FromEndDate = new Date(selected.date.valueOf());
            FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
            $('.from_date').datepicker('setEndDate', FromEndDate);
        });
});

$('.check').on('click', function() {
    var selectedTypes = [];
    $('.controls input:checked').each(function() {
        selectedTypes.push($(this).attr('value'));
    });
    selectedTypes = selectedTypes.join(",");
    $('#allTypes').val(selectedTypes);
});