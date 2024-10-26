
document.addEventListener('DOMContentLoaded', function () {
    const namespaceSelect = document.getElementById('namespaceSelect');
    const podList = document.getElementById('podList');
    const logsContent = document.getElementById('logsContent');
    const currentNamespace = document.getElementById('currentNamespace');
    const currentPod = document.getElementById('currentPod');

    //Fetching Namespaces and processing them for options
    let namespaces = fetchNamespaces();
    namespaces.then(data => {
        data = JSON.parse(data);
        
        for (let ns of data.items.metadata.name) {
            let option = document.createElement('option');
            option.value = ns;
            option.text = ns;
            namespaceSelect.appendChild(option);
        }
    });

    
});

function fetchLogs() {
    fetch('/api/logs')
        .then(response => response.json())
        .then(data => {
            console.log('Logs:', data);
        })
        .catch(error => {
            console.error('Error fetching logs:', error);
        });
}

function listPods() {
    fetch('/api/listPods')
        .then(response => response.json())
        .then(data => {
            console.log('Pods:', data);
        })
        .catch(error => {
            console.error('Error listing pods:', error);
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
            // console.log(data.env);
            data = data.env;
            return data; // Return the modified data
        })
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