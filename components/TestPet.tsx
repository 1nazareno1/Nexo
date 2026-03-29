interface Pet {
  id: number;
  breed: string;
  color: string;
  notes?: string;
}

// Datos hardcodeados de 3 mascotas para pruebas
const pets: Pet[] = [
  {
    id: 1,
    breed: "Labrador Retriever",
    color: "Marrón",
    notes: "Muy juguetón y amigable con los niños."
  },
  {
    id: 2,
    breed: "Siamés",
    color: "Gris azulado",
    notes: "Gato independiente, le gusta dormir en lugares altos."
  },
  {
    id: 3,
    breed: "Golden Retriever",
    color: "Dorado",
    notes: "Excelente perro guardián y compañero."
  }
];

import { useState } from 'react';
import { PetDetails } from './pet-details';

export function TestPet() {
  const [selectedPetId, setSelectedPetId] = useState<number>(1);

  const selectedPet = pets.find(pet => pet.id === selectedPetId);

  return (
    <div className="p-5">
      <h1 className="text-lg font-bold mb-4">Prueba de Mascotas</h1>
      <div className="mb-4">
        <label className="mr-2">Seleccionar Mascota:</label>
        <select
          value={selectedPetId}
          onChange={(e) => setSelectedPetId(Number(e.target.value))}
          className="border border-border rounded p-1"
        >
          {pets.map(pet => (
            <option key={pet.id} value={pet.id}>
              Mascota {pet.id} - {pet.breed}
            </option>
          ))}
        </select>
      </div>
      {selectedPet && (
        <PetDetails
          breed={selectedPet.breed}
          color={selectedPet.color}
          notes={selectedPet.notes}
        />
      )}
    </div>
  );
}