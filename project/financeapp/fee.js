 let transactions = JSON.parse(localStorage.getItem('fee_data')) || [];

        function saveTransaction() {
            const index = document.getElementById('editIndex').value;
            const data = {
                date: document.getElementById('date').value || new Date().toISOString().split('T')[0],
                name: document.getElementById('giverName').value,
                amount: parseFloat(document.getElementById('amount').value) || 0,
                purpose: document.getElementById('purpose').value,
                receiver: document.getElementById('receiver').value,
                submitted: document.getElementById('submittedTo').value
            };

            if (!data.name || !data.amount) return alert("Please fill Payer Name and Amount");

            if (index === "-1") {
                transactions.push(data);
            } else {
                transactions[index] = data;
                document.getElementById('editIndex').value = "-1";
                document.getElementById('saveBtn').innerText = "Save Entry";
            }

            localStorage.setItem('fee_data', JSON.stringify(transactions));
            clearForm();
            render();
        }

        function render() {
    const body = document.getElementById('tableBody');
    body.innerHTML = '';
    let total = 0, submitted = 0;

    // Sort by latest date first
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    transactions.forEach((item, index) => {

        total += item.amount;
        if (item.submitted !== "Not Yet") submitted += item.amount;

        // Format date (DD Month YYYY)
        const formattedDate = new Date(item.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        body.innerHTML += `
            <tr>
                <td>${formattedDate}</td>
                <td title="${item.name}">${item.name}</td>
                <td>₹${item.amount}</td>
                <td title="${item.purpose}">${item.purpose}</td>
                <td>${item.receiver}</td>
                <td style="font-weight:bold; color:${item.submitted === 'Not Yet' ? 'red' : 'green'}">
                    ${item.submitted}
                </td>
                <td class="action-btns">
                    <button class="btn-edit" title="Edit" onclick="editEntry(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" title="Delete" onclick="deleteEntry(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById('totalCollected').innerText = `₹${total}`;
    document.getElementById('totalSubmitted').innerText = `₹${submitted}`;
    document.getElementById('pendingAmount').innerText = `₹${total - submitted}`;
        }

        function deleteEntry(index) {
            if (confirm("Delete this record permanently?")) {
                transactions.splice(index, 1);
                localStorage.setItem('fee_data', JSON.stringify(transactions));
                render();
            }
        }

        function editEntry(index) {
            const item = transactions[index];
            document.getElementById('date').value = item.date;
            document.getElementById('giverName').value = item.name;
            document.getElementById('amount').value = item.amount;
            document.getElementById('purpose').value = item.purpose;
            document.getElementById('receiver').value = item.receiver;
            document.getElementById('submittedTo').value = item.submitted;

            document.getElementById('editIndex').value = index;
            document.getElementById('saveBtn').innerText = "Update Entry";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function clearForm() {
            document.querySelectorAll('.input-group input').forEach(i => {
                if (i.type !== 'hidden') i.value = '';
            });
            document.getElementById('submittedTo').value = 'Not Yet';
            document.getElementById('editIndex').value = "-1";
        }

        // Initial Load

        render();
