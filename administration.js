"use strict";
// variable declarations
let objectadded = 1;
let dbExist = true;
let saveIsClicked = 1;
let formname = "";
let version = 1;
let HTML = "";
let state = {
  id: 0,
  arr: [
    {
      formName: "",
      forms: [
        {
          version: 1,
          elements: [],
        },
      ],
    },
  ],
};
let searchButton = document.querySelector(".search-button");
let counter = 0;
let administrationElements = document.querySelector(".Elements");
let administrationElement = document.querySelector(".Element");
// function declarations
const ifStateExist = () => {
  let db = null;
  let objectStore = null;
  let DBOpenReq = indexedDB.open("Formular", 1);
  DBOpenReq.addEventListener("error", (err) => {});
  DBOpenReq.addEventListener("success", (ev) => {
    db = ev.target.result;
  });
  DBOpenReq.addEventListener("upgradeneeded", (ev) => {
    db = ev.target.result;

    if (db.objectStoreNames.contains("Formular")) {
      dbExist = true;
    } else {
      dbExist = false;
      db.close();
      indexedDB.deleteDatabase("Formular");
    }
  });

  setTimeout(() => {
    if (dbExist) {
      let tx = db.transaction("Formular", "readonly");
      tx.oncomplete = (ev) => {};
      tx.onerror = (err) => {};
      let store = tx.objectStore("Formular");
      let request = store.get(0);
      request.onsuccess = (ev) => {
        if (ev.target.result != undefined) {
          state = ev.target.result;
          saveIsClicked = 2;
          objectadded = ev.target.result.arr.length + 1;
        }
      };
      request.onerror = (err) => {
        console.log("error in request to add");
      };
    }
  }, 100);
};
ifStateExist();

// function for storing values in array
let findValuesAndStore = function (array, emptyarray) {
  for (let i = 0; i < array.length; i++) {
    emptyarray[i] = array[i].value;
  }
};
// function that render the latest version of a template
const RenderValues = (object, label, boxtypes, types) => {
  for (let i = 0; i < label.length; i++) {
    label[i].value = object[i].labelName;
    boxtypes[i].value = object[i].inputType;
    types[i].value = object[i].type;
    if (object[i].radiooptions != undefined) {
      for (let j = 0; j < object[i].radiooptions.length; j++) {
        if (
          boxtypes[i].parentElement.children[j + 1].classList.contains(
            "textAndButtons"
          )
        )
          boxtypes[i].parentElement.children[
            j + 1
          ].children[0].children[0].value = object[i].radiooptions[j];
      }
    }
  }
};
const renderLatestTemplate = (object, formname) => {
  for (let k = 0; k < object.arr.length; k++) {
    if (object.arr[k].formName == formname) {
      for (let f = 0; f < object.arr[k].forms.length; f++) {
        if (f == object.arr[k].forms.length - 1) {
          administrationElements.innerHTML = object.arr[k].forms[f].HTML;
          counter = administrationElements.children.length - 1;
          let labelNames = document.querySelectorAll(".input-field");
          let boxTypes = document.querySelectorAll(".box-type");
          let Types = document.querySelectorAll(".obligation-form");
          RenderValues(
            object.arr[k].forms[f].elements,
            labelNames,
            boxTypes,
            Types
          );
        }
      }
    }
  }
};
// this function is for update or add state object into database
const IDB = (obj) => {
  let db = null;
  let objectStore = null;
  let DBOpenReq = indexedDB.open("Formular", 1);
  DBOpenReq.addEventListener("error", (err) => {
    console.warn(err);
  });
  DBOpenReq.addEventListener("success", (ev) => {
    db = ev.target.result;
  });
  DBOpenReq.addEventListener("upgradeneeded", (ev) => {
    db = ev.target.result;

    objectStore = db.createObjectStore("Formular", {
      keyPath: "id",
    });

    // add state

    setTimeout(() => {
      if (saveIsClicked == 1) {
        let tx = db.transaction("Formular", "readwrite");
        tx.oncomplete = (ev) => {};
        tx.onerror = (err) => {
          console.warn(err);
        };
        let store = tx.objectStore("Formular");
        let request = store.add(obj);
        request.onsuccess = (ev) => {};
        request.onerror = (err) => {
          console.log("error in request to add");
        };
        if (obj.arr.length == objectadded) {
          alert("You successfully saved a formtemplate");
          objectadded++;
        }
      }
    }, 100);
  });
  // update state
  setTimeout(() => {
    if (saveIsClicked == 2) {
      if (obj.arr.length == objectadded) {
        alert("You successfully saved a formtemplate");
        objectadded++;
      }
      let tx = db.transaction("Formular", "readwrite");
      tx.oncomplete = (ev) => {};
      tx.onerror = (err) => {
        console.warn(err);
      };
      let store = tx.objectStore("Formular");
      let request = store.put(obj);
      request.onsuccess = (ev) => {};
      request.onerror = (err) => {
        console.warn("error in request to put");
      };
    }
  }, 100);
  saveIsClicked = 2;
};
// function for storing radio input data in array
const storeRadioValues = (nodelist, emptyarray, radioarray) => {
  for (let i = 0; i < emptyarray.length; i++) {
    for (let j = 0; j < nodelist[i].children.length; j++) {
      if (nodelist[i].children[j].classList.contains("textAndButtons")) {
        radioarray[j] = nodelist[i].children[j].children[0].children[0].value;
      }
    }

    radioarray.shift();
    emptyarray[i] = radioarray;
    radioarray = [];
  }
};
// function for adding radio labels
const addRadio = (e) => {
  let textAndButtons = document.createElement("div");

  textAndButtons.innerHTML = `
<div class="inputs">
  <input type="text"  class="input-option" />
</div>
<div class="radioplusminus-button">

<button
class="radioplus-button"
onclick="RadioPlus(event)"
id="radio-plusbutton"
>
<img src="Images/plus-circle.svg" width="15px" height="15px" />
</button>
  <button class="radiominus-button"  onclick="RadioMinus(event)" id="radio-minusbutton">
    <img src="Images/minus-circle.svg" width="15px" height="15px" />
  </button>
</div>
`;

  textAndButtons.classList.add("textAndButtons");
  if (e.target.parentElement.children.length < 3) {
    e.target.after(textAndButtons);
  }
};
// Function which delete element rows if someone clicks
const minusButton = (e) => {
  if (
    administrationElements.lastChild != e.target.parentElement.parentElement &&
    administrationElements.children.length > 1
  ) {
    counter--;
    administrationElements.removeChild(e.target.parentElement.parentElement);

    for (let i = 0; i < administrationElements.children.length; i++) {
      let labelCorrection = document.querySelectorAll(".element-label");
      labelCorrection[i].innerHTML = `Element ${i + 1}`;
    }
    counter = administrationElements.children.length - 1;
  }
};
// function for adding element rows
const plusButton = (ev) => {
  counter++;
  ev.preventDefault();

  administrationElements.insertAdjacentHTML(
    "beforeend",
    `<div class="Element">
    <form onSubmit="return false;">
      <div class="label-input">
        <label for="inputfield" class="element-label" id="elementlabel">Element ${
          counter + 1
        }</label>
        <input
          type="text"
          name="inputfield"
          id="inputfield"
          class="input-field"

          value=""
          required
        />
      </div>
      <div class="Dropdown-boxlist">
        <select class="box-type" onchange="SelectBox(event)">
          <option class="checkbox" value="checkbox">checkbox</option>
          <option class="radio-buttons" value="radio">radio buttons</option>
          <option class="textbox" value="textbox">textbox</option>
        </select>
      </div>
      <div class="obligation-formcontainer">
        <select class="obligation-form">
          <option class="numeric">numeric</option>
          <option class="mandatory">mandatory</option>
          <option class="none">none</option>
        </select>
      </div>
    </form>
    <div class="plusminus-button" id="plusminus">
    <button
    class="plus-button"
    onclick="plusButton(event)"
    id="plusbutton"
  >
    <img src="Images/plus-circle.svg" width="15px" height="15px" />
  </button>
      <button class="minus-button"   id="minusbutton" onclick="minusButton(event)">
      <img src="Images/minus-circle.svg" width="15px" height="15px" />
      </button>
    </div>
    </div>`
  );
  ev.target.closest("button").remove();
  return counter;
};
// Function when someone clicks on one of the options which are (radio buttons,checkbox,textbox)
const SelectBox = (e) => {
  e.preventDefault();
  e.stopPropagation();
  function RemoveRadio(e) {
    Array.from(e.target.parentElement.children).filter((a) => {
      if (a.className == "textAndButtons") {
        e.target.parentElement.removeChild(a);
      }
    });
  }
  if (e.target.value == "checkbox") {
    RemoveRadio(e);
  } else if (e.target.value == "textbox") {
    RemoveRadio(e);
  } else if (e.target.value == "radio") {
    addRadio(e);
    addRadio(e);

    e.target.parentElement.children[1].children[1].removeChild(
      e.target.parentElement.children[1].children[1].children[0]
    );
  }
};
// function for adding input radio rows
const RadioPlus = (e) => {
  e.stopPropagation();
  e.preventDefault();
  if (e.target.closest("button")) {
    let textAndButtons = document.createElement("div");

    textAndButtons.innerHTML = `
  <div class="inputs">
    <input type="text"  class="input-option" />
  </div>
  <div class="radioplusminus-button">
  
  <button
  class="radioplus-button"
  onclick="RadioPlus(event)"
  id="radio-plusbutton"
  >
  <img src="Images/plus-circle.svg" width="15px" height="15px" />
  </button>
    <button class="radiominus-button"  onclick="RadioMinus(event)" id="radio-minusbutton">
      <img src="Images/minus-circle.svg" width="15px" height="15px" />
    </button>
  </div>
  `;

    textAndButtons.classList.add("textAndButtons");

    e.target.parentElement.parentElement.after(textAndButtons);

    e.target.closest("button").remove();
  }
};
// function which delete radio input rows
const RadioMinus = (e) => {
  e.stopPropagation();

  if (
    e.target &&
    e.target.parentElement.parentElement.parentElement.children.length > 3 &&
    e.target.parentElement.children.length == 1
  ) {
    e.target.parentElement.parentElement.parentElement.removeChild(
      e.target.parentElement.parentElement
    );
  }
};
// function which is saving the formttemplate in a indexedDB database
const saveFormTemplate = (e) => {
  if (document.querySelector(".search-box").value == "") {
    alert("Please insert a formular name");
  } else {
    /* Storing label names in array */

    let inputField = document.querySelectorAll(".input-field");
    let inputFieldValues = [];
    findValuesAndStore(inputField, inputFieldValues);
    /* Validation if a label name is not inputted */
    for (let i = 0; i < inputField.length; i++) {
      if (inputFieldValues[i] === "") {
        alert("Input all label names");

        break;
      } else {
        if (i + 1 == inputField.length) {
          /* Storing selected box types values in array */
          let allDropdownListsForBoxTypes = document.querySelectorAll(
            ".box-type"
          );
          let allDropdownListsForBoxTypesArray = [];
          findValuesAndStore(
            allDropdownListsForBoxTypes,
            allDropdownListsForBoxTypesArray
          );
          /* Storing radio input values in array */
          // nodelist with all drodown lists that have options (checkbox,radio buttons,textbox)
          let dropdownBoxTypes = document.querySelectorAll(".Dropdown-boxlist");
          let allDropdownBoxListsContainersArray = [];
          let radioInputsArray = [];
          findValuesAndStore(
            dropdownBoxTypes,
            allDropdownBoxListsContainersArray
          );
          storeRadioValues(
            dropdownBoxTypes,
            allDropdownBoxListsContainersArray,
            radioInputsArray
          );
          /*Obligation Dropdown list */
          // I used obligation to describe types(mandatory,none,numeric)
          let dropdownObligationLists = document.querySelectorAll(
            ".obligation-form"
          );
          let dropdownObligationListsArray = [];
          findValuesAndStore(
            dropdownObligationLists,
            dropdownObligationListsArray
          );
          // Creating state and latestVersion of the formtemplate
          formname = document.querySelector(".search-box").value.toLowerCase();
          HTML = administrationElements.innerHTML;
          // Creating state
          for (let i = 0; i < state.arr.length; i++) {
            if (state.arr[i].formName == formname) {
              for (let j = 0; j < state.arr[i].forms.length; j++) {
                state.arr[i].forms.push({
                  HTML: HTML,
                  version: state.arr[i].forms.length + 1,
                  elements: [],
                });
                for (let k = 0; k < dropdownObligationListsArray.length; k++) {
                  let len = state.arr[i].forms.length - 1;
                  if (allDropdownListsForBoxTypesArray[k] == "textbox") {
                    state.arr[i].forms[len].elements.push({
                      labelName: inputFieldValues[k],
                      inputType: allDropdownListsForBoxTypesArray[k],
                      type: dropdownObligationListsArray[k],
                    });
                  } else if (
                    allDropdownListsForBoxTypesArray[k] == "checkbox"
                  ) {
                    state.arr[i].forms[len].elements.push({
                      labelName: inputFieldValues[k],
                      inputType: allDropdownListsForBoxTypesArray[k],

                      type: dropdownObligationListsArray[k],
                    });
                  } else if (allDropdownListsForBoxTypesArray[k] == "radio") {
                    state.arr[i].forms[len].elements.push({
                      labelName: inputFieldValues[k],
                      inputType: allDropdownListsForBoxTypesArray[k],
                      radiooptions: allDropdownBoxListsContainersArray[k],
                      type: dropdownObligationListsArray[k],
                    });
                  }
                }
                break;
              }
            }
            let name = state.arr.find((name) => {
              return name.formName == formname;
            });
            if (!name) {
              if (state.arr[0].formName == "") {
                state.arr.shift();
              }
              state.arr.push({
                formName: formname,
                forms: [
                  {
                    HTML: HTML,
                    version: 1,
                    elements: [],
                  },
                ],
              });
              let arrlen = state.arr.length - 1;
              if (state.arr[arrlen].forms.length == 1) {
                for (
                  let index = 0;
                  index < dropdownObligationListsArray.length;
                  index++
                ) {
                  if (allDropdownListsForBoxTypesArray[index] == "textbox") {
                    state.arr[arrlen].forms[0].elements.push({
                      labelName: inputFieldValues[index],
                      inputType: allDropdownListsForBoxTypesArray[index],

                      type: dropdownObligationListsArray[index],
                    });
                  } else if (
                    allDropdownListsForBoxTypesArray[index] == "checkbox"
                  ) {
                    state.arr[arrlen].forms[0].elements.push({
                      labelName: inputFieldValues[index],
                      inputType: allDropdownListsForBoxTypesArray[index],

                      type: dropdownObligationListsArray[index],
                    });
                  } else if (
                    allDropdownListsForBoxTypesArray[index] == "radio"
                  ) {
                    state.arr[arrlen].forms[0].elements.push({
                      labelName: inputFieldValues[index],
                      inputType: allDropdownListsForBoxTypesArray[index],
                      radiooptions: allDropdownBoxListsContainersArray[index],
                      type: dropdownObligationListsArray[index],
                    });
                  }
                }
              }
              break;
            }
          }
          let radioValidation = document.querySelectorAll(".input-option");
          if (radioValidation.length != 0) {
            for (let val = 0; val < radioValidation.length; val++) {
              if (radioValidation[val].value == "") {
                alert("Input all radio labels");
                break;
              } else {
                // Storing state and LatestVersion of the formtemplate in database
                IDB(state);
              }
            }
          } else {
            IDB(state);
          }
        }
      }
    }
  }
};

// button that gets the saved formtemplate data and display it
searchButton.addEventListener("click", (event) => {
  let searchButtonValue = document
    .querySelector(".search-box")
    .value.toLowerCase();
  let db = null;
  const DBOpenReq = indexedDB.open("Formular", 1);
  DBOpenReq.addEventListener("error", (err) => {});
  DBOpenReq.addEventListener("success", (ev) => {
    db = ev.target.result;
  });
  DBOpenReq.addEventListener("upgradeneeded", (ev) => {
    db = ev.target.result;

    if (!db.objectStoreNames.contains("Formular")) {
      db.close();
      indexedDB.deleteDatabase("Formular");
    }
  });

  // getting latest formtemplate version

  setTimeout(() => {
    if (db.objectStoreNames.contains("Formular")) {
      let tx = db.transaction("Formular", "readonly");
      tx.oncomplete = (ev) => {};
      tx.onerror = (err) => {};
      let store = tx.objectStore("Formular");
      let req = store.get(0);
      req.onsuccess = (ev) => {
        for (let i = 0; i < ev.target.result.arr.length; i++) {
          if (ev.target.result.arr[i].formName != searchButtonValue) {
            if (administrationElements.children.length > 1) {
              let plusButtonAdd =
                administrationElements.lastChild.children[1].children[0];
              administrationElements.innerHTML =
                administrationElements.children[0].outerHTML;
              administrationElements.children[0].children[1].prepend(
                plusButtonAdd
              );
              counter = 0;
              break;
            }
          }
        }
        renderLatestTemplate(ev.target.result, searchButtonValue);
        saveIsClicked = 2;
        state = ev.target.result;
        objectadded = ev.target.result.arr.length + 1;
      };
      req.onerror = (err) => {
        console.log("error in request to get");
      };
    }
  }, 50);
});
