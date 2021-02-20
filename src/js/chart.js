function chart(canvasId = 'myChart') {

    var ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        // min: 1900,
                        // max: 2700,
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
