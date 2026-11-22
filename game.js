// Shift logic for image one. Text only. No pictures.

const CUSTOMERS = {
  norman: {
    id: "norman",
    name: "Norman Nibbles",
    asks: "What'll it be, my fine friend?",
    reactions: {
      falawful: {
        says: "There is lettuce. Norman will not negotiate with green.",
        complaint: true,
      },
      chicken: {
        says: "Norman asks if it is looking at him. The gull is. The chicken is not.",
        complaint: false,
      },
      beef: {
        says: "Nothing green. Norman is almost pleased, then suspicious.",
        complaint: false,
      },
    },
  },
};

const CHOICES = {
  falawful: "Falawful Kebab",
  chicken: "Chicken Kebab",
  beef: "Beef Kebab",
};

const ORDER = ["norman"];
const DONE = "Norman's order is in. That is the end of this shift.";

function createShift() {
  return { index: 0, served: null, complaints: 0, takings: 0, log: [], done: false };
}

function current(state) {
  if (state.done) return null;
  return CUSTOMERS[ORDER[state.index]] || null;
}

function choose(state, choiceId) {
  const customer = current(state);
  if (!customer || state.served || !CHOICES[choiceId]) return state;
  const reaction = customer.reactions[choiceId];
  return {
    ...state,
    served: choiceId,
    complaints: state.complaints + (reaction.complaint ? 1 : 0),
    log: state.log.concat({ customer: customer.id, choice: choiceId, says: reaction.says }),
  };
}

function nextCustomer(state) {
  if (!state.served || state.done) return state;
  const index = state.index + 1;
  if (index >= ORDER.length) return { ...state, served: null, done: true };
  return { ...state, index, served: null };
}

function speech(state) {
  const customer = current(state);
  if (!customer) return DONE;
  if (!state.served) return customer.asks;
  return customer.reactions[state.served].says;
}

function save(state) {
  return JSON.stringify(state);
}

function load(text) {
  const data = JSON.parse(text);
  return {
    index: data.index,
    served: data.served,
    complaints: data.complaints,
    takings: data.takings,
    log: data.log,
    done: data.done,
  };
}

const first = createShift();
const served = choose(first, "falawful");
const again = choose(served, "beef");
const over = nextCustomer(served);
if (again !== served) throw new Error("second choice should be ignored");
if (speech(served).indexOf("lettuce") < 0) throw new Error("reaction missing");
if (!over.done || over.complaints !== 1) throw new Error("shift did not advance");
if (speech(over) !== DONE) throw new Error("ending line missing");
if (nextCustomer(first) === first && nextCustomer(over) !== over) throw new Error("next was active too early");
if (load(save(served)).log[0].choice !== "falawful") throw new Error("save failed");

const api = { CUSTOMERS, CHOICES, ORDER, DONE, createShift, current, choose, nextCustomer, speech, save, load };
if (typeof module !== "undefined") module.exports = api;
if (typeof window !== "undefined") window.Sultan = api;
