
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
                    showPodLogs(namespace, pod.metadata.name);
                    currentPod.textContent = pod.metadata.name;
                });

                podList.appendChild(podElement);
            })
        }).catch(error => {
            logsContent.textContent = "No pods/logs found or you don't have access to the namespace";
        });
    }

    function showPodLogs(namespace, podName) {
        const pod = fetchLogs(namespace, podName);

        pod.then(data => {
            // console.log("Log data updated!");
            logsContent.textContent = data;
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

function fetchLogs(namespace, podName) {
    return fetch('http://localhost:8081/api/logs')
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

function fetchEnv() {
    fetch('/api/env')
        .then(response => response.json())
        .then(data => {
            console.log('Environment:', data);
        })
        .catch(error => {
            console.error('Error fetching environment:', error);
        });
}

function fetchStatus() {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            console.log('Status:', data);
        })
        .catch(error => {
            console.error('Error fetching status:', error);
        });
}

function sayHello() {
    fetch('/')
        .then(response => response.text())
        .then(data => {
            console.log('Hello:', data);
        })
        .catch(error => {
            console.error('Error saying hello:', error);
        });
}

function updateNamespace(namespace) {
        
    fetch('/api/updateNs', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ namespace })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Namespace update response:', data);
    })
    .catch(error => {
        console.error('Error updating namespace:', error);
    });
}