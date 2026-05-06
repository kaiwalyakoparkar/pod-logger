document.addEventListener('DOMContentLoaded', function () {
    const namespaceSelect = document.getElementById('namespaceSelect');
    const podList = document.getElementById('podList');
    const logsContent = document.getElementById('logsContent');
    const currentNamespace = document.getElementById('currentNamespace');
    const currentPod = document.getElementById('currentPod');
    const refreshButton = document.getElementById('refreshButton');
    const askChatGPTButton = document.querySelector('.btn-ask-chatgpt');
    let refreshNs, refreshPod = '';

    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;

        const icon = type === 'success'
            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--orange-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff3333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => toast.remove());
        }, 4000);
    }

    //Fetching Namespaces and processing them for options
    let namespaceData = fetchNamespaces();
    namespaceData.then(data => {
        try {
            data = JSON.parse(data);
            for (let ns of data.items) {
                let option = document.createElement('option');
                option.value = ns.metadata.name;
                option.text = ns.metadata.name;
                namespaceSelect.appendChild(option);
            }
        } catch (error) {
            console.error('Error processing namespace data: ', error);
            logsContent.textContent = "Error loading namespaces. Please try refreshing the page.";
        }
    }).catch(error => {
        console.error('Error fetching namespaces: ', error);
        logsContent.textContent = "Error loading namespaces. Please try refreshing the page.";
    });

    function updatePodList(namespace) {
        podList.innerHTML = '';
        if (!namespace) return;

        let podsData = fetchPods(namespace);
        podsData.then(data => {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new Error("Invalid response format");
            }

            if (!data || !data.items || !Array.isArray(data.items)) {
                throw new Error(data.message || "Failed to load pods");
            }

            data.items.forEach(pod => {
                let podElement = document.createElement('div');
                podElement.className = 'pod-item';
                podElement.setAttribute('data-pod-id', pod.metadata.name);
                podElement.innerHTML = `
                    <img src="./assets/pod-hollow.svg" alt="Pod Icon" class="pod-icon">
                    <span>${pod.metadata.name}</span>
                `;

                podElement.addEventListener('click', () => {
                    document.querySelectorAll('.pod-item').forEach(p => p.classList.remove('active'));
                    podElement.classList.add('active');
                    //Container name is hardcoded to 'api' for now
                    showPodLogs(namespace, pod.metadata.name);
                    currentPod.textContent = pod.metadata.name;
                });

                podList.appendChild(podElement);
            })
        }).catch(error => {
            logsContent.textContent = "No pods/logs found or you don't have access to the namespace";
            console.error('Error listing pods: ', error);
        });
    }

    function showPodLogs(namespace, podName) {
        let container = fetchContainer(namespace, podName);
        container.then(data => {
            if (!data || data.trim() === "No containers found" || data.trim() === "Error Occured") {
                throw new Error("No containers found for this pod.");
            }
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new Error("Failed to parse container list.");
            }
            let containerName = data[0];
            if (!containerName) {
                throw new Error("Container list is empty.");
            }
            console.log("Using container " + containerName);
            const pod = fetchLogs(namespace, podName, containerName);
            pod.then(logData => {
                logsContent.textContent = logData;
                refreshNs = namespace;
                refreshPod = podName;
            }).catch(error => {
                logsContent.textContent = "Error fetching logs";
            })
        }).catch(error => {
            logsContent.textContent = error.message || "Error identifying pod container";
            console.error(error);
        });
    }

    //Fetching pods after receieving selected namespace
    namespaceSelect.addEventListener('change', (e) => {
        const selectedNamespace = e.target.value;
        // console.log(selectedNamespace)//testing OK
        if (selectedNamespace) {
            updatePodList(selectedNamespace);
            currentNamespace.textContent = selectedNamespace;
            currentPod.textContent = 'Select Pod';
            logsContent.textContent = '';
        }
    });

    logsContent.textContent = 'Select a namespace and pod to view logs';

    //Refresh Button event listener
    refreshButton.addEventListener('click', () => {
        showPodLogs(refreshNs, refreshPod);
    });

    //Ask ChatGPT Button event listener
    askChatGPTButton.addEventListener('click', () => {
        const logs = logsContent.textContent.trim();
        const ns = currentNamespace.textContent.trim();
        const pod = currentPod.textContent.trim();

        if (!logs || logs === 'Select a namespace and pod to view logs') {
            showToast('Please select a pod and load its logs before asking ChatGPT.', 'error');
            return;
        }

        const prompt = `I have the following Kubernetes pod logs from namespace "${ns}", pod "${pod}". Please analyze them for errors, warnings, or any issues and suggest fixes:\n\n${logs}`;

        try {
            navigator.clipboard.writeText(prompt).then(() => {
                showToast('Logs and prompt copied! Opening ChatGPT...');
                setTimeout(() => window.open('https://chatgpt.com/', '_blank'), 1500);
            }).catch(err => {
                console.error('Clipboard copy failed:', err);
                showToast('Failed to copy to clipboard. Please copy manually.', 'error');
            });
        } catch (err) {
            console.error('Clipboard API not supported:', err);
            // Fallback for older browsers or non-HTTPS
            const encodedPrompt = encodeURIComponent(prompt.substring(0, 1500) + '... (logs truncated)');
            window.open('https://chatgpt.com/?q=' + encodedPrompt, '_blank');
        }
    });
});

//Async functions to fetch data from the API

async function fetchLogs(namespace, podName, containerName) {
    try {
        const response = await fetch('/api/logs?namespace=' + namespace + '&pod=' + podName + '&container=' + containerName, {
            mode: 'cors',
            credentials: 'same-origin'
        });
        let data = await response.text();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = JSON.parse(data);
        return data.output;
    } catch (error) {
        console.error('Error fetching logs: ', error);
    }
}

async function fetchPods(namespace) {
    try {
        const response = await fetch('/api/listPods?namespace=' + namespace, {
            mode: 'cors',
            credentials: 'same-origin'
        });
        let data = await response.text();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = JSON.parse(data);
        return data.env;
    } catch (error) {
        console.error('Error listing pods: ', error);
    }
}

//Function to crawl the namespace url
async function fetchNamespaces() {
    try {
        const response = await fetch('/api/listNs', {
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || !data.env) {
            throw new Error('Invalid response format');
        }

        return data.env;
    } catch (error) {
        console.error('Error listing namespaces: ', error);
        throw error; // Re-throw to handle in the calling code
    }
}

async function fetchContainer(namespace, podName) {
    try {
        const response = await fetch('/api/lsCont?namespace=' + namespace + '&pod=' + podName, {
            mode: 'cors',
            credentials: 'same-origin'
        });
        let data = await response.text();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = JSON.parse(data);
        return data.env;
    } catch (error) {
        console.error('Error listing containers: ', error);
    }
}
