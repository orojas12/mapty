"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10); // temporary solution for a uuid, better to use 3rd-party library

  /**
   * Workout class constructor.
   * @param {Array} coords - The coordinates of the location [latitude, longitude].
   * @param {Number} distance - The distance in miles that was traveled.
   * @param {Number} duration - The total time in minutes.
   */
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  /**
   * Running class constructor.
   * @param {Array} coords - The coordinates of the location [latitude, longitude].
   * @param {Number} distance - The distance in miles that was traveled.
   * @param {Number} duration - The total time in minutes.
   * @param {Number} cadence - The average number of steps per minute.
   */
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
  }

  calcSpeed() {
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

const run1 = new Running([39, -12], 5.2, 24, 178);
const cycling1 = new Cycling([39, -12], 27, 95, 523);
console.log(run1, cycling1);

///////////////////////////////////////////////////////////////////

class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    this.#map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on("click", this._showForm.bind(this));
  }

  _newWorkout(e) {
    e.preventDefault();

    // Get data from form

    // Check if data is valid

    // If workout == running, create running object

    // If workout == cycling, create cycling object

    // Add new object to workout array

    // Render workout on map as marker
    console.log(this.#mapEvent);
    const { lat, lng } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Workout")
      .openPopup();

    // Clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      "";
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _showForm(e) {
    this.#mapEvent = e;
    form.classList.remove("hidden");
    inputDistance.focus();
  }
}

const app = new App();
