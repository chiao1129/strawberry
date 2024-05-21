
document.addEventListener("DOMContentLoaded", function() {
    var startYearSelect = document.getElementById("start-year");
    var endYearSelect = document.getElementById("end-year");

    startYearSelect.addEventListener("change", updateEndYearOptions);
    document.getElementById("price-form").addEventListener("submit", function(event) {
        event.preventDefault();
        fetchPrices();
    });

    updateEndYearOptions(); // 初始化時更新結束年份選項
});

function updateEndYearOptions() {
    var startYearSelect = document.getElementById("start-year");
    var endYearSelect = document.getElementById("end-year");
    var startYear = parseInt(startYearSelect.value);

    endYearSelect.innerHTML = '';
    for (var year = startYear; year <= 2024; year++) { // 假設2024是最大的年份
        var option = document.createElement("option");
        option.value = year;
        option.text = year;
        endYearSelect.add(option);
    }
}

function fetchPrices() {
    var startYear = document.getElementById("start-year").value;
    var endYear = document.getElementById("end-year").value;

    fetch(`/prices?startYear=${startYear}&endYear=${endYear}`)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            drawChart(data);
        })
        .catch(error => console.error('Error fetching prices:', error));
}

function drawChart(data) {
    var ctx = document.getElementById('price-chart').getContext('2d');
    var chartData = data.map(entry => ({
        x: new Date(entry.date, 0), // 年份转化为日期对象
        y: entry.price
    }));
    console.log('Data for chart:', chartData);
    if (window.chart) {
        window.chart.destroy();
    }
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: '草莓價格',
                data: chartData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'year',
                        tooltipFormat: 'yyyy',
                        displayFormats: {
                            year: 'yyyy' // 确保x轴显示年份
                        }
                    },
                    title: {
                        display: true,
                        text: '年份'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '平均價格(元/公斤)'
                    }
                }
            }
        }
    });
    window.chart = chart; // 將新的圖表實例存儲在 window.chart 中
}
