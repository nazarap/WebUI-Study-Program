(function () {
  // Data
  var usersList = [
    new User('Bruce', 'Wayne', 35, 'Gotham', ['Reading', 'Help people'])
  ];
  var interestsList = ['Basketball', 'Reading', 'Programing'];
  var createUserWorker = null;
  var displayUserList = null;
  //
  // Short functions name for work with dom
  var dom = {
    cr: function (tagName) {
      return document.createElement(tagName)
    },
    el: function (elId) {
      return document.getElementById(elId)
    }
  };
  var didMount = function() {
    // Initialize functions
    createUserWorker = new UserDOMWorker(new User('Bruce', 'Wayne', 35, 'Gotham', ['Reading', 'Help people']));
    createUserWorker.editMode();
    displayUserList = displayList.bind(this, dom.el('user-list'), usersList, UserDOMWorker);
    displayUserList();
    displayList(dom.el('interests'), interestsList, InterestDOMWorker);
    //
  };
  //
  // Domains
  function User(firstName, lastName, age, city, interests) {
    // String values
    this.firstName = firstName || null;
    this.lastName = lastName || null;
    this.city = city || null;

    // Number value
    this.age = age || 0;

    // Array value
    this.interests = interests || [];

    this.getFullName = function () {
      return this.firstName + ' ' + this.lastName;
    };

    this.interestsToString = function () {
      return this.interests.join(', ');
    };
  }
  //
  // Dom Workers
  function UserDOMWorker (user) {
    this.user = user || new User();
    this.form = {
      fields: null
    };

    this.getUser = function () {
      return this.user;
    };
    this.editMode = function () {
      var createBtn = dom.el('create-user');
      var vm = this;
      this.initForm();
      createBtn.onclick = function () {
        vm.createFromForm();
        usersList.unshift(
          new User(
            vm.user.firstName,
            vm.user.lastName,
            vm.user.age,
            vm.user.city,
            vm.user.interests
          )
        );
        displayUserList();
      }
    };
    this.createElement = function () {
      var el = document.createElement('tr');
      var cEl = this.createPropertyElement;
      el.appendChild(cEl(this.user.getFullName()));
      el.appendChild(cEl(this.user.age));
      el.appendChild(cEl(this.user.city));
      el.appendChild(cEl(this.user.interestsToString()));
      el.appendChild(this.createRemoveButton());

      return el;
    };
    this.createPropertyElement = function (value) {
      var el = document.createElement('td');
      el.innerHTML = value;
      return el;
    };
    this.createRemoveButton = function () {
      var el = document.createElement('td');
      el.classList.add('tr-center');
      var button = document.createElement('button');
      button.classList.add('btn');
      button.classList.add('remove-btn');
      button.innerHTML = 'x';
      button.onclick = (function (user, ev) {
        var index = usersList.indexOf(user);
        usersList.splice(index, 1);
        ev.target.parentNode.parentNode.remove();
      }).bind(this, this.user);
      el.appendChild(button);
      return el;
    };
    this.initForm = function () {
      var fields;
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
    this.createFromForm = function () {
      var fields = this.form.fields;
      this.user.firstName = fields.firstName.value;
      this.user.lastName = fields.lastName.value;
      this.user.age = fields.age.value;
      this.user.city = fields.city.value;
      this.user.interest = fields.interest.value;
    };
  }
  function InterestDOMWorker (interest) {
    this.interest = interest || '';

    this.createElement = function () {
      var el = document.createElement('option');
      el.innerHTML = interest;
      el.value = interest;

      return el;
    };
  }
  //
  // Global functions
  function _map(arr, callback) {
    for (var i = 0; i < arr.length; i++)
      callback(arr[i], i);
  }

  function displayList(rootEl, usersList, domWorker) {
    if(!rootEl || !usersList || usersList.length === 0)
      return;
    rootEl.innerHTML = null;
    _map(usersList, function (user) {
      var dw = new domWorker(user);
      rootEl.appendChild(dw.createElement());
    });
  }
  //
  didMount();
})();