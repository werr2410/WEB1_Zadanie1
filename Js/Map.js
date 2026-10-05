document.addEventListener("DOMContentLoaded", function () {
    const FIXED_POINTS = [
        { name: "STU FEI", lat: 48.1511, lng: 17.0733, type: "fixed" },
        { name: "Moje pracovne pracovisko", lat: 48.158872, lng: 17.063935, type: "fixed" }
    ];

    const map = L.map('map').setView([48.1515, 17.0700], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let markersLayer = L.layerGroup().addTo(map);
    let polylineLayer = L.layerGroup().addTo(map);

    let customPoints = JSON.parse(localStorage.getItem('customMapPoints')) || [];

    function getAllPoints() {
        return [...FIXED_POINTS, ...customPoints];
    }

    function saveCustomPoints() {
        localStorage.setItem('customMapPoints', JSON.stringify(customPoints));
    }

    function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const phi1 = lat1 * Math.PI / 180;
        const phi2 = lat2 * Math.PI / 180;
        const deltaPhi = (lat2 - lat1) * Math.PI / 180;
        const deltaLambda = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    function updateUI() {
        markersLayer.clearLayers();
        const allPoints = getAllPoints();

        allPoints.forEach((pt) => {
            let marker = L.marker([pt.lat, pt.lng]).bindPopup(`<b>${pt.name}</b>`);
            markersLayer.addLayer(marker);
        });

        const startSelect = document.getElementById('start-point');
        const endSelect = document.getElementById('end-point');
        if (!startSelect || !endSelect) return;

        startSelect.innerHTML = '';
        endSelect.innerHTML = '';

        allPoints.forEach((pt, index) => {
            let opt1 = document.createElement('option');
            opt1.value = index;
            opt1.textContent = pt.name;
            startSelect.appendChild(opt1);

            let opt2 = document.createElement('option');
            opt2.value = index;
            opt2.textContent = pt.name;
            endSelect.appendChild(opt2);
        });
        if (allPoints.length > 1) {
            endSelect.selectedIndex = 1;
        }

        const listEl = document.getElementById('points-list');
        if (!listEl) return;
        listEl.innerHTML = '';

        if (customPoints.length === 0) {
            listEl.innerHTML = '<li>Zatiaľ nie sú pridané žiadne vlastné body. Kliknite na mapu.</li>';
        } else {
            customPoints.forEach((pt, index) => {
                let li = document.createElement('li');
                li.textContent = `${pt.name}  `;
                let delBtn = document.createElement('button');
                delBtn.textContent = 'Zmazať';
                delBtn.classList.add('filter-btn');
                delBtn.type = 'button';
                delBtn.onclick = () => {
                    customPoints.splice(index, 1);
                    saveCustomPoints();
                    updateUI();
                };
                li.appendChild(delBtn);
                listEl.appendChild(li);
            });
        }
    }

    map.on('click', function (e) {
        let name = prompt("Zadajte názov pre tento bod:", "Moje miesto");
        if (name) {
            customPoints.push({
                name: name,
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                type: "custom"
            });
            saveCustomPoints();
            updateUI();
        }
    });

    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', function () {
            const allPoints = getAllPoints();
            const startIndex = document.getElementById('start-point').value;
            const endIndex = document.getElementById('end-point').value;

            if (startIndex === endIndex) {
                document.getElementById('distance-result').textContent = "Zvoľte dva rôzne body.";
                return;
            }

            const p1 = allPoints[startIndex];
            const p2 = allPoints[endIndex];

            const distMeters = calculateHaversineDistance(p1.lat, p1.lng, p2.lat, p2.lng);
            const distKm = (distMeters / 1000).toFixed(2);

            document.getElementById('distance-result').textContent =
                `Vzdialenosť medzi ${p1.name} a ${p2.name} je ${distKm} km (${distMeters.toFixed(0)} m).`;

            polylineLayer.clearLayers();
            L.polyline([
                [p1.lat, p1.lng],
                [p2.lat, p2.lng]
            ], { color: 'red', weight: 4 }).addTo(polylineLayer);
        });
    }

    updateUI();
});