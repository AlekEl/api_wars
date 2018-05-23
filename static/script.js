window.addEventListener("load", function() {
    console.log("All resources finished loading!");

    let pageNum = 1;
    let lastPage;


    function doPlanetListRequest() {
        let url = getUrl(pageNum);
        fetch(url)
            .then(function(response) {
            return response.json();
            })
            .then(function(planetData) {
                console.log(planetData);
                myFunction(planetData["results"]);
                lastPage = planetData["count"] / 10;
            });
    }

    function doResidentsRequest(residents) {
        for(let i = 0; i < residents.length; i++) {
            let url = residents[i];
            fetch(url)
                .then(function(response) {
                    return response.json();
                })
                .then(function(residentsData) {
                    console.log(residentsData);
                    displayResidents(residentsData);
                });
        }
    }


    function myFunction(planetData) {
        let planetNames = [];
        let out = "";
        for(let i = 0; i < planetData.length; i++) {
            out += "<tr>" +
                "<td>" + planetData[i]["name"] + "</td>" +
                "<td>" + planetData[i]["diameter"] + "</td>" +
                "<td>" + planetData[i]["climate"] + "</td>" +
                "<td>" + planetData[i]["terrain"] + "</td>" +
                "<td>" + planetData[i]["surface_water"] + "</td>" +
                "<td>" + planetData[i]["population"] + "</td>" +
                "<td>" + checkResidents(planetData[i]["residents"], planetData[i]["name"]) + "</td>" +
                "<td><button>Vote</button></td>" +
                "</tr>";
            planetNames.push(planetData[i]["name"]);
        }
        document.getElementById("data-table-body").innerHTML = out;
        activateModalBtn(planetData, planetNames);
    }

    function displayResidents(residentsData) {
        let out = "<tr>" +
                "<td>" + residentsData["name"] + "</td>" +
                "<td>" + residentsData["height"] + "</td>" +
                "<td>" + residentsData["mass"] + "</td>" +
                "<td>" + residentsData["skin_color"] + "</td>" +
                "<td>" + residentsData["hair_color"] + "</td>" +
                "<td>" + residentsData["eye_color"] + "</td>" +
                "<td>" + residentsData["birth_year"] + "</td>" +
                "<td>" + residentsData["gender"] + "</td>" +
                "</tr>";
        document.getElementById("residents-table-body").insertAdjacentHTML('beforeend', out);
    }

    function checkResidents(data, planetName) {
        let btnModalHtml = '<button id="btn-' + planetName +  '" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">\n' +
            + data.length.toString() + '  Residents\n' +
            '</button>';
        if(data.length > 0) {
            return btnModalHtml;
        }
        return "No known residents"
    }

    function getUrl(pageNum) {
        return "https://swapi.co/api/planets/?page=" + pageNum.toString();
    }

    document.getElementById("btn-next").addEventListener("click", function() {
        if(pageNum < lastPage) {
            pageNum ++;
            doPlanetListRequest();
        }
    });

    document.getElementById("btn-previous").addEventListener("click", function() {
        if(pageNum > 1) {
            pageNum --;
            doPlanetListRequest();
            console.log(pageNum);
        }
    });

    function activateModalBtn(planetData, planetNames) {
        for(let i = 0; i < planetNames.length; i++) {
            if (document.getElementById("btn-" + planetNames[i])) {
                document.getElementById("btn-" + planetNames[i]).addEventListener("click", function () {
                    console.log(planetData[i]["residents"]);
                    document.getElementById("residents-table-body").innerHTML = "";
                    doResidentsRequest(planetData[i]["residents"]);
                })
            } else {
                setTimeout(activateModalBtn, 15);
            }
        }
    }

    doPlanetListRequest("planets");

});