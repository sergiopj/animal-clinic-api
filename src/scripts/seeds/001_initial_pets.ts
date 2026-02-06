import { Pet } from '../../database/models/pets/pet.model';

const speciesList = ['dog', 'cat', 'parrot', 'hamster', 'rabbit'];
const genderList = ['male', 'female'];
const namesList = [
  'Bella', 'Max', 'Charlie', 'Luna', 'Lucy', 'Cooper', 'Bailey', 'Daisy', 'Sadie', 'Oliver',
  'Bear', 'Tucker', 'Riley', 'Rocky', 'Lola', 'Jack', 'Molly', 'Buddy', 'Coco', 'Stella',
  'Duke', 'Leo', 'Penny', 'Ruby', 'Sophie', 'Zeus', 'Chloe', 'Jax', 'Piper', 'Milo',
  'Rosie', 'Nala', 'Harley', 'Toby', 'Gracie', 'Ellie', 'Mia', 'Finn', 'Scout', 'Dexter',
  'Zoe', 'Diesel', 'Koda', 'Lilly', 'Buster', 'Ginger', 'Marley', 'Thor', 'Lulu', 'Simba'
];

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const seed = async () => {
  console.log('Running Seed: 001_initial_pets');
  
  await Pet.deleteMany({});
  console.log('Cleared existing pets...');

  const pets = [];
  for (let i = 0; i < 50; i++) {
    pets.push({
      name: namesList[i] || `Pet${i}`,
      species: getRandomElement(speciesList),
      gender: getRandomElement(genderList),
      birthdate: getRandomDate(new Date(2010, 0, 1), new Date(2023, 0, 1)),
    });
  }

  await Pet.insertMany(pets);
  console.log('Successfully seeded 50 pets!');
};
