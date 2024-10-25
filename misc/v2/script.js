document.addEventListener('DOMContentLoaded', function() {
  const namespaceSelect = document.getElementById('namespaceSelect');
  const podList = document.getElementById('podList');
  const logsContent = document.getElementById('logsContent');
  const currentNamespace = document.getElementById('currentNamespace');
  const currentPod = document.getElementById('currentPod');

  const namespaceData = {
      namespace1: {
          name: 'Namespace 1',
          pods: [
              {
                  id: 'pod1',
                  name: 'Pod 1',
                  logs: `[2024-01-20 10:00:01] INFO Starting application
[2024-01-20 10:00:02] DEBUG Initializing components
[2024-01-20 10:00:03] INFO Application started successfully
[2024-01-20 10:00:04] DEBUG Loading configuration
[2024-01-20 10:00:05] INFO Configuration loaded successfully`
              },
              {
                  id: 'pod2',
                  name: 'Pod 2',
                  logs: `[2024-01-20 10:00:01] INFO Database connection established
[2024-01-20 10:00:02] WARN High memory usage detected
[2024-01-20 10:00:03] INFO Memory usage normalized
[2024-01-20 10:00:04] DEBUG Running maintenance tasks
[2024-01-20 10:00:05] INFO Maintenance completed`
              },
              {
                  id: 'pod3',
                  name: 'Pod 3',
                  logs: `[2024-01-20 10:00:01] INFO Cache initialized
[2024-01-20 10:00:02] ERROR Failed to connect to external service
[2024-01-20 10:00:03] INFO Retry successful
[2024-01-20 10:00:04] DEBUG Optimizing performance
[2024-01-20 10:00:05] INFO Performance optimization complete`
              }
          ]
      },
      namespace2: {
          name: 'Namespace 2',
          pods: [
              {
                  id: 'pod1',
                  name: 'Pod A',
                  logs: `[2024-01-20 10:00:01] INFO Service discovery started
[2024-01-20 10:00:02] INFO Found 3 dependent services
[2024-01-20 10:00:03] DEBUG Establishing connections
[2024-01-20 10:00:04] INFO Services connected successfully`
              },
              {
                  id: 'pod2',
                  name: 'Pod B',
                  logs: `[2024-01-20 10:00:01] WARN Network latency detected
[2024-01-20 10:00:02] INFO Implementing fallback strategy
[2024-01-20 10:00:03] INFO System recovered
[2024-01-20 10:00:04] DEBUG Monitoring network status`
              }
          ]
      },
      namespace3: {
          name: 'Namespace 3',
          pods: [
              {
                  id: 'pod1',
                  name: 'Pod X',
                  logs: `[2024-01-20 10:00:01] INFO Batch processing started
[2024-01-20 10:00:02] INFO Processed 1000 records
[2024-01-20 10:00:03] INFO Batch complete
[2024-01-20 10:00:04] DEBUG Generating reports`
              }
          ]
      }
  };

  Object.keys(namespaceData).forEach(ns => {
      const option = document.createElement('option');
      option.value = ns;
      option.textContent = namespaceData[ns].name;
      namespaceSelect.appendChild(option);
  });

  function updatePodList(namespace) {
      podList.innerHTML = '';
      if (!namespace) return;

      namespaceData[namespace].pods.forEach(pod => {
          const podElement = document.createElement('div');
          podElement.className = 'pod-item';
          podElement.setAttribute('data-pod-id', pod.id);
          podElement.innerHTML = `
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b3087b9aa865379fc60aa67cadaf77edd0d3124342f3f2ad0f199aca69727c97?placeholderIfAbsent=true&apiKey=2521ff3747ac468ab7c6a91eb8d47d87" alt="" class="pod-icon">
              <span>${pod.name}</span>
          `;

          podElement.addEventListener('click', () => {
              document.querySelectorAll('.pod-item').forEach(p => p.classList.remove('active'));
              podElement.classList.add('active');
              showPodLogs(namespace, pod.id);
              currentPod.textContent = pod.name;
          });

          podList.appendChild(podElement);
      });
  }

  function showPodLogs(namespace, podId) {
      const pod = namespaceData[namespace].pods.find(p => p.id === podId);
      if (pod) {
          logsContent.textContent = pod.logs;
      }
  }

  namespaceSelect.addEventListener('change', (e) => {
      const selectedNamespace = e.target.value;
      if (selectedNamespace) {
          updatePodList(selectedNamespace);
          currentNamespace.textContent = namespaceData[selectedNamespace].name;
          currentPod.textContent = 'Select Pod';
          logsContent.textContent = '';
      }
  });

  logsContent.textContent = 'Select a namespace and pod to view logs';
});