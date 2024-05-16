// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBTnhNy8O2XjqImCBVZ0ba0ei6m25VkFiU",
    authDomain: "medical-kj.firebaseapp.com",
    databaseURL: "https://medical-kj-default-rtdb.firebaseio.com",
    projectId: "medical-kj",
    storageBucket: "medical-kj.appspot.com",
    messagingSenderId: "455132448223",
    appId: "1:455132448223:web:ed407d7beaf64c88d2706a",
    measurementId: "G-Z143CG0RHK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

function saveSales() {
    const amount = document.getElementById('amount').value;
    const item = document.getElementById('item').value;

    // Save the transaction to Firebase
    database.ref('sales').push({
        amount: amount,
        item: item,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

function getDailyReport() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const dailyReportDiv = document.getElementById('report');
    dailyReportDiv.innerHTML = ''; // Clear previous report

    // Query Firebase for transactions within the current day
    database.ref('sales')
        .orderByChild('timestamp')
        .startAt(startOfDay.getTime())
        .endAt(endOfDay.getTime())
        .once('value')
        .then(snapshot => {
            let totalSales = 0;

            snapshot.forEach(childSnapshot => {
                const transaction = childSnapshot.val();
                totalSales += parseFloat(transaction.amount);

                // You can customize how you want to display each transaction
                dailyReportDiv.innerHTML += `<p>${transaction.item}: $${transaction.amount}</p>`;
            });

            // Display the total sales amount
            dailyReportDiv.innerHTML += `<p>Total Sales: $${totalSales.toFixed(2)}</p>`;
        })
        .catch(error => {
            console.error('Error fetching daily report:', error);
        });
}

function getMonthlyReport() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    const monthlyReportDiv = document.getElementById('report');
    monthlyReportDiv.innerHTML = ''; // Clear previous report

    // Query Firebase for transactions within the current month
    database.ref('sales')
        .orderByChild('timestamp')
        .startAt(startOfMonth.getTime())
        .endAt(endOfMonth.getTime())
        .once('value')
        .then(snapshot => {
            let totalSales = 0;

            snapshot.forEach(childSnapshot => {
                const transaction = childSnapshot.val();
                totalSales += parseFloat(transaction.amount);

                // You can customize how you want to display each transaction
                monthlyReportDiv.innerHTML += `<p>${transaction.item}: $${transaction.amount}</p>`;
            });

            // Display the total sales amount
            monthlyReportDiv.innerHTML += `<p>Total Sales: $${totalSales.toFixed(2)}</p>`;
        })
        .catch(error => {
            console.error('Error fetching monthly report:', error);
        });
}

// Existing code

function openItemSearchPopup() {
    const itemSearchPopup = document.getElementById('itemSearchPopup');
    itemSearchPopup.style.display = 'block';

    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // Clear previous list

    // Query Firebase for items
    database.ref('items')
        .once('value')
        .then(snapshot => {
            snapshot.forEach(childSnapshot => {
                const item = childSnapshot.val();
                const listItem = document.createElement('li');
                listItem.textContent = item.name; // Replace 'name' with the actual property name in your items
                listItem.onclick = () => {
                    document.getElementById('item').value = item.name;
                    closeItemSearchPopup();
                };
                itemList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });
}

function closeItemSearchPopup() {
    document.getElementById('itemSearchPopup').style.display = 'none';
}
