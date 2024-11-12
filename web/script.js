document.addEventListener('DOMContentLoaded', function () {
    const namespaceSelect = document.getElementById('namespaceSelect');
    const podList = document.getElementById('podList');
    const logsContent = document.getElementById('logsContent');
    const currentNamespace = document.getElementById('currentNamespace');
    const currentPod = document.getElementById('currentPod');
    const refreshButton = document.getElementById('refreshButton');
    let refreshNs, refreshPod = '';

    //Fetching Namespaces and processing them for options
    let namespaceData = fetchNamespaces();
    namespaceData.then(data => {
        data = JSON.parse(data);

        for (let ns of data.items) {
            // console.log(ns);
            let option = document.createElement('option');
            option.value = ns.metadata.name;
            option.text = ns.metadata.name;
            namespaceSelect.appendChild(option);
        }
    });

    function updatePodList(namespace) {
        podList.innerHTML = '';
        if (!namespace) return;

        let podsData = fetchPods(namespace);
        podsData.then(data => {
            data = JSON.parse(data);
            // console.log(data);

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
        container = fetchContainer(namespace, podName);
        container.then(data => {
            data = JSON.parse(data);
            containerName = data[0];
            console.log("Using container " + containerName);
            const pod = fetchLogs(namespace, podName, containerName);
            pod.then(data => {
                logsContent.textContent = data;
                refreshNs = namespace;
                refreshPod = podName;
            })
        })
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
});

//Async functions to fetch data from the API

async function fetchLogs(namespace, podName, containerName) {
    try {
        const response = await fetch('http://localhost:8080/api/logs?namespace=' + namespace + '&pod=' + podName + '&container=' + containerName);
        let data = await response.text();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = JSON.parse(data);
        return data.output;
    } catch (error) {
        console.error('Error listing namespaces: ', error);
    }
}

async function fetchPods(namespace) {
    try {
        const response = await fetch('http://localhost:8080/api/listPods?namespace=' + namespace);
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
        const response = await fetch('http://localhost:8080/api/listNs');
        let data = await response.text();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = JSON.parse(data);
        return data.env;
    } catch (error) {
        console.error('Error listing namespaces: ', error);
    }
}

async function fetchContainer(namespace, podName) {
    try {
        const response = await fetch('http://localhost:8080/api/lsCont?namespace=' + namespace + '&pod=' + podName);
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
