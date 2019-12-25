/* Utility function to Assessing the document element */

const accessElement = identifier => {
  return document.querySelector(`.${identifier}`);
};

const accessAllElement = identifier => {
  return document.querySelectorAll(`.${identifier}`);
};

//Access form and prevent default action
accessElement('search-form').addEventListener('submit', e =>
  e.preventDefault()
);

/* grap on to the form input field */

const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', handleForm);

const showDetail = () => {
  const btn_showDetails = [...accessAllElement('btn-show')];
  btn_showDetails.map(btn =>
    btn.addEventListener('click', function detail() {
      this.classList.add('hide');
      this.nextElementSibling.classList.remove('hide');
      this.previousElementSibling.classList.add('show');
    })
  );
};

const hideDetail = () => {
  const btn_hideDetails = [...accessAllElement('btn-hide')];
  btn_hideDetails.map(btn =>
    btn.addEventListener('click', function detail() {
      this.classList.add('hide');
      this.previousElementSibling.classList.remove('hide');
      this.previousElementSibling.previousElementSibling.classList.remove(
        'show'
      );
    })
  );
};

/* function to handle the form */

function handleForm(e) {
  const outputHtml = document.querySelector('.outputHTML');
  const input = e.target.value;

  /* regular expression to validate user input */

  const regEx = new RegExp(`^${input}`, 'gi');

  /* fetch request from an API */

  fetch('state.json')
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject({
          status: res.status,
          statusText: res.statusText
        });
      }
    })
    .then(states => {
      let state = states.filter(state => {
        if (regEx.test(state.state) || regEx.test(state.capital)) {
          return state;
        }
      });

      displayHtml(state);
      showDetail();
      hideDetail();
    })

    .catch(error => console.log(`Error message: ${error.statusText}`));

  /* display to the DOM */
  const displayHtml = states => {
    if (input.length > 0) {
      let output = states
        .map(state => {
          return `
            <div class="output">
            <h3>State: ${state.state}</h3>
            <p>Capital: ${state.capital}</p>
            <div class="more-detail">
              <p>Nick Name: ${state.nickname}</p>
            </div>
            <button class="btn btn-show">Show more details</button>
            <button class="btn btn-hide hide">Hide details</button>
            </div>
        `;
        })
        .join('');
      outputHtml.innerHTML = output;
    } else {
      outputHtml.innerHTML = '';
    }
  };
}
