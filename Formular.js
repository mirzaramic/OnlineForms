/* Varibale declarations */
let radioCounter = 0;
let dbExist = true;
let formTemplate = "";
let state = {
  id: 1,
  dataValues: [
    {
      id: 0,
      data: [{ formname: "", formTemplate: "", values: "" }],
    },
  ],
};

let saveIsClicked = 2;
let formularDiv = document.querySelector(".formular");
const saveDataBtn = document.querySelector(".formtemplate-save-button");
const loadDataBtn = document.querySelector(".Load-button");
const newDataBtn = document.querySelector(".New-button");
let searchButtonValue = document.querySelector(".search-box").value;
let id = 0;

/*Function declarations*/
function compare(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
let findValuesAndStore = function (arr, emptyarr) {
  for (let j = 0; j < arr.length; j++) {
    emptyarr[j] = arr[j].value;
  }
};
let findCheckedValuesAndStore = function (checkbox, checkboxarr) {
  for (let i = 0; i < checkboxarr.length; i++) {
    checkbox[i] = checkboxarr[i].checked;
  }
};

let findRadioValuesAndStore = function (checkbox, checkboxarr) {
  radioCounter = 0;
  for (let i = 0; i < checkboxarr.length; i++) {
    if (checkboxarr[i].checked) {
      checkbox[radioCounter] = [checkboxarr[i].checked, checkboxarr[i].value];
      radioCounter++;
    }
  }
};
// checking if a formular data object is existing in database
const ifFormularDataExist = () => {
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
  // get state

  setTimeout(() => {
    if (dbExist) {
      let tx = db.transaction("Formular", "readonly");
      tx.oncomplete = (ev) => {};
      tx.onerror = (err) => {};
      let store = tx.objectStore("Formular");
      let request = store.get(1);
      request.onsuccess = (ev) => {
        if (ev.target.result != undefined) {
          state = ev.target.result;

          saveIsClicked = 2;
        }
      };
      request.onerror = (err) => {
        console.log("error in request to add");
      };
    }
  }, 100);
};
ifFormularDataExist();
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
  });
  // Update
  setTimeout(() => {
    if (saveIsClicked == 2) {
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
// function which is taking an object in the database and render his data
const renderTemplate = (object) => {
  for (let j = 0; j < object.elements.length; j++) {
    if (object.elements[j].type == "mandatory") {
      let label = document.createElement("div");
      label.classList.add("formular-labels-inputs");
      formularDiv.appendChild(label);
      if (object.elements[j].inputType == "textbox") {
        label.classList.add("text");
        label.innerHTML = ` <label for="name">${object.elements[j].labelName}*</label>
          <input id="name" class="name" type="text" value="" />`;
      } else if (object.elements[j].inputType == "checkbox") {
        label.classList.add("checkbox");
        label.innerHTML = ` <div class="checkbox-label">
        <label for="checkbox">${object.elements[j].labelName}*</label>
      </div>
      <div class="checkbox-inputs">
        <div class="checkbox-input"><input type="checkbox" class="checkbox" name="checkbox"/></div>
      </div>`;
      } else if (object.elements[j].inputType == "radio") {
        label.classList.add("radio");
        label.innerHTML = ` <div class="radio-label">
          <label for="something">${object.elements[j].labelName}*</label>
        </div>`;
        let radioInputsDiv = document.createElement("div");
        radioInputsDiv.classList.add("radio-inputs");
        label.appendChild(radioInputsDiv);
        for (
          let radio = 0;
          radio < object.elements[j].radiooptions.length;
          radio++
        ) {
          radioInputsDiv.insertAdjacentHTML(
            "beforeend",
            `  
          <div class="radio-input">
            <input type="radio" name="${object.elements[j].labelName}" value="${object.elements[j].radiooptions[radio]}" />
            <label>${object.elements[j].radiooptions[radio]}</label>
          </div>`
          );
        }
      }
    } else if (object.elements[j].type == "numeric") {
      let label = document.createElement("div");
      formularDiv.appendChild(label);
      label.classList.add("formular-labels-inputs");
      if (object.elements[j].inputType == "textbox") {
        label.classList.add("number");
        label.innerHTML = ` <label for="name">${object.elements[j].labelName}</label>
            <input id="name" class="name" type="number" value="" />`;
      } else if (object.elements[j].inputType == "checkbox") {
        label.classList.add("checkbox");
        label.innerHTML = ` <div class="checkbox-label">
          <label for="checkbox">${object.elements[j].labelName}</label>
        </div>
        <div class="checkbox-inputs">
          <div class="checkbox-input"><input type="checkbox" class="checkbox" name="checkbox"/></div>
        </div>`;
      } else if (object.elements[j].inputType == "radio") {
        label.classList.add("radio");
        label.innerHTML = ` <div class="radio-label">
            <label for="something">${object.elements[j].labelName}</label>
          </div>`;
        let radioInputsDiv = document.createElement("div");
        radioInputsDiv.classList.add("radio-inputs");
        label.appendChild(radioInputsDiv);
        for (
          let radio = 0;
          radio < object.elements[j].radiooptions.length;
          radio++
        ) {
          radioInputsDiv.insertAdjacentHTML(
            "beforeend",
            `  
            <div class="radio-input">
              <input type="radio" name="${object.elements[j].labelName}" value="${object.elements[j].radiooptions[radio]}" />
              <label>${object.elements[j].radiooptions[radio]}</label>
            </div>`
          );
        }
      }
    } else if (object.elements[j].type == "none") {
      let label = document.createElement("div");
      formularDiv.appendChild(label);
      label.classList.add("formular-labels-inputs");

      if (object.elements[j].inputType == "textbox") {
        label.classList.add("text");
        label.innerHTML = ` <label for="name">${object.elements[j].labelName}</label>
            <input id="name" class="name" type="text" value="" />`;
      } else if (object.elements[j].inputType == "checkbox") {
        label.innerHTML = ` <div class="checkbox-label">
          <label for="checkbox">${object.elements[j].labelName}</label>
        </div>
        <div class="checkbox-inputs">
          <div class="checkbox-input"><input type="checkbox" class="checkbox" name="checkbox"/></div>
        </div>`;
      } else if (object.elements[j].inputType == "radio") {
        label.classList.add("radio");
        label.innerHTML = ` <div class="radio-label">
            <label for="something">${object.elements[j].labelName}</label>
          </div>`;
        let radioInputsDiv = document.createElement("div");
        radioInputsDiv.classList.add("radio-inputs");
        label.appendChild(radioInputsDiv);
        for (
          let radio = 0;
          radio < object.elements[j].radiooptions.length;
          radio++
        ) {
          radioInputsDiv.insertAdjacentHTML(
            "beforeend",
            `  
            <div class="radio-input">
              <input type="radio" name="${object.elements[j].labelName}" value="${object.elements[j].radiooptions[radio]}" />
              <label>${object.elements[j].radiooptions[radio]}</label>
            </div>`
          );
        }
      }
    }
  }
};

/* Code */

/* LOad Btn */

loadDataBtn.addEventListener("click", (event) => {
  formularDiv.innerHTML = "";

  searchButtonValue = document.querySelector(".search-box").value;
  id = parseInt(document.querySelector(".ID-field").value, 10);

  if (searchButtonValue == "") {
    alert("Insert a form name");
  } else {
    if (typeof id === "number") {
      for (let t = 0; t < state.dataValues.length; t++) {
        if (state.dataValues[t].id == id) {
          for (let d = 0; d < state.dataValues[t].data.length; d++) {
            if (state.dataValues[t].data[d].formname === searchButtonValue) {
              formTemplate = state.dataValues[t].data[d].formTemplate;
              renderTemplate(formTemplate);

              let checkbox = document.querySelectorAll("input[type=checkbox]");
              let radio = document.querySelectorAll("input[type=radio]");
              let textbox = document.querySelectorAll("input[type=text]");
              let numeric = document.querySelectorAll("input[type=number]");

              for (let i = 2; i < textbox.length; i++) {
                textbox[i].value =
                  state.dataValues[t].data[d].values.textboxValues[i - 2];
              }

              for (let i = 0; i < numeric.length; i++) {
                numeric[i].value =
                  state.dataValues[t].data[d].values.numericValues[i];
              }
              for (let i = 0; i < checkbox.length; i++) {
                checkbox[i].checked =
                  state.dataValues[t].data[d].values.checkboxValues[i];
              }
              for (
                let j = 0;
                j < state.dataValues[t].data[d].values.radioValues.length;
                j++
              ) {
                for (let i = 0; i < radio.length; i++) {
                  if (
                    radio[i].value ==
                    state.dataValues[t].data[d].values.radioValues[j][1]
                  ) {
                    radio[i].checked =
                      state.dataValues[t].data[d].values.radioValues[j][0];
                  }
                }
              }
            }
            let name = state.dataValues[t].data.find((name) => {
              return name.formname == searchButtonValue;
            });
            if (!name) {
              alert("Inputted formtemplate name dont exist");
              break;
            }
          }
        }
        let ID = state.dataValues.find((IDs) => {
          return IDs.id == id;
        });
        if (!ID) {
          alert("inputted id dont exist");
          break;
        }
      }
    }
  }
});
// End of load BTN

//new data btn start
newDataBtn.addEventListener("click", (event) => {
  searchButtonValue = document.querySelector(".search-box").value;
  id = parseInt(document.querySelector(".ID-field").value, 10);
  formularDiv.innerHTML = "";
  // 1 Ako imam vec snimljeno nesto pod istim id-jem trebao bi da imam get i put opcije
  //2 ako nemam snimljeno nista pod ovim id-jem trebam da kreiram add opciju sa najnovijom verzijom forme
  if (searchButtonValue == "") {
    alert("Insert a form name");
  } else {
    let db = null;

    let DBOpenReq = indexedDB.open("Formular", 1);
    DBOpenReq.addEventListener("error", (err) => {
      console.warn(err);
    });
    DBOpenReq.addEventListener("success", (ev) => {
      db = ev.target.result;
      if (!db.objectStoreNames.contains("Formular")) {
        alert("Formular template  dont exist");
        db.close();
        indexedDB.deleteDatabase("Formular");
        dbExist = false;
      } else {
        dbExist = true;
      }
    });
    DBOpenReq.addEventListener("upgradeneeded", (ev) => {
      db = ev.target.result;
    });

    setTimeout(() => {
      if (dbExist) {
        let tx = db.transaction("Formular", "readonly");
        tx.oncomplete = (ev) => {};
        tx.onerror = (err) => {
          console.warn(err);
        };
        let store = tx.objectStore("Formular");
        let req = store.get(0);

        req.onsuccess = (ev) => {
          for (let i = 0; i < ev.target.result.arr.length; i++) {
            if (ev.target.result.arr[i].formName == searchButtonValue) {
              let formsLength = ev.target.result.arr[i].forms.length - 1;
              let latestVersion = ev.target.result.arr[i].forms[formsLength];
              formTemplate = latestVersion;
              renderTemplate(latestVersion);
              let radioChecked = document.querySelectorAll(".radio-inputs");

              for (let j = 0; j < radioChecked.length; j++) {
                radioChecked[j].lastChild.children[0].checked = true;
              }
              break;
            } else if (ev.target.result.arr[i].formName != searchButtonValue) {
              if (i == ev.target.result.arr.length - 1) {
                alert("Please, insert a valid formtemplate name");
              }
            }
          }
        };
        req.onerror = (err) => {
          console.log("error in request to get");
        };
      }
    }, 100);
  }
});
// end of new data btn

//Save btn start
saveDataBtn.addEventListener("click", (event) => {
  id = parseInt(document.querySelector(".ID-field").value, 10);
  searchButtonValue = document.querySelector(".search-box").value;
  let checkboxInputs = document.querySelectorAll("input[type=checkbox]");
  let radioInputs = document.querySelectorAll("input[type=radio]");
  let textboxInputs = document.querySelectorAll("input[type=text]");
  let numericInputs = document.querySelectorAll("input[type=number]");
  if (searchButtonValue == "") {
    alert("Insert a form name");
  } else {
    for (let k = 0; k < formularDiv.children.length; k++) {
      if (
        formularDiv.children[k].classList.contains("text") &&
        formularDiv.children[k].children[1].value == ""
      ) {
        alert("Fill out all fields with asterisk (labelname*)");
        break;
      } else {
        if (k + 1 == formularDiv.children.length) {
          let checkboxValuesArr = [];
          let textboxValuesArr = [];
          let radioValuesArr = [];
          let numericValuesArr = [];
          findCheckedValuesAndStore(checkboxValuesArr, checkboxInputs);
          findValuesAndStore(textboxInputs, textboxValuesArr);
          findRadioValuesAndStore(radioValuesArr, radioInputs);
          findValuesAndStore(numericInputs, numericValuesArr);
          textboxValuesArr.shift();
          textboxValuesArr.shift();

          const values = {
            radioValues: radioValuesArr,
            checkboxValues: checkboxValuesArr,
            numericValues: numericValuesArr,
            textboxValues: textboxValuesArr,
          };

          for (let m = 0; m < state.dataValues.length; m++) {
            if (state.dataValues[m].id === id) {
              for (let n = 0; n < state.dataValues[m].data.length; n++) {
                if (state.dataValues[m].data[n].formname == searchButtonValue) {
                  state.dataValues[m].data[n].values = values;
                  state.dataValues[m].data[n].formTemplate = formTemplate;
                  state = state;
                  IDB(state);
                  break;
                }
                let name = state.dataValues[m].data.find((name) => {
                  return name.formname == searchButtonValue;
                });
                if (!name) {
                  state.dataValues[m].data.push({
                    formname: searchButtonValue,
                    values: values,
                    formTemplate: formTemplate,
                  });
                  state = state;
                  IDB(state);
                }
              }
            }
            let ids = state.dataValues.find((ids) => {
              return ids.id == id;
            });
            if (!ids) {
              state.dataValues.push({
                id: id,
                data: [{ formname: "", formTemplate: "", values: "" }],
              });
              for (let n = 0; n < state.dataValues[m].data.length; n++) {
                if (state.dataValues[m].data[n].formname == searchButtonValue) {
                  state.dataValues[m].data[n].values = values;
                  state.dataValues[m].data[n].formTemplate = formTemplate;

                  IDB(state);
                }
                let name = state.dataValues[m].data.find((name) => {
                  return name.formname == searchButtonValue;
                });
                if (!name) {
                  state.dataValues[m].data.push({
                    formname: searchButtonValue,
                    values: values,
                    formTemplate: formTemplate,
                  });

                  IDB(state);
                }
              }
            }
          }
        }
      }
    }
  }
});
