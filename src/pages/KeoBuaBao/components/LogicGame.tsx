export const choices = ['Búa', 'Bao', 'Kéo'];

export const dictionaryChoices = {
    'Búa': { 'Thắng': 'Kéo', 'Thua': 'Bao', 'Hòa': 'Búa' },
    'Bao': { 'Thắng': 'Búa', 'Thua': 'Kéo', 'Hòa': 'Bao' },
    'Kéo': { 'Thắng': 'Bao', 'Thua': 'Búa', 'Hòa': 'Kéo' }
};

export const getRandomChoice = () => choices[Math.floor(Math.random() * choices.length)];

export const getResult = (userChoice, computerChoice) => {
    if (dictionaryChoices[userChoice]["Thắng"] === computerChoice) {
        return { message: "Bạn thắng!", type: "success" };
    } else if (dictionaryChoices[userChoice]["Hòa"] === computerChoice) {
        return { message: "Hòa!", type: "info" };
    } else {
        return { message: "Bạn thua!", type: "warning" };
    }
};
