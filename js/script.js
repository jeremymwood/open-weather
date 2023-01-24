(function () {
    $(document).ready(function () {
        let d = $('<div class="container border border-2 border-white text-white rounded-3 bg-dark fs-6 m-auto"><div id="testData" class="row"></div></div>');
        $('body').prepend(d);

        let c = $('<h1 class="text-white text-center pb-3">Openweather API</h1>');
        $('body').prepend(c);

        // TODO:
        //5 day forecast
        //use reverse geocode for city and state
        //general weather icons
        //fix wind direction
        //readme

        //wind and temp widget
        //mobile responsive
        //drag end event listener for marker
        //dropdown for light/dark mode
        //footer
        //nav bar
        //toggle detailed 4 hour, daily, and 5 day forecast
        //temp graphs
        //template margins to access for innerHTMl
        // fix latlong deck margin

        let startingLatitude = 29.515156939194544;
        let startingLongitude = -98.39371378157797;

        mapboxgl.accessToken = MAPBOX_API_KEY;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 10,
            center: [startingLongitude, startingLatitude]
        });

        const markerDurationInit = 400;
        const marker = new mapboxgl.Marker({"color": "red", draggable: true});
        marker.setLngLat([startingLongitude, startingLatitude]);

        function openWeather(startingLongitude, startingLatitude) {
            $.get("http://api.openweathermap.org/data/2.5/forecast", {
                APPID: OPENWEATHER_API_KEY,
                lat:    startingLatitude,
                lon:   startingLongitude,
                units: "imperial"
            }).done(function(data) {

                // display all data
                console.log(data);

                testData
                    .innerHTML = `<div class="col-6 m-0">Location: ${data.city.name}, ${data.city.country}
                <br />
                Population: ${data.city.population.toLocaleString('en-US')}
                </div><div class="col-6 m-0">
                Longitude: ${startingLongitude}
                <br />Latitude: &nbsp&nbsp&nbsp&nbsp&nbsp${startingLatitude}</div>`;

                //formatted time
                const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                const months = ["January","February","March","April","May","June","July", "August", "September", "October", "November", "December"];

                const unix_timestamp = data.list[0].dt;
                const date = new Date(unix_timestamp * 1000);
                const day = date.getDay();
                const dayOfWeek = weekday[day];
                const dayOfMonth = date.getDate();
                const month = date.getMonth();
                const namedMonth = months[month];
                const year = date.getFullYear();
                const hours = date.getHours();
                const minutes = "0" + date.getMinutes();
                const seconds = "0" + date.getSeconds();
                const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                const rawWind = Math.round(data.list[0].wind.deg);

                //shorten with array and for loop
                const windAbbreviations = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "NW", "NNW"];
                let windMin = 0;
                let windMax = 11.25;
                let windIncrement = 22.5

                function windDirection() {
                    for (let i = 0; i < windAbbreviations.length; i++) {
                        if (rawWind >= windMin && rawWind <= windMax) {
                            return windAbbreviations[i];
                        } else {
                            windMin = windMin + windIncrement;
                            windMax = windMax + windIncrement;
                        }
                    }
                    // if (rawWind <= 22.5) {
                    //     return "NNE";
                    // }
                    // if (rawWind <= 45) {
                    //     return "NE";
                    // }
                    // if (rawWind <= 67.5) {
                    //     return "ENE";
                    // }
                    // if (rawWind <= 90) {
                    //     return "E";
                    // }
                    // if (rawWind <= 122.5) {
                    //     return "ESE";
                    // }
                    // if (rawWind <= 135) {
                    //     return "SE";
                    // }
                    // if (rawWind <= 157.5) {
                    //     return "SSE";
                    // }
                    // if (rawWind <= 180) {
                    //     return "S";
                    // }
                    // if (rawWind <= 202.5) {
                    //     return "SSW";
                    // }
                    // if (rawWind <= 225) {
                    //     return "SW";
                    // }
                    // if (rawWind <= 247.5) {
                    //     return "WSW";
                    // }
                    // if (rawWind <= 270) {
                    //     return "W";
                    // }
                    // if (rawWind <= 292.5) {
                    //     return "WNW";
                    // }
                    // if (rawWind <= 315) {
                    //     return "NW";
                    // }
                    // if (rawWind <= 337.5) {
                    //     return "NNW";
                    // }
                    // if (rawWind <= 360) {
                    //     return "N";
                    // }
                }

                testForecast.innerHTML = `
                    Today:
                    <br />
                    Date: ${dayOfWeek}, ${namedMonth} ${dayOfMonth}, ${year}
                    <br />
                    Day of the week: ${dayOfWeek}
                    <br />
                    Feels like: ${Math.round(data.list[0].main.feels_like)}&#176;
                    <br />
                    Humidity: ${data.list[0].main.humidity}%
                    <br />
                    Temperature: ${Math.round(data.list[0].main.temp)}&#176
                    <br />
                    High: ${Math.round(data.list[0].main.temp_max)}&#176
                    <br />
                    Low: ${Math.round(data.list[0].main.temp_min)}&#176
                    <br />
                    General: ${data.list[0].weather[0].description}
                    <br />
                    Wind: ${Math.round(data.list[0].wind.speed)} mph ${windDirection()} (Gust: ${Math.round(data.list[0].wind.gust)} mph)
                `;
            });
        };

        openWeather(startingLongitude, startingLatitude);

        let fiveDayContainer = $('<div class="container m-auto d-flex" id="fiveDayContainer"></div>');
        $('body').append(fiveDayContainer);

        const fiveDayForecast = function () {
            for (let i = 0; i <= 4; i++) {
                let fiveDayId = 'day' + i + 'Forecast';

                let forecast = $('<div class="fiveDayForecast border border-2 border-white text-white rounded-3 bg-dark fs-6 mt-2 p-2 flex-grow-1"></div>');
                forecast.attr('id', fiveDayId);
                $('#fiveDayContainer').append(forecast);

                let innerFiveDay = $('<p>test</p>');
                $('.fiveDayForecast').append(innerFiveDay);
                // let innerFiveDay = document.getElementsByClassName("fiveDayForecast");
                // innerFiveDay.innerText = 'test';

                // forecast.innerText = `<p>test</p>`;
            }
        }
        fiveDayForecast();

        let e = $('<div id="testForecast" class="currentData border border-2 border-white text-white rounded-3 bg-dark fs-6 mt-2 p-2"></div>');
        $('body').append(e);

        let f = $('<div id="coordinates" class="coordinates border border-2 border-white text-white rounded-3 bg-dark fs-6 mt-2 p-2"></div>');
        $('body').append(f);

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

        setTimeout(()=> {
            marker.addTo(map);
        },(markerDurationInit));

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


    // function pinThatAddress(address) {
    //     geocode(address, MAPBOX_API_KEY).then(function (address) {
    //         const marker = new mapboxgl.Marker();
    //         marker.setLngLat(address);
    //         marker.addTo(map);
    //     });
    // }

})();