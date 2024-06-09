async function fetchFeeRates() {
    try {
      const response = await fetch('https://mempool.space/api/v1/fees/recommended');
      const data = await response.json();
      const fastestFee = data.fastestFee;
      let badgeColor = '#000000';
  
      if (fastestFee <= 30) {
        badgeColor = '#00FF00';  // Green
      } else if (fastestFee <= 60) {
        badgeColor = '#FFA500';  // Orange
      } else if (fastestFee <= 100) {
        badgeColor = '#FF0000';  // Red
      } else {
        badgeColor = '#000000';  // Black
      }
  
      chrome.action.setBadgeText({ text: fastestFee.toString() });
      chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  
      chrome.storage.local.set({ feeData: data });
    } catch (error) {
      console.error('Error fetching fee rates:', error);
    }
  }
  
  chrome.runtime.onInstalled.addListener(() => {
    fetchFeeRates();
    chrome.alarms.create('fetchFeeRates', { periodInMinutes: 1 });
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'fetchFeeRates') {
      fetchFeeRates();
    }
  });
  