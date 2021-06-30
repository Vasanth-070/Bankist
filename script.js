'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Vasanth Gentela',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Kishor Beeravalli',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Billa Neeraj Kumar',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Shashank Vinapadkal',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const errorbox = document.querySelector('.invalid');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUserNames = function (accs) {
  accs.forEach(function (singleAccount) {
    singleAccount.UserName = singleAccount.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUserNames(accounts);
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">Rs.${mov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => cur + acc, 0);
  labelBalance.textContent = `Rs.${acc.balance}`;
};
const displaySummary = function (acc) {
  const deposits = acc.movements
    .filter(mov => mov > 0)
    .reduce((cur, mov) => cur + mov, 0);
  labelSumIn.textContent = `Rs.${deposits}`;
  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((cur, mov) => cur + mov, 0);
  labelSumOut.textContent = `Rs.${Math.abs(withdrawal)}`;
  const interest = acc.movements
    .filter(mov => mov > 1)
    .map(mov => (acc.interestRate / 100) * mov)
    .filter(mov => mov > 1)
    .reduce((cur, int) => cur + int, 0);
  labelSumInterest.textContent = `Rs.${interest}`;
};
const updateUI = function (acc) {
  displayMovements(acc.movements);
  displayBalance(acc);
  displaySummary(acc);
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.UserName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    errorbox.classList.add('conceal');
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
  } else {
    errorbox.classList.remove('conceal');
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = 'Invalid Credentials';
  }
  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const reciever = inputTransferTo.value;
    const recieverAcc = accounts.find(acc => acc.UserName === reciever);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
    console.log(amount, recieverAcc, reciever);
    if (
      amount > 0 &&
      amount <= currentAccount.balance &&
      recieverAcc &&
      recieverAcc?.UserName !== currentAccount.UserName
    ) {
      currentAccount.movements.push(-amount);
      recieverAcc.movements.push(amount);
      updateUI(currentAccount);
    }
  });
  btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    if (
      inputCloseUsername.value === currentAccount.UserName &&
      Number(inputClosePin.value) === currentAccount.pin
    ) {
      inputCloseUsername.value = inputClosePin.value = '';
      inputClosePin.blur();
      const index = accounts.findIndex(
        acc => acc.UserName === currentAccount.UserName
      );
      accounts.splice(index, 1);
      console.log(accounts);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
  });
  btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    inputLoanAmount.blur();
    if (
      amount > 0 &&
      currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
      currentAccount.movements.push(amount);
      updateUI(currentAccount);
    }
  });
  let sorted = false;
  btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
  });
  labelBalance.addEventListener('click', function () {
    const movements = Array.from(
      document.querySelectorAll('.movements__value'),
      el => Number(el.textContent.replace('Rs.', ''))
    );
    console.log(movements);
  });
});
