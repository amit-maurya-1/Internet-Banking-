//  Session Check 
function checkSession() {
  const user = sessionStorage.getItem('bankUser');
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return JSON.parse(user);
}

//  Demo User Data 
const DEMO_USER = {
  name: 'Amit Maurya',
  customerId: 'SBI2024167',
  accounts: [
    { type: 'Savings Account', number: '3489 XXXX XXXX 7821', fullNumber: '348900007821', balance: 100420085000.75, ifsc: 'SBIN0001234', branch: 'Bareilly Main Branch' },
    { type: 'Current Account', number: '5512 XXXX XXXX 3304', fullNumber: '551200003304', balance: 111138500.00, ifsc: 'SBIN0001234', branch: 'Bareilly Main Branch' }
  ]
};

//  Format Currency 
function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

//  Format Date 
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

//  Show Toast 
function showToast(title, msg, type = 'success') {
  const icons = { success: '✅', danger: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = document.querySelector('.toast-container') || (() => {
    const c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
  })();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '✅'}</span>
    <div class="toast-text">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

//  OTP Modal 
function showOTPModal(onSuccess, purpose = 'Transaction') {
  const overlay = document.getElementById('otpModal');
  if (!overlay) return;
  document.getElementById('otpPurpose').textContent = purpose;
  overlay.classList.add('show');
  const inputs = overlay.querySelectorAll('.otp-input');
  inputs.forEach((inp, i) => {
    inp.value = '';
    inp.addEventListener('input', () => {
      if (inp.value.length === 1 && inputs[i + 1]) inputs[i + 1].focus();
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !inp.value && inputs[i - 1]) inputs[i - 1].focus();
    });
  });
  inputs[0]?.focus();

  // Timer
  let timeLeft = 30;
  const timerEl = document.getElementById('otpTimer');
  const resendEl = document.getElementById('resendOtp');
  if (timerEl) timerEl.textContent = timeLeft;
  if (resendEl) resendEl.style.display = 'none';
  const interval = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(interval);
      if (timerEl) timerEl.parentElement.style.display = 'none';
      if (resendEl) resendEl.style.display = 'inline';
    }
  }, 1000);

  // Confirm button
  const confirmBtn = document.getElementById('otpConfirmBtn');
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      const otp = Array.from(inputs).map(i => i.value).join('');
      if (otp.length < 6) { showToast('Incomplete OTP', 'Please enter all 6 digits', 'warning'); return; }
      clearInterval(interval);
      overlay.classList.remove('show');
      onSuccess();
    };
  }

  // Close
  document.getElementById('closeOtpModal')?.addEventListener('click', () => {
    clearInterval(interval);
    overlay.classList.remove('show');
  });
}

//  Render Sidebar Active 
function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === page) item.classList.add('active');
  });
}

//  Mobile Sidebar Toggle 
function initSidebarToggle() {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

//  Transactions 
const TRANSACTIONS = [

  { id: 15, date: '2025-01-01', description: 'OnlyFans', type: 'debit', amount: 100000, category: 'OF', ref: 'OF20250101', balance: 100420085000.75 },
{ id: 2, date: '2025-01-14', description: 'Credit - RawTalk Ltd', type: 'credit', amount: 18590000, category: 'Inc', ref: 'INC202501141', balance: 100438675000.75 }, 
];

//  Beneficiaries 
function getBeneficiaries() {
  const stored = localStorage.getItem('beneficiaries');
  if (stored) return JSON.parse(stored);
  const defaults = [
    { id: 1, name: 'Omji Dubey', bank: 'HDFC Bank', account: '50100123456789', ifsc: 'HDFC0001234', type: 'NEFT' },
    { id: 2, name: ' Navneet Rajput', bank: 'ICICI Bank', account: '000605005678', ifsc: 'ICIC0000234', type: 'IMPS' },
    { id: 3, name: 'Prince', bank: 'Axis Bank', account: '912010034567', ifsc: 'UTIB0001234', type: 'NEFT' },
  ];
  localStorage.setItem('beneficiaries', JSON.stringify(defaults));
  return defaults;
}

function saveBeneficiaries(list) {
  localStorage.setItem('beneficiaries', JSON.stringify(list));
}

//  Logout 
function logout() {
  sessionStorage.removeItem('bankUser');
  window.location.href = 'index.html';
}

//  OTP HTML (shared modal) 
const OTP_MODAL_HTML = `
<div class="modal-overlay" id="otpModal">
  <div class="modal" style="width:380px">
    <div class="modal-header">
      <h3>🔐 OTP Verification</h3>
      <button class="modal-close" id="closeOtpModal">&times;</button>
    </div>
    <div class="modal-body" style="text-align:center">
      <p style="color:var(--text-muted);font-size:13px;margin-bottom:6px">OTP sent to your registered mobile</p>
      <p style="font-size:13px;font-weight:600;color:var(--primary);margin-bottom:16px">Purpose: <span id="otpPurpose">Transaction</span></p>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:4px">Demo OTP: <strong>123456</strong></p>
      <div class="otp-inputs">
        <input type="text" maxlength="1" class="otp-input" />
        <input type="text" maxlength="1" class="otp-input" />
        <input type="text" maxlength="1" class="otp-input" />
        <input type="text" maxlength="1" class="otp-input" />
        <input type="text" maxlength="1" class="otp-input" />
        <input type="text" maxlength="1" class="otp-input" />
      </div>
      <p style="font-size:12px;color:var(--text-muted)">Resend OTP in <span id="otpTimer">30</span>s</p>
      <p id="resendOtp" style="display:none;font-size:13px;color:var(--primary);cursor:pointer;font-weight:500">Resend OTP</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" id="closeOtpModal2" onclick="document.getElementById('otpModal').classList.remove('show')">Cancel</button>
      <button class="btn btn-primary" id="otpConfirmBtn">Verify & Confirm</button>
    </div>
  </div>
</div>`;
