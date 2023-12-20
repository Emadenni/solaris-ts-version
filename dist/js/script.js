/* --------------------- global variables------------------- */
let planetData = [];
let selectedPlanet;
const startBtn = document.querySelector("#startButton");
const intro = document.querySelector("#introContainer");
const mainPage = document.querySelector(".mainContainer");
const spaceSound = document.getElementById("spaceSound");

/* --------------------- main event/page load-------------------- */
document.addEventListener("DOMContentLoaded", () => {

/* --------------------- EVENT LISTENER: intro/start button ------------ */

  startBtn.addEventListener("click", () => {
    intro.style.display = "none";
    mainPage.style.display = "block";
    
    if (spaceSound) {
      spaceSound.play(); //play a sound when a planet infos are showed
    }
  });
  
  getClickableList();
  getPlanetInfo();
  generateStarField();

   
  /* --------------------- ASYNC FUNCTION : getApyKey()------------ */
  //obtains and returns the keys to the API
  async function getApiKey() {
    return fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
      {
        method: "POST",
        headers: { "x-zocom": "" },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error during Api request. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Key gotten:", data.key);
        return data.key;
      })
      .catch((error) => {
        console.error("Error during Api request:", error);
        throw error;
      });
  }

  /* --------------------- ASYNC FUNCTION : getPlanetInfo()------------ */
  //uses the API keys to fetch informations about planets by the API

  async function getPlanetInfo() {
    try {
      const apiKey = await getApiKey();
      console.log("Api-key used:", apiKey);
      const apiUrl =
        "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies";
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "x-zocom": apiKey },
      });

      const data = await response.json();

  /* -----------------------------if-else----------------------- */
      //Checks if data.bodies exists and if it is an array
      //If answer is positive then executes the functions
      if (data.bodies && Array.isArray(data.bodies)) {
        planetData = data.bodies;
        console.log("Received data:", planetData);
        attachClickEvents();
        attachHoverEvents();
      } else {
        console.error("Invalid data format from API");
      }


      if (!response.ok) {
        throw new Error(`Error during Api request. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Main error:", error);
    }
  }

  /* ---------------------FUNCTION : getClickableList()------------ */
  //encloses the elements with class "toClick" in an array

  function getClickableList() {
    const clickableElements = document.querySelectorAll(".toClick");
    return Array.from(clickableElements);
  }

  /* ---------------------FUNCTION : attachClickEvents()------------ */
  // creates a loop through clickable elements
  // assign a click EVENT LISTENER to each clickable element
  // compares and MATCHES the index of the array of clickable elements with the index of the array returned by the API
  // encloses the HTML content of the overlay in a variable with the dynamic parts entrusted to template literals
  // replace the "template litterals" with the values obtained from the api

  function attachClickEvents() {
    const clickableList = getClickableList();
    clickableList.forEach((element, index) => {
      element.addEventListener("click", () => {
        if (planetData && planetData.length > index) {
          selectedPlanet = planetData[index];
          console.log("Selected Planet:", selectedPlanet);

        const overlayContent = `  <div class="overlay" id="pageOverlay">
            <button id="goBackBtn">&leftarrow;</button>
            <div class=" planetsImg  ${selectedPlanet.name.toLowerCase()}"></div>
            ${
              selectedPlanet.name.toLowerCase() === "saturnus"
                ? '<div class="ring2"></div>'
                : ""
            }
            <div class="planetInfo">
            
              <div class="titlesBoxOverlay">
                <h1>${selectedPlanet.name}</h1>
                <h2>${selectedPlanet.latinName}</h2>
              </div>
              <p>${selectedPlanet.desc}</p>
              <hr>
              <div class="detailsBox" >
                <div class="detailType1">
                  <div class="details">
                    <h3>OMKRETS</h2>
                    <P>${selectedPlanet.circumference} Km</P>
                  </div>
                  <div class="details ">
                    <h3>MAX TEMPERATUR</h2>
                    <P>${selectedPlanet.temp.day} C</P>
                  </div>
                </div>
                <div class="detailType2">
                  <div class="details">
                    <h3>KM FRÅN SOLEN</h2>
                    <P>${selectedPlanet.distance} Km</P>
                  </div>
                  <div class="details">
                    <h3>MIN TEMPERATUR</h2>
                    <P>${selectedPlanet.temp.night} C</P>
                  </div>
                </div>
              </div>
              <hr>
              <div class="moons details">
                <h3>MÅNAR</h2>
                <P>${
                  selectedPlanet.moons.length > 0
                    ? selectedPlanet.moons.join(", ")
                    : "Noll"
                }</P>
              </div>
            </div>
          </div>`;

          //makes the body empty and fills it with the generated overlay
          document.body.innerHTML = "";
          document.body.innerHTML = overlayContent;
          if (spaceSound) {
            spaceSound.play(); //play a sound when a planet infos are showed
          }


          /* ---------------------EVENT LISTENER : goBack button------------ */
          // remove the overlay
          // makes the body empty again
          // show the mainPage's content

          const goBackBtn = document.getElementById("goBackBtn");
          if (goBackBtn) {
            goBackBtn.addEventListener("click", () => {
              document.body.removeChild(pageOverlay);

              if (mainPage) {
                document.body.innerHTML = "";
                document.body.appendChild(mainPage);
                generateStarField(); //re-creates stars bkg for the mainPage
              }

            
            });
          }
          generateStarField(); //create stars bkg for the overlay
        } else {
          console.error("Planet data undefined or index out of bounds");
        }

        if (spaceSound) {
          spaceSound.play(); //play a sound when a planet infos are showed
        }
      });
    });
  }

  /* ---------------------FUNCTION : attachHoverEvents()------------ */
  // creates 2 EVENT LISTENER (mouseover,mouseout) to handle the planets name preview
  // creates a container where to place the preview
  // uses a similar method used in click event listener

  function attachHoverEvents() {
    const clickableList = getClickableList();
    let previewCreated = false;

    clickableList.forEach((element, index) => {
      element.addEventListener("mouseover", () => {
        console.log("Mouse over planet");
        if (planetData && planetData.length > index && !previewCreated) {
          selectedPlanet = planetData[index];
          const previewContainer = document.createElement("div");
          previewContainer.classList.add("preview-container");
          const planetName = document.createElement("h3");
          planetName.innerText = selectedPlanet.name;
          planetName.classList.add("preview");
          previewContainer.appendChild(planetName);
          document.body.appendChild(previewContainer);
          previewCreated = true; //flag that shows that the preview is created
        }
      });

      element.addEventListener("mouseout", () => {
        // remove preview only if it has been created (that's why the flag)
        if (previewCreated) {
          const previewContainer = document.querySelector(".preview-container");
          if (previewContainer) {
            previewContainer.remove();
          }
          previewCreated = false; // reset the plag on "removed"
        }
      });
    });
  }

  /* ---------------------FUNCTION : generateStarField()------------ */
  // creats 100 stars and distributes them in the created container in random position and size (getRandomNumber())

  function generateStarField() {
    const starContainer = document.createElement("div");
    starContainer.id = "star-container";

    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const size = getRandomNumber(1, 4);
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${getRandomNumber(0, 100)}vh`;
      star.style.left = `${getRandomNumber(0, 100)}vw`;
      starContainer.appendChild(star);
    }

    document.body.appendChild(starContainer);
  }

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
});
