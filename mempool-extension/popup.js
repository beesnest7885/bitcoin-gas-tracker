document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get('feeData', function (result) {
      let fees = result.feeData;
      let feesDiv = document.getElementById('fees');
      
      if (fees) {
        feesDiv.innerHTML = `
          <div class="fee-rate"><span class="fee-label">Fastest Fee:</span> <span>${fees.fastestFee} sat/vB</span></div>
          <div class="fee-rate"><span class="fee-label">Half Hour Fee:</span> <span>${fees.halfHourFee} sat/vB</span></div>
          <div class="fee-rate"><span class="fee-label">Hour Fee:</span> <span>${fees.hourFee} sat/vB</span></div>
          <div class="fee-rate"><span class="fee-label">Minimum Fee:</span> <span>${fees.minimumFee} sat/vB</span></div>
        `;
      } else {
        feesDiv.innerText = 'Error fetching fee data';
      }
    });
  });
  