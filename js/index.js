let users = [];
const prizeData = {
    special1: 1,
    firstPrize: 1,
    secondPrize: 1,
    thirdPrize: 3,
    phu_quy: 2,
    phat_loc: 3,
    phat_tai: 3,
    cat_tuong: 3,
    nhu_y: 4
};

let currentPrize = "Đặc biệt";
let remainingSpins = 1;
let currentPrizeReward = "iPhone 16 Pro Max 256GB";

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

            users = json.slice(2).map(row => ({
                id: row[1],
                name: row[2] || '',
                position: row[3] || '',
                department: row[4] || '',
                unit: row[5] || ''
            })).filter(user => user.id && user.name);

            document.getElementById('spinButton').classList.remove('hidden');
            document.getElementById('fileLabel').classList.add('hidden');
            document.getElementById('fileInput').classList.add('hidden');
        };
        reader.readAsArrayBuffer(file);
    }
});

const reel1 = document.getElementById('reel1').querySelector('.reel-content');
const spinButton = document.getElementById('spinButton');
const prizeSelect = document.getElementById('prizeSelect');
const winnerModal = document.getElementById('winnerModal');
const winnerDetails = document.getElementById('winnerDetails');
const closeModal = document.getElementById('closeModal');
const main = document.getElementById('main');

prizeSelect.addEventListener('change', (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const prizeKey = selectedOption.value;
    currentPrize = selectedOption.text.split(' - ')[0].split(' (')[0];
    remainingSpins = prizeData[prizeKey];
    currentPrizeReward = selectedOption.getAttribute('data-prize');
    spinButton.textContent = remainingSpins > 0 ? currentPrize : `${currentPrize} đã hết`;
    spinButton.disabled = remainingSpins <= 0;
});

const spinSlot = () => {
    if (remainingSpins <= 0) {
        alert(`Hết lượt cho ${currentPrize}!`);
        return;
    }

    if (users.length === 0) {
        alert('No more users to spin for!');
        return;
    }

    spinButton.disabled = true;

    reel1.innerHTML = ''; // Xóa nội dung hiện tại

    // Tạo danh sách đầy đủ mã người dùng để quay
    const fullReel = Array(20).fill(users).flat();
    fullReel.forEach(user => {
        const div = document.createElement('div');
        div.className = 'reel-item';
        div.textContent = user.id;
        reel1.appendChild(div);
    });

    // Đặt vị trí ban đầu của cuộn
    reel1.style.transition = 'none';
    reel1.style.transform = 'translateY(0)';

    setTimeout(() => {
        const totalItems = fullReel.length;
        const winnerIndex = Math.floor(Math.random() * users.length); // Chọn người chiến thắng ngẫu nhiên
        const spinDistance = (totalItems - users.length + winnerIndex) * -80; // Khoảng cách cuộn

        // Bắt đầu quay
        reel1.style.transition = 'transform 4s cubic-bezier(0.25, 1, 0.5, 1)';
        reel1.style.transform = `translateY(${spinDistance}px)`;

        setTimeout(() => {
            // Khi cuộn kết thúc, hiển thị duy nhất mã của người chiến thắng
            const winner = users[winnerIndex];

            // Xóa tất cả nội dung và chỉ hiển thị mã người thắng
            reel1.innerHTML = '';
            const winnerDiv = document.createElement('div');
            winnerDiv.className = 'reel-item';
            winnerDiv.textContent = winner.id;
            reel1.appendChild(winnerDiv);

            // Hiển thị thông tin người thắng
            winnerDetails.innerHTML = `
                <p>Mã nhân sự: ${winner.id}</p>
                <p>Họ và tên: ${winner.name}</p>
                <p>Chức danh: ${winner.position}</p>
                <p>Bộ phận: ${winner.department}</p>
                <p>Đơn vị: ${winner.unit}</p>
                <p>Phần thưởng: ${currentPrizeReward}</p>
            `;
            winnerModal.classList.remove('hidden');
            main.classList.add('hidden');
            // Loại người thắng khỏi danh sách
            users = users.filter(user => user.id !== winner.id);

            // Cập nhật số lượt còn lại
            remainingSpins -= 1;
            prizeData[prizeSelect.value] = remainingSpins;
            spinButton.textContent = remainingSpins > 0 ? currentPrize : `${currentPrize} đã hết`;
            spinButton.disabled = remainingSpins <= 0;
        }, 4000); // Thời gian khớp với animation quay
    }, 50);
};


spinButton.addEventListener('click', spinSlot);
closeModal.addEventListener('click', () => {
    winnerModal.classList.add('hidden');
    main.classList.remove('hidden');
});
