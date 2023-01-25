(function () {
    $(document).ready(function () {
        let c = $('<div class="container-fluid border border-2 border-white text-white rounded-3 bg-dark fs-6 m-auto"><div id="testData" class="row"></div></div>');
        $('body').prepend(c);

        let d = $('<header><h1 class="text-white text-center pb-3">TetraCast</h1></header>');
        $('body').prepend(d);


        let e = $('<mapbox-address-autofill access-token="MAPBOX_API_KEY" class="searchContainerParent"><div class="searchContainer m-0"><i class="fa-solid fa-magnifying-glass text-white" aria-hidden="true"></i><form><input id="search" class="search border border-2 border-white text-white rounded-3 bg-dark fs-6 px-5 py-1 mb-2" type="text" name="address" autocomplete="shipping street-address" placeholder="search...">    <button id="myBtn" class="d-none" type="submit">button</button>\n</form></div></mapbox-address-autofill>');
        $('header').append(e);

        // TODO:
        //use reverse geocode for city and state
        //readme
        //fix wind direction or remove
        //general weather icons
        // add location, population and lat/long to map container
        // remove or repurpose vanishing div... maybe for lat long
        //hover card screen back text and prompt for detailed forecast?


        //wind and temp widget
        //mobile responsive
        //dropdown for light/dark mode
        //footer
        //toggle detailed 4 hour, daily, and 5 day forecast
        //temp graphs
        //template margins to access for innerHTMl
        let startingLatitude = 29.507103833705532;
        let startingLongitude = -98.39395190355188;

        mapboxgl.accessToken = MAPBOX_API_KEY;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 12,
            center: [startingLongitude, startingLatitude]
        });

        $("#map").addClass("container-fluid mx-auto")

        const markerDurationInit = 400;
        const marker = new mapboxgl.Marker({"color": "red", draggable: true});
        marker.setLngLat([startingLongitude, startingLatitude]);

        function openWeather(startingLongitude, startingLatitude) {
            $.get("http://api.openweathermap.org/data/2.5/forecast", {
                APPID: OPENWEATHER_API_KEY,
                lat: startingLatitude,
                lon: startingLongitude,
                units: "imperial"
            }).done(function (data) {

                // display all data
                console.log(data);

                testData.innerHTML = `
                <div class="col-6 m-0">
                Location: ${data.city.name}, ${data.city.country}
                <br />
                Population: ${data.city.population.toLocaleString('en-US')}
                </div>
                <div class="col-6 m-0">
                Longitude: ${startingLongitude}
                <br />
                Latitude: &nbsp&nbsp&nbsp&nbsp&nbsp${startingLatitude}
                </div>`;

                //formatted time
                const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                let i = 0;
                let unix_timestamp = data.list[i].dt;
                let date = new Date(unix_timestamp * 1000);
                let day = date.getDay();
                let dayOfWeek = weekday[day];
                let dayOfMonth = date.getDate();
                let month = date.getMonth();
                let namedMonth = months[month];
                let year = date.getFullYear();
                let hours = date.getHours();
                let minutes = "0" + date.getMinutes();
                let seconds = "0" + date.getSeconds();
                let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                let rawWind = Math.round(data.list[i].wind.deg);
                console.log(rawWind);

                //shorten with array and for loop
                const windAbbreviations = ["NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
                let windMin = 11.25;
                let windMax = 33.75;
                let windIncrement = 22.5;

                function windDirection(azimuth) {
                    for (let i = 0; i < windAbbreviations.length; i++) {
                        if (azimuth > windMin && azimuth < windMax) {
                            console.log(`${windAbbreviations[i]}`);
                        }
                        if (azimuth < 11.25 || azimuth > 348.75) {
                            console.log(`N`);
                            break;
                        } else {
                            windMin += windIncrement;
                            windMax += windIncrement;
                        }
                    }
                }

                // why does this fail after one occurrence?
                windDirection(0);
                windDirection(45);
                windDirection(90);
                windDirection(135);
                windDirection(180);
                windDirection(225);
                windDirection(270);
                windDirection(325);
                windDirection(359);

                day0ID.innerHTML = `
                        ${dayOfWeek}
                        <br />
                        ${namedMonth} ${dayOfMonth}, ${year}
                        <br />
                        Conditions: ${data.list[i].weather[0].description}
                        <br />
                        High: ${Math.round(data.list[i].main.temp_max)}°
                        <br />
                        Low: ${Math.round(data.list[i].main.temp_min)}°
                        <br />
                        Humidity: ${data.list[i].main.humidity}%
                        <br />
                        Wind: ${Math.round(data.list[i].wind.speed)} mph ${Math.round(data.list[i].wind.deg)}°
                        <br />
                        Gust: ${Math.round(data.list[i].wind.gust)} mph
                        `;
                let secondDayOffset = 6;
                let dailyOffset = 8;
                i += secondDayOffset;
                unix_timestamp = data.list[i].dt;
                date = new Date(unix_timestamp * 1000);
                day = date.getDay();
                dayOfWeek = weekday[day];
                dayOfMonth = date.getDate();
                month = date.getMonth();
                namedMonth = months[month];
                year = date.getFullYear();
                hours = date.getHours();
                minutes = "0" + date.getMinutes();
                seconds = "0" + date.getSeconds();
                formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                rawWind = Math.round(data.list[i].wind.deg);
                day1ID.innerHTML = `
                        ${dayOfWeek}
                        <br />
                        ${namedMonth} ${dayOfMonth}, ${year}
                        <br />
                        Conditions: ${data.list[i].weather[0].description}
                        <br />
                        High: ${Math.round(data.list[i].main.temp_max)}°
                        <br />
                        Low: ${Math.round(data.list[i].main.temp_min)}°
                        <br />
                        Humidity: ${data.list[i].main.humidity}%
                        <br />
                        Wind: ${Math.round(data.list[i].wind.speed)} mph ${Math.round(data.list[i].wind.deg)}°
                        <br />
                        Gust: ${Math.round(data.list[i].wind.gust)} mph
                        `;

                i += dailyOffset;
                unix_timestamp = data.list[i].dt;
                date = new Date(unix_timestamp * 1000);
                day = date.getDay();
                dayOfWeek = weekday[day];
                dayOfMonth = date.getDate();
                month = date.getMonth();
                namedMonth = months[month];
                year = date.getFullYear();
                hours = date.getHours();
                minutes = "0" + date.getMinutes();
                seconds = "0" + date.getSeconds();
                formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                rawWind = Math.round(data.list[i].wind.deg);
                day2ID.innerHTML = `
                        ${dayOfWeek}
                        <br />
                        ${namedMonth} ${dayOfMonth}, ${year}
                        <br />
                        Conditions: ${data.list[i].weather[0].description}
                        <br />
                        High: ${Math.round(data.list[i].main.temp_max)}°
                        <br />
                        Low: ${Math.round(data.list[i].main.temp_min)}°
                        <br />
                        Humidity: ${data.list[i].main.humidity}%
                        <br />
                        Wind: ${Math.round(data.list[i].wind.speed)} mph ${Math.round(data.list[i].wind.deg)}°
                        <br />
                        Gust: ${Math.round(data.list[i].wind.gust)} mph
                        `;

                i += dailyOffset;
                unix_timestamp = data.list[i].dt;
                date = new Date(unix_timestamp * 1000);
                day = date.getDay();
                dayOfWeek = weekday[day];
                dayOfMonth = date.getDate();
                month = date.getMonth();
                namedMonth = months[month];
                year = date.getFullYear();
                hours = date.getHours();
                minutes = "0" + date.getMinutes();
                seconds = "0" + date.getSeconds();
                formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                rawWind = Math.round(data.list[i].wind.deg);
                day3ID.innerHTML = `
                        ${dayOfWeek}
                        <br />
                        ${namedMonth} ${dayOfMonth}, ${year}
                        <br />
                        Conditions: ${data.list[i].weather[0].description}
                        <br />
                        High: ${Math.round(data.list[i].main.temp_max)}°
                        <br />
                        Low: ${Math.round(data.list[i].main.temp_min)}°
                        <br />
                        Humidity: ${data.list[i].main.humidity}%
                        <br />
                        Wind: ${Math.round(data.list[i].wind.speed)} mph ${Math.round(data.list[i].wind.deg)}°
                        <br />
                        Gust: ${Math.round(data.list[i].wind.gust)} mph
                        `;

                i += dailyOffset;
                unix_timestamp = data.list[i].dt;
                date = new Date(unix_timestamp * 1000);
                day = date.getDay();
                dayOfWeek = weekday[day];
                dayOfMonth = date.getDate();
                month = date.getMonth();
                namedMonth = months[month];
                year = date.getFullYear();
                hours = date.getHours();
                minutes = "0" + date.getMinutes();
                seconds = "0" + date.getSeconds();
                formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                rawWind = Math.round(data.list[i].wind.deg);
                day4ID.innerHTML = `
                        ${dayOfWeek}
                        <br />
                        ${namedMonth} ${dayOfMonth}, ${year}
                        <br />
                        Conditions: ${data.list[i].weather[0].description}
                        <br />
                        High: ${Math.round(data.list[i].main.temp_max)}°
                        <br />
                        Low: ${Math.round(data.list[i].main.temp_min)}°
                        <br />
                        Humidity: ${data.list[i].main.humidity}%
                        <br />
                        Wind: ${Math.round(data.list[i].wind.speed)} mph ${Math.round(data.list[i].wind.deg)}°
                        <br />
                        Gust: ${Math.round(data.list[i].wind.gust)} mph
                        `;
            });
        };

        openWeather(startingLongitude, startingLatitude);

        let fiveDayContainer = $('<div class="container-fluid m-auto p-0 d-flex justify-content-between" id="fiveDayContainer"></div>');
        $('body').append(fiveDayContainer);

        function fiveDayIDMachina() {
            for (let i = 0; i <= 4; i++) {
                let fiveDayId = `day${i}ID`;
                let forecast = $('<div class="singleDayForecast border border-2 border-white text-center rounded-3 bg-dark fs-6 p-2 w-100"></div>');
                forecast.attr('id', fiveDayId);
                $('#fiveDayContainer').append(forecast);
            }
        }

        fiveDayIDMachina();

        let g = $('<div id="coordinates" class="coordinates border border-2 border-white text-white rounded-3 bg-dark fs-6 mt-2 p-2"></div>');
        $('body').append(g);

        const coordinates = document.getElementById('coordinates');

        function onDragEnd() {
            let lngLat = marker.getLngLat();
            coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: &nbsp&nbsp&nbsp&nbsp&nbsp${lngLat.lat}`;
            coordinates.style.display = 'block';
            $('#coordinates').delay(2500).fadeOut(1000);
            map.easeTo({
                center: [lngLat.lng, lngLat.lat]
            });

            openWeather(lngLat.lng, lngLat.lat);
        }

        marker.on('dragend', onDragEnd);

        setTimeout(() => {
            marker.addTo(map);
        }, (markerDurationInit));

        //***doc rob snippet
        // let mapBoxGeocoder = undefined;
        // mapBoxGeocoder = new MapBoxGeocoder({
        //     accessToken: mapboxgl.accessToken,
        //     mapboxgl: mapboxgl,
        //     flyto: false,
        //     marker: false
        // });
        // map.addControl(mapBoxGeocoder);
        //
        // mapBoxGeocoder.on("result", function(result) {
        //     addMarkerForLngLat(result.result.center, jumpTo: true, result.result.place_name);
        // });

        //search bar on enter
        let data = document.getElementById("search");
        $('#search').on('keypress', function (e) {
            if (e.which == 13) {
                e.preventDefault()
                console.log(data.value);
                data.value = "";
            }
        });

        // function pinThatAddress(address) {
        //     geocode(address, MAPBOX_API_KEY).then(function(result) {
        //         result = document.getElementById("search").value
        //         console.log(result);
        //         // const marker = new mapboxgl.Marker();
        //         // marker.setLngLat(result);
        //         // marker.addTo(map);
        //         //
        //         // const popup = new mapboxgl.Popup();
        //         // popup.setHTML(`<h3>${address}</h3>`);
        //         // marker.setPopup(popup);
        //
        //
        //
        //     }).catch(function(error) {
        //         console.log("Boom");
        //     });
        // }
        //
        // pinThatAddress("North Star Mall");
        // pinThatAddress("Rackspace");
        // pinThatAddress();

        //nav button
        map.addControl(new mapboxgl.NavigationControl());

        //TODO: sample popup

        // const popup = new mapboxgl.Popup()
        //     .setHTML(`
        //         <div class="card w-100">
        //               <img src="image/${restaurant.image}" class="card-img-top" alt="...">
        //             <div class="card-body">
        //                 <p class="fs-6">${restaurant.name}</p>
        //                 <p class="card-text">${restaurant.description}</p>
        //             </div>
        //         </div>
        //     `);
        //
        // marker.setPopup(popup);
    });
})();