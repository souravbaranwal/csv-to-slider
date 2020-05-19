var currPage;
var totalPages;
var data;
const slideIndex = 5;

/**
 * Description : This method is called after upload csv button click and
 * it parses the csv file to a JS file object
 */
function submitAction() {
  let filesObj = document.getElementById("fileToUpload");
  let csvFile = filesObj.files[0];

  let reader = new FileReader();
  if (csvFile) {
    reader.readAsText(csvFile);
  } else {
    console.error("please select csv file to upload");
    alert("please select csv file to upload");
  }

  reader.onload = () => {
    let fileData = reader.result;
    data = parseCSV(fileData);

    displaySlider(data);
  };

  reader.onerror = () => {
    console.error(reader.error);
  };
}

/**
 * Description: This method is use to parse the csv file object to slider data
 * @param {*} dataStr
 * @param {*} delimiter
 */
function parseCSV(dataStr, delimiter = ",") {
  const headerTitleRow = dataStr
    .slice(0, dataStr.indexOf("\n"))
    .split(delimiter);

  const rows = dataStr.slice(dataStr.indexOf("\n") + 1).split("\n");

  return rows.map((row) => {
    const values = row.split(delimiter);

    return headerTitleRow.reduce((object, curr, i) => {
      object[curr.trim()] = values[i].trim();
      return object;
    }, {});
  });
}

/**
 * Description : This method is used to populate the slider
 * csv file is parsed
 * @param {*} data
 */
function displaySlider(data) {
  currPage = 0;

  let sliderHtml = `<div id="slider" class="slider">
  <div class='button-container'>
  <button id="prevBtn" onClick='handleClick(data,currPage-1)' >
      prev
  </button>
    
    </div>
    <div class="slider-item-container" id='slider-item-container'></div>

    <div class='button-container'>
    
    <button id="nextBtn" onclick='handleClick(data,currPage+1)'  >
        next
    </button>
    </div>
 </div>`;

  const sliderContainer = document.getElementById("slider-container");
  sliderContainer.innerHTML = sliderHtml;

  const paginatedData = data.slice(
    currPage * slideIndex,
    (currPage + 1) * slideIndex
  );
  setNavigationAttr(currPage);
  displaySliderContent(paginatedData);
}

/**
 * Description : This method is used to set the active/disabled status
 * of the control buttons (Next & Prev)
 * @param {*} currPage
 */
function setNavigationAttr(currPage) {
  let prevBtnClass = currPage == 0 ? "prev-btn disabled" : "prev-btn ";
  let nextBtnClass = "";
  let totalPages = Math.ceil(data.length / slideIndex);
  if (totalPages == 1) {
    nextBtnClass = "next-btn disabled";
  } else {
    if (currPage == 0) {
      nextBtnClass = "next-btn";
    } else if (currPage == totalPages - 1) {
      nextBtnClass = "next-btn disabled";
    }
  }

  let prevBtn = document.getElementById("prevBtn");
  let nextBtn = document.getElementById("nextBtn");

  prevBtn.setAttribute("class", prevBtnClass);
  nextBtn.setAttribute("class", nextBtnClass);
}

/**
 * Description : This method is used to attached the paginated slide
 * content into the slider
 * @param {*} paginatedData
 */
function displaySliderContent(paginatedData) {
  const sliderContainer = document.getElementById("slider-container");
  const slideItemContainer = document.getElementById("slider-item-container");
  slideItemContainer.innerHTML = "";

  paginatedData.forEach((slide) => {
    let slideKeys = Object.keys(slide);
    let slideItem = document.createElement("div");
    slideItem.setAttribute("class", "slider-item");
    let slideContent = "";
    slideKeys.forEach((column) => {
      slideContent += `<p>${column} : ${slide[column]}</p>`;
    });
    // const slideContent = `
    //                     <p>
    //                     ${slide.firstName}
    //                     </p>
    //                     <p>
    //                     ${slide.lastName}
    //                     </p>
    //                     <p>
    //                     ${slide.age}
    //                     </p>
    //                           `;
    slideItem.innerHTML = slideContent;
    slideItemContainer.appendChild(slideItem);
  });
}

/**
 * Description : This method is used to handle the Prev/Next button
 * click event
 * @param {*} data
 * @param {*} pageNumber
 */
let handleClick = (data, pageNumber) => {
  currPage = pageNumber;

  if (currPage != -1) {
    const paginatedData = data.slice(
      currPage * slideIndex,
      (currPage + 1) * slideIndex
    );

    setNavigationAttr(currPage);
    displaySliderContent(paginatedData);
  }
};
