'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
/* function timeConversion(s) {
  // Write your code here
  let format = s.slice(-2);
  let time = s.slice(0, -2);

  if (format === 'PM') {
    return s;
  } else if (format === 'AM') {
    let separated_time = time.split(':');

    let hold_hour = separated_time.shift();

    console.log(hold_hour);

    let updated_hour = Number(hold_hour) + 12;

    separated_time.unshift(updated_hour);

    let updated_time = separated_time.join(':');

    return updated_time;
  }
} */

/* let str = 'hamza';
console.log(str.split('').sort().join(''));

let result = timeConversion('07:05:45AM');
console.log(result);
 */

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
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

////////////////displaying movemnets/////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    
    <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

////////////////computing usernames/////////////////

const createUserNames = function (accountss) {
  accountss.forEach(function (acc, i) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (value) {
        return value[0];
      })
      .join('');
  });
};

createUserNames(accounts);

console.log(accounts);

////////////////calculate display balance/////////////////

const calDisplayBalance = function (acc) {
  acc['balance'] = acc.movements.reduce((acc, val) => acc + val, 0);

  labelBalance.textContent = `${acc.balance} EUR`;
};

//updating UI

const updateUI = function (current_acc) {
  //display movements
  displayMovements(current_acc.movements);

  //display balance
  calDisplayBalance(current_acc);

  //display summary
  calcDisplaySummary(current_acc);
};

/////////////event handlers///////////////

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and message

    containerApp.style.opacity = 1;

    labelWelcome.textContent = `Welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;

    //updating UI
    updateUI(currentAccount);

    //clearing the login fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
  } else {
    containerApp.style.opacity = 0;
    //clearing the login fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
  }
});

////////////////calculate display summary/////////////////

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value, 0);

  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(value => value < 0)
    .reduce((acc, value, i, arr) => acc + value, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = account.movements
    .filter(value => value > 0)
    .map(deposit => deposit * (account.interestRate / 100))
    .filter(intersetFn => intersetFn >= 1)
    .reduce((acc, value) => acc + value, 0);

  labelSumInterest.textContent = `${interest}€`;
};

//btnTransfer, inputTransferAmount, inputTransferTo;

////////////////transfer money/amount/////////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //it will prevent the default behaviour , and for form default behaviour is that it will reload so it won't reload it

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username != currentAccount.username
  ) {
    //doing transfer
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    //updating UI
    updateUI(currentAccount);
  }

  //clearing fields
  inputTransferTo.value = inputTransferAmount.value = '';
});

//loan feature

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add the movement
    currentAccount.movements.push(amount);

    //updating UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//close account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

//overall balance
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance);

//btnsort
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);

  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const z = Array.from({ length: 7 }, (_, index) => index + 1);
console.log(z);

console.log(`
LAST:`);

console.log(document.querySelectorAll('.movements__value'));

/////////////////////////////////////////////////
