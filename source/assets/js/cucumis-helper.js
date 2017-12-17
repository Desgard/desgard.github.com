console.log('json');

$.ajax({
    type: "get",
    async: false,
    url: 'http://127.0.0.1:5000/api/v1/test',
    dataType: 'jsonp',
    success: function(json) {
        console.log('success');
    },
    error: function() {
        console.log('error');
    }
})
