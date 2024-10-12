//Simple hello output
async function fetchData() {
  try {
      const response = await fetch('http://localhost:8080/');
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      document.getElementById('result').textContent = JSON.stringify(data);
  } catch (error) {
      console.error('Fetch error: ', error);
  }
}

//Fetches the namespaces data
async function fetchNsData() {
  try {
      // const response = await fetch('http://localhost:8080/api/listNs');

      // if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const jsonData = await response.json();

      //=====Test data for local testing=====
      const jsonData = await fetch('../data/ns.txt').then(response => response.json());

      // Decode the JSON data from the "env" field and extract names
      const namespaces = JSON.parse(jsonData.env);
      const names = namespaces.items.map(ns => ns.metadata.name);

      console.log(namespaces);
      // Display the names in the 'namespace' element
      document.getElementById('ns').textContent = JSON.stringify(names.join(', '));
  } catch (error) {
      console.error('Fetch error: ', error);
  }
}

//Fetches the pods data
async function fetchPodsData() {
  try {
      // const response = await fetch('http://localhost:8080/api/listPods');

      // if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const jsonData = await response.json();

      //=====Test data for local testing=====
      const jsonData = await fetch('../data/pods.txt').then(response => response.json());

      // Decode the JSON data from the "env" field and extract names
      const pods = JSON.parse(jsonData.env);
      const names = pods.items.map(pod => pod.metadata.name);

      console.log(pods);
      // Display the names in the 'pods' element
      document.getElementById('pods').textContent = JSON.stringify(names.join(', '));

  } catch (error) {
      console.error('Fetch error: ', error);
  }
}

fetchData();
fetchNsData();
fetchPodsData();