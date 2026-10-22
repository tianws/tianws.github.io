(function () {
    'use strict';

    const currentValue = document.getElementById('busuanzi_value_site_pv');
    const totalValue = document.getElementById('site_total_pv');
    if (!currentValue || !totalValue) return;

    const historyPV = Number(totalValue.dataset.historyPv || 0);
    if (!Number.isSafeInteger(historyPV) || historyPV < 0) return;

    function updateTotal() {
        const rawValue = currentValue.textContent.trim();
        if (!/^\d+$/.test(rawValue)) return;

        const currentPV = Number(rawValue);
        const totalPV = historyPV + currentPV;
        if (!Number.isSafeInteger(totalPV)) return;

        totalValue.textContent = String(totalPV);
    }

    // Observe the provider's raw value, never the displayed total, so retries
    // and repeated callbacks cannot add the historical baseline more than once.
    const observer = new MutationObserver(updateTotal);
    observer.observe(currentValue, { childList: true, characterData: true, subtree: true });
    updateTotal();
}());
