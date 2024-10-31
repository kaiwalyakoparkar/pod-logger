
document.addEventListener('DOMContentLoaded', function () {
    const namespaceSelect = document.getElementById('namespaceSelect');
    const podList = document.getElementById('podList');
    const logsContent = document.getElementById('logsContent');
    const currentNamespace = document.getElementById('currentNamespace');
    const currentPod = document.getElementById('currentPod');
    const refreshButton = document.getElementById('refreshButton');

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
            console.log(data);
            
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
            console.log("Using container " +data);
            containerName = JSON.parse(data);

            const pod = fetchLogs(namespace, podName, containerName[0]);
            pod.then(data => {
                logsContent.textContent = data;
            })
        })

    }

    //Fetching pods after receieving selected namespace
    namespaceSelect.addEventListener('change', (e) => {
        const selectedNamespace = e.target.value;
        console.log(selectedNamespace)//testing OK
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
        showPodLogs()
    });
});

function fetchLogs(namespace, podName, containerName) {
    return fetch('http://localhost:8081/api/logs?namespace=' + namespace + '&pod=' + podName+ '&container='+ containerName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Parse the JSON directly
        })
        .then(data => {
            data = JSON.parse(data);
            data = data.output;
            return data; 
        })
        .catch(error => {
            console.error('Error listing namespaces: ', error);
        });
}

function fetchPods(namespace) {
    return fetch('http://localhost:8081/api/listPods?namespace=' + namespace)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Parse the JSON directly
        })
        .then(data => {
            data = JSON.parse(data);
            // console.log(data.env);
            data = data.env;
            // console.log(data.env)
            return data;
        })
        .catch(error => {
            console.error('Error listing pods: ', error);
        });
}

//Function to crawl the namespace url
function fetchNamespaces() {
    return fetch('http://localhost:8081/api/listNs') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Parse the JSON directly
        })
        .then(data => {
            data = JSON.parse(data);
            data = data.env;
            return data; 
        })
        .catch(error => {
            console.error('Error listing namespaces: ', error);
        });
}

function fetchContainer(namespace, podName) {
    return fetch('http://localhost:8081/api/lsCont?namespace=' + namespace + '&pod=' + podName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Parse the JSON directly
        })
        .then(data => {
            data = JSON.parse(data);
            data = data.env;
            return data;
        })
        .catch(error => {
            console.error('Error listing containers: ', error);
        });
}