const SEMESTER_START = new Date("2026-09-14"); 
const SEMESTER_END = new Date("2026-12-12");  
const FILTERBUTTONS = document.querySelectorAll('.filter-btn'); 

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

                break;

            case 'lection':
                turnOffAllFiltersButtons();
                button.classList.add("active");



                break;

            case 'practical':
                turnOffAllFiltersButtons();
                button.classList.add("active");

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
    const DAYOFWEEKS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

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