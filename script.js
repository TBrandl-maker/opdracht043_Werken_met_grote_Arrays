const nav = document.querySelector('#button-navigation')
const ul = document.getElementById('button-menu')

const listOfRegions = array => {
    const getMapofRegions = array.map(person => person.region)
    return Array.from(new Set(getMapofRegions)).sort();
}

const listOfCapricornWomen = array =>
    array.filter(person => person.gender === "female" && person.age > 30)
        .filter(person => person.birthday.mdy.substring(0, 5) >= "12/22" || person.birthday.mdy.substring(0, 5) <= "01/19")
        .map(person => person.name + " " + person.surname + "<img src='" + person.photo + "' />")
        .sort();


const getComparableExpirationDateFromPerson = person => {
    let expirationArray = person.credit_card.expiration.split("/"); // format string: M/yy
    let expirationMonth = parseInt(expirationArray[0]);
    let expirationYear = parseInt("20" + expirationArray[1]);
    return parseInt(expirationYear + expirationMonth);
}
const getPersonsWithOldCreditcards = array =>
    array.filter(person => person.age > 18)
        .filter(person => {
            let expirationArray = person.credit_card.expiration.split("/"); // format string: M/yy
            let expirationMonth = parseInt(expirationArray[0]);
            let expirationYear = parseInt("20" + expirationArray[1]);
            let today = new Date();
            let thisMonth = today.getMonth();
            let thisYear = today.getFullYear();

            if (expirationYear == thisYear && expirationMonth >= thisMonth) {
                return true;
            }
            if (expirationYear == thisYear + 1) {
                return true;
            }

            return false;
        })
        .sort((firstPerson, secondPerson) => {
            return getComparableExpirationDateFromPerson(firstPerson) - getComparableExpirationDateFromPerson(secondPerson);
        })
        .map(person => person.name + " " + person.surname + "," + " phone: "
            + person.phone + "," + " creditcard number: " + person.credit_card.number + ", "
            + "expiration date " + person.credit_card.expiration)


const addArrayToList = array => {
    ul.innerHTML = "";
    array.forEach(element => {
        const li = document.createElement('li');
        li.innerHTML = element;
        ul.appendChild(li);
    });
}

const landenLijst = document.querySelector(".landenlijst");
landenLijst.addEventListener("click", () => {
    addArrayToList(listOfRegions(randomPersonData))
});


const steenbokVrouwen = document.querySelector(".steenbokvrouwen");
steenbokVrouwen.addEventListener("click", () => {
    addArrayToList(listOfCapricornWomen(randomPersonData))
});

const oldCreditCards = document.querySelector(".creditcards");
oldCreditCards.addEventListener("click", () => {
    addArrayToList(getPersonsWithOldCreditcards(randomPersonData))
});

const mostPeopleFromRegion = array => {
    return array.map(person => person.region)
        .reduce((aggregate, current) => {
            let el = aggregate.find(person => person.region === current);
            if (!el) {
                aggregate.push({ region: current, count: 1 })
            } else {
                el.count = el.count + 1;
            }
            return aggregate;
        }, [])
        .sort((a, b) => b.count - a.count)
        .map(aggregate => `Region: ${aggregate.region}. Number of occurences: ${aggregate.count}`); // [{region: String, count: Number}] Region: ${region}. Number of occurences: ${count}
}

const mostPeople = document.querySelector(".meeste-mensen");
mostPeople.addEventListener("click", () => {
    addArrayToList(mostPeopleFromRegion(randomPersonData))
});

const averageAgePersonsPerRegion = array => {
    return array.reduce((aggregate, currentPerson) => {
        let el = aggregate.find(person => person.region === currentPerson.region);
        if (!el) {
            aggregate.push({ region: currentPerson.region, ages: [currentPerson.age] })
        } else {
            el.ages.push(currentPerson.age);
        }
        return aggregate;
    }, []);
}

const averagePersonsAge = document.querySelector(".gemiddelde-leeftijd");
averagePersonsAge.addEventListener("click", () => {
    addButtonToList(averageAgePersonsPerRegion(randomPersonData))
});

const addButtonToList = array => {
    ul.innerHTML = "";
    array.forEach(element => {
        const li = document.createElement('li');
        const button = document.createElement("button");
        button.innerHTML = element.region;
        li.appendChild(button);

        button.addEventListener("click", () => {
            li.innerHTML = `De gemiddelde persoon in ${element.region} is ${Math.round(element.ages.reduce((a, b) => a + b) / element.ages.length)} jaar oud`;
        });
        ul.appendChild(li);
    });
}

const getHoroscopeFromBirthDate = birthdate => {
    if (birthdate >= '01/21' && birthdate <= '02/19') {
        return 'Waterman';
    }
    if (birthdate >= '02/20' && birthdate <= '03/20') {
        return 'Vissen';
    }
    if (birthdate >= '03/21' && birthdate <= '04/20') {
        return 'Ram';
    }
    if (birthdate >= '04/21' && birthdate <= '05/20') {
        return 'Stier';
    }
    if (birthdate >= '05/21' && birthdate <= '06/21') {
        return 'Tweelingen';
    }
    if (birthdate >= '06/22' && birthdate <= '07/22') {
        return 'Kreeft';
    }
    if (birthdate >= '07/23' && birthdate <= '08/23') {
        return 'Leeuw';
    }
    if (birthdate >= '08/24' && birthdate <= '09/22') {
        return 'Maagd';
    }
    if (birthdate >= '09/23' && birthdate <= '10/23') {
        return 'Weegschaal';
    }
    if (birthdate >= '10/24' && birthdate <= '11/22') {
        return 'Schorpioen';
    }
    if (birthdate >= '11/23' && birthdate <= '12/21') {
        return 'Boogschutter';
    }
    return 'Steenbok';

}

const matchMaking = array => {
    return array.filter(person => person.age >= 18)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(person => {
            return {
                name: `${person.name} ${person.surname}`,
                photo: person.photo,
                country: person.region,
                age: person.age,
                horoscope: getHoroscopeFromBirthDate(person.birthday.mdy.substring(0, 5))
            };
        })
}
const allmatchMakers = matchMaking(randomPersonData)

const findMatchesButton = document.querySelector(".matchmaking");
findMatchesButton.addEventListener("click", () => {
    addButtonMatchesToList(allmatchMakers)
});

const showPerson = person => {
    return `<div>
    <div><img src="${person.photo}"></img></div>
    <div>${person.name}</div>
    <div>Land: ${person.country}</div>
    <div>Leeftijd: ${person.age}</div>
    <div>Horoscoop: ${person.horoscope}</div>
    </div>`;
}

const addButtonMatchesToList = array => {
    ul.innerHTML = "";
    array.forEach(element => {
        const li = document.createElement('li');
        const button = document.createElement("button");
        li.innerHTML = showPerson(element);
        button.innerHTML = "vind matches";
        li.appendChild(button);

        button.addEventListener("click", () => {
            let matches = array.filter(person => person.horoscope === element.horoscope && person != element);
            showMatches(matches)
            const thisIsMe = document.createElement('li');
            thisIsMe.innerHTML = showPerson(element);
            ul.prepend(thisIsMe);
        });
        ul.appendChild(li);
    });
}

const showMatches = array => {
    ul.innerHTML = "";
    array.forEach(element => {
        const li = document.createElement('li');
        li.innerHTML = showPerson(element);
        ul.appendChild(li);
    });
}
