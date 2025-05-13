"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function PropertyForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    postal_code: "",
    area_size: "",
    is_furnished: false,
    pets_allowed: false,
    smoking_allowed: false,
  });

  const createProperty = api.property.create.useMutation({
    onSuccess: () => {
      setFormData({
        name: "",
        description: "",
        address: "",
        city: "",
        postal_code: "",
        area_size: "",
        is_furnished: false,
        pets_allowed: false,
        smoking_allowed: false,
      });
      router.refresh();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert area_size to number if it exists
    const area_size = formData.area_size ? parseFloat(formData.area_size) : undefined;
    
    createProperty.mutate({
      ...formData,
      area_size,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nazwa lokalu*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Adres*
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Miasto*
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
            Kod pocztowy*
          </label>
          <input
            type="text"
            id="postal_code"
            name="postal_code"
            required
            value={formData.postal_code}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="area_size" className="block text-sm font-medium text-gray-700">
            Powierzchnia (m²)
          </label>
          <input
            type="number"
            id="area_size"
            name="area_size"
            value={formData.area_size}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Opis
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_furnished"
            name="is_furnished"
            checked={formData.is_furnished}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="is_furnished" className="ml-2 block text-sm text-gray-700">
            Umeblowane
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="pets_allowed"
            name="pets_allowed"
            checked={formData.pets_allowed}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="pets_allowed" className="ml-2 block text-sm text-gray-700">
            Przyjazne zwierzętom
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="smoking_allowed"
            name="smoking_allowed"
            checked={formData.smoking_allowed}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="smoking_allowed" className="ml-2 block text-sm text-gray-700">
            Dla palących
          </label>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={createProperty.isPending}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {createProperty.isPending ? "Dodawanie..." : "Dodaj lokal"}
        </button>
      </div>
    </form>
  );
} 