let state = Sultan.createShift();
const speech = document.getElementById("speech");
const dishes = ["falawful", "chicken", "beef"].map(function (id) {
  return document.getElementById(id);
});
const next = document.getElementById("next");

function draw() {
  speech.textContent = Sultan.speech(state);
  dishes.forEach(function (button) {
    const chosen = state.served === button.id;
    button.setAttribute("aria-pressed", chosen ? "true" : "false");
    button.disabled = Boolean(state.served) || state.done;
  });
  next.disabled = !state.served || state.done;
  if (state.done) next.setAttribute("aria-pressed", "true");
}

dishes.forEach(function (button) {
  button.addEventListener("click", function () {
    state = Sultan.choose(state, button.id);
    draw();
  });
});
next.addEventListener("click", function () {
  state = Sultan.nextCustomer(state);
  draw();
});
draw();
