const podsByNamespace = {
  ns1: ['pod-frontend-1', 'pod-backend-1', 'pod-database-1'],
  ns2: ['pod-frontend-2', 'pod-backend-2', 'pod-database-2'],
  ns3: ['pod-frontend-3', 'pod-backend-3', 'pod-database-3']
};

const dummyLogs = {
  'pod-frontend-1': `[2024-01-20 10:00:01] INFO  Starting frontend service
[2024-01-20 10:00:02] INFO  Connected to backend
[2024-01-20 10:00:03] INFO  Service healthy
[2024-01-20 10:00:04] DEBUG Processing incoming request
[2024-01-20 10:00:05] INFO  Request processed successfully`,
  'pod-backend-1': `[2024-01-20 10:00:01] INFO  Initializing backend service
[2024-01-20 10:00:02] INFO  Database connection established
[2024-01-20 10:00:03] INFO  Ready to accept requests
[2024-01-20 10:00:04] DEBUG Processing data
[2024-01-20 10:00:05] INFO  Data processed successfully`,
  'pod-database-1': `[2024-01-20 10:00:01] INFO  Database initialization
[2024-01-20 10:00:02] INFO  Creating initial schemas
[2024-01-20 10:00:03] INFO  Database ready
[2024-01-20 10:00:04] DEBUG Running maintenance tasks
[2024-01-20 10:00:05] INFO  Maintenance completed`
};

let currentPod = null;

function updatePodList(namespace) {
  const podList = document.getElementById('pod-list');
  podList.innerHTML = '';
  
  podsByNamespace[namespace].forEach(pod => {
      const button = document.createElement('button');
      button.className = 'pod-button';
      button.innerHTML = `
          <i class="bi bi-cube-fill"></i>
          <span>${pod}</span>
      `;
      button.setAttribute('aria-label', `View logs for ${pod}`);
      button.onclick = () => {
          document.querySelectorAll('.pod-button').forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          showLogs(pod);
          currentPod = pod;
      };
      podList.appendChild(button);
  });
}

function showLogs(pod) {
  const logsDisplay = document.getElementById('logs-display');
  logsDisplay.textContent = dummyLogs[pod] || 'No logs available for this pod';
}

document.getElementById('namespace-select').addEventListener('change', (e) => {
  updatePodList(e.target.value);
});

document.getElementById('refresh-logs').addEventListener('click', () => {
  if (currentPod) {
      showLogs(currentPod);
  }
});

// Initialize with first namespace
updatePodList('ns1');