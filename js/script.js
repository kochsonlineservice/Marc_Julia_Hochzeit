function init() {
    renderHeader();
    renderMain();
    renderSchedule();
    renderFooter();
    renderLocation();
}

function renderHeader() {
    document.getElementById("header").innerHTML = getHeaderTemplate();
}


function renderMain(){
    document.getElementById("content").innerHTML = getMainTemplate();
}


function renderSchedule(){



for (let index = 0; index < weddingSchedule.length; index++) {
    
  const schedule = weddingSchedule[index];


  document.getElementById("ablauf").innerHTML +=  
  `

  <p class="ablauf">
    <span class="ablauf-zeit">${schedule.time}</span>
    <span class="ablauf-event">${schedule.event}</span>
</p>
  
  `    ;
}
}


function renderLocation() {
    document.getElementById("location").innerHTML = getLocationTemplate();
}



function renderFooter() {
    document.getElementById("footer").innerHTML = getFooterTemplate();
}


