// ================= TAB NAVIGATION =================
function switchTab(tabId) {
    // Cập nhật trạng thái nút điều hướng
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Hiển thị nội dung tab tương ứng
    document.querySelectorAll('.tab-view').forEach(view => {
        view.classList.toggle('active', view.id === `tab-${tabId}`);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= MODULE 1: BED CƠ BẢN =================
function setBasicPreset(n, d, ab) {
    document.getElementById('basic-n').value = n;
    document.getElementById('basic-d').value = d;
    document.getElementById('basic-ab').value = ab;
    calcBasic();
}

function calcBasic() {
    const n = parseFloat(document.getElementById('basic-n').value) || 0;
    const d = parseFloat(document.getElementById('basic-d').value) || 0;
    const ab = parseFloat(document.getElementById('basic-ab').value) || 1;

    const totalD = n * d;
    const re = 1 + (d / ab);
    const bed = totalD * re;
    const eqd2 = bed / (1 + (2 / ab));

    document.getElementById('res-basic-bed').innerHTML =
        `${bed.toFixed(2)} <span class="res-unit">Gy<sub>${ab}</sub></span>`;
    document.getElementById('res-basic-total').textContent = `${totalD.toFixed(2)} Gy`;
    document.getElementById('res-basic-eqd2').textContent = `${eqd2.toFixed(2)} Gy`;

    document.getElementById('res-basic-step').textContent =
        `BED = ${n} × ${d} × (1 + ${d} / ${ab}) = ${bed.toFixed(2)} Gy`;
    document.getElementById('res-basic-note').textContent =
        `Hệ số hiệu quả tương đối RE = 1 + d/(α/β) = ${re.toFixed(3)}. Tương đương ${eqd2.toFixed(2)} Gy nếu chiếu ở phân liều chuẩn 2 Gy/buổi.`;
}

// ================= MODULE 2: BED TÁI SINH =================
function setRepopPreset(n, d, ab, T, Tk, K) {
    document.getElementById('rep-n').value = n;
    document.getElementById('rep-d').value = d;
    document.getElementById('rep-ab').value = ab;
    document.getElementById('rep-T').value = T;
    document.getElementById('rep-Tk').value = Tk;
    document.getElementById('rep-K').value = K;
    calcRepop();
}

function calcRepop() {
    const n = parseFloat(document.getElementById('rep-n').value) || 0;
    const d = parseFloat(document.getElementById('rep-d').value) || 0;
    const ab = parseFloat(document.getElementById('rep-ab').value) || 1;
    const T = parseFloat(document.getElementById('rep-T').value) || 0;
    const Tk = parseFloat(document.getElementById('rep-Tk').value) || 0;
    const K = parseFloat(document.getElementById('rep-K').value) || 0;

    const grossBed = n * d * (1 + d / ab);
    const repopDays = Math.max(0, T - Tk);
    const loss = K * repopDays;
    const netBed = Math.max(0, grossBed - loss);
    const netEqd2 = netBed / (1 + 2 / ab);

    document.getElementById('res-rep-net').textContent = netBed.toFixed(2);
    document.getElementById('res-rep-gross').textContent = `${grossBed.toFixed(2)} Gy`;
    document.getElementById('res-rep-loss').textContent = `-${loss.toFixed(2)} Gy`;

    if (T > Tk) {
        document.getElementById('res-rep-step').textContent =
            `BED_net = ${grossBed.toFixed(2)} − ${K} × (${T} − ${Tk}) = ${netBed.toFixed(2)} Gy`;
        document.getElementById('res-rep-note').textContent =
            `Tế bào tăng tốc tái sinh trong ${repopDays} ngày (sau ngày thứ ${Tk}), làm hao hụt ${loss.toFixed(2)} Gy BED. EQD2 thực tế còn ${netEqd2.toFixed(2)} Gy.`;
    } else {
        document.getElementById('res-rep-step').textContent =
            `Vì T (${T} ngày) ≤ Tk (${Tk} ngày) → Chưa khởi phát tái sinh nhanh: BED = ${grossBed.toFixed(2)} Gy`;
        document.getElementById('res-rep-note').textContent =
            `Phác đồ hoàn tất trước thời điểm khởi phát tái sinh tăng tốc nên không bị tổn thất BED.`;
    }
}

// ================= MODULE 3: CHUYỂN ĐỔI PHÁC ĐỒ =================
function toggleConvertMode() {
    const mode = document.getElementById('conv-mode').value;
    document.getElementById('conv-input-n2-wrap').style.display = mode === 'by-n' ? 'block' : 'none';
    document.getElementById('conv-input-d2-wrap').style.display = mode === 'by-d' ? 'block' : 'none';
    calcConvert();
}

function calcConvert() {
    const n1 = parseFloat(document.getElementById('conv-n1').value) || 1;
    const d1 = parseFloat(document.getElementById('conv-d1').value) || 0;
    const abu = parseFloat(document.getElementById('conv-abu').value) || 10;
    const abl = parseFloat(document.getElementById('conv-abl').value) || 3;
    const mode = document.getElementById('conv-mode').value;

    const bedU1 = n1 * d1 * (1 + d1 / abu);
    const bedL1 = n1 * d1 * (1 + d1 / abl);
    const eqd2L1 = bedL1 / (1 + 2 / abl);

    let n2 = 0, d2 = 0;

    if (mode === 'by-n') {
        n2 = parseFloat(document.getElementById('conv-n2').value) || 1;
        const c = (bedU1 * abu) / n2;
        d2 = (-abu + Math.sqrt(abu * abu + 4 * c)) / 2;
    } else {
        d2 = parseFloat(document.getElementById('conv-d2').value) || 0.1;
        n2 = bedU1 / (d2 * (1 + d2 / abu));
    }

    const bedU2 = n2 * d2 * (1 + d2 / abu);
    const bedL2 = n2 * d2 * (1 + d2 / abl);
    const eqd2L2 = bedL2 / (1 + 2 / abl);
    const diffL = bedL2 - bedL1;

    document.getElementById('res-conv-scheme').textContent = `${n2.toFixed(1).replace('.0', '')} buổi × ${d2.toFixed(2)} Gy`;
    document.getElementById('res-conv-total').textContent = `${(n2 * d2).toFixed(2)} Gy`;
    document.getElementById('res-conv-bedu').textContent = `${bedU2.toFixed(2)} Gy`;

    document.getElementById('tbl-abu').textContent = abu;
    document.getElementById('tbl-abl').textContent = abl;
    document.getElementById('tbl-bedu1').textContent = `${bedU1.toFixed(2)} Gy`;
    document.getElementById('tbl-bedu2').textContent = `${bedU2.toFixed(2)} Gy`;
    document.getElementById('tbl-bedl1').textContent = `${bedL1.toFixed(2)} Gy`;
    document.getElementById('tbl-bedl2').textContent = `${bedL2.toFixed(2)} Gy`;
    document.getElementById('tbl-eqd2l1').textContent = `${eqd2L1.toFixed(2)} Gy`;
    document.getElementById('tbl-eqd2l2').textContent = `${eqd2L2.toFixed(2)} Gy`;

    const alertBox = document.getElementById('res-conv-alert');
    if (diffL > 0.5) {
        alertBox.className = 'info-banner warn';
        alertBox.textContent = `Lưu ý lâm sàng: Phác đồ mới có liều/buổi lớn hơn nên làm tăng BED mô lành thêm +${diffL.toFixed(2)} Gy (tăng ${((diffL / bedL1) * 100).toFixed(1)}%). Cần đánh giá kỹ giới hạn chịu đựng mô lành.`;
    } else if (diffL < -0.5) {
        alertBox.className = 'info-banner';
        alertBox.textContent = `Tín hiệu tốt: Phác đồ mới giảm phân liều nhỏ hơn giúp giảm BED mô lành đi ${Math.abs(diffL).toFixed(2)} Gy trong khi vẫn giữ nguyên hiệu quả kiểm soát u.`;
    } else {
        alertBox.className = 'info-banner';
        alertBox.textContent = `Hai phác đồ tương đương sinh học cả trên khối u lẫn mô lành.`;
    }
}

// ================= MODULE 4: SỬA SAI PHÂN LIỀU =================
function calcErrorFix() {
    const nPlan = parseFloat(document.getElementById('err-nplan').value) || 1;
    const dPlan = parseFloat(document.getElementById('err-dplan').value) || 0;
    const nErr = parseFloat(document.getElementById('err-nerr').value) || 0;
    const dErr = parseFloat(document.getElementById('err-derr').value) || 0;
    const nRem = parseFloat(document.getElementById('err-nrem').value) || 1;
    const ab = parseFloat(document.getElementById('err-ab').value) || 10;

    const bedTarget = nPlan * dPlan * (1 + dPlan / ab);
    const bedDeliv = nErr * dErr * (1 + dErr / ab);
    const bedRem = bedTarget - bedDeliv;

    document.getElementById('res-err-nrem-lbl').textContent = nRem;
    document.getElementById('res-err-bedtarget').textContent = `${bedTarget.toFixed(2)} Gy`;
    document.getElementById('res-err-beddeliv').textContent = `${bedDeliv.toFixed(2)} Gy`;

    const alertBox = document.getElementById('res-err-alert');

    if (bedRem <= 0) {
        document.getElementById('res-err-dnew').textContent = '0.00';
        document.getElementById('res-err-step').innerHTML =
            `BED đã nhận (${bedDeliv.toFixed(2)} Gy) ≥ BED mục tiêu (${bedTarget.toFixed(2)} Gy) → Đã vượt ngưỡng kế hoạch.`;
        alertBox.className = 'info-banner warn';
        alertBox.textContent = `Cảnh báo nghiêm trọng: Liều đã chiếu vượt quá toàn bộ BED mục tiêu ban đầu (+${Math.abs(bedRem).toFixed(2)} Gy). Cần hội chẩn ngưng chiếu ngay.`;
        return;
    }

    const c = (bedRem * ab) / nRem;
    const dNew = (-ab + Math.sqrt(ab * ab + 4 * c)) / 2;

    document.getElementById('res-err-dnew').textContent = dNew.toFixed(2);
    document.getElementById('res-err-step').innerHTML =
        `BED còn thiếu = ${bedTarget.toFixed(2)} − ${bedDeliv.toFixed(2)} = ${bedRem.toFixed(2)} Gy<br>` +
        `Giải phương trình bậc 2 cho ${nRem} buổi còn lại → d_new = ${dNew.toFixed(2)} Gy/buổi`;

    if (dNew > dPlan) {
        alertBox.className = 'info-banner warn';
        alertBox.textContent = `Do chiếu thiếu liều ở ${nErr} buổi đầu, cần nâng liều lên ${dNew.toFixed(2)} Gy/buổi trong ${nRem} buổi còn lại để bù đủ BED mục tiêu.`;
    } else {
        alertBox.className = 'info-banner';
        alertBox.textContent = `Do đã chiếu dư liều ở ${nErr} buổi đầu, cần giảm liều xuống ${dNew.toFixed(2)} Gy/buổi trong ${nRem} buổi còn lại để tránh quá liều.`;
    }
}

// Khởi chạy tính toán mặc định khi tải trang
window.addEventListener('DOMContentLoaded', () => {
    calcBasic();
    calcRepop();
    calcConvert();
    calcErrorFix();
});
