const SEMESTER_START = new Date("2026-09-14");
const SEMESTER_END = new Date("2026-12-12");
const FILTERBUTTONS = document.querySelectorAll('.filter-btn');

const DAY_CLASSES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok'];
const TYPE_CLASSES = { lection: 'lection', practical: 'practical', PE: 'physicalEducation' };
const CURRENT_CLASS = 'stressed';
const NEXT_CLASS = 'lesson-next';
const LESSON_LENGTH_HOURS = 2;
let activeFilter = 'everything';

const FILTER_RULES = {
    everything: () => true,
    lection: type => type === 'lection',
    practical: type => type === 'practical' || type === 'PE'
};

const SCHEDULE = [
    {
        time: 7,
        items: [null, null, null, null, null]
    }, {
        time: 8,
        items: [
            null,
            { title: "<strong> Digital Communication 2</strong> <br> <span>AB300</span>", firstPart: true, type: "lection" },
            null,
            { title: "<strong> Prenosové systémy a siete </strong><br><span>AB150</span>", firstPart: true, type: "lection" },
            null
        ]
    }, {
        time: 9,
        items: [
            null,
            { title: "DK2", firstPart: false, type: "lection" },
            null,
            { title: "PSS", firstPart: false, type: "lection" },
            null
        ]
    }, {
        time: 10,
        items: [
            { title: "<strong> Siete novej generácie </strong><br><span> B715</span>", firstPart: true, type: "lection" },
            { title: "<strong> Web technology 1</strong><br><span>CD150</span>", firstPart: true, type: "lection" },
            null,
            { title: "<strong> Spracovanie multimédií </strong><br><span>B427</span>", firstPart: true, type: "practical" },
            null
        ]
    }, {
        time: 11,
        items: [
            { title: "NGN", firstPart: false, type: "lection" },
            { title: "WEB1", firstPart: false, type: "lection" },
            { title: "<strong> Telesná kultúra 5 </strong><br><span>E009</span>", firstPart: true, type: "PE" },
            { title: "SPMM", firstPart: false, type: "practical" },
            null
        ]
    }, {
        time: 12,
        items: [
            null,
            null,
            { title: "TK5", firstPart: false, type: "PE" },
            null,
            null
        ]
    }, {
        time: 13,
        items: [
            { title: "<strong>Webové technológie 1</strong><br><span>C137</span>", firstPart: true, type: "practical" },
            { title: "<strong>Digital Communication 2</strong><br><span>B617</span>", firstPart: true, type: "practical" },
            { title: "<strong>Spracovanie multimédií</strong><br><span>AB150</span>", firstPart: true, type: "lection" },
            { title: "<strong>Prenosové systémy a siete</strong><br><span>AB150</span>", firstPart: true, type: "practical" },
            null
        ]
    }, {
        time: 14,
        items: [
            { title: "WEB1", firstPart: false, type: "practical" },
            { title: "DK2", firstPart: false, type: "practical" },
            { title: "SPMM", firstPart: false, type: "lection" },
            { title: "PSS", firstPart: false, type: "practical" },
            null
        ]
    },
    { time: 15, items: [{ title: "<strong>Siete novej generácie</strong><br><span>B527</span>", firstPart: true, type: "practical" }, null, null, null, null] },
    { time: 16, items: [{ title: "NGN", firstPart: false, type: "practical" }, null, null, null, null] },
    { time: 17, items: [null, null, null, null, null] },
    { time: 18, items: [null, null, null, null, null] },
    { time: 19, items: [null, null, null, null, null] },
    { time: 20, items: [null, null, null, null, null] }
];

function initSemesterProgress() {
    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressPercentEl = document.getElementById("progress-percent");
    const progressStart = document.getElementById("START-SEMESTER");
    const progressEnd = document.getElementById("END-SEMESTER");

    if (!progressBarFill || !progressPercentEl) return;

    const now = new Date();

    if (now > SEMESTER_END) {
        const container = document.getElementById("dates-sch");
        container.innerHTML = '<div class="semester-ended-text">Semester už sa skončil.</div>';
        return;
    }

    const totalDuration = SEMESTER_END - SEMESTER_START;
    const elapsed = now - SEMESTER_START;

    let percent = (elapsed / totalDuration) * 100;
    percent = Math.max(0, Math.min(100, percent));

    progressBarFill.style.width = percent.toFixed(1) + "%";
    progressPercentEl.textContent = percent.toFixed(1) + "%";

    if (!progressStart || !progressEnd) return;

    const options = { day: 'numeric', month: 'long' };
    const formatter = new Intl.DateTimeFormat('sk-SK', options);

    progressStart.textContent = formatter.format(SEMESTER_START);
    progressEnd.textContent = formatter.format(SEMESTER_END);
}

function getLessonName(item) {
    const holder = document.createElement('div');
    holder.innerHTML = item.title;
    const strong = holder.querySelector('strong');
    return strong ? strong.textContent.trim() : '';
}

function formatHour(hour) {
    return String(hour).padStart(2, '0') + ':00';
}

function renderSchedule(filterName) {
    const tableBody = document.getElementById('Table-Body');
    const emptyMessage = document.getElementById('no-classes-message');
    const matches = FILTER_RULES[filterName];
    if (!tableBody || !matches) return;

    tableBody.innerHTML = '';
    let visibleCount = 0;

    SCHEDULE.forEach(slot => {
        const row = document.createElement('tr');

        const timeCell = document.createElement('td');
        timeCell.textContent = formatHour(slot.time);
        row.appendChild(timeCell);

        slot.items.forEach((item, dayIndex) => {
            const cell = document.createElement('td');
            cell.classList.add(DAY_CLASSES[dayIndex]);

            const isVisible = item !== null && matches(item.type);

            if (!isVisible) {
                cell.classList.add('empty');
            } else if (item.firstPart) {
                cell.innerHTML = item.title;
                cell.rowSpan = LESSON_LENGTH_HOURS;
                cell.classList.add(TYPE_CLASSES[item.type]);
                cell.dataset.day = dayIndex;
                cell.dataset.hour = slot.time;
                visibleCount++;
            } else {
                cell.hidden = true; // covered by the rowspan of the first part
            }

            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    if (emptyMessage) emptyMessage.hidden = visibleCount > 0;

    updateCurrentLesson(); // re-apply highlight after every redraw
}

function getCurrentLesson(now) {
    const dayIndex = now.getDay() - 1; // Monday = 0
    if (dayIndex < 0 || dayIndex > 4) return null;

    const hour = now.getHours();
    for (const slot of SCHEDULE) {
        const item = slot.items[dayIndex];
        if (item && item.firstPart && hour >= slot.time && hour < slot.time + LESSON_LENGTH_HOURS) {
            return { dayIndex, hour: slot.time, item };
        }
    }
    return null;
}

function getNextLesson(now) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const todayIndex = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6

    for (let offset = 0; offset <= 7; offset++) {
        const dayIndex = (todayIndex + offset) % 7;
        if (dayIndex > 4) continue;

        for (const slot of SCHEDULE) {
            const item = slot.items[dayIndex];
            if (!item || !item.firstPart) continue;
            if (offset === 0 && slot.time * 60 <= nowMinutes) continue;
            return { dayIndex, hour: slot.time, item, offset };
        }
    }
    return null;
}

function highlightLesson(dayIndex, hour, className) {
    const cell = document.querySelector(
        `.schedule-table td[data-day="${dayIndex}"][data-hour="${hour}"]`
    );
    if (cell) cell.classList.add(className);
}

function updateCurrentLesson() {
    const statusElement = document.getElementById('schedule-status');
    document.querySelectorAll('.schedule-table td').forEach(cell => {
        cell.classList.remove(CURRENT_CLASS, NEXT_CLASS);
    });

    const now = new Date();
    const current = getCurrentLesson(now);

    if (current) {
        highlightLesson(current.dayIndex, current.hour, CURRENT_CLASS);
        if (statusElement) {
            statusElement.textContent = `Práve prebieha: ${getLessonName(current.item)}.`;
        }
        return;
    }

    const next = getNextLesson(now);
    if (!next) {
        if (statusElement) statusElement.textContent = 'Momentálne nemám žiadnu výučbu.';
        return;
    }

    highlightLesson(next.dayIndex, next.hour, NEXT_CLASS);

    if (statusElement) {
        let when = DAY_LABELS[next.dayIndex];
        if (next.offset === 0) when = 'dnes';
        if (next.offset === 1) when = 'zajtra';
        statusElement.textContent =
            `Teraz nemám výučbu. Najbližšia hodina: ${when} o ${formatHour(next.hour)} — ${getLessonName(next.item)}.`;
    }
}

FILTERBUTTONS.forEach(button => {
    button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        FILTERBUTTONS.forEach(other => {
            other.classList.toggle('active', other === button);
            other.setAttribute('aria-pressed', String(other === button));
        });
        renderSchedule(activeFilter);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    initSemesterProgress();
    renderSchedule(activeFilter);
    setInterval(updateCurrentLesson, 60 * 1000);
});