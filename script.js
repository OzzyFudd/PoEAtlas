maps = {
    Unique : ["Acton's_Nightmare", "Caer_Blaidd,_Wolfpack's_Den", "Death_and_Taxes", "Hall_of_Grandmasters", "Hallowed_Ground",
        "Maelström_of_Chaos", "Mao_Kun", "Oba's_Cursed_Trove", "Olmec's_Sanctum", "Pillars_of_Arun", 
        "Poorjoy's_Asylum", "The_Coward's_Trial", "The_Putrid_Cloister", "The_Twilight_Temple",
        "The_Vinktar_Square", "Vaults_of_Atziri", "Whakawairua_Tuahu"],
    Tier1  : ["Beach", "Dungeon", "Graveyard", "Lookout"],
    Tier2  : ["Alleyways", "Arid_Lake", "Desert", "Flooded_Mine", "Marshes", "Pen"],
    Tier3  : ["Arcade", "Burial_Chambers", "Cage", "Cells", "Excavation", "Iceberg", "Leyline", "Peninsula", "Port", "Springs"],
    Tier4  : ["Canyon", "Chateau", "City_Square", "Courthouse", "Gorge", "Grotto", "Lighthouse", "Relic_Chambers", "Strand", "Volcano"],
    Tier5  : ["Ancient_City", "Barrows", "Channel", "Conservatory", "Haunted_Mansion", "Ivory_Temple", "Maze", "Spider_Lair", "Sulphur_Vents", "Toxic_Sewer"],
    Tier6  : ["Academy", "Ashen_Wood", "Atoll", "Cemetery", "Fields", "Jungle_Valley", "Mausoleum", "Phantasmagoria", "Thicket", "Underground_Sea", "Wharf"],
    Tier7  : ["Arachnid_Nest", "Bazaar", "Bone_Crypt", "Coral_Ruins", "Dunes", "Gardens", "Lava_Chamber", "Ramparts", "Residence", "Tribunal", "Underground_River"],
    Tier8  : ["Armoury", "Courtyard", "Geode", "Infested_Valley", "Laboratory", "Mineral_Pools", "Mud_Geyser", "Overgrown_Ruin", "Shore", "Tropical_Island", "Vaal_Pyramid"],
    Tier9  : ["Arena", "Estuary", "Moon_Temple", "Museum", "Plateau", "Scriptorium", "Sepulchre", "Temple", "Tower", "Vault", "Waste_Pool"],
    Tier10 : ["Arachnid_Tomb", "Belfry", "Bog", "Cursed_Crypt", "Orchard", "Pier", "Precinct", "Shipyard", "Siege", "Wasteland"],
    Tier11 : ["Colonnade", "Coves", "Factory", "Lair", "Mesa", "Pit", "Primordial_Pool", "Promenade", "Spider_Forest", "Waterways"],
    Tier12 : ["Castle_Ruins", "Crystal_Ore", "Defiled_Cathedral", "Necropolis", "Overgrown_Shrine", "Racecourse", "Summit", "Toture_Chamber", "Villa"],
    Tier13 : ["Arsenal", "Caldera", "Core", "Desert_Spring", "Ghetto", "Malformation", "Park", "Shrine", "Terrace"],
    Tier14 : ["Acid_Lakes", "Colosseum", "Crimson_Temple", "Dark_Forest", "Dig", "Palace", "Plaza"],
    Tier15 : ["Basilica", "Carcass", "Lava_Lake", "Reef", "Sunken_City"],
    Tier16 : ["Forge_of_the_Phoenix", "Lair_of_the_Hydra", "Maze_of_the_Minotaur", "Pit_of_the_Chimera", "Vaal_Temple"],
    Tier17 : ["The_Shaper's_Realm"]
}

completedMaps = {};

var totalNumberOfMaps = 0;
var numberOfCompletedMaps = 0;

function toggleChevron(e) {
    $(e.target).parent().find(".panel-title .glyphicon")
        .toggleClass("glyphicon-chevron-down glyphicon-chevron-right");
}

$(document).ready(function() {
    $("#mapSelector").on('hidden.bs.collapse', toggleChevron);
    $("#mapSelector").on('shown.bs.collapse', toggleChevron);
    $("#resetButton").on('click', function(e) {
        e.preventDefault();
        $('#confirm').modal({ backdrop: 'static', keyboard: false })
            .one('click', '#delete', function() {
                resetData();
        });
    });

    generateMapSelector();

    $.each(maps, function(i, val) {
        completedMaps[i] = [];
        totalNumberOfMaps += val.length;
    });

    loadFromLocalStorage();
    displayMissingMaps();
});

function saveToLocalStorage() {
    localStorage.setItem("data", JSON.stringify(completedMaps));
}

function loadFromLocalStorage() {
    var loadedData = JSON.parse(localStorage.getItem("data"));
    if (loadedData !== null) {
        $.each(loadedData, function(i, val) {
            $.each(val, function() {
                setMapAsComplete(i, this);
            });
        });
        completedMaps = loadedData;
    }
}

function resetData() {
    $.each(maps, function(i, val) {
        completedMaps[i] = [];
    });
    numberOfCompletedMaps = 0;
    saveToLocalStorage();

    location.reload();
}

function toggleMapCompletion(category, name) {
    var index = completedMaps[category].indexOf(name);
    if (index < 0) {
        setMapAsComplete(category, name);
    } else {
        setMapAsNotComplete(category, name);
    }
}

function setMapAsNotComplete(category, name) {
    var index = completedMaps[category].indexOf(name);
    if (index > -1) {
        $("#" + name).find("span").toggleClass("glyphicon-ok glyphicon-remove");
        $("#" + name).find("a").css("color", "");
        numberOfCompletedMaps--;
        completedMaps[category].splice(index, 1);

        displayMissingMaps();
        updateProgressBar();
        saveToLocalStorage();
    }
}

function setMapAsComplete(category, name) {
    var index = completedMaps[category].indexOf(name);
    if (index < 0) {
        $("#" + name).find("span").toggleClass("glyphicon-ok glyphicon-remove");
        $("#" + name).find("a").css("color", "#0A0");
        numberOfCompletedMaps++;
        completedMaps[category].push(name);

        displayMissingMaps();
        updateProgressBar();
        saveToLocalStorage();
    }
}

function setCategoryComplete(category) {
    $(maps[category]).each(function() {
        setMapAsComplete(category, this.toString().replace(/'|,/g, ""));
    });
}

function setCategoryNotComplete(category) {
    $(maps[category]).each(function() {
        setMapAsNotComplete(category, this.toString().replace(/'|,/g, ""));
    });
}

function updateProgressBar() {
    var percentage = 100 * numberOfCompletedMaps / totalNumberOfMaps;
    $("#progress-bar").css("width", percentage+"%").attr("aria-valuenow", numberOfCompletedMaps);
    $("#progress-bar").html(numberOfCompletedMaps.toString() + " / " + totalNumberOfMaps.toString());
}

function displayMissingMaps() {
    var overview = "";
    $.each(maps, function(category, val) {
        var missing = val.filter(function(el) {
            if (completedMaps[category] === undefined) return true;
            return completedMaps[category].indexOf(el.replace(/'|,/g, "")) < 0;
        });
        if (missing.length !== 0) {
            overview += category.replace(/Tier/g, "Tier ") + ": ";
            for (var i = 0; i < missing.length; i++) {
                overview += "<a href=\"http://pathofexile.gamepedia.com/";
                overview += missing[i];
                if (category !== "Unique") {
                    overview += "_Map"
                }
                overview += "\">" + missing[i].replace(/_/g, " ");
                overview += "</a>";
                if (i != missing.length - 1) {
                    overview += ", ";
                }
            }
            overview += "<br>";
        } else {
            $("#collapse" + category).collapse("hide");
        }
    });
    $("#overviewBody").html(overview);
}

function generateMapSelector() {
    $("#mapSelector").append("<h3>Select completed maps</h3>");
    $("#mapSelector").append("<strong>Click map names to toggle which ones you have completed.</strong>");
    $("#mapSelector").append("<div class=\"panel-group\" id=\"panels\">");

    $.each(maps, function(i, val) {
        $("#panels").append("<div class=\"panel panel-default\" id=\"" + i + "\">");
        $("#" + i).append(" \
        <div class=\"panel-heading\"> \
            <h4 class=\"panel-title\"> \
                <a data-toggle=\"collapse\" href=\"#collapse" + i + "\"> \
                    <strong>" + i.replace(/Tier/g, "Tier ") + "</strong> \
                    <span class=\"glyphicon glyphicon-chevron-down\"></span> \
                </a> \
            </h4> \
        </div> \
        ");

        $("#" + i).append(" \
        <div id=\"collapse" + i + "\" class=\"panel-collapse collapse in\"> \
            <div class=\"panel-body\"> \
                <div class=\"row\" id=\"" + i + "control\" style=\"margin-bottom:15px\"> \
                    <div style=\"padding:5px\"> \
                        <button type=\"button\" style=\"margin-right:10px;\" class=\"btn btn-default\" \
                            onclick=\"setCategoryComplete('" + i + "')\"> \
                            <span class=\"glyphicon glyphicon-ok\"></span> \
                            Mark all maps of this category as completed \
                        </a> \
                        <button type=\"button\" class=\"btn btn-default\" \
                            onclick=\"setCategoryNotComplete('" + i + "')\"> \
                            <span class=\"glyphicon glyphicon-remove\"></span> \
                            Mark all maps of this category as not completed  \
                        </a> \
                    </div> \
                </div> \
                <div class=\"row\" id=\"" + i + "maps\"> \
        ");

        $.each(val, function() {
            $("#" + i + "maps").append(" \
            <div id=\"" + this.replace(/'|,/g, "")
                + "\" style=\"word-wrap:break-word; padding:10px; \
                margin-bottom:7px; margin-top:7px; float:left;\"> \
                <a href=\"#/\" role=\"button\" onclick=\"toggleMapCompletion('" + i + "', '" +
                    this.replace(/'|,/g, "") + "')\" style=\"display:block;\"> \
                    <span class=\"glyphicon glyphicon-remove\"></span> \
                    " + this.replace(/_/g, " ") + " \
                </a> \
            </div> \
            ");
        });
    });

    $("#mapSelector").append("</div>");
}
