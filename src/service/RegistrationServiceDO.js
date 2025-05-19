const OwnerModel = require('../repository/OwnerRepository');
const DogModel = require('../repository/DogRepository');

const RegistrationServiceDO = {
  registerDogForTempOwner: async (session, dogData) => {
    const { owner_id, owner_name, owner_surname, phone_number, password } = session.temp_owner_data;
    const { name, breed_id, age } = dogData;

    await OwnerModel.createOwner(owner_id, owner_name, owner_surname, phone_number, 1, password);
    await DogModel.addDog(name, breed_id, age, owner_id);

    return {
      id: owner_id,
      name: owner_name,
      surname: owner_surname
    };
  },

  registerDogForExistingOwner: async (owner_id, dogData) => {
    const { name, breed_id, age } = dogData;

    await DogModel.addDog(name, breed_id, age, owner_id);
    await DogModel.updateOwnerDogCount(owner_id);
  },

  registerOwner: async ({ name, surname, phone_number, password }) => {
    const isPhoneUnique = await OwnerModel.isPhoneNumberUnique(phone_number);
    if (!isPhoneUnique) {
      throw new Error('Цей номер телефону вже зареєстрований!');
    }

    let owner_id;
    let isUnique = false;

    while (!isUnique) {
      owner_id = Math.floor(Math.random() * 10000);
      isUnique = await OwnerModel.isOwnerIdUnique(owner_id);
    }

    return {
      owner_id,
      owner_name: name,
      owner_surname: surname,
      phone_number,
      password
    };
  },
};

module.exports = RegistrationServiceDO;
