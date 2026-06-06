import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerUI({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function handleDateClose(selectedDates) {
  const selectedTime = selectedDates[0].getTime();

  if (selectedTime <= Date.now()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    startBtn.disabled = true;
  } else {
    userSelectedDate = selectedTime;
    startBtn.disabled = false;
  }
}

const flatpickrOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: handleDateClose,
};

flatpickr(datetimePicker, flatpickrOptions);


startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  datetimePicker.disabled = true;

  timerId = setInterval(() => {
    const remainingTime = userSelectedDate - Date.now();

    if (remainingTime <= 0) {
      clearInterval(timerId);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false;
      return;
    }

    updateTimerUI(convertMs(remainingTime));
  }, 1000);
});
