const database = require('./database');

const {getAudioDurationInSeconds} = require('get-audio-duration');
const ffProbeStatic = require('ffprobe-static');
const utility = require('./sever-utility');

async function preLoadAllAudio() {
    return new Promise((resolve, reject) => {
        database.loadAllAudios(async function (result) {
            let allAudio = {};

            try {
                const durations = await Promise.all(result.map(async (row) => {
                    try {
                        const duration = await getAudioDurationInSeconds(`${row.PATH}`, ffProbeStatic.path);
                        return utility.timeFormatFromSeconds(duration);
                    } catch (err) {
                        console.log(err.message);
                        return null; // or some placeholder value
                    }
                }));

                result.forEach((row, index) => {
                    if (durations[index]) {
                        allAudio[row.AUDIO_ID] = {
                            id: row.AUDIO_ID,
                            title: row.AUDIO_NAME || "unknown",
                            creator: row.CREATOR_NAME || "unknown",
                            collection: row.COLLECTION_NAME || "unknown",
                            length: durations[index] || "unknown",
                            path: row.PATH,
                        };
                    }
                    if (index + 1 === result.length) {
                        resolve(allAudio); // Resolve with the allAudio object
                    }
                });
            } catch (error) {
                reject(error); // Reject with the error if any occurs
            }
        });
    });
}

async function loadPlaylistAudio(playlistID, allAudio) {
    return new Promise((resolve, reject) => {
        database.loadAudioOfPlaylist(playlistID, function (result, error) {
            if(error) {
                return reject(error);
            }
            let playlistAudio = {};
            result.forEach(function (entry) {
                playlistAudio[entry.AUDIO_ID] = allAudio[entry.AUDIO_ID];
            });
            resolve(playlistAudio);
        });
    });
}

// async function loadPlaylists(userID) {
//     return new Promise((resolve, reject) => {
//         database.loadPlaylistsOfCurrentUser(userID, function (result, error) {
//             if(error) {
//                 return reject(error);
//             }
//             let playlists = {};
//             result.forEach(function (entry) {
//                 playlists={
//                     id: entry.PLAYLIST_ID,
//                     name: entry.PLAYLIST_NAME
//                 }
//             });
//             resolve(playlists);
//         });
//     });
// }

async function createNewPlaylist(userID, playlistName) {
    return new Promise((resolve, reject) => {
        database.createPlaylist(playlistName, userID, function (result, error) {
            if(error) {
                reject(error);
            }
            resolve(result);
        });
    });
}

async function addAudioToPlaylist(audioId, playlistId) {
    return new Promise((resolve, reject) => {
        database.addAudioToPlaylist(audioId, playlistId, function (success) {
            if(!success) {
                reject(0);
            }
            resolve(1);
        });
    });
}

async function deleteAudioFromPlaylist(audioId, playlistId) {
    return new Promise((resolve, reject) => {
        database.deleteAudioFromPlaylist(audioId, playlistId, function (success) {
            if(!success) {
                reject(0);
            }
            resolve(1);
        });
    });
}
async function deletePlaylist(playlistId){
    return new Promise((resolve, reject) => {
        database.deletePlaylist(playlistId, function (success) {
            if(!success) {
                reject(0);
            }
            resolve(1);
        });
    });
}

let options = {
    loginRegister: true,
    hamburger: true
}

let countryOptions = [
    "Åland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Cote D'ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands (Malvinas)",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-bissau",
    "Guyana",
    "Haiti",
    "Heard Island and Mcdonald Islands",
    "Holy See (Vatican City State)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran, Islamic Republic of",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Democratic People's Republic of Korea",
    "Republic of Korea",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libyan Arab Jamahiriya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Macedonia, The Former Yugoslav Republic of",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia, Federated States of",
    "Moldova, Republic of",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestinian Territory, Occupied",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Saint Helena",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Pierre and Miquelon",
    "Saint Vincent and The Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and The South Sandwich Islands",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "United States Minor Outlying Islands",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Viet Nam",
    "Virgin Islands, British",
    "Virgin Islands, U.S.",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
]

module.exports = {options, countryOptions, preLoadAllAudio, loadPlaylistAudio, createNewPlaylist, addAudioToPlaylist, deleteAudioFromPlaylist, deletePlaylist}