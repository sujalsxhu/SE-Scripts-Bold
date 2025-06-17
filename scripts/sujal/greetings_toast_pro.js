// ==SE_module==
// name: greetings_toast_pro
// displayName: Greetings Toast PRO
// description: Shows a hilarious and abusive greeting toast on Snapchat startup. Input: username dd/mm/yyyy. Avoid full names.
// version: 1.0
// author: Sujal
// Fork credits: Gabriel Modz & Jacob Thomas & Jimothy
// ==/SE_module==

var config = require("config");
var im = require("interface-manager");

var settingsContext = {
    events: [],
};

var greetingPresets = {
    morning: {
        Hinglish: [
            "Uth ja bhosdike {username}, Snap dekhne se kuch nahi hoga 🖕",
            "Snap kholne se pehle mooh dhoya? Ya seedha haath maar ke aya? 😏",
            "Sun {username}, duniya chutiya ban rahi hai, tu bhi contribute kar 😆",
            "Tera alarm bhi thak gaya hoga, jaag ja ch*tiye 😴",
            "{username}, aaj ka goal: kisi ko gali de aur Snap streak bacha 😈"
        ],
        English: [
            "Wake up {username}, no one's gonna pay you for scrolling Snap 💀",
            "Good morning! Time to fake productivity again 😎",
            "{username}, even Snap streaks deserve better than your face 😆",
            "Rise and shine, asshole. Just kidding, stay in bed 💩",
            "Another day to do absolutely nothing 👍"
        ]
    },
    afternoon: {
        Hinglish: [
            "Lunch ki jagah Snap gobar khaa raha hai? 🤡",
            "{username}, Snap me reel dekh dekh ke dimag ka dahi ho gaya hoga 😂",
            "Behen ke lode, thoda kaam bhi karle bsdk 😤",
            "Chup chap Snap maar aur fake busy ban ja 😎",
            "Kaam karle bhosdike, warna boss teri gand maar dega 💼🔥"
        ],
        English: [
            "Half the day’s gone, still useless huh {username}? 😂",
            "You’ve survived this long — now go pretend to work 😏",
            "What’s for lunch? Guilt, laziness, or Snap stories? 🤣",
            "{username}, productivity left the chat 💀",
            "Keep scrolling, maybe your dignity is down there too 👀"
        ]
    },
    evening: {
        Hinglish: [
            "Raat ho gayi, Snap story daal aur ch*tiyapanti bandh kar 😐",
            "Aaj bhi kuch nahi ukhada, hai na loser? 😆",
            "Tere jaise log hi India ka future barbad karte hain 😂",
            "Netflix & chill ya fir haath se skill? 😏✋",
            "{username}, Snap streak toh bach gaya, zindagi nahi 💔"
        ],
        English: [
            "Evening vibes: Fake smiles, real exhaustion 😮‍💨",
            "Night is young — unlike your hopes and dreams 😂",
            "Another sunset, another chance to be a disappointment 🌇",
            "Snap stories don’t hide your pain, but nice try {username} 😎",
            "Time to chill... or cry alone. Both work 👍"
        ]
    },
    birthday: {
        Hinglish: [
            "Happy birthday, bhosdike {username}! Umar badh gayi, akal wahi chutiye wali 🤡",
            "Janamdin mubarak, madarchod! Aaj toh cake bhi tujhe gaali dega 😂",
            "Happy birthday bsdk {username} — Snap story daal warna peetunga 🎉",
            "Tere jaise log sirf birthday me hi special lagte hain 😏",
            "Congrats! Ek aur saal closer to being totally irrelevant 💀"
        ],
        English: [
            "Happy Birthday {username}! Still dumb as ever 🎂",
            "Cheers to you! Another year of being a disappointment 🍻",
            "A birthday toast: To fewer friends and more Snap views 🎉",
            "You’re not getting older, just more irrelevant 😆",
            "Happy Birthday legend! Too bad legends are usually dead 💀"
        ]
    }
};

function createManagerToolBoxUI() {
    settingsContext.events.push({
        start: function (builder) {
            builder.row(function (builder) {
                builder.textInput("Enter your username and birthday (username dd/mm/yyyy)", config.get("userInput", ""), function (value) {
                    config.set("userInput", value, true);
                }).maxLines(1).singleLine(true);
            });

            const tones = ["Hinglish", "English"];
            const currentTone = config.get("tone", "Hinglish");

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
    var day = String(now.getDate()).padStart(2, '0');
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var year = now.getFullYear();
    var hours = now.getHours();
    return { day, month, year, hours };
}

function getAge(birthday) {
    var today = new Date();
    var birthDate = new Date(birthday.split('/').reverse().join('-'));
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function isValidDateFormat(dateString) {
    var regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(dateString);
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function testGreetingsToast() {
    const input = String(config.get("userInput"));
    if (!input || !input.includes(" ")) {
        longToast("Please use format: username dd/mm/yyyy");
        return;
    }

    const [username, dob] = input.split(" ");
    if (!isValidDateFormat(dob)) {
        longToast("Invalid date. Use dd/mm/yyyy");
        return;
    }

    displayToast(username, dob);
}

function displayToast(username, dob) {
    const { day, month, hours } = getCurrentDateTime();
    const tone = config.get("tone", "Hinglish");
    const [bDay, bMonth] = dob.split("/");

    let toast = "";
    if (day === bDay && month === bMonth) {
        const age = getAge(dob);
        toast = getRandomElement(greetingPresets.birthday[tone]).replace("{username}", username) + ` 🎂 (${age} years old)`;
    } else {
        let time;
        if (hours < 12) time = "morning";
        else if (hours < 18) time = "afternoon";
        else time = "evening";

        toast = getRandomElement(greetingPresets[time][tone]).replace("{username}", username);
    }

    longToast(toast);
}

module.onSnapMainActivityCreate = activity => {
    const input = String(config.get("userInput"));
    if (input && input.includes(" ")) {
        const [username, dob] = input.split(" ");
        if (isValidDateFormat(dob)) {
            displayToast(username, dob);
        }
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
    settingsContext.events.forEach(e => e.start(builder, args));
});
