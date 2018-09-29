(() => {
  // Data
  const usersList = [];
  const interestsList = ['Basketball', 'Reading', 'Programing'];
  let createUserWorker = null;
  let displayUserList = null;

  const didMount = () => {
    // Initialize functions
    usersList.push(new User('Bruce', 'Wayne', 35, 'Gotham', ['Reading', 'Help people']));
    createUserWorker = new UserDOMWorker(new User('Bruce', 'Wayne', 35, 'Gotham', ['Reading', 'Help people']));
    createUserWorker.editMode();
    displayUserList = displayList.bind(this, dom.el('user-list'), usersList, UserDOMWorker);
    displayUserList();
    displayList(dom.el('interests'), interestsList, InterestDOMWorker);
    //
  };
  //
  // Short functions name for work with dom
  const dom = {
    cr: (tagName) => document.createElement(tagName),
    el: (elId) => document.getElementById(elId)
  };
  //
  // Domains
  class User {
    constructor(firstName, lastName, age = 0, city, interests = []) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.city = city;

      this.age = age;

      this.interests = interests;
    }

    getFullName () {
      return `${this.firstName} ${this.lastName}`;
    };

    interestsToString () {
      return this.interests.join(', ');
    };
  }
  //
  // Dom Workers
  class UserDOMWorker {
    constructor(user = new User()) {
      this.user = user;
      this.form = {
        fields: null
      };
    }
    editMode () {
      const createBtn = dom.el('create-user');
      this.initForm();
      createBtn.onclick = () => {
        this.createFromForm();
        usersList.unshift(
          new User(
            this.user.firstName,
            this.user.lastName,
            this.user.age,
            this.user.city,
            this.user.interests
          )
        );
        displayUserList();
      }
    };
    createElement () {
      const el = document.createElement('tr');
      const cEl = this.createPropertyElement;
      el.appendChild(cEl(this.user.getFullName()));
      el.appendChild(cEl(this.user.age));
      el.appendChild(cEl(this.user.city));
      el.appendChild(cEl(this.user.interestsToString()));
      el.appendChild(this.createRemoveButton());

      return el;
    };
    createPropertyElement (value) {
      const el = document.createElement('td');
      el.innerHTML = value;
      return el;
    };
    createRemoveButton () {
      const el = document.createElement('td');
      el.classList.add('tr-center');
      const button = document.createElement('button');
      button.classList.add('btn');
      button.classList.add('remove-btn');
      button.innerHTML = 'x';
      button.onclick = ((user, ev) => {
        usersList.splice(usersList.indexOf(user), 1);
        ev.target.parentNode.parentNode.remove();
      }).bind(this, this.user);
      el.appendChild(button);
      return el;
    };
    initForm () {
      let fields;
      if(!this.form.fields) {
        this.form.fields = {
          firstName: dom.el('first_name'),
          lastName: dom.el('last_name'),
          age: dom.el('age'),
          city: dom.el('city'),
          interests: dom.el('interests'),
          interest: dom.el('interest')
        }
      }
      fields = this.form.fields;
      fields.firstName.value = this.user.firstName;
      fields.lastName.value = this.user.lastName;
      fields.age.value = this.user.age;
      fields.city.value = this.user.city;
      fields.interest.value = this.user.interestsToString();
    };
    createFromForm () {
      const fields = this.form.fields;
      this.user.firstName = fields.firstName.value;
      this.user.lastName = fields.lastName.value;
      this.user.age = fields.age.value;
      this.user.city = fields.city.value;
      this.user.interest = fields.interest.value;
    };
  }
  class InterestDOMWorker {
    constructor(interest = '') {
      this.interest = interest;
    }

    createElement () {
      const el = document.createElement('option');
      el.innerHTML = this.interest;
      el.value = this.interest;

      return el;
    };
  }
  //
  function displayList(rootEl, usersList = {}, domWorker) {
    if(!rootEl)
      return;
    rootEl.innerHTML = null;
    usersList.forEach(user => rootEl.appendChild(new domWorker(user).createElement()));
  }
  //
  didMount();
})();