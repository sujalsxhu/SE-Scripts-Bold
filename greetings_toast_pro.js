// ==SE_module==
// name: greetings_toast_pro
// displayName: Greetings Toast PRO
// description: Shows a hilarious and abusive greeting toast on Snapchat startup. Input: username dd/mm/yyyy. Avoid full names.
// version: 2.0
// author: Sujal (Enhanced by ChatGPT)
// ==/SE_module==

var config = require("config");
var im = require("interface-manager");

var settingsContext = { events: [] };

var greetingPresets = {
    morning: {
        RawBold: [
            "Uth ja bhos*dike {username}, alarm ne bhi tujhe ignore kar diya 😂",
            "Snap khol raha hai? Teri maa ki, brush kiya ya haath se hi chal raha hai? 😏",
            "Abe {username}, subah subah Snap pe kya ch*tiyapa dekh raha hai? 😒",
            "Sun bh*sdike, Snap streak tera career nahi banayega 😎",
            "Bistar se nikal aur duniya ka m* chod de! (Snap daal pehle) 😆"
        ],
        Chill: [
            "Morning ho gayi {username}, Snap check karle bas 😴📱",
            "Jaag gaya? Ab Snap pe thoda smile bhi daal le 😂",
            "{username}, tu zinda hai? Subah Snap ne bhi doubt kiya tha 😵‍💫",
            "Aankhein khol, duniya nahi toh Snap dekh le 📸",
            "Snap daala kya? Nahi? Toh tu flop hai bhai 😩"
        ]
    },
    afternoon: {
        RawBold: [
            "Lunch ke sath Snap bhi chahiye kya {username}? 🤨",
            "Kaam chhod, Snap daal, bhen ke takle 💥",
            "Tu to aalsi ka baap nikla, Snap pe bhi thak gaya 😑",
            "Behen ke l*de {username}, Snap story bhi boring hai 😂",
            "Tera boss bhi bolta hoga – Snap chod aur kaam kar bsdk 🤬"
        ],
        Chill: [
            "Afternoon vibes {username}, chill maar aur Snap story daal 😉",
            "Snap ka mood hai ya Netflix? Tera hi choice hai 😏",
            "Half-day ho gaya, Snap bhi half hi lag raha hai 😂",
            "Thoda smile kar, Snap wali duniya tera wait kar rahi hai 😎",
            "{username}, tu legend hai — agar Snap daal diya toh 😆"
        ]
    },
    evening: {
        RawBold: [
            "Raat ho gayi, feelings Snap pe daal de {username} ❤️‍🔥",
            "Snap story nahi daala? Toh chomu award tera 🏆",
            "{username}, raat ka time = Snap + gali combo 😈",
            "Aaj bhi kuch nahi ukhaada, Snap pe shikayat likh le 😤",
            "Snap streak tod de ya duniya ko 😎"
        ],
        Chill: [
            "Evening ho gayi, light down, Snap up 🔥",
            "{username}, Snap story daalne ka sahi time ab hai 🌇",
            "Shanti se Snap dekh ya story bana, tu hi hero hai 😌",
            "Good vibes, better snaps — {username} ka rule 📱",
            "Snap kar warna raat ko dreams bhi bore honge 😂"
        ]
    },
    birthday: [
        "Happy birthday bkl {username}! Cake katega ya fir koi aur? 🎂😏",
        "Janamdin mubarak bsdk! Umar badh gayi, akal nahi 😌",
        "{username}, Snap story full authorized aaj 🖕🎉",
        "Birthday hai tera, Snap pe gali valid hai 😂👑",
        "Badhai ho {username}, ek aur saal chomu ban gaya tu 🥳"
    ]
};

function createManagerToolBoxUI() {
    settingsContext.events.push({
        start: function (builder) {
            builder.row(function (builder) {
                builder.textInput("Enter your username and birthday (username dd/mm/yyyy)", config.get("userInput", ""), function (value) {
                    config.set("userInput", value, true);
                }).maxLines(1).singleLine(true);
            });

            var tones = ["RawBold", "Chill"];
            var currentTone = config.get("tone", "RawBold");
            builder.row(function (builder) {
                var text = builder.text("Tone: " + currentTone);
                builder.slider(0, tones.length - 1, 1, tones.indexOf(currentTone), function (value) {
                    var tone = tones[value];
                    text.label("Tone: " + tone);
                    config.set("tone", tone, true);
                });
            });

            builder.row(function (builder) {
                builder.button("Test Greetings Toast", function () {
                    testGreetingsToast();
                });
            });
        },
    });
}

function getCurrentDateTime() {
    var now = new Date();
    return {
        day: String(now.getDate()).padStart(2, '0'),
        month: String(now.getMonth() + 1).padStart(2, '0'),
        year: now.getFullYear(),
        hours: now.getHours()
    };
}

function getAge(birthday) {
    var today = new Date();
    var birthDate = new Date(birthday.split('/').reverse().join('-'));
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
}

function isValidDateFormat(dateString) {
    var dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    if (!dateRegex.test(dateString)) return false;
    var parts = dateString.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var year = parseInt(parts[2], 10);
    var date = new Date(year, month, day);
    return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function testGreetingsToast() {
    const userInput = String(config.get("userInput"));
    if (!userInput) {
        longToast("Pehle username aur birthday daal bhai.");
        return;
    }

    var [username, userBirthday] = userInput.split(' ');
    if (!username || !userBirthday || !isValidDateFormat(userBirthday)) {
        longToast("Format galat hai. Format hona chahiye: username dd/mm/yyyy");
        return;
    }

    displayToast();
}

function displayToast() {
    const userInput = String(config.get("userInput"));
    const { day, month, hours } = getCurrentDateTime();
    const tone = config.get("tone", "RawBold");

    var [username, userBirthday] = userInput.split(' ');
    var [bDay, bMonth] = userBirthday.split('/');

    var prompt;
    if (day === bDay && month === bMonth) {
        var age = getAge(userBirthday);
        prompt = getRandomElement(greetingPresets.birthday).replace('{username}', username) + ` You are ${age} years old today!`;
    } else {
        var timeOfDay = hours < 12 ? "morning" : hours < 18 ? "afternoon" : "evening";
        prompt = getRandomElement(greetingPresets[timeOfDay][tone]).replace('{username}', username);
    }

    longToast(prompt);
}

module.onSnapMainActivityCreate = function () {
    if (config.get("userInput")) {
        testGreetingsToast();
    }
};

function createInterface() {
    createManagerToolBoxUI();
}

function start(_) {
    createInterface();
}

start();

im.create("settings", function (builder, args) {
    settingsContext.events.forEach(function (event) {
        event.start(builder, args);
    });
});
