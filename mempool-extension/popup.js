document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], // Labels will be populated from local storage
        datasets: [{
          label: 'Fee Rates (sat/vB)',
          data: [],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 1,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'orange'
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            min: 1,
            max: 50,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)'
            }
          },
          y: {
            type: 'linear',
            min: 0,
            max: 250,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'orange'
            }
          }
        }
      }
    });
  
    // Load data from local storage and update the chart
    chrome.storage.local.get(['feeRateHistory'], function(result) {
      if (result.feeRateHistory) {
        const history = result.feeRateHistory;
        myChart.data.labels = history.labels;
        myChart.data.datasets[0].data = history.data;
        myChart.update();
      }
    });
  
    function updateChart(data) {
      chrome.storage.local.get(['feeRateHistory'], function(result) {
        let history = result.feeRateHistory || { labels: [], data: [] };
        
        if (history.labels.length >= 2000) {
          history.labels.shift();
          history.data.shift();
        }
        
        const currentBlock = history.labels.length > 0 ? history.labels[history.labels.length - 1] + 1 : 1;
        history.labels.push(currentBlock);
        history.data.push(data.fastestFee);
  
        chrome.storage.local.set({ feeRateHistory: history }, function() {
          myChart.data.labels = history.labels;
          myChart.data.datasets[0].data = history.data;
          myChart.update();
        });
      });
    }
  
    function fetchFeeRates() {
      fetch('https://mempool.space/api/v1/fees/recommended')
        .then(response => response.json())
        .then(data => {
          updateChart(data);
          document.getElementById('fees').innerHTML = `
            <div class="fee-rate"><span class="fee-label">Fastest Fee:</span> <span>${data.fastestFee} sat/vB</span></div>
            <div class="fee-rate"><span class="fee-label">Half Hour Fee:</span> <span>${data.halfHourFee} sat/vB</span></div>
            <div class="fee-rate"><span class="fee-label">Hour Fee:</span> <span>${data.hourFee} sat/vB</span></div>
            <div class="fee-rate"><span class="fee-label">Minimum Fee:</span> <span>${data.minimumFee} sat/vB</span></div>
          `;
        })
        .catch(error => console.error('Error fetching fee rates:', error));
    }
  
    // Fetch initial data
    fetchFeeRates();
    // Update data every minute
    setInterval(fetchFeeRates, 60000);
  });
  