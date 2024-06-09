let daftarBarang = [];

function tambahBarang() {
  const berat = parseInt(document.getElementById("berat-barang").value);
  const profit = parseInt(document.getElementById("profit-barang").value);
  if (isNaN(berat) || isNaN(profit)) {
    // Jika tidak memasukkan nilai berat dan profit barang
    alert("Masukkan berat barang dan profit barang yang valid!");
    return;
  }

  daftarBarang.push({ berat, profit });
  // UI
  const itemsBody = document.getElementById("items-body");
  const row = itemsBody.insertRow();
  row.insertCell(0).innerText = daftarBarang.length;
  row.insertCell(1).innerText = berat;
  row.insertCell(2).innerText = profit;

  document.getElementById("berat-barang").value = "";
  document.getElementById("profit-barang").value = "";
}

function exhaustiveSearchKnapsack() {
  const kapasitas = parseInt(document.getElementById("kapasitas").value);
  if (isNaN(kapasitas)) {
    alert("Masukkan kapasitas barang yang valid!");
    return;
  }

  let daftarSolusi = [];
  const n = daftarBarang.length; // Jumlah barang yang ada
  let solusiOptimal = null;

  // Menghasilkan semua kemungkinan kombinasi item
  for (let i = 0; i < 1 << n; i++) {
    // 1 << n artinya adalah menggeser bit 1 ke kiri sebanyak n kali
    let beratTotal = 0;
    let profitTotal = 0;
    let temp = []; // menyimpan pasangan solusi pada tiap iterasi ke-j

    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        beratTotal += daftarBarang[j].berat;
        profitTotal += daftarBarang[j].profit;
        temp.push(j + 1); // menyimpan pasangan solusi pada tiap iterasi dan memasukkan ke array temp dimulai dari index ke-1
      }
    }

    const solusiIterasi = { temp, beratTotal, profitTotal }; // menyimpan pasangan solusi pada tiap iterasi ke-i
    daftarSolusi.push(solusiIterasi);

    if (
      beratTotal <= kapasitas &&
      (!solusiOptimal || profitTotal > solusiOptimal.profitTotal)
    ) {
      solusiOptimal = solusiIterasi; // update solusi optimal
    }
  }

  // Urutkan hasil berdasarkan panjang solusiIterasi dan kemudian secara leksikografis
  daftarSolusi.sort((a, b) => {
    if (a.temp.length !== b.temp.length) {
      return a.temp.length - b.temp.length;
    }
    for (let i = 0; i < a.temp.length; i++) {
      if (a.temp[i] !== b.temp[i]) {
        return a.temp[i] - b.temp[i];
      }
    }
    return 0;
  });

  displayResults(daftarSolusi, kapasitas, solusiOptimal);
}

function displayResults(daftarSolusi, kapasitas, solusiOptimal) {
  // UI
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  const maxValueDiv = document.createElement("div");
  maxValueDiv.innerText = `Max Value: ${
    solusiOptimal ? solusiOptimal.profitTotal : 0
  }`;
  resultDiv.appendChild(maxValueDiv);

  const itemsTakenDiv = document.createElement("div");
  itemsTakenDiv.innerText = `Items Taken: ${
    solusiOptimal ? solusiOptimal.temp.join(", ") : "None"
  }`;
  resultDiv.appendChild(itemsTakenDiv);

  const resultHeader = document.createElement("h2");
  resultHeader.innerText = "Tabel Exhaustive Search:";
  resultDiv.appendChild(resultHeader);
  const resultsTable = document.createElement("table");
  resultsTable.classList.add("solution-table");
  const tableHeader = resultsTable.createTHead();
  const headerRow = tableHeader.insertRow();
  headerRow.insertCell(0).innerText = "Solusi #";
  headerRow.insertCell(1).innerText = "Daftar Barang";
  headerRow.insertCell(2).innerText = "Berat Total";
  headerRow.insertCell(3).innerText = "Profit Total";
  const tableBody = resultsTable.createTBody();

  daftarSolusi.forEach((hasil, index) => {
    const row = tableBody.insertRow();
    row.insertCell(0).innerText = index + 1;
    row.insertCell(1).innerText = hasil.temp.join(", ");
    row.insertCell(2).innerText = hasil.beratTotal;
    row.insertCell(3).innerText = hasil.profitTotal;

    if (hasil.beratTotal > kapasitas) {
      row.classList.add("over-capacity");
    } else if (hasil === solusiOptimal) {
      row.classList.add("optimal");
    }
  });

  resultDiv.appendChild(resultsTable);
}
