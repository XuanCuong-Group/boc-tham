let users = [];

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Parse Excel data, skipping the header row and unnecessary columns
            users = json.slice(2).map(row => ({
                id: row[1], // Mã nhân sự
                name: row[2], // Họ và tên
                position: row[3], // Chức danh
                department: row[4], // Bộ phận/ Phòng ban
                unit: row[5] // Đơn vị
            })).filter(user => user.id && user.name); // Filter valid rows

            document.getElementById('spinButton').classList.remove('hidden');
            document.getElementById('fileLabel').classList.add('hidden');
            document.getElementById('fileInput').classList.add('hidden');
        };
        reader.readAsArrayBuffer(file);
    }
});

const reel1 = document.getElementById('reel1').querySelector('.reel-content');
const spinButton = document.getElementById('spinButton');

const spinSlot = () => {
    if (users.length === 0) {
        alert('No more users to spin for!');
        return;
    }

    spinButton.disabled = true;
    spinButton.textContent = "Spinning...";

    // Clear existing reel content
    reel1.innerHTML = '';

    // Create a full reel of users
    const shuffledUsers = [...users, ...users].sort(() => Math.random() - 0.5);
    shuffledUsers.forEach(user => {
        const div = document.createElement('div');
        div.className = 'reel-item';
        div.textContent = user.name;
        reel1.appendChild(div);
    });

    // Start animation
    reel1.style.transform = 'translateY(0)';
    const spinDistance = Math.floor(Math.random() * users.length) * -80;
    reel1.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)';
    reel1.style.transform = `translateY(${spinDistance}px)`;

    // Select a winner after animation ends
    setTimeout(() => {
        const winnerIndex = Math.abs(spinDistance / 80) % users.length;
        const winner = users[winnerIndex];
        alert(`Winner: \nMã nhân sự: ${winner.id}\nHọ và tên: ${winner.name}\nChức danh: ${winner.position}\nBộ phận: ${winner.department}\nĐơn vị: ${winner.unit}`);

        // Remove winner from the list
        users.splice(winnerIndex, 1);

        spinButton.disabled = false;
        spinButton.textContent = "Spin";
    }, 2000);
};

spinButton.addEventListener('click', spinSlot);