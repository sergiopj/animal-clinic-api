
import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Animal Clinic API - iskaypet",
    description: "REST API built on Node.js and TypeScript for managing veterinary clinics, pets, and veterinarians",
    version: "1.0.0"   
  },
  tags: [
    {
      name: "Clinics",
      description: "Veterinary clinic management endpoints",
    },
    {
      name: "Pets",
      description: "Pet management endpoints",
    },
    {
      name: "Veterinarians",
      description: "Veterinarian management endpoints",
    },
  ],
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {    
    schemas: {
      Clinic: {
        type: "object",
        required: ["name", "address", "phone", "vatNumber", "licenseNumber"],
        properties: {
          _id: {
            type: "string",
            description: "Clinic unique identifier",
          },
          name: {
            type: "string",
            description: "Clinic name",
          },
          address: {
            type: "string",
            description: "Clinic address",
          },
          phone: {
            type: "string",
            description: "Clinic phone number",
          },
          email: {
            type: "string",
            description: "Clinic email",
          },
          website: {
            type: "string",
            description: "Clinic website URL",
          },
          vatNumber: {
            type: "string",
            description: "VAT/Tax number",
          },
          licenseNumber: {
            type: "string",
            description: "Clinic license number",
          },
          veterinarians: {
            type: "array",
            items: { $ref: "#/components/schemas/Vet" },
          },
          pets: {
            type: "array",
            items: { $ref: "#/components/schemas/Pet" },
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      Vet: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          specialization: {
            type: "string",
          },
        },
      },
      Pet: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          species: {
            type: "string",
          },
          gender: {
            type: "string",
          },
          birthdate: {
            type: "string",
            format: "date",
          }
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
        },
      },
    },
  },
};

const options: OAS3Options = {
  definition: swaggerDefinition,
  apis: ["./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
