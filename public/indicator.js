let indicatorRoot = null;

export function createIndicator() {
  if (indicatorRoot) return indicatorRoot; // already exists

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '9999';

  // Attach Shadow DOM
  const shadow = container.attachShadow({ mode: 'open' });

  // Add initial styles and content
  shadow.innerHTML = `
    <style>
      .indicator {
        padding: 10px 15px;
        border-radius: 8px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
      .running { background-color: #f59e0b; }
      .success { background-color: #10b981; }
      .failure { background-color: #ef4444; }
    </style>
    <div class="indicator running">Extraction running...</div>
  `;

  document.body.appendChild(container);
  indicatorRoot = shadow.querySelector('.indicator');

  return indicatorRoot;
}

export function setIndicatorState(state, message = '') {
  const indicator = createIndicator();
  indicator.className = `indicator ${state}`;
  if (message) {
    indicator.textContent = message;
  } else {
    indicator.textContent =
      state === 'running'
        ? 'Extraction running...'
        : state === 'success'
        ? 'Extraction completed!'
        : 'Extraction failed!';
  }

  // Auto-hide after 3 seconds for success/failure
  if (state === 'success' || state === 'failure') {
    setTimeout(() => {
      if (indicator && indicator.parentElement) {
        indicator.parentElement.remove();
        indicatorRoot = null;
      }
    }, 3000);
  }
}
