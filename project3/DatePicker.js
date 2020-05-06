"use strict";

function DatePicker(id, callback) {
    this.id = id;
    this.callback = callback;
}

// Create the elements in HTML to display the calendar
DatePicker.prototype._createStructure = function () {
    // Create button div at the header of calendar
    let wrapperDiv = document.getElementById(this.id);
    wrapperDiv.innerHTML = ""; // Clear previous view
    let calendarDiv = document.createElement('div');
    calendarDiv.setAttribute('id', this.id+'-calendar-container');


    let buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class', 'button-container');
    let previousBtn = document.createElement("BUTTON");
    previousBtn.setAttribute('id', this.id+'-previous');
    previousBtn.innerHTML = "<";
    let nextBtn = document.createElement("BUTTON");
    nextBtn.setAttribute('id', this.id+'-next');
    nextBtn.innerHTML = ">";
    let monthHeader = document.createElement("h3");
    monthHeader.setAttribute('id', this.id+'-monthHeader');
    let yearHeader = document.createElement("P");
    yearHeader.setAttribute('id', this.id+'-yearHeader');

    buttonDiv.appendChild(previousBtn);
    buttonDiv.appendChild(nextBtn);
    buttonDiv.appendChild(monthHeader);
    buttonDiv.appendChild(yearHeader);
    calendarDiv.appendChild(buttonDiv);

    // Create table div below the button header
    let tableDiv = document.createElement('table');
    tableDiv.setAttribute('class', 'calendar-table');
    tableDiv.setAttribute('id', this.id+'-calender');
    let theadMonth = document.createElement('thead');
    theadMonth.setAttribute('id', this.id+'-thead-month');
    let tableBody = document.createElement('tbody');
    tableBody.setAttribute('id', this.id+'-table-body');
    tableDiv.appendChild(theadMonth);
    tableDiv.appendChild(tableBody);
    calendarDiv.appendChild(tableDiv);
    wrapperDiv.appendChild(calendarDiv);
};

DatePicker.prototype._renderTableHeader = function() {
    let days = "";
    let daysArr = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    days = daysArr;
    let theadMonth = document.getElementById(this.id+"-thead-month");
    let dataHead = "<tr>";
    let startDay = "";

    // Create a header row to display the days of the week
    for(let day of days) {
        if(day === "Su") {
            startDay = "red-text";
        } else {
            startDay = "";
        }
        dataHead += "<th data-days='" + day + "' class='" + startDay + "'>" + day + "</th>";
    }
    dataHead += "</tr>";
    theadMonth.innerHTML = dataHead;
};

DatePicker.prototype._renderTableBody = function(month, year, today) {
    let monthHeader = document.getElementById(this.id+"-monthHeader");
    let yearHeader = document.getElementById(this.id+"-yearHeader");
    let tableBody = document.getElementById(this.id+'-table-body');
    tableBody.innerHTML = ""; // Clear previous view

    // Set table header content
    let months = "";
    let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    months = monthsArr;
    let monthName = monthsArr[month];
    monthHeader.innerHTML = monthName;
    yearHeader.innerHTML = year;

    let date  = 1;
    let firstDay = new Date(year, month).getDay();
    let firstDate = new Date(year, month);
    let lastDate = new Date(new Date(year, month+1, 1)-1);
    let exitFlag = false;
    for(let r = 0; r < 6 && !exitFlag; r++) {
        let row = document.createElement('tr');
        for(let c = 0; c < 7; c++) {
            let cell = document.createElement('td');
            if (r === 0 && c < firstDay) {
                let previousDate = new Date(firstDate);
                previousDate.setDate(firstDate.getDate()-(firstDay-c));
                cell.className = this.id+"-date-unpicker";
                cell.innerHTML = "<span>"+previousDate.getDate()+"</span>";
                row.appendChild(cell);
            } else if(date > lastDate.getDate()) {
                let cell = document.createElement('td');
                let nextDate = new Date(year, month, (date-lastDate.getDate())).getDate();
                cell.className = this.id+"-date-unpicker";
                cell.innerHTML = "<span>"+nextDate+"</span>";
                row.appendChild(cell);
                date++;
                if(c+1 === 7) {
                    exitFlag = true;
                }
            } else {
                cell.setAttribute("data-date", date);
                cell.setAttribute("data-month", month+1);
                cell.setAttribute("data-year", year);
                cell.setAttribute("data-month-name", months[month]);

                cell.className = this.id+"-date-picker";
                cell.innerHTML = "<span>" + date + "</span>";
                cell.onclick = (event) => {
                    let dates = document.querySelectorAll("."+this.id+"-date-picker");
                    let currentTarget = event.currentTarget;
                    let encodeDate = {"year":currentTarget.dataset.year, "month": currentTarget.dataset.month,
                        "day": currentTarget.dataset.date};
                    this.callback(this.id, encodeDate);

                    for (let i = 0; i < dates.length; i++) {
                        dates[i].classList.remove("selected");
                    }
                    currentTarget.classList.add("selected");
                };

                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.className = this.id+"-date-picker selected";
                }
                row.appendChild(cell);
                if(date === lastDate.getDate() && c+1 === 7) {
                    exitFlag = true;
                }
                date++;
            }
        }
        tableBody.appendChild(row);
    }
};

DatePicker.prototype.render = function(currentDate) {
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    // Outline DOM in HTML
    this._createStructure();

    // Locate elements
    let nextBtn = document.getElementById(this.id+"-next");
    let previousBtn = document.getElementById(this.id+ "-previous");

    this._renderTableHeader();
    this._renderTableBody(currentMonth, currentYear, currentDate);


    previousBtn.addEventListener("click", (event) => {
        let currentMonth = document.getElementById(this.id+"-monthHeader").textContent;
        let currentYear = parseInt(document.getElementById(this.id+"-yearHeader").textContent);
        currentMonth = new Date(Date.parse(currentMonth+" "+currentYear.toString())).getMonth();
        if(currentMonth === 0) {
            currentYear -= 1;
            currentMonth = 11;
        } else {
            currentMonth -= 1;
        }
        this._renderTableBody(currentMonth, currentYear, currentDate);
    });

    nextBtn.addEventListener("click", (event) =>{
        let currentMonth = document.getElementById(this.id+"-monthHeader").textContent;
        let currentYear = parseInt(document.getElementById(this.id+"-yearHeader").textContent);
        currentMonth = new Date(Date.parse(currentMonth+" "+currentYear.toString())).getMonth();
        if(currentMonth === 11) {
            currentYear += 1;
            currentMonth = 0;
        } else {
            currentMonth += 1;
        }
        this._renderTableBody(currentMonth, currentYear, currentDate);
    });

};

