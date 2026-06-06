import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

function handleFormSubmit(event) {
  event.preventDefault();

  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  createPromise(delay, state)
    .then(resultDelay => {
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${resultDelay}ms`,
        position: 'topRight',
      });
    })
    .catch(errorDelay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${errorDelay}ms`,
        position: 'topRight',
      });
    });

  form.reset();
}

form.addEventListener('submit', handleFormSubmit);
