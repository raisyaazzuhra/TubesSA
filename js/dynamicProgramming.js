let daftarBarang = [];
let jumlahBarang = 0;

function tambahBarang() {
    const berat = document.getElementById('berat-barang').value;
    const profit = document.getElementById('profit-barang').value;

    if (berat && profit) {
        daftarBarang.push({ berat: parseInt(berat), profit: parseInt(profit) });
        jumlahBarang++;
        
        // UI
        const tbody = document.getElementById('items-body');
        const row = document.createElement('tr');
        row.innerHTML = `<td>${jumlahBarang}</td><td>${berat}</td><td>${profit}</td>`;
        tbody.appendChild(row);

        document.getElementById('berat-barang').value = '';
        document.getElementById('profit-barang').value = '';
    } else {
        alert('Masukkan berat dan profit barang dengan benar!');
    }
}

function dynamicProgrammingKnapsack() {
    const kapasitas = document.getElementById('kapasitas').value;
    if (!kapasitas) {
        alert('Masukkan kapasitas knapsack');
        return;
    }

    const n = daftarBarang.length; // jumlah barang pada daftar barang
    const W = parseInt(kapasitas); 
    const daftarSolusi = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= W; w++) {
            if (daftarBarang[i - 1].berat <= w) {
                daftarSolusi[i][w] = Math.max(daftarSolusi[i - 1][w], daftarSolusi[i - 1][w - daftarBarang[i - 1].berat] + daftarBarang[i - 1].profit);
            } else {
                daftarSolusi[i][w] = daftarSolusi[i - 1][w];
            }
        }
    }

    // Tracing solusi optimal barang yang akan diambil dari array daftarBarang 
    let w = W;
    let ambilBarang = []; // barang yang diambil
    for (let i = n; i > 0 && w > 0; i--) {
        if (daftarSolusi[i][w] !== daftarSolusi[i - 1][w]) {
            ambilBarang.push(i);  // Barang diambil, index berkurang 1
            w -= daftarBarang[i - 1].berat;
        }
    }

    document.getElementById('max-value').innerText = `Profit maksimal pada knapsack: ${daftarSolusi[n][W]}`;
    document.getElementById('items-taken').innerText = `Barang yang diambil: ${ambilBarang.reverse().join(', ')}`;

    // Menampilkan Dynamic Programming Tabel
    const dpTable = document.getElementById('dp-table');
    dpTable.innerHTML = '';

    // UI
    // Membuat header tabel
    let headerRow = '<tr><th></th>';
    for (let j = 0; j <= W; j++) {
        headerRow += `<th>${j}</th>`;
    }
    headerRow += '</tr>';
    dpTable.innerHTML += headerRow;

    // Membuat row tabel
    for (let i = 0; i <= n; i++) {
        let row = `<tr><th>${i}</th>`;
        for (let j = 0; j <= W; j++) {
            row += `<td>${daftarSolusi[i][j]}</td>`;
        }
        row += '</tr>';
        dpTable.innerHTML += row;
    }
}
