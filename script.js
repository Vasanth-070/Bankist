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
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-04-30T17:01:17.194Z',
    '2021-05-01T20:36:17.929Z',
    '2021-05-02T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Kishor Beeravalli',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2021-01-01T13:15:33.035Z',
    '2021-01-30T09:48:16.867Z',
    '2021-02-25T06:04:23.907Z',
    '2021-02-25T14:18:46.235Z',
    '2021-03-05T16:33:06.386Z',
    '2021-04-30T14:43:26.374Z',
    '2021-05-01T18:49:59.371Z',
    '2021-05-02T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
};

const account3 = {
  owner: 'Billa Neeraj Kumar',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2021-01-01T13:15:33.035Z',
    '2021-01-30T09:48:16.867Z',
    '2021-02-25T06:04:23.907Z',
    '2021-02-25T14:18:46.235Z',
    '2021-03-05T16:33:06.386Z',
    '2021-04-30T14:43:26.374Z',
    '2021-05-01T18:49:59.371Z',
    '2021-05-02T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
};

const account4 = {
  owner: 'Shashank Vinapadkal',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-04-30T17:01:17.194Z',
    '2021-05-01T20:36:17.929Z',
    '2021-05-02T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

let currentAccount, timer;
const createUserNames = function (accs) {
  accs.forEach(function (singleAccount) {
    singleAccount.UserName = singleAccount.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

const startTimer = function () {
  const ticktok = () => {
    const min = String(Math.trunc(seconds / 60)).padStart(2, 0);
    const sec = String(Math.trunc(seconds % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (seconds === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;
      containerApp.style.opacity = 0;
    }
    seconds--;
  };

  let seconds = 5 * 60;

  ticktok();
  timer = setInterval(ticktok, 1000);
  return timer;
};
const formatNumber = function (value, locale, currency) {
  const options = { style: 'currency', currency: currency };
  return new Intl.NumberFormat(locale, options).format(value);
};
const calcMovementDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const DaysPassed = calcDaysPassed(new Date(), date);
  if (DaysPassed === 0) return 'Today';
  if (DaysPassed === 1) return 'Yesterday';
  if (DaysPassed <= 7) return `${DaysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};
createUserNames(accounts);
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const CurrDate = calcMovementDates(date, acc.locale);
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${CurrDate}</div>
      <div class="movements__value">${formatNumber(
        mov,
        acc.locale,
        acc.currency
      )}</div>
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
  displayMovements(acc);
  displayBalance(acc);
  displaySummary(acc);
};

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
    const date = new Date();
    const options = {
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      navigator.language,
      options
    ).format(date);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = startTimer();
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
      currentAccount.movementsDates.push(new Date().toISOString());
      recieverAcc.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      if (timer) clearInterval(timer);
      timer = startTimer();
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
      currentAccount.movementsDates.push(new Date().toISOString());
      setTimeout(() => {
        updateUI(currentAccount);
      }, 1500);
      if (timer) clearInterval(timer);
      timer = startTimer();
    }
  });
  let sorted = false;
  btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    if (timer) clearInterval(timer);
    timer = startTimer();
    sorted = !sorted;
  });
  labelBalance.addEventListener('click', function () {
    const movements = Array.from(
      document.querySelectorAll('.movements__value'),
      el => +el.textContent.replace('Rs.', '')
    );
  });
});
