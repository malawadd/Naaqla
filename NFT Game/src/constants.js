const CONTRACT_ADDRESS = '0xE8942fD02F01A8780C696519ad528b470a4c2a25';

const transformCharacterData = (characterData) => {
    return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    milkProduced: characterData.milkProduced.toNumber(),
    maxMilkProduced: characterData.maxMilkProduced.toNumber(),
    milk: characterData.milk.toNumber(),
    };
};

const transformFarmData = (characterData) => {
    return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    milkNeeded: characterData.milkNeeded.toNumber(),
    maxMilkNeeded: characterData.maxMilkNeeded.toNumber(),
    milk: characterData.milk.toNumber(),
    };
};

export { CONTRACT_ADDRESS , transformCharacterData, transformFarmData};