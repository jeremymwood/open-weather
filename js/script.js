(function () {
    $(document).ready(function () {
        let d = $('<div id="testData" class="currentData border border-2 border-white text-white rounded-3 bg-dark fs-6 mt-2 p-2"></div>');
        $('body').prepend(d);

        let c = $('<h1 class="text-white text-center pb-3">Openweather API</h1>');
        $('body').prepend(c);

        // TODO:
        //5 day forecast
        //use reverse geocode for city and state
        //general weather icons
        //fix wind direction

        //wind and temp widget
        //mobile responsive
        //drag end event listener for marker
        //dropdown for light/dark mode
        //footer
        //nav bar
        //toggle detailed 4 hour, daily, and 5 day forecast
        //temp graphs

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

                testData.innerHTML = `Location: ${data.city.name}, ${data.city.country}
                <br />
                Population: ${data.city.population.toLocaleString('en-US')}
                <br />
                Longitude: ${startingLongitude}
                <br />Latitude: &nbsp&nbsp&nbsp&nbsp&nbsp${startingLatitude}`;

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

    // introduce .ajax()
    // go over request/response architecture
    // WHITEBOARD!
    // mention different types of requests
    // mention different types of data
    // show https://java.codeup.com as an example request and show the response as html

    // make a simple AJAX request to http://localhost
    // and show the echo server
    // $.ajax("http://localhost/?sort=desc&state=TX");
    //
    // // do a POST
    // $.ajax("http://localhost/", {
    //     type: "POST",
    //     dataType: "json",
    //     contentType: "application/json",
    //     data: JSON.stringify({
    //         name: "Bob Smith",
    //         age: 42
    //     })
    // });
    //
    // // do a PUT
    // $.ajax("http://localhost/v1/people/555", {
    //     type: "PUT",
    //     dataType: "json",
    //     contentType: "application/json",
    //     data: JSON.stringify({
    //         name: "Bob Smith",
    //         age: 52
    //     })
    // });
    //
    //     // do a DELETE
    //
    // $.ajax("http://localhost", {
    //         type: "DELETE",
    //         dataType: "json"
    // });

    // do some method chaining
    // use .done() to see the data from the GET request

    //     $.ajax("http://localhost").done(function(data) {
    //         // iterate over the data array
    //         // and print out each thing
    //         // console.log(data);
    //         // for (const row of data) {
    //         //     console.log(row);
    //         // }
    //         $("#my-div").text(data[0].currentPet.age);
    //
    // }).fail(function(jqXhr, status, error) {
    //         console.log("crap! "  + jqXhr.status)
    //     });


    // use .fail() and make a 404 happen
    // be sure to print the status
    // mutually exclusive with done()

    // show all the pretty http response codes

    // function getQuote() {
    //     $("#anime").text("");
    //     $("#character").text("");
    //     $("#quote").text("");
    //     $("#loading-pic").removeClass("d-none");
    //     $.ajax("https://animechan.vercel.app/api/random")
    //         .done(function(data) {
    //             console.log(data);
    //             $("#anime").text(data.anime);
    //             $("#character").text(data.character);
    //             $("#quote").text(data.quote);
    //
    //         }).fail(function(error) {
    //         console.log("RATS! an error");
    //     }).always(function() {
    //         $("#loading-pic").addClass("d-none");
    //     })
    // }
    //
    // $("#get-quote").click(getQuote);

    // $.ajax("https://pokeapi.co/api/v2/pokemon/charmander")
    //     .done(function(data) {
    //         // console.log(data);
    //         // $("#p1").text(data.name);
    //         // $("#p2").text(data.height);
    //         // $("#p3").text(data.weight);
    //     })
    //     .fail(function(statusCode) {
    //         console.log(statusCode.status);
    //     });
    // add .always() and explain

    // point out get and post shorthand

    // use a real api!


    // introduce JSON MAYBE DO THIS LAST BEFORE ANIME QUOTE DEMO
    // show JS object and talk about how it may not be usable outside of JS
    // show JSON equivalent



    // no cors problems THANK GOD!


    // HOWEVER: FOR 5 DAY FORECAST this api is not what we want
    // we must use the one call endpoint!
    // https://openweathermap.org/api/one-call-api#parameter
    // notice we must now use lat/lon instead of the city name + state

    // where is our data?!?

    // look in the .daily property
    // .daily is an array with 8 elements
    // index 0 is today
    // index 1 is tomorrow, etc.

    // what is dt ?  how to convert it to something more recognizable?
    // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript

    // what about the weather icon??? check out .daily[x].weather[0].icon
})();