const SEMESTER_START = new Date("2026-09-14"); 
const SEMESTER_END = new Date("2026-12-12");  
const FILTERBUTTONS = document.querySelectorAll('.filter-btn'); 
const DAYOFWEEKS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const SCHEDULE = [ 
{
    time: 7,
    items: [ null, null, null, null, null ]
}, {  
    time: 8,
    items: [ 
            null,
            {title: "<strong> Digital Communication 2</strong> <br> <span>AB300</span>", firstPart: true, type: "lection" },
            null,
            {title: "<strong> Prenosove systemy a siete </strong><br><span>AB150</span>", firstPart: true, type: "lection" },
            null
    ]
}, {
    time: 9,
    items: [
        null,
        {title: "DK2", firstPart: false, type: "lection" },
        null,
        {title: "PSS", firstPart: false, type: "lection" },
        null
    ]
}, {
    time: 10,
    items: [
        {title: "<strong> Siete novej generacie </strong><br><span> B715</span>", firstPart: true, type: "lection" },
        {title: "<strong> Web tecnology 1</strong><br><span>CD150</span>", firstPart: true, type: "lection" },
        null,
        {title: "<strong> Spracovanie multimedia </strong><br><span>B427</span>", firstPart: true, type: "practical" },
        null
    ]
}, {
    time: 11,
    items: [
        {title: "NGN", firstPart: false, type: "lection" },
        {title: "WEB1", firstPart: false, type: "lection" },
        {title: "<strong> Telesna kultura 5 </strong><br><span>E009</span>", firstPart: true, type: "PE" },
        {title: "SPMM", firstPart: false, type: "practical" },
        null,
    ]
}, {
    time: 12,
    items: [
        null,
        null,
        {title: "TK5", firstPart: false, type: "PE" },
        null,
        null
    ]
}, {
    time: 13,
    items: [
        {title: "<strong>Webove technologie 1</strong><br><span>C137</span>", firstPart: true, type: "practical" },
        {title: "<strong>Digital Communication 2</strong><br><span>B617</span>", firstPart: true, type: "practical" },
        {title: "<strong>Spracovanie multimedia</strong><br><span>AB150</span>", firstPart: true, type: "lection" },
        {title: "<strong>Prenosove systemy a siete</strong><br><span>AB150</span>", firstPart: true, type: "practical" },
        null
    ]
}, {
    time: 14,
    items: [
        {title: "WEB1", firstPart: false, type: "practical" },
        {title: "DK2", firstPart: false, type: "practical" },
        {title: "SPMM", firstPart: false, type: "lection" },
        {title: "PSS", firstPart: false, type: "practical" },
        null
    ]},

    { time: 15, items: [{title: "<strong>Siete novej generacie</strong><br><span>B527</span>", firstPart: true, type: "practical" }, null, null, null, null ]},
    { time: 16, items: [ {title: "NGN", firstPart: false, type: "practical" }, null, null, null, null ]},
    { time: 17, items: [ null, null, null, null, null ]},
    { time: 18, items: [ null, null, null, null, null ] },
    { time: 19, items: [ null, null, null, null, null ]},
    { time: 20, items: [ null, null, null, null, null ]}
];

function turnOffAllFiltersButtons() {
    FILTERBUTTONS.forEach(button => {
        button.classList.remove("active");
    });
}

FILTERBUTTONS.forEach(button => {
    button.addEventListener('click', function() {
        const filterValue = this.dataset.filter; 
        
        console.log("Used filter: ", filterValue);

        switch(filterValue) {
            case 'everything':
                turnOffAllFiltersButtons();
                button.classList.add("active");

                const tableEvery = document.getElementById("Table-Body");
                tableEvery.innerHTML = '';

                SCHEDULE.forEach(slot => {
                    const tr = document.createElement('tr');

                    const td_time = document.createElement('td');
                    td_time.textContent = slot.time + ':00';

                    tr.appendChild(td_time);
                    let DayOfWeek = 1;

                    slot.items.forEach(element => {
                        const td = document.createElement('td');
                        DayofWeek = 1;


                        if(element === null) {
                            td.classList.add("empty");
                        } else {
                            if(element.firstPart === true){
                                td.innerHTML = element.title;
                                td.rowSpan=2;
                                
                                if(element.type==="lection") td.classList.add("lection");
                                if(element.type==="practical") td.classList.add("practical");
                                if(element.type==="PE") td.classList.add("physicalEducation");

                            } else {
                                td.style.display="none";
                            }
                        }

                        td.classList.add(DAYOFWEEKS[DayOfWeek].toString());

                        DayOfWeek++;

                        tr.appendChild(td);
                    });

                    tableEvery.appendChild(tr);
                });

                
                break;

            case 'practical':
                turnOffAllFiltersButtons();
                button.classList.add("active");

                const tablePractical = document.getElementById("Table-Body");
                tablePractical.innerHTML = '';

                SCHEDULE.forEach(slot => {
                    const tr = document.createElement('tr');

                    const td_time = document.createElement('td');
                    td_time.textContent = slot.time + ':00';

                    tr.appendChild(td_time);
                    let DayOfWeek = 1;

                    slot.items.forEach(element => {
                        const td = document.createElement('td');
                        DayofWeek = 1;


                        if(element === null || element.type === "lection") {
                            td.classList.add("empty");
                        } else {
                            if(element.firstPart === true){
                                td.innerHTML = element.title;
                                td.rowSpan=2;
                                if(element.type === "PE"){
                                    td.classList.add("physicalEducation");
                                } else {
                                    td.classList.add("practical");
                                }
                            } else {
                                td.style.display="none";
                            }
                        }

                        td.classList.add(DAYOFWEEKS[DayOfWeek].toString());

                        DayOfWeek++;

                        tr.appendChild(td);
                    });

                    tablePractical.appendChild(tr);
                });

                break;

            case 'lection':
                turnOffAllFiltersButtons();
                button.classList.add("active");

                const table = document.getElementById("Table-Body");
                table.innerHTML = '';

                SCHEDULE.forEach(slot => {
                    const tr = document.createElement('tr');

                    const td_time = document.createElement('td');
                    td_time.textContent = slot.time + ':00';

                    tr.appendChild(td_time);
                    let DayOfWeek = 1;

                    slot.items.forEach(element => {
                        const td = document.createElement('td');
                        DayofWeek = 1;


                        if(element === null || element.type === "practical" || element.type === "PE") {
                            td.classList.add("empty");
                        } else {
                            if(element.firstPart === true){
                                td.innerHTML = element.title;
                                td.rowSpan=2;
                                td.classList.add("lection");
                            } else {
                                td.style.display="none";
                            }
                        }

                        td.classList.add(DAYOFWEEKS[DayOfWeek].toString());

                        DayOfWeek++;

                        tr.appendChild(td);
                    });

                    table.appendChild(tr);
                });


                break;
            
            default:
                console.error('Filter isnt founded');
        }
        
    });
});

document.addEventListener("DOMContentLoaded", () => {
    initSemesterProgress();
    initScheduleTracker();
});


function initSemesterProgress() {
    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressPercentEl = document.getElementById("progress-percent");
    const progressStart = document.getElementById("START-SEMESTER");
    const progressEnd = document.getElementById("END-SEMESTER");

    if (!progressBarFill || !progressPercentEl) return;

    const now = new Date();
    const totalDuration = SEMESTER_END - SEMESTER_START;
    const elapsed = now - SEMESTER_START;

    let percent = (elapsed / totalDuration) * 100;
    percent = Math.max(0, Math.min(100, percent)); 

    progressBarFill.style.width = percent.toFixed(1) + "%";
    progressPercentEl.textContent = percent.toFixed(1) + "%";

    if(!progressStart | !progressEnd) return;

    const options = { day: 'numeric', month: 'long' }; 
    const formatter = new Intl.DateTimeFormat('sk-SK', options);

    progressStart.textContent = formatter.format(SEMESTER_START);
    progressEnd.textContent = formatter.format(SEMESTER_END);
}

function initScheduleTracker(day, hour) {
    

    let now = new Date();
    let currentDay = (day !== undefined) ? day : now.getDay();
    let currentHour = (hour !== undefined) ? hour : now.getHours();

    if(day && hour) {
        currentDay = day;
        currentHour = hour;
    }

    if(currentDay === 0 || currentDay === 6) {
        currentDay = 1;
        currentHour = 7;
    }

    if (currentHour >= 21) {
        currentDay = (currentDay + 1) % 7;
        currentHour = 7;
    } else if (currentHour < 7) {
        currentHour = 7;
    }

    let targetCell = null;
    const rows = document.querySelectorAll('.schedule-table tbody tr');

    while (!targetCell) {
        const dayName = DAYOFWEEKS[currentDay];

        for (const row of rows) {
            const timeCell = row.cells[0];
            if (!timeCell) continue;

            const rowHour = parseInt(timeCell.textContent.trim().split(':')[0], 10);

            if (rowHour === currentHour) {
                const dayCell = row.querySelector(`td.${dayName}`);

                if(dayCell) {
                    const hasText = dayCell.textContent.trim() !== "";
                    const isDisplayNone = dayCell.style.display === 'none';
                    
                    if (hasText) {
                        targetCell = dayCell;
                        break;
                    }

                    if(isDisplayNone) {
                        initScheduleTracker(currentDay, currentHour - 1);
                        return;
                    }
                }

                if (dayCell.style.display == 'none') {
                    initScheduleTracker(currentDay, currentHour - 1);
                    targetCell = null;
                    break;
                }
            }
        }

        if (!targetCell) {
            currentHour++;

            if (currentHour > 20) {
                currentHour = 7;
                currentDay = (currentDay + 1) % 7;
            }
        }
    }

    document.querySelectorAll('.schedule-table td').forEach(td => td.classList.remove('stressed'));
    targetCell.classList.add('stressed');
}