'use strict';
import request from 'supertest';
import app from '../../src/app';
import { PET_OBJECT_LIST, PET_OBJECT, MOST_NUM_SPECIES_OBJECT, INSERT_PET_OBJECT, INSERT_PET_OBJECT_INCOMPLETE } from '../common/mocks/pet.mock';
import * as petsService from '../../src/services/Pets';

describe('getAllPets', () => {
  it('should return all pets | status code 200', async () => {
    const mockData: any = PET_OBJECT_LIST;
    jest.spyOn(petsService, 'getAllPetsService').mockResolvedValue(mockData);
    const response = await request(app).get('/pets');
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(mockData);
    expect(response.body.count).toBe(mockData.length);
  });
  it('should return a empty data | status code 200', async () => {
    jest.spyOn(petsService, 'getAllPetsService').mockResolvedValue([]);
    const response = await request(app).get('/pets');
    expect(response.status).toBe(200);
    const { count, data } = response.body;
    expect(count).toBe(0);
    expect(data.length).toBe(0);
  });
  it('should return a error message | status code 500', async () => {
    jest.spyOn(petsService, 'getAllPetsService').mockRejectedValue(new Error('Force database error test'));
    const response = await request(app).get('/pets');
    expect(response.status).toBe(500);
    expect(response.body.msg).toBe('Error trying to get all pets');
  });
});

// TODO no mockear crear script de inserciond e datos etc
describe('getPetById', () => {
  it('should return a pet object by id | status code 200', async () => {
    const mockData: any = PET_OBJECT;
    jest.spyOn(petsService, 'getPetByIdService').mockResolvedValue(mockData);
    const response = await request(app).get('/pets/641a2b3c4d5e6f7g8h9i0j1k');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });  
  it('should return a not found message | status code 404', async () => {
    const mockData: any = PET_OBJECT;
    jest.spyOn(petsService, 'getPetByIdService').mockResolvedValue(null);
    const response = await request(app).get('/pets/641a2b3c4d5e6f7g8h9i0j9z');
    expect(response.status).toBe(404);
    expect(response.body.msg).toEqual('Pet not found');
  });
  it('should return a error message with pet id | status code 500', async () => {
    const mockData: any = PET_OBJECT;
    jest.spyOn(petsService, 'getPetByIdService').mockRejectedValue(new Error('Force error'));
    const response = await request(app).get('/pets/641a2b3c4d5e6f7g8h9i0j8y');
    expect(response.status).toBe(500);
    expect(response.body.msg).toEqual('Error getting pet by id : 641a2b3c4d5e6f7g8h9i0j8y');
  });   
});

describe('getMostNumerousSpecies', () => {
  it('should return a object with species and count | status code 200', async () => {
    const mockData: any = MOST_NUM_SPECIES_OBJECT;
    jest.spyOn(petsService, 'getMostNumerousSpeciesService').mockResolvedValue(mockData);
    const response = await request(app).get('/pets/species/most_numerous_species');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });    
  it('should return a error message | status code 500', async () => {
    const mockData: any = MOST_NUM_SPECIES_OBJECT;
    jest.spyOn(petsService, 'getMostNumerousSpeciesService').mockRejectedValue(new Error('Force error'));
    const response = await request(app).get('/pets/species/most_numerous_species');
    expect(response.status).toBe(500);
    expect(response.body.msg).toEqual('Error getting most numerous species');
  });   
});

describe('addNewPet', () => {
  it('should return a object with new pet | status code 201', async () => {
    const mockData: any = INSERT_PET_OBJECT;
    jest.spyOn(petsService, 'addNewPetService').mockResolvedValue(mockData);
    const response = await request(app).post('/pets').send(mockData);;
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockData);
  });    
   it('should return a not found message | status code 400', async () => {
    const mockData: any = INSERT_PET_OBJECT_INCOMPLETE;
    jest.spyOn(petsService, 'addNewPetService').mockRejectedValue(mockData);
    const response = await request(app).post('/pets').send(mockData);
    expect(response.status).toBe(400);
    expect(response.body.errors[0]).toEqual({ msg: 'The name field is required', param: 'name', location: 'body' });
  }); 
});

describe('Swagger api-docs', () => {
  it('should return a html with endpoints | status code 200', async () => {
    const response = await request(app).get('/api-docs').redirects(1);
    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
    expect(response.text.includes('<title>Swagger UI</title>')).toBe(true);
  });
});

describe('Health Check', () => {
  it('should return Ok | status code 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Ok');
  });
});
