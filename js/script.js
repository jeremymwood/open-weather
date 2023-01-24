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


                // day0Forecast.innerHTML = `
                //     ${dayOfWeek}, ${namedMonth} ${dayOfMonth}, ${year}
                //     <br />
                //     Feels like: ${Math.round(data.list[0].main.feels_like)}&#176;
                //     <br />
                //     Humidity: ${data.list[0].main.humidity}%
                //     <br />
                //     Temperature: ${Math.round(data.list[0].main.temp)}&#176
                //     <br />
                //     High: ${Math.round(data.list[0].main.temp_max)}&#176
                //     <br />
                //     Low: ${Math.round(data.list[0].main.temp_min)}&#176
                //     <br />
                //     General: ${data.list[0].weather[0].description}
                //     <br />
                //     Wind: ${Math.round(data.list[0].wind.speed)} mph ${windDirection()} (Gust: ${Math.round(data.list[0].wind.gust)} mph)
                // `;

                for (let i = 0; i <= 4; i++) {
                    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    const months = ["January","February","March","April","May","June","July", "August", "September", "October", "November", "December"];

                    let fiveDayId = 'day' + i + 'Forecast';

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

                    let forecast = $('<div class="fiveDayForecast border border-2 border-white text-white text-center rounded-3 bg-dark fs-6 m-2 p-2 flex-grow-1"></div>');
                    forecast.attr('id', fiveDayId);
                    $('#fiveDayContainer').append(forecast);

                    document.getElementById(fiveDayId).append(`day ${i + 1}`);



                    let fiveDayContent = `
                        ${dayOfWeek}, ${namedMonth} ${dayOfMonth}, ${year}
                        <br />
                        Feels like: ${Math.round(data.list[i].main.feels_like)}&#176;
                        <br />
                        Humidity: ${data.list[i].main.humidity}%
                        <br />
                        Temperature: ${Math.round(data.list[i].main.temp)}&#176
                        <br />
                        High: ${Math.round(data.list[i].main.temp_max)}&#176
                        <br />
                        Low: ${Math.round(data.list[i].main.temp_min)}&#176
                        <br />                      
                        Wind: ${Math.round(data.list[i].wind.speed)} mph ${windDirection()} (Gust: ${Math.round(data.list[i].wind.gust)} mph)
                    `;
                    document.getElementById(fiveDayId).append(fiveDayContent);

                }
            });
        };

        openWeather(startingLongitude, startingLatitude);

        let fiveDayContainer = $('<div class="container m-auto d-flex" id="fiveDayContainer"></div>');
        $('body').append(fiveDayContainer);

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