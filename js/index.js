var currPage;
var totalPages;
var data;
const slideIndex = 5;

function submitAction() {
  let filesObj = document.getElementById("fileToUpload");
  let csvFile = filesObj.files[0];
  console.log(csvFile);
  let reader = new FileReader();
  if (csvFile) {
    reader.readAsText(csvFile);
  } else {
    console.error("please select csv file");
  }

  reader.onload = () => {
    let fileData = reader.result;
    data = parseCSV(fileData);
    console.log("parse data", data);
    displaySlider(data);
  };

  reader.onerror = () => {
    console.log(reader.error);
  };
}

let handleClick = (data, pageNumber) => {
  console.log(data);
  currPage = pageNumber;
  console.log("currPage", currPage);
  if (currPage != -1) {
    console.log("slice first arg :", currPage * slideIndex);
    console.log("slice 2nd arg :", (currPage + 1) * slideIndex);
    const paginatedData = data.slice(
      currPage * slideIndex,
      (currPage + 1) * slideIndex
    );
    console.log("paginateData with next ", paginatedData);
    setNavigationAttr(currPage);
    displaySliderContent(paginatedData);
  }
};

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

function displaySlider(data) {
  console.log(data, "DATA FROM CSV");
  currPage = 0;
  // let disablePrev = currPage == 0 ? "prev-btn disabled" : "prev-btn ";
  // let disableNext =
  //   currPage == data.length % slideIndex ? "next-btn disabled" : "next-btn";
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

function displaySliderContent(paginatedData) {
  const sliderContainer = document.getElementById("slider-container");
  const slideItemContainer = document.getElementById("slider-item-container");
  slideItemContainer.innerHTML = "";
  console.log("paginateData: ", paginatedData);
  paginatedData.forEach((slide) => {
    console.log(slide);
    let slideItem = document.createElement("div");
    slideItem.setAttribute("class", "slider-item");
    const slideContent = `
                        <p>
                        ${slide.firstName}
                        </p>
                        <p>
                        ${slide.lastName}
                        </p>
                        <p>
                        ${slide.age}
                        </p>
                              `;
    slideItem.innerHTML = slideContent;
    slideItemContainer.appendChild(slideItem);
  });
  console.log(sliderContainer);
}

function parseCSV(dataStr, delimiter = ",") {
  const headerTitleRow = dataStr
    .slice(0, dataStr.indexOf("\n"))
    .split(delimiter);
  //    console.log(headerTitleRow);
  const rows = dataStr.slice(dataStr.indexOf("\n") + 1).split("\n");

  return rows.map((row) => {
    // Convert to 2D array
    const values = row.split(delimiter);
    // Convert array to object
    return headerTitleRow.reduce((object, curr, i) => {
      object[curr.trim()] = values[i].trim();
      return object;
    }, {});
  });
}
